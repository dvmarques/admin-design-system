import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { AdsAdminShell } from '@admin-ds/admin';
import {
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
} from '@admin-ds/components';

const demoRoot = resolve(import.meta.dirname, '..');

/** Reads every `app/**` and `lib/**` TypeScript source of the demo, except test files. */
async function readAppSources() {
	const files: string[] = [];
	for (const dir of ['app', 'lib']) {
		for (const entry of await readdir(resolve(demoRoot, dir), { recursive: true })) {
			if (/\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
				files.push(resolve(demoRoot, dir, entry));
			}
		}
	}
	return Promise.all(files.map((file) => readFile(file, 'utf8')));
}

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
	});

	it('includes the Admin Shell styles in its own distributed CSS', async () => {
		const css = await readFile(
			resolve(process.cwd(), '../../packages/admin/dist/styles.css'),
			'utf8',
		);

		expect(css).toMatch(/\.ads-admin-shell-header/);
		expect(css).toMatch(/min-height:\s*calc\(100vh - 4rem\)/);
		expect(css).not.toMatch(/@source|@import/);
	});

	it('keeps the reference application on public package imports', async () => {
		const sources = (await readAppSources()).join('\n');

		expect(sources).toContain("from '@admin-ds/components'");
		expect(sources).toContain("from '@admin-ds/admin'");
		expect(sources).not.toMatch(
			/@admin-ds\/(components|admin)\/src|packages\/(components|admin)\/src/,
		);
	});
});
