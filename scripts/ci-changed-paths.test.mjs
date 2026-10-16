import assert from 'node:assert/strict';
import test from 'node:test';
import { isDocsFile, isDocsOnly } from './ci-changed-paths.mjs';

const pr = (files, baseRef = 'develop') => isDocsOnly({ event: 'pull_request', baseRef, files });

test('documentation and spec files are classified as docs', () => {
	for (const file of [
		'openspec/changes/x/proposal.md',
		'CHANGELOG.md',
		'AGENTS.md',
		'CLAUDE.md',
		'README.md',
		'docs/release-process.md',
	]) {
		assert.equal(isDocsFile(file), true, file);
	}
});

test('docs read by tests or scripts, nested docs and code are not docs', () => {
	for (const file of [
		'docs/integration.md',
		'docs/bundle-baseline.json',
		'docs/bundle-baseline.md',
		'packages/tokens/README.md',
		'.github/workflows/ci.yml',
		'docs/sub/page.md',
		'docs/image.png',
		'package.json',
		'packages/components/src/button.tsx',
		'apps/docs/README.md',
	]) {
		assert.equal(isDocsFile(file), false, file);
	}
});

test('a PR with only docs skips heavy work', () => {
	assert.equal(pr(['openspec/specs/a/spec.md', 'docs/quality.md', 'CHANGELOG.md']), true);
});

test('a PR mixing docs and code runs the full flow', () => {
	assert.equal(pr(['docs/quality.md', 'packages/components/src/button.tsx']), false);
	assert.equal(pr(['docs/quality.md', 'docs/integration.md']), false);
});

test('unknown or empty change lists run the full flow', () => {
	assert.equal(pr([]), false);
	assert.equal(pr(undefined), false);
});

test('push events and PRs to master always run the full flow', () => {
	assert.equal(isDocsOnly({ event: 'push', baseRef: '', files: ['docs/quality.md'] }), false);
	assert.equal(pr(['docs/quality.md'], 'master'), false);
});
