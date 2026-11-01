#!/usr/bin/env node
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { appendFile, lstat, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makePlan, PACKAGE_ORDER, registryVersion, verifyPlan } from './npm-publication.mjs';

export const REPOSITORY = 'dvmarques/admin-design-system';
export const PREPARE_WORKFLOW = '.github/workflows/release-prepare.yml';
export const PYTHON_COMMAND = process.platform === 'win32' ? 'python' : 'python3';
const MAX_ARCHIVE = 100 * 1024 * 1024;
const API_TIMEOUT_MS = 30_000;
const DOWNLOAD_TIMEOUT_MS = 120_000;
const integer = (value) => Number.isSafeInteger(Number(value)) && Number(value) > 0;

export function artifactName(version, sha, runId, attempt) {
	assert.match(version, /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/);
	assert.match(sha, /^[a-f0-9]{40}$/);
	assert.ok(integer(runId) && integer(attempt), 'Run/tentativa inválidos.');
	return `npm-release-${version}-${sha}-${runId}-${attempt}`;
}

export function validateOrigin({
	artifact,
	run,
	workflow,
	repository,
	version,
	sha,
	now = Date.now(),
}) {
	assert.ok(integer(artifact.id), 'Artifact ID inválido.');
	for (const value of [repository.id, workflow.id, run.id, run.run_attempt]) {
		assert.ok(integer(value), 'Identidade/tentativa da execução inválida.');
	}
	assert.equal(run.run_attempt, 1, 'Somente a preparação original é aceita.');
	assert.equal(repository.full_name, REPOSITORY);
	assert.equal(artifact.expired, false, 'Artifact expirado.');
	assert.ok(Date.parse(artifact.expires_at) > now, 'Artifact ausente ou expirado.');
	assert.match(artifact.digest || '', /^sha256:[a-f0-9]{64}$/, 'Digest do artifact ausente.');
	assert.equal(run.repository?.id, repository.id, 'Run de outro repositório.');
	assert.equal(run.head_repository?.id, repository.id, 'Run de fork.');
	assert.equal(run.event, 'workflow_dispatch', 'Evento não autorizado.');
	assert.equal(run.head_branch, 'develop', 'Branch não autorizada.');
	assert.equal(typeof run.path, 'string', 'Caminho do workflow ausente.');
	const [runWorkflowPath, runWorkflowRef] = run.path.split('@');
	assert.equal(runWorkflowPath, PREPARE_WORKFLOW, 'Workflow não autorizado.');
	if (runWorkflowRef !== undefined) {
		assert.equal(runWorkflowRef, 'refs/heads/develop', 'Ref do workflow não autorizada.');
	}
	assert.equal(workflow.path, PREPARE_WORKFLOW);
	assert.equal(run.workflow_id, workflow.id, 'Workflow ID divergente.');
	assert.equal(run.status, 'completed');
	assert.equal(run.conclusion, 'success', 'Preparação sem sucesso.');
	assert.match(run.head_sha, /^[a-f0-9]{40}$/);
	assert.equal(artifact.workflow_run?.id, run.id);
	assert.equal(artifact.workflow_run?.repository_id, repository.id);
	assert.equal(artifact.workflow_run?.head_repository_id, repository.id);
	assert.equal(artifact.workflow_run?.head_sha, run.head_sha);
	assert.equal(artifact.workflow_run?.head_branch, 'develop');
	assert.equal(artifact.name, artifactName(version, sha, run.id, run.run_attempt));
	return {
		repository: REPOSITORY,
		workflow: PREPARE_WORKFLOW,
		workflowSha: run.head_sha,
		runId: String(run.id),
		runAttempt: String(run.run_attempt),
	};
}

export function verifyArchiveDigest(bytes, digest) {
	assert.equal(
		'sha256:' + createHash('sha256').update(bytes).digest('hex'),
		digest,
		'Digest ZIP divergente.',
	);
}

