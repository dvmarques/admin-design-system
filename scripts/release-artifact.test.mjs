import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
	artifactName,
	extractArchive,
	fetchArtifact,
	PREPARE_WORKFLOW,
	PYTHON_COMMAND,
	REPOSITORY,
	validateOrigin,
	verifyArchiveDigest,
} from './release-artifact.mjs';
import { PACKAGE_ORDER } from './npm-publication.mjs';

const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const version = JSON.parse(
	execFileSync('git', ['show', `${sha}:package.json`], { encoding: 'utf8' }),
).version;
function origin() {
	return {
		version,
		sha,
		now: 1,
		repository: { id: 10, full_name: REPOSITORY },
		workflow: { id: 20, path: PREPARE_WORKFLOW },
		run: {
			id: 30,
			run_attempt: 1,
			workflow_id: 20,
			path: `${PREPARE_WORKFLOW}@refs/heads/develop`,
			repository: { id: 10 },
			head_repository: { id: 10 },
			event: 'workflow_dispatch',
			head_branch: 'develop',
			head_sha: sha,
			status: 'completed',
			conclusion: 'success',
		},
		artifact: {
			id: 40,
			name: artifactName(version, sha, 30, 1),
			expired: false,
			expires_at: '2999-01-01T00:00:00Z',
			digest: 'sha256:' + 'a'.repeat(64),
			workflow_run: {
				id: 30,
				repository_id: 10,
				head_repository_id: 10,
				head_sha: sha,
				head_branch: 'develop',
			},
		},
	};
}

test('origem exige run manual bem-sucedido do workflow em develop do mesmo repo', () => {
	const input = origin();
	assert.equal(validateOrigin(input).runId, '30');
	const apiRunPath = structuredClone(input);
	apiRunPath.run.path = `${PREPARE_WORKFLOW}@refs/heads/feature`;
	assert.throws(() => validateOrigin(apiRunPath), /Ref do workflow não autorizada/);
	const variants = [
		(x) => {
			x.run.event = 'pull_request';
		},
		(x) => {
			x.run.event = 'workflow_run';
		},
		(x) => {
			x.run.head_branch = 'feature';
		},
		(x) => {
			x.run.head_repository.id = 99;
		},
		(x) => {
			x.run.repository.id = 99;
		},
		(x) => {
			x.run.path = '.github/workflows/ci.yml';
		},
		(x) => {
			delete x.run.path;
		},
		(x) => {
			x.run.workflow_id = 99;
		},
		(x) => {
			x.run.conclusion = 'failure';
		},
		(x) => {
			x.run.status = 'in_progress';
		},
		(x) => {
			x.artifact.workflow_run.head_sha = 'f'.repeat(40);
		},
		(x) => {
			x.artifact.workflow_run.id = 99;
		},
		(x) => {
			x.artifact.name = artifactName('999.0.0', sha, 30, 1);
		},
		(x) => {
			x.run.run_attempt = 2;
		},
		(x) => {
			x.artifact.digest = null;
		},
		(x) => {
			delete x.repository.id;
			delete x.run.repository.id;
		},
	];
	for (const mutate of variants) {
		const changed = structuredClone(input);
		mutate(changed);
		assert.throws(() => validateOrigin(changed));
	}
});

test('artifact expirado, sem data ou de outro merge é recusado', () => {
	for (const mutate of [
		(x) => {
			x.artifact.expired = true;
		},
		(x) => {
			x.artifact.expires_at = '1970-01-01T00:00:00Z';
		},
		(x) => {
			x.artifact.expires_at = null;
		},
		(x) => {
			x.sha = 'e'.repeat(40);
		},
	]) {
		const changed = origin();
		mutate(changed);
		assert.throws(() => validateOrigin(changed));
	}
});

test('digest ZIP divergente é erro fatal', () => {
	const bytes = Buffer.from('validated');
	const digest = 'sha256:' + createHash('sha256').update(bytes).digest('hex');
	verifyArchiveDigest(bytes, digest);
	assert.throws(() => verifyArchiveDigest(Buffer.from('tampered'), digest), /Digest ZIP/);
});

async function fixture() {
	const temporary = await mkdtemp(join(tmpdir(), 'ads-artifact-test-'));
	const directory = join(temporary, 'input');
	await mkdir(directory);
	const input = origin();
	const producer = validateOrigin(input);
	const plan = {
		schemaVersion: 1,
		version: input.version,
		releaseSha: sha,
		producer,
		packages: [],
	};
	for (const part of PACKAGE_ORDER) {
		const source = join(temporary, part, 'package');
		await mkdir(source, { recursive: true });
		const manifest = execFileSync('git', ['show', `${sha}:packages/${part}/package.json`]);
		await writeFile(join(source, 'package.json'), manifest);
		const file = `dvmarques-admin-ds-${part}-${version}.tgz`;
		execFileSync('tar', ['-czf', join(directory, file), '-C', join(temporary, part), 'package']);
		const bytes = await readFile(join(directory, file));
		plan.packages.push({
			name: `@dvmarques/admin-ds-${part}`,
			version,
			file,
			sha256: createHash('sha256').update(bytes).digest('hex'),
			integrity: 'sha512-' + createHash('sha512').update(bytes).digest('base64'),
		});
	}
	await writeFile(join(directory, 'publication-plan.json'), JSON.stringify(plan));
	const archive = join(temporary, 'artifact.zip');
	execFileSync(PYTHON_COMMAND, [
		'-c',
		'import zipfile,pathlib,sys; p=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],"w"); [z.write(f,f.name) for f in p.iterdir()]; z.close()',
		directory,
		archive,
	]);
	const bytes = await readFile(archive);
	input.artifact.digest = 'sha256:' + createHash('sha256').update(bytes).digest('hex');
	return {
		temporary,
		directory,
		input,
		archive,
		bytes,
		dispose: () => rm(temporary, { recursive: true, force: true }),
	};
}

