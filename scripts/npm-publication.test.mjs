import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import {
	PACKAGE_ORDER,
	FINAL_REGISTRY_CONFIRMATION,
	REGISTRY_CONFIRMATION,
	makePlan,
	publishPlan,
	registryVersion,
	verifyPlan,
} from './npm-publication.mjs';

const packageName = (part) => '@dvmarques/admin-ds-' + part;
const manifest = (name, version, isPrivate) => ({
	name,
	version,
	private: isPrivate,
	license: 'MIT',
	publishConfig: { access: 'public' },
	peerDependencies: name === packageName('admin') ? { [packageName('components')]: version } : {},
});

test('registry lookup has a bounded timeout', async () => {
	const originalFetch = globalThis.fetch;
	let signal;
	try {
		globalThis.fetch = async (_url, options) => {
			signal = options.signal;
			return globalThis.Response.json({ name: packageName('tokens'), version: '0.2.0' });
		};
		await registryVersion(packageName('tokens'), '0.2.0');
		assert.ok(signal instanceof globalThis.AbortSignal);
		assert.equal(signal.aborted, false);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

async function fixture(version = '0.2.0') {
	const path = await mkdtemp(join(tmpdir(), 'admin-ds-npm-test-'));
	const root = join(path, 'root');
	const dir = join(path, 'tarballs');
	await mkdir(dir, { recursive: true });
	for (const part of PACKAGE_ORDER) {
		const workspace = join(root, 'packages', part);
		await mkdir(workspace, { recursive: true });
		await writeFile(
			join(workspace, 'package.json'),
			JSON.stringify(manifest(packageName(part), version, false)),
		);
		const archive = join(path, 'archives', part);
		await mkdir(join(archive, 'package'), { recursive: true });
		await writeFile(
			join(archive, 'package', 'package.json'),
			JSON.stringify({
				...manifest(packageName(part), version, false),
				repository: {
					url: 'git+https://github.com/dvmarques/admin-design-system.git',
				},
			}),
		);
		const packed = spawnSync(
			'tar',
			[
				'-czf',
				join(dir, 'dvmarques-admin-ds-' + part + '-' + version + '.tgz'),
				'-C',
				archive,
				'package',
			],
			{ encoding: 'utf8' },
		);
		assert.equal(packed.status, 0, packed.stderr);
	}
	await writeFile(join(root, 'package.json'), JSON.stringify({ version, private: true }));
	for (const part of ['admin-demo', 'docs']) {
		const workspace = join(root, 'apps', part);
		await mkdir(workspace, { recursive: true });
		await writeFile(join(workspace, 'package.json'), JSON.stringify({ private: true }));
	}
	const releaseSha = 'f'.repeat(40);
	return {
		root,
		dir,
		releaseSha,
		plan: () => makePlan(version, releaseSha, dir, root),
		dispose: () => rm(path, { recursive: true, force: true }),
	};
}

function fakeRegistry(plan, initiallyPublished = []) {
	const registry = new Map();
	const calls = [];
	for (const item of plan.packages) {
		if (initiallyPublished.includes(item.name)) {
			registry.set(item.name, {
				name: item.name,
				version: item.version,
				dist: { integrity: item.integrity },
			});
		}
	}
	const getVersion = async (name) => registry.get(name) || null;
	const publishTarball = async (item) => {
		calls.push(item.name);
		registry.set(item.name, {
			name: item.name,
			version: item.version,
			dist: { integrity: item.integrity },
		});
	};
	return { registry, calls, getVersion, publishTarball, sleep: async () => {} };
}

test('confirma publicação propagada depois de mais de 30 segundos sem republicar', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		const tokens = packageName('tokens');
		let clock = 0;
		let tokenReads = 0;
		const getVersion = async (name, version) => {
			if (name === tokens && fake.registry.has(tokens)) {
				tokenReads += 1;
				if (tokenReads <= 6) return null;
			}
			return fake.getVersion(name, version);
		};
		await publishPlan(plan, {
			...fake,
			getVersion,
			now: () => clock,
			sleep: async (ms) => {
				clock += ms;
			},
		});
		assert.equal(tokenReads, 8, '7 consultas de confirmação e 1 verificação final');
		assert.ok(clock > 30_000, 'a versão somente deve aparecer depois da janela antiga');
		assert.ok(clock < REGISTRY_CONFIRMATION.maxDurationMs);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.map(packageName));
	} finally {
		await fx.dispose();
	}
});

