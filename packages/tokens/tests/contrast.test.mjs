import assert from 'node:assert/strict';
import test from 'node:test';
import { tokenSource } from '../source/tokens.mjs';
import { contrastPairs, minimumRatio } from './contrast-pairs.mjs';

function luminance(hex) {
	const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
	const linear = channels.map((channel) =>
		channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
	);
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrast(first, second) {
	const [lightest, darkest] = [luminance(first), luminance(second)].sort((a, b) => b - a);
	return (lightest + 0.05) / (darkest + 0.05);
}

function resolveValue(value) {
	if (!value.startsWith('{')) return value;
	return value
		.slice(1, -1)
		.split('.')
		.reduce((current, segment) => current[segment], tokenSource);
}

/** Papéis de cor de um tema; em `more`, aplica as sobrescritas de `prefers-contrast: more`. */
function roles(themeName, mode) {
	const overrides = mode === 'more' ? tokenSource.color.semanticContrast[themeName] : {};
	return { ...tokenSource.color.semantic[themeName], ...overrides };
}

const hexOnly = (value) => /^#[\da-f]{6}$/i.test(value);

for (const themeName of ['light', 'dark']) {
	for (const mode of ['default', 'more']) {
		test(`contrast pairs meet WCAG 2.2 AA in the ${themeName} theme (${mode} contrast)`, () => {
			const theme = roles(themeName, mode);
			const failures = [];
			for (const { kind, foreground, background } of contrastPairs) {
				const fg = resolveValue(theme[foreground] ?? '');
				const bg = resolveValue(theme[background] ?? '');
				assert.ok(hexOnly(fg), `${themeName}: unknown or non-hex role ${foreground}`);
				assert.ok(hexOnly(bg), `${themeName}: unknown or non-hex role ${background}`);
				const ratio = contrast(fg, bg);
				if (ratio < minimumRatio[kind])
					failures.push(
						`${themeName}/${mode}: ${foreground} on ${background} = ${ratio.toFixed(2)}:1 (min ${minimumRatio[kind]}:1)`,
					);
			}
			assert.deepEqual(failures, []);
		});
	}
}

test('default content and action colors meet the AA contrast baseline', () => {
	const source = tokenSource.color.reference;
	assert.ok(contrast(source.slate900, source.slate50) >= 4.5);
	assert.ok(contrast(source.white, source.blue500) >= 4.5);
});

test('high-contrast mode never lowers a pair below its default ratio', () => {
	for (const themeName of ['light', 'dark']) {
		const base = roles(themeName, 'default');
		const more = roles(themeName, 'more');
		for (const { foreground, background } of contrastPairs) {
			const ratio = (theme) =>
				contrast(resolveValue(theme[foreground]), resolveValue(theme[background]));
			assert.ok(
				ratio(more) >= ratio(base) - 0.001,
				`${themeName}: ${foreground} on ${background} loses contrast in prefers-contrast: more`,
			);
		}
	}
});
