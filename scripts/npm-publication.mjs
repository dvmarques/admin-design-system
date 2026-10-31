#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { lstat, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

export const PACKAGE_ORDER = ['tokens', 'components', 'highlighted-code', 'admin'];
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REGISTRY = 'https://registry.npmjs.org';
const NAME = (part) => '@dvmarques/admin-ds-' + part;

function verifyVersion(version) {
	if (!/^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/.test(version)) {
		throw new Error('Versão SemVer estável inválida.');
	}
}

export function verifyIntegrity(actual, expected, label) {
	if (!actual || actual !== expected) {
		throw new Error('Integridade divergente para ' + label + '; publicação bloqueada.');
	}
}

async function verifyPrivateManifests(root) {
	for (const file of ['package.json', 'apps/admin-demo/package.json', 'apps/docs/package.json']) {
		const manifest = JSON.parse(await readFile(join(root, file), 'utf8'));
		assert.equal(manifest.private, true, file + ' deve permanecer privado');
	}
}

export async function makePlan(version, releaseSha, directory, root = ROOT) {
	verifyVersion(version);
	if (!/^[a-f0-9]{40}$/.test(releaseSha)) throw new Error('Commit de release inválido.');
	await verifyPrivateManifests(root);
	const rootManifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
	assert.equal(rootManifest.version, version, 'Raiz não coincide com release aprovada.');
	const entries = await readdir(directory);
	const actualTarballs = entries.filter((name) => name.endsWith('.tgz')).sort();
	const expectedTarballs = PACKAGE_ORDER.map(
		(part) => 'dvmarques-admin-ds-' + part + '-' + version + '.tgz',
	).sort();
	assert.deepEqual(actualTarballs, expectedTarballs, 'Inventário de tarballs inesperado.');
	const packages = [];
	for (const part of PACKAGE_ORDER) {
		const name = NAME(part);
		const manifest = JSON.parse(
			await readFile(join(root, 'packages', part, 'package.json'), 'utf8'),
		);
		assert.equal(manifest.name, name);
		assert.equal(manifest.version, version);
		assert.equal(manifest.private, false, name + ' não habilitado para publicação.');
		assert.equal(manifest.publishConfig?.access, 'public');
		assert.equal(manifest.license, 'MIT');
		if (part === 'admin') {
			assert.equal(manifest.peerDependencies?.[NAME('components')], version);
		}
		const file = 'dvmarques-admin-ds-' + part + '-' + version + '.tgz';
		const stat = await lstat(join(directory, file));
		assert.ok(stat.isFile() && !stat.isSymbolicLink(), 'Tarball inválido: ' + file);
		const bytes = await readFile(join(directory, file));
		assert.ok(bytes.length > 0, 'Tarball vazio: ' + file);
		packages.push({
			name,
			version,
			file,
			integrity: 'sha512-' + createHash('sha512').update(bytes).digest('base64'),
			sha256: createHash('sha256').update(bytes).digest('hex'),
		});
	}
	return { schemaVersion: 1, version, releaseSha, packages };
}

function inspectArchive(item, directory) {
	const file = join(directory, item.file);
	const result = spawnSync('tar', ['-xzOf', file, 'package/package.json'], {
		encoding: 'utf8',
		maxBuffer: 256 * 1024,
	});
	if (result.status !== 0 || !result.stdout) {
		throw new Error('Tarball inválido ou sem package.json: ' + item.name);
	}
	let manifest;
	try {
		manifest = JSON.parse(result.stdout);
	} catch {
		throw new Error('Manifest inválido no tarball: ' + item.name);
	}
	assert.equal(manifest.name, item.name, 'Nome no tarball diverge da publicação.');
	assert.equal(manifest.version, item.version, 'Versão no tarball diverge da publicação.');
	assert.equal(manifest.private, false, 'Tarball privado bloqueado.');
	assert.equal(manifest.publishConfig?.access, 'public', 'Tarball sem acesso público.');
	assert.equal(manifest.license, 'MIT', 'Licença inesperada.');
	assert.equal(
		manifest.repository?.url,
		'git+https://github.com/dvmarques/admin-design-system.git',
		'Repositório de origem inesperado.',
	);
	if (item.name === NAME('admin')) {
		assert.equal(
			manifest.peerDependencies?.[NAME('components')],
			item.version,
			'Dependência components divergente.',
		);
	}
}

export async function verifyPlan(plan, version, releaseSha, directory) {
	verifyVersion(version);
	assert.equal(plan.schemaVersion, 1);
	assert.equal(plan.version, version, 'Versão do artifact diverge da release.');
	assert.equal(plan.releaseSha, releaseSha, 'Artifact de outro commit de release.');
	assert.equal(plan.packages?.length, 4);
	assert.deepEqual(plan.packages.map((item) => item.name), PACKAGE_ORDER.map(NAME));
	const tarballs = (await readdir(directory)).filter((name) => name.endsWith('.tgz')).sort();
	assert.deepEqual(tarballs, plan.packages.map((item) => item.file).sort());
	for (const item of plan.packages) {
		assert.equal(item.version, version);
		const expectedFile = item.name.slice(1).replace('/', '-') + '-' + version + '.tgz';
		assert.equal(item.file, expectedFile, 'Caminho de tarball inesperado.');
		const path = join(directory, item.file);
		const stat = await lstat(path);
		assert.ok(stat.isFile() && !stat.isSymbolicLink());
		const bytes = await readFile(path);
		verifyIntegrity(
			'sha512-' + createHash('sha512').update(bytes).digest('base64'),
			item.integrity,
			item.name,
		);
		verifyIntegrity(createHash('sha256').update(bytes).digest('hex'), item.sha256, item.name);
		inspectArchive(item, directory);
	}
	return plan;
}