test('janela esgotada falha com contexto e impede o próximo publish', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const writes = [];
		const timeouts = [];
		let clock = 0;
		const getVersion = async (_name, _version, timeoutMs) => {
			if (timeoutMs !== undefined) timeouts.push(timeoutMs);
			return null;
		};
		await assert.rejects(
			publishPlan(plan, {
				getVersion,
				publishTarball: async (item) => {
					writes.push(item.name);
				},
				now: () => clock,
				sleep: async (ms) => {
					clock += ms;
				},
			}),
			(error) =>
				/Publicação não confirmada/.test(error.message) &&
				error.message.includes(packageName('tokens') + '@' + plan.version) &&
				error.message.includes('mesmo artifact ID'),
		);
		assert.deepEqual(writes, [packageName('tokens')]);
		assert.equal(clock, REGISTRY_CONFIRMATION.maxDurationMs);
		assert.ok(timeouts.length <= REGISTRY_CONFIRMATION.maxAttempts);
		assert.ok(timeouts.every((timeout) => timeout > 0 && timeout <= 30_000));
		assert.ok(timeouts.at(-1) < 30_000, 'última chamada respeita o saldo da janela');
	} finally {
		await fx.dispose();
	}
});

test('limite de leituras prevalece mesmo quando relógio não avança', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		let reads = 0;
		let publishes = 0;
		await assert.rejects(
			publishPlan(plan, {
				getVersion: async () => {
					reads += 1;
					return null;
				},
				publishTarball: async () => {
					publishes += 1;
				},
				sleep: async () => {},
				now: () => 0,
			}),
			/Publicação não confirmada/,
		);
		assert.equal(reads, plan.packages.length + REGISTRY_CONFIRMATION.maxAttempts);
		assert.equal(publishes, 1);
	} finally {
		await fx.dispose();
	}
});

test('integridade divergente após publish falha antes de continuar', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		await assert.rejects(
			publishPlan(plan, {
				...fake,
				publishTarball: async (item) => {
					fake.calls.push(item.name);
					fake.registry.set(item.name, {
						name: item.name,
						version: item.version,
						dist: { integrity: 'sha512-conteudo-inesperado' },
					});
				},
			}),
			/Integridade divergente/,
		);
		assert.deepEqual(fake.calls, [packageName('tokens')]);
	} finally {
		await fx.dispose();
	}
});

test('reconcilia 200 → 404 → 200 na verificação final sem novo publish', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		const tokens = packageName('tokens');
		let tokenReads = 0;
		let clock = 0;
		const getVersion = async (name, version) => {
			if (name === tokens && fake.registry.has(tokens)) {
				tokenReads += 1;
				if (tokenReads === 2) return null;
			}
			return fake.getVersion(name, version);
		};
		await publishPlan(plan, {
			...fake,
			getVersion,
			now: () => clock,
			sleep: async (ms) => {
				clock += ms;
			},
		});
		assert.equal(tokenReads, 3, 'confirmação 200, leitura final 404 e retry 200');
		assert.ok(clock > 0 && clock <= FINAL_REGISTRY_CONFIRMATION.maxDurationMs);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.map(packageName));
	} finally {
		await fx.dispose();
	}
});

test('timeout e HTTP transitório não encerram polling dentro da janela', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		const tokens = packageName('tokens');
		let clock = 0;
		let tokenReads = 0;
		const getVersion = async (name, version) => {
			if (name === tokens && fake.registry.has(tokens)) {
				tokenReads += 1;
				if (tokenReads === 1) {
					clock += 30_000;
					const error = new Error('tempo de consulta esgotado');
					error.name = 'TimeoutError';
					throw error;
				}
				if (tokenReads === 2) {
					const error = new Error('HTTP 503');
					error.retryableRegistry = true;
					throw error;
				}
				if (tokenReads === 3) {
					const error = new Error('conexão resetada');
					error.code = 'ECONNRESET';
					throw error;
				}
			}
			return fake.getVersion(name, version);
		};
		await publishPlan(plan, {
			...fake,
			getVersion,
			now: () => clock,
			sleep: async (ms) => {
				clock += ms;
			},
		});
		assert.equal(tokenReads, 5, 'quatro leituras iniciais e a releitura final');
		assert.ok(clock > 30_000 && clock < REGISTRY_CONFIRMATION.maxDurationMs);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.map(packageName));
	} finally {
		await fx.dispose();
	}
});

