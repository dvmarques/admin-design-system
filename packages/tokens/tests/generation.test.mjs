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
