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

test('filter bar collapses by its own width and keeps the header hidden on wide bars', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	assert.match(css, /\.ads-filter-bar\s*\{[^}]*container:\s*ads-filter-bar\s*\/\s*inline-size/);
	assert.match(css, /\.ads-filter-bar-header\s*\{[^}]*display:\s*none/);
	const query = css.match(
		/@container ads-filter-bar \(max-width: 40rem\)\s*\{(?:[^{}]*\{[^}]*\})*[^}]*\}/,
	)?.[0];
	assert.ok(query, 'missing @container ads-filter-bar (max-width: 40rem)');
	assert.match(query, /\.ads-filter-bar-header\s*\{[^}]*display:\s*block/);
	assert.match(query, /\.ads-filter-bar-body\[data-expanded='false'\]\s*\{[^}]*display:\s*none/);
	assert.match(css, /\.ads-filter-bar\[data-loading\]::before\s*\{[^}]*animation:/);
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

test('admin flow styles hide inactive steps, keep announcements accessible and use tokens', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	assert.match(css, /\.ads-step-form-panel\[hidden\]\s*\{[^}]*display:\s*none/);
	assert.match(
		css,
		/\.ads-bulk-action-bar-status,\s*\.ads-step-form-visually-hidden\s*\{[^}]*clip-path:\s*inset\(50%\)/,
	);
	assert.match(css, /\.ads-step-form-heading:focus-visible\s*\{[^}]*--ads-color-focus-ring/);
	assert.match(
		css,
		/\.ads-step-form-step\[data-state='current'\] \.ads-step-form-marker\s*\{[^}]*--ads-color-primary/,
	);
	assert.match(css, /\.ads-bulk-action-bar\s*\{[^}]*flex-wrap:\s*wrap/);
	const start = css.indexOf('.ads-bulk-action-bar-status');
	assert.ok(start > 0, 'missing admin flow styles');
	assert.doesNotMatch(css.slice(start), /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(/);
});

test('smart table styles use public tokens, a focusable scroll region and the selected row state', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	assert.match(css, /\.ads-smart-table-scroll:focus-visible/);
	assert.match(
		css,
		/\.ads-smart-table \.ads-table-row\[data-selected\]\s*\{[^}]*--ads-color-primary/,
	);
	assert.match(css, /\.ads-smart-table-columns-panel\[hidden\]\s*\{[^}]*display:\s*none/);
});

test('smart table caption is padded with density tokens before the visually hidden rule', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	const caption = css.match(/\.ads-smart-table-scroll :where\(\.ads-table-caption\)\s*\{([^}]*)\}/);
	assert.ok(caption, 'missing smart table caption padding');
	assert.match(
		caption[1],
		/padding:[^;]*--ads-density-cell-padding-y[^;]*--ads-density-cell-padding-x/,
	);
	// A legenda oculta zera o padding; para vencer com a mesma especificidade, vem depois.
	assert.ok(css.indexOf('.ads-smart-table-visually-hidden') > caption.index);
});

test('smart table selection cell has no percentage width, so the table is not stretched', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	const block = css.match(/\.ads-smart-table-select-cell\s*\{([^}]*)\}/)?.[1];
	assert.ok(block, 'missing .ads-smart-table-select-cell');
	assert.doesNotMatch(block, /width:[^;]*%/);
	assert.match(block, /white-space:\s*nowrap/);
});

test('smart table column panel is inline and the grid does not grow past its container', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	const panel = css.match(/\.ads-smart-table-columns-panel\s*\{([^}]*)\}/)?.[1];
	assert.ok(panel, 'missing .ads-smart-table-columns-panel');
	assert.doesNotMatch(panel, /position:\s*(absolute|fixed)|z-index/);
	assert.match(css, /\.ads-smart-table\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
	assert.match(css, /\.ads-smart-table-pagination > \.ads-pagination\s*\{[^}]*min-width:\s*0/);
});

test('admin styles take durations from the motion tokens and cover forced colors', async () => {
	const source = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
	const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
	assert.doesNotMatch(css, /transition:[^;]*\d+m?s/);
	assert.doesNotMatch(css, /transition:\s*none/);
	const forced = css.slice(css.indexOf('@media (forced-colors: active)'));
	assert.match(
		forced,
		/\.ads-smart-table \.ads-table-row\[data-selected\]\s*\{[^}]*outline:[^;]*Highlight/,
	);
	assert.match(forced, /\.ads-filter-bar\[data-loading\]::before\s*\{[^}]*Highlight/);
});
