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

test('dashboard styles keep panels in DOM order and use public prefixes', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	assert.doesNotMatch(css, /grid-auto-flow:\s*dense/);
	assert.doesNotMatch(css, /\border:\s*-?\d/);
	for (const selector of ['.ads-dashboard-grid', '.ads-dashboard-panel', '.ads-metric-card']) {
		assert.ok(css.includes(selector), `missing selector: ${selector}`);
	}
	assert.ok(css.includes('--ads-dashboard-grid-columns'));
});

test('dashboard grid columns follow the grid width, not the viewport', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	assert.match(
		css,
		/\.ads-dashboard-grid\s*\{[^}]*container:\s*ads-dashboard-grid\s*\/\s*inline-size/,
	);
	assert.match(css, /@container ads-dashboard-grid \(min-width: 40rem\)/);
	assert.match(css, /@container ads-dashboard-grid \(min-width: 64rem\)/);
	for (const block of css.match(/@media[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g) ?? []) {
		assert.doesNotMatch(block, /ads-dashboard|ads-metric-card/);
	}
});
