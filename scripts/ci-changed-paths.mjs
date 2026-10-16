#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const docsRootFiles = new Set(['CHANGELOG.md', 'AGENTS.md', 'CLAUDE.md', 'README.md']);
const docsExceptions = [
	/^docs\/integration\.md$/,
	/^docs\/bundle-baseline\./,
	/^packages\/tokens\/README\.md$/,
	/^\.github\//,
];

export function isDocsFile(file) {
	if (docsExceptions.some((pattern) => pattern.test(file))) return false;
	return file.startsWith('openspec/') || docsRootFiles.has(file) || /^docs\/[^/]+\.md$/.test(file);
}

// Só `true` dispensa trabalho: qualquer dúvida cai no fluxo completo.
export function isDocsOnly({ event, baseRef, files }) {
	if (event !== 'pull_request' || baseRef === 'master') return false;
	if (!Array.isArray(files) || files.length === 0) return false;
	return files.every(isDocsFile);
}

function changedFiles() {
	try {
		const output = execFileSync('git', ['diff', '--name-only', 'HEAD^1', 'HEAD'], {
			encoding: 'utf8',
		});
		return output.split('\n').filter(Boolean);
	} catch {
		return [];
	}
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	const docsOnly = isDocsOnly({
		event: process.env.GITHUB_EVENT_NAME,
		baseRef: process.env.GITHUB_BASE_REF,
		files: changedFiles(),
	});
	const line = `docs_only=${docsOnly}`;
	console.log(line);
	if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${line}\n`);
}
