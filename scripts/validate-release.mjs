#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {
	assertStableSemver,
	discoverManifests,
	parseChangelog,
	readJson,
	validateCoordinatedManifests,
} from './release-utils.mjs';

const version = process.argv[2];
if (!version) throw new Error('Uso: node scripts/validate-release.mjs X.Y.Z');
assertStableSemver(version);

const manifests = await Promise.all(
	(await discoverManifests()).map(async (relative) => ({
		rel: relative,
		json: await readJson(relative),
	})),
);
const coordinated = validateCoordinatedManifests(manifests);
if (coordinated !== version) {
	throw new Error(`Versão coordenada ${coordinated} difere de ${version}.`);
}

const names = new Set(manifests.map(({ json }) => json.name).filter(Boolean));
for (const { rel, json } of manifests) {
	for (const field of [
		'dependencies',
		'devDependencies',
		'peerDependencies',
		'optionalDependencies',
	]) {
		for (const [name, value] of Object.entries(json[field] ?? {})) {
			if (names.has(name) && value !== version) {
				throw new Error(`${rel}: ${field}.${name}=${value}; esperado ${version}.`);
			}
		}
	}
}

const lock = JSON.parse(await fs.readFile('package-lock.json', 'utf8'));
if (lock.version !== version || lock.packages?.['']?.version !== version) {
	throw new Error('package-lock.json raiz não está coordenado.');
}
for (const { rel } of manifests.filter(({ rel }) => rel !== 'package.json')) {
	const workspace = path.posix.dirname(rel);
	if (lock.packages?.[workspace]?.version !== version) {
		throw new Error(`Lockfile divergente em ${workspace}.`);
	}
}

const parsed = parseChangelog(await fs.readFile('CHANGELOG.md', 'utf8'));
if (!parsed.closed.some((section) => section.version === version)) {
	throw new Error(`CHANGELOG não possui seção fechada ${version}.`);
}
if (parsed.ongoing.length !== 1) {
	throw new Error('CHANGELOG deve possuir exatamente uma seção Em andamento.');
}

console.log(`Release ${version} consistente.`);
