import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';

const [ci, release] = await Promise.all([
	fs.readFile(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8'),
	fs.readFile(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8'),
]);

test('publication workflow is manually dispatched only from develop and serialized', () => {
	assert.match(release, /workflow_dispatch:/);
	assert.match(release, /group: release-publication/);
	assert.match(release, /queue: max/);
	assert.doesNotMatch(release, /cancel-in-progress:\s*true/);
	assert.match(release, /GITHUB_REF_NAME" == "develop/);
});

test('publication separates read-only validation from privileged publication', () => {
	assert.match(release, /resolve-validate:[\s\S]*?permissions:[\s\S]*?contents: read/);
	assert.match(release, /publish:[\s\S]*?permissions:[\s\S]*?contents: write/);
	assert.match(release, /publish:[\s\S]*?publish-release\.mjs/);
	assert.doesNotMatch(release, /publish:[\s\S]*?npm run release:/);
});

test('CI keeps checks visible while draft PR jobs are skipped and Ready reruns them', () => {
	assert.match(ci, /ready_for_review/);
	assert.match(
		ci,
		/github\.event_name != 'pull_request' \|\| github\.event\.pull_request\.draft == false/,
	);
	assert.match(ci, /develop-policy:[\s\S]*?github\.base_ref == 'develop'[\s\S]*?draft == false/);
	assert.match(ci, /release-check:[\s\S]*?github\.base_ref == 'master'[\s\S]*?draft == false/);
	assert.match(ci, /push:[\s\S]*?develop[\s\S]*?master/);
});
