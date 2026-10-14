import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('admin package exposes only its public entry points', () => {
	assert.deepEqual(Object.keys(manifest.exports), ['.', './styles.css']);
});

test('admin package declares its runtime peers explicitly', () => {
	for (const peer of ['@admin-ds/components', 'react', 'react-dom']) {
		assert.ok(manifest.peerDependencies[peer], `missing peer dependency: ${peer}`);
	}
});

test('admin stylesheet does not require Tailwind in consumers', async () => {
	const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	assert.doesNotMatch(css, /@import|@source|@theme|@apply/);
});
