import assert from 'node:assert/strict';
import test from 'node:test';
import { createArtifacts, validateTokenSource } from '../scripts/generate-tokens.mjs';
import { tokenSource } from '../source/tokens.mjs';

test('generates CSS and TypeScript metadata from one source', () => {
	const artifacts = createArtifacts(tokenSource);
	assert.match(artifacts.css, /--ads-color-background/);
	assert.match(artifacts.css, /\[data-theme="dark"\]/);
	assert.match(artifacts.module, /export type TokenName/);
});
test('rejects missing required categories', () => {
	const incomplete = structuredClone(tokenSource);
	delete incomplete.motion;
	assert.throws(() => validateTokenSource(incomplete), /Missing required token category: motion/);
});
test('rejects invalid token references', () => {
	const invalid = structuredClone(tokenSource);
	invalid.color.semantic.light.primary = '{color.reference.missing}';
	assert.throws(() => validateTokenSource(invalid), /Unknown token reference/);
});

test('emits selectors for explicit and system themes', () => {
	const { css } = createArtifacts(tokenSource);
	assert.match(css, /:root, \[data-theme="light"\]/);
	assert.match(css, /\[data-theme="dark"\]/);
	assert.match(css, /prefers-color-scheme: dark/);
});

test('keeps theme overrides isolated by selector', () => {
	const { css } = createArtifacts(tokenSource);
	assert.match(css, /\[data-theme="light"\][\s\S]*--ads-color-primary/);
	assert.match(css, /\[data-theme="dark"\][\s\S]*--ads-color-primary/);
});

test('reduces motion durations to zero for every theme selector', () => {
	const { css } = createArtifacts(tokenSource);
	const block = css.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}\n/)?.[0] ?? '';
	for (const selector of [
		':root',
		'[data-theme="light"]',
		'[data-theme="dark"]',
		':root:not([data-theme])',
	])
		assert.ok(block.includes(selector), `reduced motion misses ${selector}`);
	assert.match(block, /--ads-motion-fast: 0ms/);
	assert.match(block, /--ads-motion-normal: 0ms/);
	assert.doesNotMatch(block, /motion-easing/);
});

test('emits high-contrast overrides after the themes, light before dark', () => {
	const { css } = createArtifacts(tokenSource);
	const themes = css.lastIndexOf('@media (prefers-color-scheme: dark)');
	const more = css.indexOf('@media (prefers-contrast: more) {');
	const light = css.indexOf(':root, [data-theme="light"] {', more);
	const dark = css.indexOf('[data-theme="dark"] {', more);
	const system = css.indexOf('@media (prefers-contrast: more) and (prefers-color-scheme: dark)');
	assert.ok(themes < more && more < light && light < dark && dark < system);
	assert.match(css.slice(system), /:root:not\(\[data-theme\]\)[\s\S]*--ads-color-border-control/);
});

test('rejects high-contrast overrides for unknown roles', () => {
	const invalid = structuredClone(tokenSource);
	invalid.color.semanticContrast.light.missing = '#000000';
	assert.throws(
		() => validateTokenSource(invalid),
		/Unknown high-contrast override: light.missing/,
	);
});

test('emits dark elevation only for dark theme selectors', () => {
	const { css } = createArtifacts(tokenSource);
	const light = css.match(/:root, \[data-theme="light"\] \{[\s\S]*?\n\}\n/)?.[0] ?? '';
	const dark = css.match(/\[data-theme="dark"\] \{[\s\S]*?\n\}\n/)?.[0] ?? '';
	const system = css.match(/:root:not\(\[data-theme\]\) \{[\s\S]*?\n\}\n/)?.[0] ?? '';
	assert.ok(light.includes(`--ads-elevation-md: ${tokenSource.elevation.md}`));
	for (const block of [dark, system])
		assert.ok(block.includes(`--ads-elevation-md: ${tokenSource.elevationDark.md}`));
	assert.notEqual(tokenSource.elevation.md, tokenSource.elevationDark.md);
});

test('emits density tokens after the themes, compact last', () => {
	const { css, module } = createArtifacts(tokenSource);
	const comfortable = css.indexOf(':root, [data-density="comfortable"] {');
	const compact = css.indexOf('[data-density="compact"] {');
	const system = css.lastIndexOf('@media (prefers-color-scheme: dark)');
	assert.ok(system < comfortable && comfortable < compact);
	assert.match(css.slice(compact), /--ads-density-cell-padding-y: 0\.375rem/);
	assert.match(css.slice(comfortable, compact), /--ads-density-cell-padding-y: 0\.75rem/);
	assert.match(module, /"density\.cellPaddingY": "0\.75rem"/);
	const themeBlocks = css.slice(0, comfortable);
	assert.doesNotMatch(themeBlocks, /--ads-density-/);
});

test('emits skeleton height tokens', () => {
	const { css } = createArtifacts(tokenSource);
	assert.match(css, /--ads-skeleton-height-text: 1rem/);
	assert.match(css, /--ads-skeleton-height-value: 2rem/);
	assert.match(css, /--ads-skeleton-height-block: 2\.5rem/);
});

test('rejects dark elevation and compact density with different keys', () => {
	const elevation = structuredClone(tokenSource);
	delete elevation.elevationDark.lg;
	assert.throws(() => validateTokenSource(elevation), /elevationDark must define the same tokens/);
	const density = structuredClone(tokenSource);
	density.densityCompact.extra = '1px';
	assert.throws(() => validateTokenSource(density), /densityCompact must define the same tokens/);
});

test('emits body, heading and monospace font families', () => {
	const { css, module } = createArtifacts(tokenSource);
	assert.ok(css.includes(`--ads-typography-font-family: ${tokenSource.typography.fontFamily};`));
	assert.ok(
		css.includes(`--ads-typography-font-family-heading: ${tokenSource.typography.fontFamily};`),
	);
	assert.match(css, /--ads-typography-font-family-mono: ui-monospace/);
	assert.match(module, /"typography\.fontFamilyMono"/);
});

test('emits the brand scale and keeps semantic roles pointing at it', () => {
	const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
	for (const step of steps) assert.ok(tokenSource.color.reference[`brand${step}`]);
	assert.equal(tokenSource.color.semantic.light.primary, '{color.reference.brand600}');
	assert.equal(tokenSource.color.semantic.dark.primary, '{color.reference.brand400}');
});