test('download pelo ID verifica ZIP, origem, plano e manifests do merge; reexecução preserva bytes', async () => {
	const fx = await fixture();
	const originalFetch = globalThis.fetch;
	try {
		const requested = [];
		const requestSignals = [];
		let oversized = false;
		globalThis.fetch = async (url, options = {}) => {
			requested.push(url);
			requestSignals.push(options.signal);
			if (url.endsWith('/runs/30'))
				return globalThis.Response.json({ ...fx.input.run, run_attempt: 2, conclusion: 'failure' });
			if (url === 'https://blob.example/artifact.zip') return new globalThis.Response(fx.bytes);
			if (url.endsWith('/zip'))
				return new globalThis.Response(null, {
					status: 302,
					headers: { location: 'https://blob.example/artifact.zip' },
				});
			const value = url.endsWith('/artifacts/40')
				? fx.input.artifact
				: url.endsWith('/runs/30/attempts/1')
					? fx.input.run
					: url.endsWith('/workflows/release-prepare.yml')
						? fx.input.workflow
						: fx.input.repository;
			return globalThis.Response.json(value);
		};
		for (const attempt of ['first', 'retry']) {
			const destination = join(fx.temporary, attempt);
			await fetchArtifact('40', version, sha, destination);
			assert.deepEqual(
				await readFile(join(destination, 'publication-plan.json')),
				await readFile(join(fx.directory, 'publication-plan.json')),
			);
		}
		assert.ok(requested.some((url) => url.endsWith('/runs/30/attempts/1')));
		assert.ok(
			requestSignals.every((signal) => signal instanceof globalThis.AbortSignal),
			'Chamadas de API e download têm timeout.',
		);
		assert.ok(
			!requested.some((url) => url.endsWith('/runs/30')),
			'Re-run posterior não substitui evidência da tentativa original',
		);
		await assert.rejects(
			fetchArtifact('40', version, sha, join(fx.temporary, 'first')),
			/Destino já existe/,
		);
		assert.ok(await readFile(join(fx.temporary, 'first', 'publication-plan.json')));
		globalThis.fetch = async (url) => {
			if (url === 'https://blob.example/artifact.zip') {
				return new globalThis.Response(fx.bytes, {
					headers: oversized ? { 'content-length': String(100 * 1024 * 1024 + 1) } : {},
				});
			}
			if (url.endsWith('/zip')) {
				return new globalThis.Response(null, {
					status: 302,
					headers: { location: 'https://blob.example/artifact.zip' },
				});
			}
			const value = url.endsWith('/artifacts/40')
				? fx.input.artifact
				: url.endsWith('/runs/30/attempts/1')
					? fx.input.run
					: url.endsWith('/workflows/release-prepare.yml')
						? fx.input.workflow
						: fx.input.repository;
			return globalThis.Response.json(value);
		};
		oversized = true;
		await assert.rejects(
			fetchArtifact('40', version, sha, join(fx.temporary, 'oversized')),
			/Artifact excede limite/,
		);
		oversized = false;
		fx.input.artifact.digest = 'sha256:' + 'f'.repeat(64);
		await assert.rejects(
			fetchArtifact('40', version, sha, join(fx.temporary, 'bad')),
			/Digest ZIP/,
		);
		globalThis.fetch = async () => new globalThis.Response(null, { status: 410 });
		await assert.rejects(
			fetchArtifact('40', version, sha, join(fx.temporary, 'gone')),
			/410.*não reconstruir/,
		);
		await assert.rejects(
			fetchArtifact('../42', version, sha, join(fx.temporary, 'wrong')),
			/inteiro positivo/,
		);
	} finally {
		globalThis.fetch = originalFetch;
		await fx.dispose();
	}
});

test('extração recusa traversal, duplicatas, arquivos extra e links', async () => {
	const fx = await fixture();
	try {
		extractArchive(fx.archive, join(fx.temporary, 'valid'), version);
		for (const mode of ['traversal', 'duplicate', 'extra', 'symlink']) {
			const archive = join(fx.temporary, mode + '.zip');
			execFileSync(PYTHON_COMMAND, [
				'-I',
				'-c',
				`
import zipfile,sys
with zipfile.ZipFile(sys.argv[1]) as source, zipfile.ZipFile(sys.argv[2], 'w') as target:
    for entry in source.infolist():
        if sys.argv[3] == 'symlink' and entry.filename == 'publication-plan.json':
            entry.external_attr = 0o120777 << 16
        target.writestr(entry, source.read(entry))
    if sys.argv[3] != 'symlink':
        target.writestr({'traversal':'../escape', 'duplicate':'publication-plan.json', 'extra':'code.mjs'}[sys.argv[3]], 'bad')
`,
				fx.archive,
				archive,
				mode,
			]);
			assert.throws(() => extractArchive(archive, join(fx.temporary, mode), version));
		}
	} finally {
		await fx.dispose();
	}
});

test('preparação reexecutada falha antes de construir ou consultar o npm', () => {
	const result = spawnSync(
		process.execPath,
		['scripts/release-artifact.mjs', 'guard', version, sha],
		{
			encoding: 'utf8',
			env: {
				PATH: process.env.PATH,
				GITHUB_REPOSITORY: REPOSITORY,
				GITHUB_EVENT_NAME: 'workflow_dispatch',
				GITHUB_REF_NAME: 'develop',
				GITHUB_RUN_ATTEMPT: '2',
			},
		},
	);
	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /Re-run da preparação recusado/);
});
