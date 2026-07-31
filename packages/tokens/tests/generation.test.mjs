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

function luminance(hex) {
	const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
	const linear = channels.map((channel) =>
		channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
	);
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(first, second) {
	const [lightest, darkest] = [luminance(first), luminance(second)].sort((a, b) => b - a);
	return (lightest + 0.05) / (darkest + 0.05);
}

test('default content and action colors meet the AA contrast baseline', () => {
	const source = tokenSource.color.reference;
	assert.ok(contrast(source.slate900, source.slate50) >= 4.5);
	assert.ok(contrast(source.white, source.blue500) >= 4.5);
});

function resolveThemeValue(value) {
	if (!value.startsWith('{')) return value;
	return value
		.slice(1, -1)
		.split('.')
		.reduce((current, segment) => current[segment], tokenSource);
}

test('semantic content, actions, states, and focus meet AA contrast in both themes', () => {
	for (const themeName of ['light', 'dark']) {
		const theme = tokenSource.color.semantic[themeName];
		const pair = (foreground, background) =>
			assert.ok(
				contrast(resolveThemeValue(theme[foreground]), resolveThemeValue(theme[background])) >= 4.5,
				`${themeName}: ${foreground} on ${background}`,
			);

		pair('text', 'surface');
		pair('textMuted', 'surface');
		pair('onPrimary', 'primary');
		pair('onPrimary', 'success');
		pair('onPrimary', 'warning');
		pair('onPrimary', 'danger');
		pair('info', 'infoBackground');
		pair('success', 'successBackground');
		pair('warning', 'warningBackground');
		pair('danger', 'dangerBackground');
		pair('focus', 'surface');
	}
});
