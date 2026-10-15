#!/usr/bin/env node
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { URLSearchParams } from 'node:url';

const STABLE_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const VERSION_HEADING = /^### \[([^\]]+)\] - (.+)$/gm;
const RELEASE_DATE = /^(\d{2})-(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)-(\d{4})$/;
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const version = process.env.VERSION;
const readonlyReleaseSha = process.env.READONLY_RELEASE_SHA;
const readonlyBackmergeSha = process.env.READONLY_BACKMERGE_SHA;
const readonlyDevelopSha = process.env.READONLY_DEVELOP_SHA;
const readonlyReleaseNotesSha = process.env.READONLY_RELEASE_NOTES_SHA;
const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const apiBaseUrl = process.env.GITHUB_API_URL ?? 'https://api.github.com';

if (!version || !STABLE_SEMVER.test(version)) throw new Error(`Versão inválida: ${version ?? ''}`);
if (
	!readonlyReleaseSha ||
	!readonlyBackmergeSha ||
	!readonlyDevelopSha ||
	!readonlyReleaseNotesSha
) {
	throw new Error('Evidências do job read-only são obrigatórias.');
}
if (!repository || !token) throw new Error('GITHUB_REPOSITORY e GITHUB_TOKEN são obrigatórios.');

const [owner, repo] = repository.split('/');
if (!owner || !repo) throw new Error('GITHUB_REPOSITORY inválido.');
const headers = {
	Accept: 'application/vnd.github+json',
	Authorization: `Bearer ${token}`,
	'X-GitHub-Api-Version': '2022-11-28',
};

async function api(apiPath, { method = 'GET', body, allow404 = false } = {}) {
	const response = await globalThis.fetch(`${apiBaseUrl}/repos/${repository}${apiPath}`, {
		method,
		headers: { ...headers, ...(body ? { 'Content-Type': 'application/json' } : {}) },
		body: body ? JSON.stringify(body) : undefined,
	});
	if (allow404 && response.status === 404) return null;
	if (!response.ok) throw new Error(`${response.status} ${apiPath}: ${await response.text()}`);
	if (response.status === 204) return null;
	return response.json();
}

async function refSha(ref) {
	const result = await api(`/git/ref/${encodeURIComponent(ref)}`);
	return result.object.sha;
}

async function contentAt(filePath, ref, { allow404 = false } = {}) {
	const result = await api(`/contents/${filePath}?ref=${encodeURIComponent(ref)}`, { allow404 });
	if (!result) return null;
	if (Array.isArray(result) || result.type !== 'file')
		throw new Error(`${filePath}@${ref} não é arquivo.`);
	return Buffer.from(result.content.replace(/\n/g, ''), 'base64').toString('utf8');
}

async function listDirectory(directory, ref) {
	const result = await api(`/contents/${directory}?ref=${encodeURIComponent(ref)}`);
	if (!Array.isArray(result)) throw new Error(`${directory}@${ref} não é diretório.`);
	return result;
}

async function resolveMerged(target, base) {
	const query = new URLSearchParams({
		state: 'closed',
		base,
		head: `${owner}:release/${target}`,
		per_page: '100',
	});
	const pulls = await api(`/pulls?${query}`);
	const matches = pulls.filter(
		(pr) =>
			pr.merged_at &&
			pr.head?.repo?.full_name === repository &&
			pr.head?.ref === `release/${target}` &&
			pr.base?.ref === base,
	);
	if (matches.length !== 1) {
		throw new Error(
			`Esperada 1 PR merged release/${target} -> ${base}; encontradas ${matches.length}.`,
		);
	}
	if (!matches[0].merge_commit_sha)
		throw new Error(`PR release/${target} -> ${base} sem merge_commit_sha.`);
	return matches[0];
}

async function assertAncestor(ancestor, descendant, label) {
	const compare = await api(
		`/compare/${encodeURIComponent(ancestor)}...${encodeURIComponent(descendant)}`,
	);
	if (!['ahead', 'identical'].includes(compare.status)) {
		throw new Error(`${label}: ${ancestor} não pertence ao histórico de ${descendant}.`);
	}
}

function compareSemver(a, b) {
	const aa = a.split('.').map(Number);
	const bb = b.split('.').map(Number);
	for (let index = 0; index < 3; index += 1) {
		if (aa[index] !== bb[index]) return aa[index] - bb[index];
	}
	return 0;
}

function assertReleaseDate(value) {
	const match = RELEASE_DATE.exec(value);
	if (!match) throw new Error(`Data de release inválida: ${value}.`);
	const day = Number(match[1]);
	const month = MONTHS.indexOf(match[2]);
	const year = Number(match[3]);
	const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if (day < 1 || day > days[month]) throw new Error(`Data de release inválida: ${value}.`);
}

