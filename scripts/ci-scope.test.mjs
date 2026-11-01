import assert from 'node:assert/strict';
import test from 'node:test';
import { isDocsOnly } from './ci-changed-paths.mjs';
import { loadWorkspaces } from './ci-impact.mjs';
import { computeScope, renderSummary } from './ci-scope.mjs';

const workspaces = loadWorkspaces();
const scope = (files, { event = 'pull_request', baseRef = 'develop' } = {}) =>
	computeScope({ event, baseRef, detect: () => ({ files, workspaces }) });

const everything = { reduced: false, docsOnly: false, buildDocs: true, buildDemo: true, e2e: true };

test('docs-only PRs to develop skip builds and E2E', () => {
	const { scope: decision, impact } = scope(['docs/quality.md', 'CHANGELOG.md']);
	assert.equal(impact.mode, 'docs');
	assert.deepEqual(decision, {
		reduced: true,
		docsOnly: true,
		buildDocs: false,
		buildDemo: false,
		e2e: false,
	});
});

test('a Storybook-only PR skips the demo build and E2E but still builds Storybook', () => {
	const { scope: decision } = scope(['apps/docs/src/button.stories.tsx', 'CHANGELOG.md']);
	assert.deepEqual(decision, {
		reduced: true,
		docsOnly: false,
		buildDocs: true,
		buildDemo: false,
		e2e: false,
	});
});

test('PRs touching the demo or any package keep E2E', () => {
	assert.equal(scope(['apps/admin-demo/src/page.tsx']).scope.e2e, true);
	for (const file of [
		'packages/tokens/src/a.ts',
		'packages/components/src/a.tsx',
		'packages/admin/src/a.tsx',
	]) {
		const { scope: decision } = scope([file]);
		assert.deepEqual(
			[decision.buildDocs, decision.buildDemo, decision.e2e],
			[true, true, true],
			file,
		);
	}
});

test('anything global, unknown or undetectable runs everything', () => {
	for (const files of [
		['scripts/a.mjs'],
		['.github/workflows/ci.yml'],
		['package-lock.json'],
		['mystery'],
		['docs/integration.md'],
		[],
	]) {
		assert.deepEqual(scope(files).scope, everything, JSON.stringify(files));
	}
	const failed = computeScope({
		event: 'pull_request',
		baseRef: 'develop',
		detect: () => {
			throw new Error('HEAD não é um commit de merge de PR\ndetalhe');
		},
	});
	assert.deepEqual(failed.scope, everything);
	assert.equal(failed.reason, 'detecção indisponível: HEAD não é um commit de merge de PR');
});

test('push events and release PRs always run everything without inspecting git', () => {
	const refuse = () => {
		throw new Error('não deveria detectar');
	};
	for (const input of [
		{ event: 'push', baseRef: '' },
		{ event: 'pull_request', baseRef: 'master' },
		{ event: undefined, baseRef: undefined },
	]) {
		const result = computeScope({ ...input, detect: refuse });
		assert.deepEqual(result.scope, everything);
		assert.match(result.reason, /validação completa por política/);
	}
});

test('docs_only agrees with the legacy documentation rule', () => {
	const samples = [
		['docs/quality.md'],
		['CHANGELOG.md', 'AGENTS.md', 'README.md', 'CLAUDE.md'],
		['openspec/changes/x/design.md', 'docs/release-process.md'],
		['docs/quality.md', 'packages/components/src/a.tsx'],
		['docs/integration.md'],
		['docs/bundle-baseline.json'],
		['packages/tokens/README.md'],
		['.github/workflows/ci.yml'],
		['docs/sub/page.md'],
		['apps/docs/README.md'],
		['package.json'],
	];
	for (const files of samples) {
		const legacy = isDocsOnly({ event: 'pull_request', baseRef: 'develop', files });
		assert.equal(scope(files).scope.docsOnly, legacy, JSON.stringify(files));
	}
});

test('the summary states what runs and that quality always runs in full', () => {
	const text = renderSummary(scope(['apps/docs/src/a.ts']));
	assert.match(text, /Modo: `scoped`/);
	assert.match(text, /apps\/docs/);
	assert.match(text, /Build do admin demo: dispensado/);
	assert.match(text, /E2E \(Chromium, Firefox, WebKit\): dispensado/);
	assert.match(text, /Qualidade rápida e política de develop: sempre executam por completo/);
	assert.match(renderSummary(scope(['mystery'])), /E2E \(Chromium, Firefox, WebKit\): executa/);
});
