import fs from 'node:fs/promises';
import path from 'node:path';

export const STABLE_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export const RELEASE_TAG = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export const MONTHS_PT_BR = [
	'jan',
	'fev',
	'mar',
	'abr',
	'mai',
	'jun',
	'jul',
	'ago',
	'set',
	'out',
	'nov',
	'dez',
];
export const RELEASE_FILES = ['CHANGELOG.md', 'package.json', 'package-lock.json'];

export function assertStableSemver(version) {
	if (!STABLE_SEMVER.test(version)) {
		throw new Error(`Versão inválida: ${version}. Use X.Y.Z sem prerelease/build metadata.`);
	}
	return version;
}

export function compareSemver(a, b) {
	assertStableSemver(a);
	assertStableSemver(b);
	const aa = a.split('.').map(Number);
	const bb = b.split('.').map(Number);
	for (let index = 0; index < 3; index += 1) {
		if (aa[index] !== bb[index]) return aa[index] < bb[index] ? -1 : 1;
	}
	return 0;
}

export function nextPatch(version) {
	const [major, minor, patch] = assertStableSemver(version).split('.').map(Number);
	return `${major}.${minor}.${patch + 1}`;
}

export function formatReleaseDate(date = new Date()) {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/Sao_Paulo',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(date);
	const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
	return `${values.day}-${MONTHS_PT_BR[Number(values.month) - 1]}-${values.year}`;
}

const HEADING_RE =
	/^### \[(\d+\.\d+\.\d+)\] - (Em andamento|\d{2}-(?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)-\d{4})$/gm;

export function parseChangelog(text) {
	const sections = [];
	for (const match of text.matchAll(HEADING_RE)) {
		sections.push({
			version: match[1],
			status: match[2],
			index: match.index,
			heading: match[0],
		});
	}
	const ongoing = sections.filter((section) => section.status === 'Em andamento');
	const closed = sections.filter((section) => section.status !== 'Em andamento');
	const seen = new Set();
	for (const section of closed) {
		if (seen.has(section.version)) {
			throw new Error(`Versão fechada duplicada no changelog: ${section.version}`);
		}
		seen.add(section.version);
	}
	for (let index = 1; index < closed.length; index += 1) {
		if (compareSemver(closed[index - 1].version, closed[index].version) <= 0) {
			throw new Error('Versões fechadas devem aparecer em ordem SemVer decrescente.');
		}
	}
	return { sections, ongoing, closed };
}

export function latestClosedVersion(parsed) {
	if (!parsed.closed.length) return null;
	return parsed.closed
		.map((section) => section.version)
		.sort(compareSemver)
		.at(-1);
}

export function predecessorVersion(parsed, target) {
	return (
		parsed.closed
			.map((section) => section.version)
			.filter((version) => compareSemver(version, target) < 0)
			.sort(compareSemver)
			.at(-1) ?? null
	);
}

export function extractReleaseNotes(text, version) {
	assertStableSemver(version);
	const parsed = parseChangelog(text);
	const section = parsed.closed.find((candidate) => candidate.version === version);
	if (!section) throw new Error(`Seção fechada ${version} não encontrada no changelog.`);
	const start = section.index + section.heading.length;
	const next = parsed.sections.find((candidate) => candidate.index > section.index);
	return text.slice(start, next?.index ?? text.length).trim();
}

export function normalizeReleaseBody(text) {
	return text.replace(/\r\n/g, '\n').replace(/\n+$/, '');
}

export function prepareChangelog(text, target, date = new Date()) {
	assertStableSemver(target);
	const parsed = parseChangelog(text);
	if (parsed.ongoing.length !== 1) {
		throw new Error(
			`Esperada exatamente uma seção Em andamento; encontradas ${parsed.ongoing.length}.`,
		);
	}
	if (parsed.closed.some((section) => section.version === target)) {
		throw new Error(`A versão ${target} já está fechada no changelog.`);
	}
	const ongoing = parsed.ongoing[0];
	const closedHeading = `### [${target}] - ${formatReleaseDate(date)}`;
	const newHeading = `### [${nextPatch(target)}] - Em andamento`;
	return `${text.slice(0, ongoing.index)}${newHeading}\n\n${closedHeading}${text.slice(
		ongoing.index + ongoing.heading.length,
	)}`;
}

export async function discoverManifests(root = '.') {
	const result = ['package.json'];
	for (const parent of ['packages', 'apps']) {
		let entries = [];
		try {
			entries = await fs.readdir(path.join(root, parent), { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;
			const relative = path.posix.join(parent, entry.name, 'package.json');
			try {
				await fs.access(path.join(root, relative));
				result.push(relative);
			} catch {
				// Diretório de workspace sem package.json.
			}
		}
	}
	return result;
}

export async function readJson(file) {
	return JSON.parse(await fs.readFile(file, 'utf8'));
}

export function formatJson(value) {
	return `${JSON.stringify(value, null, '\t')}\n`;
}

export function validateCoordinatedManifests(manifests) {
	const versions = new Set(manifests.map(({ json }) => json.version));
	if (versions.size !== 1) {
		throw new Error(`Versões divergentes no monorepo: ${[...versions].join(', ')}`);
	}
	return [...versions][0];
}

export function updateManifestVersions(manifests, target) {
	const internalNames = new Set(manifests.map(({ json }) => json.name).filter(Boolean));
	return manifests.map(({ rel, json }) => {
		const copy = structuredClone(json);
		copy.version = target;
		for (const field of [
			'dependencies',
			'devDependencies',
			'peerDependencies',
			'optionalDependencies',
		]) {
			if (!copy[field]) continue;
			for (const name of Object.keys(copy[field])) {
				if (internalNames.has(name)) copy[field][name] = target;
			}
		}
		return { rel, json: copy };
	});
}

export function validateTargetAgainstState({ target, current, parsed }) {
	const latest = latestClosedVersion(parsed);
	if (!latest) {
		if (compareSemver(target, current) < 0) {
			throw new Error(`Bootstrap não permite downgrade: atual=${current}, alvo=${target}.`);
		}
		return;
	}
	if (current !== latest) {
		throw new Error(
			`Versão coordenada atual ${current} deve corresponder à última versão fechada ${latest}.`,
		);
	}
	if (compareSemver(target, latest) <= 0) {
		throw new Error(`A nova versão ${target} deve ser superior à última fechada ${latest}.`);
	}
}

export function isAllowedReleaseFile(file) {
	return RELEASE_FILES.includes(file) || /^(packages|apps)\/[^/]+\/package\.json$/.test(file);
}
