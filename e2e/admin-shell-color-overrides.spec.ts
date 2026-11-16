import { expect, test } from '@playwright/test';

const swatches = {
	light: {
		defaultSidebar: 'rgb(255, 255, 255)',
		defaultHeader: 'rgb(255, 255, 255)',
		global: 'rgb(238, 238, 238)',
		sidebar: 'rgb(234, 242, 255)',
		sidebarHex: '#eaf2ff',
		header: 'rgb(220, 230, 250)',
		headerHex: '#dce6fa',
		headerText: 'rgb(15, 23, 42)',
		headerTextHex: '#0f172a',
	},
	dark: {
		defaultSidebar: 'rgb(51, 65, 85)',
		defaultHeader: 'rgb(30, 41, 59)',
		global: 'rgb(68, 68, 68)',
		sidebar: 'rgb(34, 51, 68)',
		sidebarHex: '#223344',
		header: 'rgb(25, 44, 70)',
		headerHex: '#192c46',
		headerText: 'rgb(248, 250, 252)',
		headerTextHex: '#f8fafc',
	},
} as const;

for (const theme of ['light', 'dark'] as const) {
	test(`shell: cores por região sem mudar defaults (${theme})`, async ({ page }) => {
		const colors = swatches[theme];
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/');
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

		const sidebar = page.locator('.ads-admin-shell-sidebar-desktop > .ads-admin-shell-sidebar');
		const sidebarHeader = page.locator(
			'.ads-admin-shell-sidebar-desktop > .ads-admin-shell-sidebar-header',
		);
		const header = page.locator('.ads-admin-shell-header');
		const main = page.locator('.ads-admin-shell-main');
		const baselineMain = await main.evaluate(
			(element) => getComputedStyle(element).backgroundColor,
		);
		await expect(sidebar).toHaveCSS('background-color', colors.defaultSidebar);
		await expect(sidebarHeader).toHaveCSS('background-color', colors.defaultSidebar);
		await expect(header).toHaveCSS('background-color', colors.defaultHeader);

		// Without a component override, changing a global token still changes the sidebar.
		await page.addStyleTag({
			content: `[data-theme='${theme}'] { --ads-color-surface-raised: ${colors.global}; }`,
		});
		await expect(sidebar).toHaveCSS('background-color', colors.global);
		await expect(sidebarHeader).toHaveCSS('background-color', colors.global);

		// With a component override, only the targeted region changes.
		await page.addStyleTag({
			content: `[data-theme='${theme}'] {
				--ads-sidebar-background: ${colors.sidebarHex};
				--ads-header-background: ${colors.headerHex};
				--ads-header-text: ${colors.headerTextHex};
			}`,
		});
		await expect(sidebar).toHaveCSS('background-color', colors.sidebar);
		await expect(sidebarHeader).toHaveCSS('background-color', colors.sidebar);
		await expect(header).toHaveCSS('background-color', colors.header);
		await expect(header).toHaveCSS('color', colors.headerText);
		await expect(main).toHaveCSS('background-color', baselineMain);

		// The existing demo selection override remains compatible; explicit local override wins.
		await page.addStyleTag({
			content: `[data-theme='${theme}'] .demo-navigation {
				--ads-sidebar-active-background: ${colors.sidebarHex};
				--ads-sidebar-active-text: ${colors.headerTextHex};
			}`,
		});
		await expect(page.locator('.demo-navigation a[aria-current="page"]')).toHaveCSS(
			'background-color',
			colors.sidebar,
		);

		// Collapsing does not alter the palette.
		await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
		await expect(sidebar).toHaveCSS('background-color', colors.sidebar);

		// The mobile Drawer receives the same sidebar override without changing the generic Drawer.
		await page.setViewportSize({ width: 390, height: 844 });
		await page.getByRole('button', { name: 'Abrir navegação' }).click();
		const drawer = page.getByRole('dialog', { name: 'Navegação do demo' });
		await expect(drawer).toHaveCSS('background-color', colors.sidebar);
		await expect(drawer.locator('.ads-admin-shell-sidebar')).toHaveCSS(
			'background-color',
			'rgba(0, 0, 0, 0)',
		);
	});
}
