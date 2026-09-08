#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import {
	discoverManifests,
	isAllowedReleaseFile,
	parseChangelog,
	readJson,
	validateCoordinatedManifests,
} from './release-utils.mjs';

const base = process.env.GITHUB_BASE_SHA;
const headRef = process.env.GITHUB_HEAD_REF ?? '';
const sameRepo = process.env.PR_HEAD_REPO === process.env.GITHUB_REPOSITORY;
if (!base) throw new Error('GITHUB_BASE_SHA obrigatório.');

const show = (ref, file) => execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8' });
const section = (text, parsed, version) => {
	const current = parsed.closed.find((candidate) => candidate.version === version);
	if (!current) return null;
	const next = parsed.sections.find((candidate) => candidate.index > current.index);
	return text.slice(current.index, next?.index ?? text.length).trimEnd();
};
const assertClosedBlocksPreserved = ({ allowAddedVersion = null } = {}) => {
	const baseVersions = baseParsed.closed.map(({ version }) => version);
	const headVersions = headParsed.closed.map(({ version }) => version);
	const expectedVersions = allowAddedVersion ? [allowAddedVersion, ...baseVersions] : baseVersions;
	if (
		headVersions.length !== expectedVersions.length ||
		headVersions.some((version, index) => version !== expectedVersions[index])
	) {
		throw new Error(
			`Conjunto de versões fechadas divergente. Esperado: ${expectedVersions.join(', ') || '(vazio)'}; encontrado: ${headVersions.join(', ') || '(vazio)'}.`,
		);
	}
	for (const closed of baseParsed.closed) {
		const before = section(baseChangelog, baseParsed, closed.version);
		const after = section(headChangelog, headParsed, closed.version);
		if (after === null) throw new Error(`Bloco fechado ${closed.version} removido.`);
		if (before !== after) throw new Error(`Bloco fechado ${closed.version} alterado.`);
	}
};

const headChangelog = await fs.readFile('CHANGELOG.md', 'utf8');
const baseChangelog = show(base, 'CHANGELOG.md');
const headParsed = parseChangelog(headChangelog);
const baseParsed = parseChangelog(baseChangelog);
if (headParsed.ongoing.length !== 1) {
	throw new Error('Head deve conter exatamente uma seção Em andamento.');
}

const manifests = await Promise.all(
	(await discoverManifests()).map(async (relative) => ({
		rel: relative,
		json: await readJson(relative),
	})),
);
const headVersion = validateCoordinatedManifests(manifests);
const baseRoot = JSON.parse(show(base, 'package.json'));
const isBackmerge = sameRepo && /^release\/\d+\.\d+\.\d+$/.test(headRef);

if (!isBackmerge) {
	if (headVersion !== baseRoot.version) {
		throw new Error('PR comum não pode alterar a versão coordenada.');
	}
	if (headParsed.ongoing[0].version !== baseParsed.ongoing[0]?.version) {
		throw new Error('PR comum não pode alterar o heading Em andamento.');
	}
	assertClosedBlocksPreserved();
	console.log('develop-policy comum: ok');
} else {
	const changed = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], {
		encoding: 'utf8',
	})
		.trim()
		.split('\n')
		.filter(Boolean);
	const invalid = changed.filter((file) => !isAllowedReleaseFile(file));
	if (invalid.length) {
		throw new Error(`Back-merge altera arquivos não permitidos: ${invalid.join(', ')}`);
	}

	const version = headRef.slice('release/'.length);
	if (headVersion !== version) {
		throw new Error(`Back-merge ${version} com manifests ${headVersion}.`);
	}
	assertClosedBlocksPreserved({ allowAddedVersion: version });

	const repo = process.env.GITHUB_REPOSITORY;
	const token = process.env.GITHUB_TOKEN;
	if (!repo || !token) {
		throw new Error('GITHUB_REPOSITORY/GITHUB_TOKEN obrigatórios no back-merge.');
	}
	const [owner] = repo.split('/');
	const headers = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${token}`,
		'X-GitHub-Api-Version': '2022-11-28',
	};
	const query = new URLSearchParams({
		state: 'closed',
		base: 'master',
		head: `${owner}:release/${version}`,
		per_page: '100',
	});
	const pullsResponse = await fetch(`https://api.github.com/repos/${repo}/pulls?${query}`, {
		headers,
	});
	if (!pullsResponse.ok) {
		throw new Error(`Falha ao resolver PR de release: ${pullsResponse.status}`);
	}
	const pulls = await pullsResponse.json();
	const matches = pulls.filter(
		(pr) =>
			pr.merged_at &&
			pr.head?.repo?.full_name === repo &&
			pr.head?.ref === `release/${version}` &&
			pr.base?.ref === 'master',
	);
	if (matches.length !== 1) {
		throw new Error(
			`Esperada uma PR merged release/${version} -> master; encontradas ${matches.length}.`,
		);
	}

	const releaseSha = matches[0].merge_commit_sha;
	const contentResponse = await fetch(
		`https://api.github.com/repos/${repo}/contents/CHANGELOG.md?ref=${encodeURIComponent(releaseSha)}`,
		{ headers },
	);
	if (!contentResponse.ok) {
		throw new Error(`Falha ao ler CHANGELOG do commit liberado: ${contentResponse.status}`);
	}
	const content = await contentResponse.json();
	const releaseChangelog = Buffer.from(content.content.replace(/\n/g, ''), 'base64').toString(
		'utf8',
	);
	const releaseParsed = parseChangelog(releaseChangelog);
	const expected = section(releaseChangelog, releaseParsed, version);
	const actual = section(headChangelog, headParsed, version);
	if (!actual || actual !== expected) {
		throw new Error(`Bloco fechado ${version} diverge do commit exato liberado ${releaseSha}.`);
	}

	console.log(`develop-policy back-merge ${version}: ok (${releaseSha})`);
}
