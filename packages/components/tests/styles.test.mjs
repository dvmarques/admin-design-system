import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('build distributes static Tailwind utilities without preflight', async () => {
	const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
	assert.match(css, /\.bg-surface/);
	assert.match(css, /\.border-primary/);
	assert.doesNotMatch(css, /\*,:after,:before/);
});
