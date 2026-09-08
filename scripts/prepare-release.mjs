#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
	assertStableSemver,
	discoverManifests,
	formatJson,
	parseChangelog,
	prepareChangelog,
	readJson,
	updateManifestVersions,
	validateCoordinatedManifests,
	validateTargetAgainstState,
} from './release-utils.mjs';

const PINNED_NPM = '11.19.1';
const target = process.argv[2];
if (!target) throw new Error('Uso: npm run release:prepare -- X.Y.Z');
assertStableSemver(target);

const npmVersion = execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim();
if (npmVersion !== PINNED_NPM) {
	throw new Error(`Use npm ${PINNED_NPM} para preparar releases; atual: ${npmVersion}.`);
}

const root = process.cwd();
const branch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
if (branch !== `release/${target}`) {
	throw new Error(`Execute em release/${target}; branch atual: ${branch || '(detached)'}`);
}
if (execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()) {
	throw new Error('Working tree deve estar limpa antes da preparação.');
}

const manifestPaths = await discoverManifests(root);
const manifests = await Promise.all(
	manifestPaths.map(async (relative) => ({
		rel: relative,
		json: await readJson(path.join(root, relative)),
	})),
);
const current = validateCoordinatedManifests(manifests);
const changelogPath = path.join(root, 'CHANGELOG.md');
const changelog = await fs.readFile(changelogPath, 'utf8');
const parsed = parseChangelog(changelog);
validateTargetAgainstState({ target, current, parsed });

const staged = new Map();
for (const { rel, json } of updateManifestVersions(manifests, target)) {
	staged.set(rel, formatJson(json));
}
staged.set('CHANGELOG.md', prepareChangelog(changelog, target));

const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'admin-ds-release-'));
try {
	for (const [relative, content] of staged) {
		const destination = path.join(tempRoot, relative);
		await fs.mkdir(path.dirname(destination), { recursive: true });
		await fs.writeFile(destination, content);
	}

	await fs.copyFile(path.join(root, 'package-lock.json'), path.join(tempRoot, 'package-lock.json'));
	execFileSync(
		'npm',
		['install', '--package-lock-only', '--ignore-scripts', '--offline', '--no-audit', '--no-fund'],
		{ cwd: tempRoot, stdio: 'inherit' },
	);
	// Confirma que o lockfile gerado pode ser instalado de forma reproduzível
	// antes de qualquer arquivo do repositório ser substituído.
	execFileSync('npm', ['ci', '--ignore-scripts', '--offline', '--no-audit', '--no-fund'], {
		cwd: tempRoot,
		stdio: 'inherit',
	});
	staged.set(
		'package-lock.json',
		await fs.readFile(path.join(tempRoot, 'package-lock.json'), 'utf8'),
	);

	const backups = new Map();
	try {
		for (const [relative, content] of staged) {
			const destination = path.join(root, relative);
			backups.set(relative, await fs.readFile(destination));
			const temporary = `${destination}.release-tmp-${process.pid}`;
			await fs.writeFile(temporary, content);
			await fs.rename(temporary, destination);
		}
	} catch (error) {
		for (const [relative, content] of backups) {
			await fs.writeFile(path.join(root, relative), content);
		}
		throw error;
	}
} finally {
	await fs.rm(tempRoot, { recursive: true, force: true });
}

console.log(`Release ${target} preparada com sucesso.`);