test('esgotamento de 60 s na verificação final não republica pacotes', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		const tokens = packageName('tokens');
		let clock = 0;
		let firstConfirmation = false;
		const getVersion = async (name, version) => {
			if (name === tokens && fake.registry.has(tokens)) {
				if (firstConfirmation) return null;
				firstConfirmation = true;
			}
			return fake.getVersion(name, version);
		};
		await assert.rejects(
			publishPlan(plan, {
				...fake,
				getVersion,
				now: () => clock,
				sleep: async (ms) => {
					clock += ms;
				},
			}),
			(error) =>
				error.message.includes('Verificação final não confirmada') &&
				error.message.includes(tokens + '@' + plan.version) &&
				/leituras.*motivo: versão não visível/.test(error.message),
		);
		assert.equal(clock, FINAL_REGISTRY_CONFIRMATION.maxDurationMs);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.map(packageName));
	} finally {
		await fx.dispose();
	}
});

test('limite de leituras finais também é aplicado quando relógio não avança', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		const tokens = packageName('tokens');
		let tokensReads = 0;
		const getVersion = async (name, version) => {
			if (name === tokens && fake.registry.has(tokens)) {
				tokensReads += 1;
				if (tokensReads > 1) return null;
			}
			return fake.getVersion(name, version);
		};
		await assert.rejects(
			publishPlan(plan, { ...fake, getVersion, now: () => 0 }),
			/Verificação final não confirmada/,
		);
		assert.equal(tokensReads, 1 + FINAL_REGISTRY_CONFIRMATION.maxAttempts);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.map(packageName));
	} finally {
		await fx.dispose();
	}
});

test('divergência de integridade na verificação final é fatal e não refaz publish', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		const tokens = packageName('tokens');
		let tokensReads = 0;
		const getVersion = async (name, version) => {
			if (name === tokens && fake.registry.has(tokens) && ++tokensReads === 2) {
				return {
					name,
					version,
					dist: { integrity: 'sha512-hash-incorreto' },
				};
			}
			return fake.getVersion(name, version);
		};
		await assert.rejects(publishPlan(plan, { ...fake, getVersion }), /Integridade divergente/);
		assert.equal(tokensReads, 2, 'integridade divergente não deve acionar retry');
		assert.deepEqual(fake.calls, PACKAGE_ORDER.map(packageName));
	} finally {
		await fx.dispose();
	}
});

test('registryVersion diferencia HTTP 429/5xx de erros HTTP permanentes', async () => {
	const originalFetch = globalThis.fetch;
	try {
		for (const status of [429, 500, 502, 503, 504]) {
			globalThis.fetch = async () => new Response(null, { status });
			await assert.rejects(
				registryVersion(packageName('tokens'), '0.2.0'),
				(error) => error.retryableRegistry === true && error.message.includes(String(status)),
			);
		}
		for (const status of [400, 401, 403, 422]) {
			globalThis.fetch = async () => new Response(null, { status });
			await assert.rejects(
				registryVersion(packageName('tokens'), '0.2.0'),
				(error) => error.retryableRegistry !== true && error.message.includes(String(status)),
			);
		}
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('registryVersion diferencia falha de rede de erro permanente', async () => {
	const originalFetch = globalThis.fetch;
	try {
		globalThis.fetch = async () => {
			throw new TypeError('fetch failed');
		};
		await assert.rejects(
			registryVersion(packageName('tokens'), '0.2.0'),
			(error) => error.retryableRegistry === true && error.message.includes('fetch failed'),
		);
		globalThis.fetch = async () => {
			throw new Error('falha inesperada');
		};
		await assert.rejects(
			registryVersion(packageName('tokens'), '0.2.0'),
			(error) => error.retryableRegistry !== true && error.message === 'falha inesperada',
		);
	} finally {
		globalThis.fetch = originalFetch;
	}
});

test('falhas transitórias até o deadline informam o último motivo e não avançam', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		let clock = 0;
		const getVersion = async (name, version) => {
			if (fake.registry.has(name)) {
				const error = new Error('HTTP 503 temporário');
				error.retryableRegistry = true;
				throw error;
			}
			return fake.getVersion(name, version);
		};
		await assert.rejects(
			publishPlan(plan, {
				...fake,
				getVersion,
				now: () => clock,
				sleep: async (ms) => {
					clock += ms;
				},
			}),
			(error) =>
				/Publicação não confirmada/.test(error.message) &&
				error.message.includes(packageName('tokens') + '@' + plan.version) &&
				error.message.includes('motivo: HTTP 503 temporário'),
		);
		assert.equal(clock, REGISTRY_CONFIRMATION.maxDurationMs);
		assert.deepEqual(fake.calls, [packageName('tokens')]);
	} finally {
		await fx.dispose();
	}
});

test('erro HTTP permanente interrompe polling na primeira leitura', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		let reads = 0;
		const getVersion = async (name, version) => {
			if (fake.registry.has(name)) {
				reads += 1;
				throw new Error('Falha ao consultar registry npm: HTTP 403');
			}
			return fake.getVersion(name, version);
		};
		await assert.rejects(publishPlan(plan, { ...fake, getVersion }), /HTTP 403/);
		assert.equal(reads, 1);
		assert.deepEqual(fake.calls, [packageName('tokens')]);
	} finally {
		await fx.dispose();
	}
});