function parseChangelog(text) {
	const sections = [];
	for (const match of text.matchAll(VERSION_HEADING)) {
		if (!STABLE_SEMVER.test(match[1]))
			throw new Error(`Versão inválida no changelog: ${match[1]}.`);
		if (match[2] !== 'Em andamento') assertReleaseDate(match[2]);
		sections.push({ version: match[1], status: match[2], index: match.index, heading: match[0] });
	}
	const ongoing = sections.filter(({ status }) => status === 'Em andamento');
	const closed = sections.filter(({ status }) => status !== 'Em andamento');
	if (ongoing.length !== 1)
		throw new Error(`Esperada exatamente uma seção Em andamento; encontradas ${ongoing.length}.`);
	const seen = new Set();
	for (const section of closed) {
		if (seen.has(section.version)) throw new Error(`Versão fechada duplicada: ${section.version}.`);
		seen.add(section.version);
	}
	for (let index = 1; index < closed.length; index += 1) {
		if (compareSemver(closed[index - 1].version, closed[index].version) <= 0) {
			throw new Error('Versões fechadas fora de ordem SemVer decrescente.');
		}
	}
	return { sections, ongoing, closed };
}

function releaseBlock(text, parsed, target) {
	const section = parsed.closed.find(({ version: candidate }) => candidate === target);
	if (!section) throw new Error(`Bloco fechado ${target} ausente.`);
	const next = parsed.sections.find(({ index }) => index > section.index);
	return text.slice(section.index + section.heading.length, next?.index ?? text.length).trim();
}

function normalizeBody(value = '') {
	return value.replace(/\r\n/g, '\n').replace(/\n+$/, '');
}

function notesSha(value) {
	return createHash('sha256').update(`${value}\n`).digest('hex');
}

async function manifestPaths(ref) {
	const paths = ['package.json'];
	for (const parent of ['packages', 'apps']) {
		for (const entry of (await listDirectory(parent, ref)).filter(({ type }) => type === 'dir')) {
			const candidate = `${parent}/${entry.name}/package.json`;
			if (await contentAt(candidate, ref, { allow404: true })) paths.push(candidate);
		}
	}
	return paths;
}

async function validateCoordinated(ref, target) {
	const manifests = [];
	for (const filePath of await manifestPaths(ref)) {
		manifests.push({ path: filePath, json: JSON.parse(await contentAt(filePath, ref)) });
	}
	const names = new Set(manifests.map(({ json }) => json.name).filter(Boolean));
	for (const { path: filePath, json } of manifests) {
		if (json.version !== target)
			throw new Error(`${filePath}@${ref} usa ${json.version}; esperado ${target}.`);
		for (const field of [
			'dependencies',
			'devDependencies',
			'peerDependencies',
			'optionalDependencies',
		]) {
			for (const [name, value] of Object.entries(json[field] ?? {})) {
				if (names.has(name) && value !== target) {
					throw new Error(`${filePath}: ${field}.${name}=${value}; esperado ${target}.`);
				}
			}
		}
	}
	const lock = JSON.parse(await contentAt('package-lock.json', ref));
	if (lock.version !== target || lock.packages?.['']?.version !== target) {
		throw new Error(`package-lock.json@${ref} não está coordenado em ${target}.`);
	}
	for (const { path: filePath } of manifests.filter(
		({ path: candidate }) => candidate !== 'package.json',
	)) {
		const workspace = filePath.slice(0, -'/package.json'.length);
		if (lock.packages?.[workspace]?.version !== target) {
			throw new Error(`Lockfile divergente em ${workspace}@${ref}.`);
		}
	}
}

async function tagState(target) {
	const ref = await api(`/git/ref/tags/v${target}`, { allow404: true });
	if (!ref) return { exists: false };
	if (ref.object.type !== 'tag') return { exists: true, annotated: false, commit: ref.object.sha };
	const tag = await api(`/git/tags/${ref.object.sha}`);
	if (tag.object.type !== 'commit') throw new Error(`v${target} não aponta para commit.`);
	return { exists: true, annotated: true, commit: tag.object.sha, tagObject: ref.object.sha };
}

async function releaseState(target) {
	return api(`/releases/tags/v${target}`, { allow404: true });
}

async function validatePublished(target) {
	const pr = await resolveMerged(target, 'master');
	const tag = await tagState(target);
	const release = await releaseState(target);
	if (!tag.exists || !tag.annotated || tag.commit !== pr.merge_commit_sha || !release) {
		throw new Error(`Release anterior ${target} inconsistente.`);
	}
	const changelog = await contentAt('CHANGELOG.md', pr.merge_commit_sha);
	const notes = releaseBlock(changelog, parseChangelog(changelog), target);
	if (
		release.tag_name !== `v${target}` ||
		release.name !== `v${target}` ||
		release.draft ||
		release.prerelease ||
		normalizeBody(release.body ?? '') !== normalizeBody(notes)
	) {
		throw new Error(`Metadados da release anterior ${target} divergentes.`);
	}
}