// The ZIP is untrusted input. Keep it in memory; only flat, regular files are extracted.
export function extractArchive(bytes, destination, version) {
	const expected = [
		'publication-plan.json',
		...PACKAGE_ORDER.map((part) => `dvmarques-admin-ds-${part}-${version}.tgz`),
	];
	execFileSync(
		PYTHON_COMMAND,
		[
			'-I',
			'-c',
			`
import io, json, os, pathlib, stat, sys, zipfile
destination, expected = pathlib.Path(sys.argv[1]), json.loads(sys.argv[2])
archive_bytes = sys.stdin.buffer.read(100 * 1024 * 1024 + 1)
if len(archive_bytes) > 100 * 1024 * 1024:
    raise ValueError('ZIP excede limite de tamanho')
with zipfile.ZipFile(io.BytesIO(archive_bytes)) as z:
    entries = z.infolist()
    if sorted(x.filename for x in entries) != sorted(expected):
        raise ValueError('Inventário ZIP inválido, duplicado ou caminho inesperado')
    if sum(x.file_size for x in entries) > 150 * 1024 * 1024:
        raise ValueError('ZIP excede limite descompactado')
    destination.mkdir(parents=True, exist_ok=False)
    destination_real = destination.resolve(strict=True)
    for x in entries:
        mode = x.external_attr >> 16
        if stat.S_IFMT(mode) not in (0, stat.S_IFREG) or x.flag_bits & 1:
            raise ValueError('ZIP contém link, diretório ou arquivo cifrado')
        target_path = destination / x.filename
        if target_path.parent.resolve(strict=True) != destination_real:
            raise ValueError('Caminho ZIP fora do diretório validado')
        descriptor = os.open(target_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, 'O_NOFOLLOW', 0), 0o600)
        with os.fdopen(descriptor, 'wb') as target:
            with z.open(x) as source:
                while chunk := source.read(64 * 1024):
                    target.write(chunk)
`,
			destination,
			JSON.stringify(expected),
		],
		{ input: bytes, maxBuffer: 1024 * 1024 },
	);
}

async function api(path, { redirect = 'follow' } = {}) {
	const response = await globalThis.fetch(`https://api.github.com/repos/${REPOSITORY}${path}`, {
		signal: globalThis.AbortSignal.timeout(API_TIMEOUT_MS),
		headers: {
			authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
		},
		redirect,
	});
	if (redirect === 'manual' && response.status === 302) return response;
	if (!response.ok)
		throw new Error(
			`GitHub API HTTP ${response.status}: artifact ausente, expirado ou inacessível; não reconstruir.`,
		);
	return response;
}