export async function publishPlan(plan, { getVersion, publishTarball, sleep = delay }) {
	// Examinar o estado INTEIRO antes da primeira publicação, evitando falha tardia previsível.
	const existing = new Map();
	for (const item of plan.packages) {
		const remote = await getVersion(item.name, item.version);
		if (remote) {
			assert.equal(remote.name, item.name, 'Registry devolveu nome diferente.');
			assert.equal(remote.version, item.version, 'Registry devolveu versão diferente.');
			verifyIntegrity(remote.dist?.integrity, item.integrity, item.name);
		}
		existing.set(item.name, Boolean(remote));
	}
	for (const item of plan.packages) {
		if (existing.get(item.name)) {
			console.log('Já publicado com integridade correta: ' + item.name);
			continue;
		}
		if (item.name === NAME('admin')) {
			const dependency = await getVersion(NAME('components'), item.version);
			if (!dependency) throw new Error('Dependência components ausente no registry.');
			verifyIntegrity(
				dependency.dist?.integrity,
				plan.packages.find((part) => part.name === NAME('components')).integrity,
				NAME('components'),
			);
		}
		await publishTarball(item);
		let confirmed = false;
		for (let attempt = 0; attempt < 12; attempt += 1) {
			const remote = await getVersion(item.name, item.version);
			if (remote) {
				assert.equal(remote.name, item.name);
				assert.equal(remote.version, item.version);
				verifyIntegrity(remote.dist?.integrity, item.integrity, item.name);
				confirmed = true;
				break;
			}
			await sleep(2500);
		}
		if (!confirmed) throw new Error('Publicação não confirmada no registry: ' + item.name);
	}
	for (const item of plan.packages) {
		const remote = await getVersion(item.name, item.version);
		if (!remote) throw new Error('Pacote ausente na verificação final: ' + item.name);
		assert.equal(remote.name, item.name);
		assert.equal(remote.version, item.version);
		verifyIntegrity(remote.dist?.integrity, item.integrity, item.name);
	}
	console.log('Quatro pacotes npm confirmados com SHA-512 idêntico aos tarballs validados.');
}

export async function registryVersion(name, version) {
	const url = REGISTRY + '/' + name.replace('/', '%2f') + '/' + encodeURIComponent(version);
	const response = await fetch(url, { headers: { accept: 'application/json' }, cache: 'no-store' });
	if (response.status === 404) return null;
	if (!response.ok) throw new Error('Falha ao consultar registry npm: HTTP ' + response.status);
	return response.json();
}

function npmPublish(tarball) {
	return new Promise((done, fail) => {
		const child = spawn(
			'npm',
			['publish', tarball, '--access', 'public', '--provenance', '--ignore-scripts', '--registry', REGISTRY],
			{ stdio: 'inherit', env: process.env },
		);
		child.on('error', fail);
		child.on('close', (code) => {
			if (code === 0) done();
			else fail(new Error('npm publish falhou com código ' + code));
		});
	});
}

function requireTrustedPublisher() {
	assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Publicação requer GitHub Actions.');
	assert.equal(process.env.GITHUB_REPOSITORY, 'dvmarques/admin-design-system');
	assert.equal(process.env.GITHUB_REF_NAME, 'develop', 'Disparo deve ser feito em develop.');
	assert.ok(
		process.env.GITHUB_WORKFLOW_REF?.includes(
			'dvmarques/admin-design-system/.github/workflows/release.yml@refs/heads/develop',
		),
		'Workflow OIDC inesperado.',
	);
	assert.ok(
		process.env.ACTIONS_ID_TOKEN_REQUEST_URL && process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN,
		'Token OIDC indisponível: configurar id-token: write no job npm.',
	);
	assert.ok(
		!process.env.NPM_TOKEN && !process.env.NODE_AUTH_TOKEN,
		'Tokens npm permanentes não são permitidos no job de publicação.',
	);
}

async function main() {
	const [operation, version, sha, dirArg] = process.argv.slice(2);
	const directory = resolve(dirArg || '');
	if (!['plan', 'publish'].includes(operation)) throw new Error('Modo esperado: plan ou publish.');
	if (!dirArg) throw new Error('Diretório de tarballs é obrigatório.');
	if (operation === 'plan') {
		const plan = await makePlan(version, sha, directory);
		await writeFile(join(directory, 'publication-plan.json'), JSON.stringify(plan, null, 2) + '\n');
		console.log('Plano validado para ' + version + ' no commit ' + sha + '; sem publicar.');
		return;
	}
	requireTrustedPublisher();
	const plan = JSON.parse(await readFile(join(directory, 'publication-plan.json'), 'utf8'));
	await verifyPlan(plan, version, sha, directory);
	await publishPlan(plan, {
		getVersion: registryVersion,
		publishTarball: (item) => npmPublish(join(directory, item.file)),
	});
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