async function validateTargetArtifacts(target, releaseSha, notes) {
	const tag = await tagState(target);
	const release = await releaseState(target);
	if (tag.exists && (!tag.annotated || tag.commit !== releaseSha)) {
		throw new Error(`Tag v${target} é lightweight ou aponta para outro commit.`);
	}
	if (release) {
		if (
			!tag.exists ||
			release.tag_name !== `v${target}` ||
			release.name !== `v${target}` ||
			release.draft ||
			release.prerelease ||
			normalizeBody(release.body ?? '') !== normalizeBody(notes)
		) {
			throw new Error(`GitHub Release v${target} existente está divergente.`);
		}
	}
	return { tag, release };
}

const releasePr = await resolveMerged(version, 'master');
const backmergePr = await resolveMerged(version, 'develop');
const releaseSha = releasePr.merge_commit_sha;
const backmergeSha = backmergePr.merge_commit_sha;
if (releaseSha !== readonlyReleaseSha)
	throw new Error('Commit rederivado diverge do job read-only.');
if (backmergeSha !== readonlyBackmergeSha)
	throw new Error('Back-merge rederivado diverge do job read-only.');

const initialDevelopSha = await refSha('heads/develop');
const initialMasterSha = await refSha('heads/master');
if (initialDevelopSha !== readonlyDevelopSha)
	throw new Error('HEAD de develop diverge da evidência read-only.');
await assertAncestor(releaseSha, initialMasterSha, 'Release');
await assertAncestor(backmergeSha, initialDevelopSha, 'Back-merge');
await validateCoordinated(releaseSha, version);
await validateCoordinated(initialDevelopSha, version);

const releaseChangelog = await contentAt('CHANGELOG.md', releaseSha);
const releaseParsed = parseChangelog(releaseChangelog);
const notes = releaseBlock(releaseChangelog, releaseParsed, version);
if (notesSha(notes) !== readonlyReleaseNotesSha)
	throw new Error('Notas rederivadas divergem da evidência read-only.');
const developChangelog = await contentAt('CHANGELOG.md', initialDevelopSha);
const developParsed = parseChangelog(developChangelog);
if (releaseBlock(developChangelog, developParsed, version) !== notes) {
	throw new Error('Bloco fechado em develop diverge do commit liberado.');
}

const predecessor = releaseParsed.closed
	.map(({ version: candidate }) => candidate)
	.filter((candidate) => compareSemver(candidate, version) < 0)
	.sort(compareSemver)
	.at(-1);
if (predecessor) await validatePublished(predecessor);
await validateTargetArtifacts(version, releaseSha, notes);

// Revalidar o estado mutável imediatamente antes de qualquer escrita.
const releasePrNow = await resolveMerged(version, 'master');
const backmergePrNow = await resolveMerged(version, 'develop');
if (
	releasePrNow.merge_commit_sha !== releaseSha ||
	backmergePrNow.merge_commit_sha !== backmergeSha
) {
	throw new Error('PR/commit de release ou back-merge mudou durante a publicação.');
}
const currentDevelopSha = await refSha('heads/develop');
const currentMasterSha = await refSha('heads/master');
if (currentDevelopSha !== initialDevelopSha) {
	throw new Error(
		`develop mudou durante a publicação: ${initialDevelopSha} -> ${currentDevelopSha}.`,
	);
}
await assertAncestor(releaseSha, currentMasterSha, 'Release');
await assertAncestor(backmergeSha, currentDevelopSha, 'Back-merge');
if (predecessor) await validatePublished(predecessor);
const currentState = await validateTargetArtifacts(version, releaseSha, notes);

if (currentState.release) {
	console.log(`v${version} já publicada de forma consistente; nenhuma alteração necessária.`);
	process.exit(0);
}

let tag = currentState.tag;
if (!tag.exists) {
	const tagObject = await api('/git/tags', {
		method: 'POST',
		body: {
			tag: `v${version}`,
			message: `Release v${version}`,
			object: releaseSha,
			type: 'commit',
		},
	});
	await api('/git/refs', {
		method: 'POST',
		body: { ref: `refs/tags/v${version}`, sha: tagObject.sha },
	});
	tag = { exists: true, annotated: true, commit: releaseSha };
}
if (!tag.annotated || tag.commit !== releaseSha)
	throw new Error(`Tag v${version} incompatível após criação.`);

await api('/releases', {
	method: 'POST',
	body: {
		tag_name: `v${version}`,
		name: `v${version}`,
		body: notes,
		draft: false,
		prerelease: false,
		target_commitish: releaseSha,
	},
});
console.log(`Release v${version} publicada no commit ${releaseSha}.`);