test('plano contém quatro pacotes públicos, mesma versão, SHA e tarballs reais', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		assert.deepEqual(
			plan.packages.map((item) => item.name),
			PACKAGE_ORDER.map(packageName),
		);
		await verifyPlan(plan, plan.version, fx.releaseSha, fx.dir);
		assert.ok(plan.packages.every((item) => item.integrity.startsWith('sha512-')));
	} finally {
		await fx.dispose();
	}
});

test('rejeita pacote privado, versão divergente, tarball ausente e arquivo extra', async () => {
	const fx = await fixture();
	try {
		const path = join(fx.root, 'packages', 'admin', 'package.json');
		const original = await readFile(path, 'utf8');
		await writeFile(path, original.replace('"private":false', '"private":true'));
		await assert.rejects(fx.plan(), /não habilitado/);
		await writeFile(path, original.replace('"0.2.0"', '"0.3.0"'));
		await assert.rejects(fx.plan(), /0.3.0/);
		await writeFile(path, original);
		await writeFile(join(fx.dir, 'extra.tgz'), 'wrong package');
		await assert.rejects(fx.plan(), /Inventário/);
		await rm(join(fx.dir, 'extra.tgz'));
		await writeFile(join(fx.dir, 'README.txt'), 'unexpected artifact file');
		await assert.rejects(fx.plan(), /Inventário/);
		await rm(join(fx.dir, 'README.txt'));
		await rm(join(fx.dir, 'dvmarques-admin-ds-admin-0.2.0.tgz'));
		await assert.rejects(fx.plan(), /Inventário/);
	} finally {
		await fx.dispose();
	}
});

test('rejeita artifact adulterado ou associado a outro SHA/versão', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		await assert.rejects(verifyPlan(plan, '0.2.1', fx.releaseSha, fx.dir), /Versão/);
		await assert.rejects(verifyPlan(plan, '0.2.0', 'e'.repeat(40), fx.dir), /outro commit/);
		await writeFile(join(fx.dir, plan.packages[0].file), 'artifact adulterado');
		await assert.rejects(
			verifyPlan(plan, '0.2.0', fx.releaseSha, fx.dir),
			/Integridade divergente/,
		);
	} finally {
		await fx.dispose();
	}
});

test('publica os quatro em ordem e reexecuta sem publicar novamente', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		await publishPlan(plan, fake);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.map(packageName));
		await publishPlan(plan, fake);
		assert.equal(fake.calls.length, 4, 'reexecução deve ser no-op');
	} finally {
		await fx.dispose();
	}
});

test('recupera publicação parcial sem recriar as versões já existentes', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan, PACKAGE_ORDER.slice(0, 2).map(packageName));
		await publishPlan(plan, fake);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.slice(2).map(packageName));
	} finally {
		await fx.dispose();
	}
});

test('divergência em versão existente impede qualquer escrita', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		fake.registry.set(packageName('admin'), {
			name: packageName('admin'),
			version: '0.2.0',
			dist: { integrity: 'sha512-outro-arquivo' },
		});
		await assert.rejects(publishPlan(plan, fake), /Integridade divergente/);
		assert.deepEqual(fake.calls, []);
	} finally {
		await fx.dispose();
	}
});

test('não publica admin quando components desaparece do registry', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan, PACKAGE_ORDER.slice(0, 3).map(packageName));
		let componentLookups = 0;
		const getVersion = async (name, version) => {
			if (name === packageName('components') && ++componentLookups > 1) return null;
			return fake.getVersion(name, version);
		};
		await assert.rejects(
			publishPlan(plan, { ...fake, getVersion }),
			/Dependência components ausente/,
		);
		assert.deepEqual(fake.calls, []);
	} finally {
		await fx.dispose();
	}
});

