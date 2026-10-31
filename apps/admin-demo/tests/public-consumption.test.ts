import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	findAdsSelectors,
	findForbiddenClassTokens,
	findInternalPackageImports,
	findTailwindDirectives,
	findUndeclaredDependencies,
	importSpecifiers,
	listDemoRootFiles,
	readDemoFiles,
	readDemoPackageJson,
} from './support/demo-contract';
import { AdsAdminShell } from '@dvmarques/admin-ds-admin';
import {
	AdsAccordion,
	AdsAccordionHeader,
	AdsAccordionItem,
	AdsAccordionPanel,
	AdsAccordionTrigger,
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
	AdsLoadingText,
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
} from '@dvmarques/admin-ds-components';

const repoRoot = resolve(import.meta.dirname, '../../..');

describe('public component consumption', () => {
	it('resolves all component exports without internal package paths', () => {
		expect([
			AdsAccordion,
			AdsAccordionHeader,
			AdsAccordionItem,
			AdsAccordionPanel,
			AdsAccordionTrigger,
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
			AdsLoadingText,
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
		]).toHaveLength(48);
	});

	it('includes component styles in the distributed CSS', async () => {
		const css = await readFile(resolve(repoRoot, 'packages/components/dist/styles.css'), 'utf8');

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
		expect(css).toMatch(/\.ads-loading-text/);
		expect(css).toMatch(/\.ads-dropdown-content/);
		expect(css).toMatch(/\.ads-pagination/);
		expect(css).toMatch(/\.overflow-x-auto/);
		expect(css).toMatch(/\.border-dashed/);
		expect(css).toMatch(/motion-reduce/);
	});

	it('includes the Admin Shell styles in its own distributed CSS', async () => {
		const css = await readFile(resolve(repoRoot, 'packages/admin/dist/styles.css'), 'utf8');

		expect(css).toMatch(/\.ads-admin-shell-header/);
		expect(css).toMatch(/min-height:\s*calc\(100vh - 4rem\)/);
		expect(css).not.toMatch(/@source|@import/);
	});

	it('keeps the reference application on public package imports', async () => {
		const files = await readDemoFiles(['app', 'lib'], /\.(ts|tsx)$/);
		const sources = files.map((file) => file.content).join('\n');

		expect(sources).toContain("from '@dvmarques/admin-ds-components'");
		expect(sources).toContain("from '@dvmarques/admin-ds-admin'");
		for (const file of files) {
			expect(findInternalPackageImports(importSpecifiers(file.content)), file.path).toEqual([]);
		}
	});

	it('imports only packages that its own package.json declares', async () => {
		const files = await readDemoFiles(['app', 'lib'], /\.(ts|tsx)$/);
		const { dependencies = {} } = await readDemoPackageJson();

		for (const file of files) {
			expect(
				findUndeclaredDependencies(importSpecifiers(file.content), Object.keys(dependencies)),
				file.path,
			).toEqual([]);
		}
	});

	it('does not depend on or configure Tailwind', async () => {
		const { dependencies = {}, devDependencies = {} } = await readDemoPackageJson();
		const declared = [...Object.keys(dependencies), ...Object.keys(devDependencies)];
		expect(declared.filter((name) => /tailwind/i.test(name))).toEqual([]);

		expect(
			(await listDemoRootFiles()).filter((name) => /^(tailwind|postcss)\.config\./.test(name)),
		).toEqual([]);

		for (const file of await readDemoFiles(['app'], /\.css$/)) {
			expect(findTailwindDirectives(file.content), file.path).toEqual([]);
		}
	});

	it('does not redefine the internal look of public ads- classes', async () => {
		for (const file of await readDemoFiles(['app'], /\.css$/)) {
			expect(findAdsSelectors(file.content), file.path).toEqual([]);
		}
	});

	it('uses only demo- and public ads- classes in literal className values', async () => {
		for (const file of await readDemoFiles(['app'], /\.tsx$/)) {
			expect(findForbiddenClassTokens(file.content), file.path).toEqual([]);
		}
	});
});
