import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	AdsAvatar,
	AdsBadge,
	AdsButton,
	AdsCheckbox,
	AdsField,
	AdsInput,
	AdsIcon,
	AdsLoadingIndicator,
	AdsRadio,
	AdsSelect,
	AdsSelectionGroup,
	AdsSurface,
	AdsSwitch,
	AdsTextarea,
	AdsTypography,
	AdsDialog,
	AdsDrawer,
	AdsPopover,
	AdsToast,
	AdsTooltip,
	AdsBreadcrumb,
	AdsNav,
	AdsTabs,
	AdsDropdown,
	AdsPagination,
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
			AdsCheckbox,
			AdsField,
			AdsInput,
			AdsRadio,
			AdsSelect,
			AdsSelectionGroup,
			AdsSwitch,
			AdsTextarea,
			AdsDialog,
			AdsDrawer,
			AdsPopover,
			AdsToast,
			AdsTooltip,
			AdsBreadcrumb,
			AdsNav,
			AdsTabs,
			AdsDropdown,
			AdsPagination,
		]).toHaveLength(25);
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
		expect(css).toMatch(/\.bg-form-background/);
		expect(css).toMatch(/\.border-form-invalid/);
		expect(css).toMatch(/\.ads-overlay-panel/);
		expect(css).toMatch(/\.ads-toast/);
		expect(css).toMatch(/\.ads-breadcrumb/);
		expect(css).toMatch(/\.ads-dropdown-content/);
		expect(css).toMatch(/\.ads-pagination/);
	});
});
