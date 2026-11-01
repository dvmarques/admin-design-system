import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = new URL('./visual-baseline-transfer.mjs', import.meta.url).pathname;
const sha = 'a'.repeat(40);

const run = (env) =>
	spawnSync(process.execPath, [script], {
		env: { PATH: process.env.PATH, ...env },
		encoding: 'utf8',
	});

for (const branch of ['develop', 'master', 'release/1.2.3', 'x y', 'a;b', '']) {
	test('recusa a branch "' + branch + '"', () => {
		const result = run({
			GITHUB_REF_NAME: branch,
			GITHUB_REF: 'refs/heads/' + branch,
			GITHUB_SHA: sha,
		});
		assert.notEqual(result.status, 0);
		assert.match(result.stderr, /branches de feature/);
	});
}

test('recusa ref divergente da branch', () => {
	const result = run({
		GITHUB_REF_NAME: 'feature/x',
		GITHUB_REF: 'refs/heads/outra',
		GITHUB_SHA: sha,
	});
	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /Ref\/commit de origem inválidos/);
});

test('recusa SHA que não tem 40 hex', () => {
	const result = run({
		GITHUB_REF_NAME: 'feature/x',
		GITHUB_REF: 'refs/heads/feature/x',
		GITHUB_SHA: 'abc',
	});
	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /Ref\/commit de origem inválidos/);
});
