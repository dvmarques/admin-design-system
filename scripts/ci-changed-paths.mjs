// Classificação de documentação usada por `ci-impact.mjs` e `ci-scope.mjs`.
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