test('falha no terceiro pacote pode ser recuperada sem republicar os anteriores', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		const fake = fakeRegistry(plan);
		const failThird = async (item) => {
			if (item.name === packageName('highlighted-code')) {
				throw new Error('Falha temporária npm');
			}
			return fake.publishTarball(item);
		};
		await assert.rejects(
			publishPlan(plan, { ...fake, publishTarball: failThird }),
			/Falha temporária npm/,
		);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.slice(0, 2).map(packageName));
		await publishPlan(plan, fake);
		assert.deepEqual(fake.calls, PACKAGE_ORDER.map(packageName));
	} finally {
		await fx.dispose();
	}
});

test('confere manifesto dentro do tarball, mesmo com hashes válidos', async () => {
	const fx = await fixture();
	try {
		const archive = join(fx.root, '..', 'archives', 'admin', 'package', 'package.json');
		const manifestJson = JSON.parse(await readFile(archive, 'utf8'));
		manifestJson.private = true;
		await writeFile(archive, JSON.stringify(manifestJson));
		const target = join(fx.dir, 'dvmarques-admin-ds-admin-0.2.0.tgz');
		const packed = spawnSync(
			'tar',
			['-czf', target, '-C', join(fx.root, '..', 'archives', 'admin'), 'package'],
			{ encoding: 'utf8' },
		);
		assert.equal(packed.status, 0, packed.stderr);
		const plan = await fx.plan();
		await assert.rejects(
			verifyPlan(plan, '0.2.0', fx.releaseSha, fx.dir),
			/Tarball privado bloqueado/,
		);
	} finally {
		await fx.dispose();
	}
});

test('publisher OIDC aceita master somente no SHA aprovado e workflow confiável', () => {
	const sha = 'a'.repeat(40);
	const env = {
		PATH: process.env.PATH,
		GITHUB_ACTIONS: 'true',
		GITHUB_REPOSITORY: 'dvmarques/admin-design-system',
		GITHUB_REF_NAME: 'master',
		GITHUB_REF: 'refs/heads/master',
		GITHUB_SHA: sha,
		GITHUB_WORKFLOW_REF:
			'dvmarques/admin-design-system/.github/workflows/release.yml@refs/heads/master',
		ACTIONS_ID_TOKEN_REQUEST_URL: 'https://example.invalid/oidc',
		ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'mock-only',
	};
	const run = (changes = {}) =>
		spawnSync(
			process.execPath,
			['scripts/npm-publication.mjs', 'publish', '0.2.0', sha, '/tmp/not-used'],
			{ encoding: 'utf8', env: { ...env, ...changes } },
		);

	const valid = run();
	assert.notEqual(valid.status, 0);
	assert.match(valid.stderr, /ENOENT/);
	assert.doesNotMatch(valid.stderr, /Disparo deve|Workflow OIDC inesperado|diverge do merge SHA/);

	for (const [changes, expected] of [
		[{ GITHUB_REF: 'refs/heads/develop', GITHUB_REF_NAME: 'develop' }, /master/],
		[{ GITHUB_SHA: 'b'.repeat(40) }, /diverge do merge SHA/],
		[
			{ GITHUB_WORKFLOW_REF: env.GITHUB_WORKFLOW_REF.replace('master', 'develop') },
			/Workflow OIDC inesperado/,
		],
		[{ ACTIONS_ID_TOKEN_REQUEST_URL: '' }, /Token OIDC indisponível/],
		[{ NPM_TOKEN: 'mock-only' }, /Tokens npm permanentes/],
	]) {
		const result = run(changes);
		assert.notEqual(result.status, 0);
		assert.match(result.stderr, expected);
	}
});

test('sem OIDC nem identidade do workflow não inicia publicação', () => {
	const command = spawnSync(
		process.execPath,
		['scripts/npm-publication.mjs', 'publish', '0.2.0', 'f'.repeat(40), '/tmp/not-used'],
		{
			encoding: 'utf8',
			env: {
				PATH: process.env.PATH,
				GITHUB_ACTIONS: 'false',
				GITHUB_REPOSITORY: 'dvmarques/admin-design-system',
			},
		},
	);
	assert.notEqual(command.status, 0);
	assert.match(command.stderr, /GitHub Actions/);
});
