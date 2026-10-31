import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const names = readdirSync(new URL('.github/workflows/', root)).filter(
	(name) => name.endsWith('.yml') || name.endsWith('.yaml'),
);
const playwrightVersion = '1.64.1';
const playwrightDigest = 'sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea';
const playwrightImage =
	'mcr.microsoft.com/playwright:v' + playwrightVersion + '-noble@' + playwrightDigest;

const block = (workflow, jobName) => {
	const start = workflow.indexOf('\n  ' + jobName + ':\n');
	assert.notEqual(start, -1, 'job ' + jobName);
	const next = workflow.slice(start + 1).search(/\n {2}[a-z][a-z-]*:\n/);
	return next === -1 ? workflow.slice(start) : workflow.slice(start, start + 1 + next);
};

export function verifyWorkflowSupplyChain() {
	const manifest = JSON.parse(read('package.json'));
	const lock = JSON.parse(read('package-lock.json'));
	assert.equal(manifest.engines.node, '>=24.0.0');
	for (const dep of ['@playwright/test', 'playwright', 'playwright-core']) {
		if (dep === '@playwright/test') assert.equal(manifest.devDependencies[dep], playwrightVersion);
		assert.equal(lock.packages['node_modules/' + dep]?.version, playwrightVersion, dep);
	}
	assert.equal(lock.packages['']?.devDependencies['@playwright/test'], playwrightVersion);

	const expectedImages = ['ci.yml', 'pages.yml', 'update-visual-baselines.yml'];
	for (const file of names) {
		const workflow = read('.github/workflows/' + file);
		assert.doesNotMatch(workflow, /pull_request_target/, file + ' usa evento privilegiado');
		assert.doesNotMatch(workflow, /npx[^\n]*(?:@latest|@fission-ai\/openspec(?!@1\.15\.0))/, file);
		assert.doesNotMatch(workflow, /uses:\s*[^\n]*@v\d+(?:\s|$)/, file + ': action por tag mutável');
		for (const match of workflow.matchAll(
			/^\s+(?:-\s+)?uses:\s+([^\s#]+)(?:[ \t]+#[ \t]*([^\r\n]+))?/gm,
		)) {
			const action = match[1];
			if (action.startsWith('./')) continue;
			assert.match(action, /^[\w.-]+\/[\w./-]+@[a-f0-9]{40}$/, file + ': ' + action);
			assert.match(
				match[2] ?? '',
				/^v\d+(?:\.\d+)*\b/,
				file + ': comentário de versão em ' + action,
			);
			if (action.startsWith('actions/checkout@')) {
				const snippet = workflow.slice(
					match.index,
					workflow.indexOf('\n      - ', match.index + 1) === -1
						? undefined
						: workflow.indexOf('\n      - ', match.index + 1),
				);
				assert.match(
					snippet,
					/persist-credentials:\s*false/,
					file + ': checkout deve remover token persistido',
				);
			}
		}
		const references = [
			...workflow.matchAll(/^\s+image:\s+(mcr\.microsoft\.com\/playwright:[^\s#]+)/gm),
		].map((x) => x[1]);
		if (expectedImages.includes(file)) {
			assert.deepEqual(
				references,
				[playwrightImage],
				file + ': imagem/versionamento inconsistentes',
			);
		} else {
			assert.deepEqual(references, [], file + ': imagem não inventariada');
		}
	}
	const ci = read('.github/workflows/ci.yml');
	const pages = read('.github/workflows/pages.yml');
	const security = read('.github/workflows/security.yml');
	const release = read('.github/workflows/release.yml');
	const baseline = read('.github/workflows/update-visual-baselines.yml');
	assert.match(ci, /^permissions:\n {2}contents: read/m);
	assert.match(pages, /^permissions:\n {2}contents: read/m);
	assert.match(security, /^permissions:\n {2}contents: read/m);
	assert.match(block(pages, 'deploy'), /permissions:\n\s+pages: write\n\s+id-token: write/);
	assert.match(
		block(security, 'sast'),
		/permissions:\n\s+contents: read\n\s+security-events: write/,
	);
	assert.doesNotMatch(block(release, 'resolve-validate'), /contents: write/);
	assert.match(block(release, 'publish'), /contents: write/);
	assert.match(baseline, /^permissions:\n {2}contents: read/m);
	assert.doesNotMatch(block(baseline, 'generate'), /contents: write/);
	assert.match(block(baseline, 'commit'), /permissions:\n\s+contents: write/);
	assert.doesNotMatch(block(baseline, 'commit'), /npm (ci|install|run)|npx |node \.\/scripts\//);
	assert.match(
		block(baseline, 'generate'),
		/safe\.directory "\$GITHUB_WORKSPACE"\n\s+node \.\/scripts\/visual-baseline-transfer\.mjs/,
		'generate: git no contêiner exige safe.directory antes do transfer',
	);
	assert.match(block(baseline, 'generate'), /ref: \$\{\{ github\.sha \}\}/);
	assert.match(block(baseline, 'commit'), /ref: \$\{\{ github\.sha \}\}/);
	assert.match(block(baseline, 'commit'), /manifest\.sha !== sha/);
	assert.match(block(baseline, 'commit'), /ls-remote/);
	assert.match(block(baseline, 'commit'), /git push .*HEAD:refs\/heads/);
	assert.doesNotMatch(ci + pages + security, /contents: write/);
	return names.length;
}