async function boundedBytes(response) {
	const contentLength = response.headers.get('content-length');
	if (contentLength !== null) {
		assert.match(contentLength, /^\d+$/, 'Tamanho do artifact inválido.');
		assert.ok(Number(contentLength) <= MAX_ARCHIVE, 'Artifact excede limite de tamanho.');
	}
	const chunks = [];
	let size = 0;
	for await (const chunk of response.body) {
		size += chunk.length;
		if (size > MAX_ARCHIVE) throw new Error('Artifact excede limite de tamanho.');
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}

export async function verifyReleaseManifests(plan, directory, sha) {
	for (const item of plan.packages) {
		const part = item.name.slice('@dvmarques/admin-ds-'.length);
		assert.ok(PACKAGE_ORDER.includes(part));
		const expected = JSON.parse(
			execFileSync('git', ['show', `${sha}:packages/${part}/package.json`], { encoding: 'utf8' }),
		);
		const packed = JSON.parse(
			execFileSync('tar', ['-xzOf', join(directory, item.file), 'package/package.json'], {
				encoding: 'utf8',
				maxBuffer: 256 * 1024,
			}),
		);
		assert.deepEqual(
			packed,
			expected,
			`Manifest/dependências divergem do merge aprovado: ${item.name}`,
		);
	}
}

export async function fetchArtifact(id, version, sha, destination) {
	assert.ok(
		integer(id) && /^[1-9][0-9]*$/.test(String(id)),
		'Artifact ID deve ser inteiro positivo.',
	);
	await lstat(destination).then(
		() => {
			throw new Error('Destino já existe; preserve o conjunto validado e use diretório limpo.');
		},
		(error) => {
			if (error.code !== 'ENOENT') throw error;
		},
	);
	const artifact = await (await api(`/actions/artifacts/${id}`)).json();
	assert.equal(String(artifact.id), String(id));
	assert.ok(integer(artifact.workflow_run?.id), 'Run do artifact ausente.');
	const prefix = `npm-release-${version}-${sha}-${artifact.workflow_run.id}-`;
	assert.ok(artifact.name.startsWith(prefix), 'Nome/merge do artifact divergente.');
	const attempt = artifact.name.slice(prefix.length);
	assert.match(attempt, /^[1-9][0-9]*$/, 'Tentativa do artifact inválida.');
	const [run, workflow, repository] = await Promise.all([
		api(`/actions/runs/${artifact.workflow_run.id}/attempts/${attempt}`).then((r) => r.json()),
		api('/actions/workflows/release-prepare.yml').then((r) => r.json()),
		api('').then((r) => r.json()),
	]);
	const producer = validateOrigin({ artifact, run, workflow, repository, version, sha });
	// develop is the immutable dispatch SHA checked out with full history, not a user ref.
	execFileSync('git', ['merge-base', '--is-ancestor', run.head_sha, 'HEAD']);
	const redirect = await api(`/actions/artifacts/${id}/zip`, { redirect: 'manual' });
	const location = redirect.headers.get('location');
	assert.ok(location?.startsWith('https://'), 'URL de download inválida.');
	// Never send GitHub credentials to the signed blob URL or expose that URL in logs.
	const response = await globalThis.fetch(location, {
		signal: globalThis.AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
	});
	assert.ok(response.ok, `Download do artifact falhou: HTTP ${response.status}`);
	const bytes = await boundedBytes(response);
	verifyArchiveDigest(bytes, artifact.digest);
	const temporary = await mkdtemp(join(dirname(destination), '.ads-artifact-'));
	try {
		const contents = join(temporary, 'contents');
		extractArchive(bytes, contents, version);
		const plan = JSON.parse(await readFile(join(contents, 'publication-plan.json'), 'utf8'));
		assert.deepEqual(plan.producer, producer, 'Origem do plano diverge do run validado.');
		await verifyPlan(plan, version, sha, contents);
		await verifyReleaseManifests(plan, contents, sha);
		await rename(contents, destination);
	} finally {
		await rm(temporary, { recursive: true, force: true });
	}
	console.log(`Artifact ${id} validado: ${artifact.name}; expira ${artifact.expires_at}.`);
}

async function main() {
	const [operation, version, sha, argument] = process.argv.slice(2);
	if (operation === 'fetch') {
		assert.equal(process.env.GITHUB_REPOSITORY, REPOSITORY);
		assert.equal(process.env.GITHUB_REF_NAME, 'develop');
		return fetchArtifact(argument, version, sha, resolve('npm-release-artifacts'));
	}
	assert.equal(process.env.GITHUB_REPOSITORY, REPOSITORY);
	assert.equal(process.env.GITHUB_EVENT_NAME, 'workflow_dispatch');
	assert.equal(process.env.GITHUB_REF_NAME, 'develop');
	assert.equal(
		process.env.GITHUB_RUN_ATTEMPT,
		'1',
		'Re-run da preparação recusado; reutilize o artifact original.',
	);
	assert.equal(
		process.env.GITHUB_WORKFLOW_REF,
		`${REPOSITORY}/${PREPARE_WORKFLOW}@refs/heads/develop`,
	);
	if (operation === 'guard') {
		for (const part of PACKAGE_ORDER) {
			assert.equal(
				await registryVersion(`@dvmarques/admin-ds-${part}`, version),
				null,
				'Versão já publicada: não preparar novos bytes, reutilize o artifact original.',
			);
		}
		return;
	}
	assert.equal(operation, 'plan');
	const directory = resolve(argument);
	const plan = await makePlan(version, sha, directory, process.cwd());
	plan.producer = {
		repository: REPOSITORY,
		workflow: PREPARE_WORKFLOW,
		workflowSha: process.env.GITHUB_SHA,
		runId: process.env.GITHUB_RUN_ID,
		runAttempt: process.env.GITHUB_RUN_ATTEMPT,
	};
	await verifyPlan(plan, version, sha, directory);
	await verifyReleaseManifests(plan, directory, sha);
	await writeFile(join(directory, 'publication-plan.json'), JSON.stringify(plan, null, 2) + '\n');
	await appendFile(
		process.env.GITHUB_OUTPUT,
		`artifact_name=${artifactName(version, sha, process.env.GITHUB_RUN_ID, process.env.GITHUB_RUN_ATTEMPT)}\n`,
	);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
