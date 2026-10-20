import assert from 'node:assert/strict';
import test from 'node:test';
import { tokenSource } from '../source/tokens.mjs';
import { minimumDistance, visionModes } from './color-vision.mjs';

/** ΔE mínimo entre quaisquer duas cores de gráfico, em visão normal e nas três dicromacias. */
const minimumDelta = 10;
const chartRoles = Array.from({ length: 8 }, (_, index) => `chart${index + 1}`);

for (const themeName of ['light', 'dark']) {
	test(`defines eight distinct chart colors in the ${themeName} theme`, () => {
		const theme = tokenSource.color.semantic[themeName];
		const colors = chartRoles.map((role) => theme[role]);
		for (const color of colors) assert.match(color, /^#[\da-f]{6}$/i);
		assert.equal(new Set(colors).size, chartRoles.length);
	});

	for (const mode of visionModes)
		test(`chart colors stay distinguishable in the ${themeName} theme (${mode})`, () => {
			const theme = tokenSource.color.semantic[themeName];
			const distance = minimumDistance(
				chartRoles.map((role) => theme[role]),
				mode,
			);
			assert.ok(distance >= minimumDelta, `${themeName}/${mode}: ΔE mínimo ${distance.toFixed(1)}`);
		});
}

test('dark surfaces are distinct from each other and from background and surface', () => {
	const dark = tokenSource.color.semantic.dark;
	const resolve = (value) =>
		value.startsWith('{')
			? value
					.slice(1, -1)
					.split('.')
					.reduce((current, segment) => current[segment], tokenSource)
			: value;
	const roles = ['background', 'surface', 'surfaceRaised', 'surfaceMuted', 'surfaceHover'];
	const values = roles.map((role) => resolve(dark[role]));
	assert.equal(new Set(values).size, roles.length);
});

test('spacing scale keeps existing values and adds 5, 10, 12 and 16', () => {
	assert.deepEqual(tokenSource.spacing, {
		1: '0.25rem',
		2: '0.5rem',
		3: '0.75rem',
		4: '1rem',
		5: '1.25rem',
		6: '1.5rem',
		8: '2rem',
		10: '2.5rem',
		12: '3rem',
		16: '4rem',
	});
});
