#!/usr/bin/env node
import fs from 'node:fs/promises';
import {
	extractReleaseNotes,
	normalizeReleaseBody,
	parseChangelog,
	predecessorVersion,
	RELEASE_TAG,
} from './release-utils.mjs';

const [command, version] = process.argv.slice(2);
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) {
	throw new Error('GITHUB_REPOSITORY e GITHUB_TOKEN são obrigatórios.');
}

const [owner] = repo.split('/');
const headers = {
	Accept: 'application/vnd.github+json',
	Authorization: `Bearer ${token}`,
	'X-GitHub-Api-Version': '2022-11-28',
};

async function api(apiPath, { allow404 = false } = {}) {
	const response = await fetch(`https://api.github.com/repos/${repo}${apiPath}`, { headers });
	if (allow404 && response.status === 404) return null;
	if (!response.ok) {
		throw new Error(`${response.status} ${apiPath}: ${await response.text()}`);
	}
	return response.json();
}

async function contentAt(filePath, ref) {
	const content = await api(`/contents/${filePath}?ref=${encodeURIComponent(ref)}`);
	return Buffer.from(content.content.replace(/\n/g, ''), 'base64').toString('utf8');
}

async function resolveMerged(target, base) {
	const query = new URLSearchParams({
		state: 'closed',
		base,
		head: `${owner}:release/${target}`,
		per_page: '100',
	});
	const pulls = await api(`/pulls?${query}`);
	const candidates = pulls.filter(
		(pr) =>
			pr.merged_at &&
			pr.head?.repo?.full_name === repo &&
			pr.head?.ref === `release/${target}` &&
			pr.base?.ref === base,
	);
	if (candidates.length !== 1) {
		throw new Error(
			`Esperada 1 PR merged release/${target} -> ${base}; encontradas ${candidates.length}.`,
		);
	}
	return candidates[0];
}

async function tagState(target) {
	const ref = await api(`/git/ref/tags/v${target}`, { allow404: true });
	if (!ref) return { exists: false };
	if (ref.object.type !== 'tag') {
		return { exists: true, annotated: false, commit: ref.object.sha };
	}
	const tag = await api(`/git/tags/${ref.object.sha}`);
	if (tag.object.type !== 'commit') throw new Error(`v${target} não aponta para commit.`);
	return {
		exists: true,
		annotated: true,
		commit: tag.object.sha,
		tagObject: ref.object.sha,
	};
}

async function releaseState(target) {
	return api(`/releases/tags/v${target}`, { allow404: true });
}

async function published(target) {
	const pr = await resolveMerged(target, 'master');
	const tag = await tagState(target);
	const release = await releaseState(target);
	if (!tag.exists || !tag.annotated || tag.commit !== pr.merge_commit_sha) {
		throw new Error(`Tag v${target} ausente, lightweight ou divergente do commit esperado.`);
	}
	if (!release) throw new Error(`GitHub Release v${target} ausente.`);

	const changelog = await contentAt('CHANGELOG.md', pr.merge_commit_sha);
	const notes = extractReleaseNotes(changelog, target);
	if (
		release.tag_name !== `v${target}` ||
		release.name !== `v${target}` ||
		release.draft ||
		release.prerelease ||
		normalizeReleaseBody(release.body ?? '') !== normalizeReleaseBody(notes)
	) {
		throw new Error(`GitHub Release v${target} divergente.`);
	}
	return {
		version: target,
		pr: pr.number,
		commit: pr.merge_commit_sha,
		tag,
		release: {
			id: release.id,
			tag_name: release.tag_name,
			name: release.name,
			draft: release.draft,
			prerelease: release.prerelease,
		},
	};
}

if (command === 'resolve') {
	console.log(JSON.stringify(await resolveMerged(version, process.argv[4] ?? 'master')));
} else if (command === 'state') {
	console.log(
		JSON.stringify({ tag: await tagState(version), release: await releaseState(version) }),
	);
} else if (command === 'target-absent') {
	const state = { tag: await tagState(version), release: await releaseState(version) };
	if (state.tag.exists || state.release) {
		throw new Error(`v${version} já possui tag/release antes da integração.`);
	}
	console.log('ok');
} else if (command === 'published') {
	console.log(JSON.stringify(await published(version)));
} else if (command === 'predecessor') {
	const parsed = parseChangelog(await fs.readFile('CHANGELOG.md', 'utf8'));
	const predecessor = predecessorVersion(parsed, version);
	if (!predecessor) {
		console.log(JSON.stringify({ predecessor: null }));
	} else {
		console.log(
			JSON.stringify({ predecessor, published: await published(predecessor) }),
		);
	}
} else if (command === 'bootstrap-remote') {
	const parsed = parseChangelog(await fs.readFile('CHANGELOG.md', 'utf8'));
	if (predecessorVersion(parsed, version)) {
		console.log('not-bootstrap');
	} else {
		const tags = await api('/tags?per_page=100');
		const releaseTags = tags.map((tag) => tag.name).filter((name) => RELEASE_TAG.test(name));
		const releases = await api('/releases?per_page=100');
		const releaseNames = releases
			.map((release) => release.tag_name)
			.filter((name) => RELEASE_TAG.test(name));
		if (releaseTags.length || releaseNames.length) {
			throw new Error(
				`Bootstrap incompatível com histórico remoto: tags=${releaseTags.join(',')} releases=${releaseNames.join(',')}`,
			);
		}
		console.log('ok');
	}
} else {
	throw new Error(`Comando desconhecido: ${command}`);
}
