import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AdsIcon as PublicAdsIcon } from '../src/index';
import { AdsIcon as LegacyAdsIcon } from '../src/icon';
import { AdsIcon as ModularAdsIcon } from '../src/icons/index';
import { iconPaths } from '../src/icons/paths';
import type { AdsIconName } from '../src/icons/types';

const names = [
	'alertCircle',
	'alertTriangle',
	'bell',
	'building',
	'calendar',
	'check',
	'chevronDown',
	'chevronLeft',
	'chevronRight',
	'chevronsUpDown',
	'close',
	'logOut',
	'monitor',
	'moon',
	'info',
	'plus',
	'sun',
	'settings',
	'search',
	'user',
] as const satisfies readonly AdsIconName[];

describe('AdsIcon modular architecture', () => {
	it('preserves the existing public and legacy exports', () => {
		expect(PublicAdsIcon).toBe(ModularAdsIcon);
		expect(LegacyAdsIcon).toBe(ModularAdsIcon);
	});

	it('keeps all 20 names and their licensed SVG artwork in one module', () => {
		expect(Object.keys(iconPaths)).toEqual(names);
	});

	it.each(names)('renders %s identically through both public entrypoints', (name) => {
		const props = { name, label: 'Ícone', size: 'sm' } as const;
		expect(renderToStaticMarkup(<LegacyAdsIcon {...props} />)).toBe(
			renderToStaticMarkup(<PublicAdsIcon {...props} />),
		);
	});

	it.each(names)('preserves the reviewed artwork for %s', (name) => {
		expect(renderToStaticMarkup(<>{iconPaths[name]}</>)).toMatchSnapshot();
	});
});
