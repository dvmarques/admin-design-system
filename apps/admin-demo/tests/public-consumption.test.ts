import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	AdsAvatar,
	AdsAdminShell,
	AdsBadge,
	AdsBreadcrumb,
	AdsButton,
	AdsCard,
	AdsCardActions,
	AdsCardContent,
	AdsCardHeader,
	AdsCheckbox,
	AdsDialog,
	AdsDrawer,
	AdsDropdown,
	AdsEmptyState,
	AdsField,
	AdsIcon,
	AdsInput,
	AdsList,
	AdsListItem,
	AdsLoadingIndicator,
	AdsNav,
	AdsPagination,
	AdsPopover,
	AdsProgress,
	AdsRadio,
	AdsSelect,
	AdsSelectionGroup,
	AdsSkeleton,
	AdsSurface,
	AdsSwitch,
	AdsTable,
	AdsTableBody,
	AdsTableCaption,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
	AdsTabs,
	AdsTextarea,
	AdsToast,
	AdsTooltip,
	AdsTypography,
} from '@admin-ds/components';

describe('public component consumption', () => {
	it('resolves all component exports without internal package paths', () => {
		expect([
			AdsAvatar,
			AdsBadge,
			AdsBreadcrumb,
			AdsButton,
			AdsCard,
			AdsCardActions,
			AdsCardContent,
			AdsCardHeader,
			AdsCheckbox,
			AdsDialog,
			AdsDrawer,
			AdsDropdown,
			AdsEmptyState,
			AdsField,
			AdsIcon,
			AdsInput,
			AdsList,
			AdsListItem,
			AdsLoadingIndicator,
			AdsNav,
			AdsPagination,
			AdsPopover,
			AdsProgress,
			AdsRadio,
			AdsSelect,
			AdsSelectionGroup,
			AdsSkeleton,
			AdsSurface,
			AdsSwitch,
			AdsTable,
			AdsTableBody,
			AdsTableCaption,
			AdsTableCell,
			AdsTableHead,
			AdsTableHeader,
			AdsTableRow,
			AdsTabs,
			AdsTextarea,
			AdsToast,
			AdsTooltip,
			AdsTypography,
			AdsAdminShell,
		]).toHaveLength(42);
	});

	it('includes component styles in the distributed CSS', async () => {
		const css = await readFile(
			resolve(process.cwd(), '../../packages/components/dist/styles.css'),
			'utf8',
		);

		expect(css).toMatch(/\.bg-primary/);
		expect(css).toMatch(/\.bg-success/);
		expect(css).toMatch(/\.min-w-0/);
		expect(css).toMatch(/\.animate-spin/);
		expect(css).toMatch(/\.animate-pulse/);
		expect(css).toMatch(/\.text-3xl/);
		expect(css).toMatch(/\.bg-form-background/);
		expect(css).toMatch(/\.border-form-invalid/);
		expect(css).toMatch(/\.ads-overlay-panel/);
		expect(css).toMatch(/\.ads-toast/);
		expect(css).toMatch(/\.ads-breadcrumb/);
		expect(css).toMatch(/\.ads-dropdown-content/);
		expect(css).toMatch(/\.ads-pagination/);
		expect(css).toMatch(/\.overflow-x-auto/);
		expect(css).toMatch(/\.border-dashed/);
		expect(css).toMatch(/motion-reduce/);
		expect(css).toMatch(/\.ads-admin-shell/);
		expect(css).toMatch(/min-height:calc\(100vh - 4rem\)/);
	});

	it('keeps the reference application on public package imports', async () => {
		const page = await readFile(
			resolve(process.cwd(), '../../apps/admin-demo/app/page.tsx'),
			'utf8',
		);
		expect(page).toContain("from '@admin-ds/components'");
		expect(page).not.toMatch(/@admin-ds\/components\/src|packages\/components\/src/);
	});
});
