import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	AdsAvatar,
	AdsBadge,
	AdsButton,
	AdsIcon,
	AdsLoadingIndicator,
	AdsSurface,
	AdsTypography,
} from '@admin-ds/components';

describe('public component consumption', () => {
	it('resolves all primitive exports without internal package paths', () => {
		expect([
			AdsAvatar,
			AdsBadge,
			AdsButton,
			AdsIcon,
			AdsLoadingIndicator,
			AdsSurface,
			AdsTypography,
		]).toHaveLength(7);
	});

	it('includes primitive styles in the distributed CSS', async () => {
		const css = await readFile(
			resolve(process.cwd(), '../../packages/components/dist/styles.css'),
			'utf8',
		);

		expect(css).toMatch(/\.bg-primary/);
		expect(css).toMatch(/\.bg-success/);
		expect(css).toMatch(/\.min-w-0/);
		expect(css).toMatch(/\.animate-spin/);
		expect(css).toMatch(/\.text-3xl/);
	});
});
