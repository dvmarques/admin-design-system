import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import {
	PACKAGE_ORDER,
	makePlan,
	publishPlan,
	verifyPlan,
} from './npm-publication.mjs';

const packageName = (part) => '@dvmarques/admin-ds-' + part;
const manifest = (name, version, isPrivate) => ({
	name,
	version,
	private: isPrivate,
	license: 'MIT',
	publishConfig: { access: 'public' },
	peerDependencies:
		name === packageName('admin') ? { [packageName('components')]: version } : {},
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

test('plano contém quatro pacotes públicos, mesma versão, SHA e tarballs reais', async () => {
	const fx = await fixture();
	try {
		const plan = await fx.plan();
		assert.deepEqual(plan.packages.map((item) => item.name), PACKAGE_ORDER.map(packageName));
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
		await assert.rejects(verifyPlan(plan, '0.2.0', fx.releaseSha, fx.dir), /Integridade divergente/);
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
