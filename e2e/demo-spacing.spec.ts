import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark'] as const) {
	for (const width of [320, 390, 768, 1440]) {
		test(`espaçamento do catálogo e clientes em ${width}px (${theme})`, async ({
			page,
			context,
		}) => {
			await page.setViewportSize({ width, height: 900 });
			await context.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			await page.goto('/catalogo');
			await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
			const nav = page.getByRole('navigation', { name: 'Exemplos administrativos integrados' });
			const list = nav.locator('ul');
			await expect(list.locator('li')).toHaveCount(4);
			await expect(list).toHaveCSS('list-style-type', 'none');
			await expect(list).toHaveCSS('padding-left', '0px');
			await expect(list).toHaveCSS('column-gap', '16px');
			const links = nav.getByRole('link');
			const destinations = [
				'/exemplos/integracao',
				'/exemplos/composicao-semantica/consulta',
				'/exemplos/composicao-semantica/formulario',
				'/exemplos/composicao-semantica/dashboard',
			];
			for (let index = 0; index < 4; index++) {
				await expect(links.nth(index)).toHaveAttribute('href', destinations[index]);
				await links.nth(index).focus();
				await expect(links.nth(index)).toBeFocused();
				await expect(links.nth(index)).toHaveCSS('outline-style', 'solid');
			}
			await page.goto('/');
			const overview = await page.locator('.demo-page > .demo-shell').boundingBox();
			await page.goto('/clientes');
			const customers = await page.locator('.demo-page > .demo-shell').boundingBox();
			expect(overview).not.toBeNull();
			expect(customers).not.toBeNull();
			expect(customers!.x).toBeCloseTo(overview!.x, 0);
			const header = page.locator('header.demo-section');
			const section = page.getByRole('region', { name: 'Lista de clientes' });
			const headerBox = await header.boundingBox();
			const sectionBox = await section.boundingBox();
			expect(sectionBox!.y - (headerBox!.y + headerBox!.height)).toBeCloseTo(24, 0);
			await expect(section).toHaveCSS('border-top-width', '0px');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true,
			);
		});
	}
}

test('atalhos do catálogo abrem os exemplos por teclado', async ({ page }) => {
	const destinations = [
		['Visão integrada', '/exemplos/integracao'],
		['Consulta', '/exemplos/composicao-semantica/consulta'],
		['Formulário', '/exemplos/composicao-semantica/formulario'],
		['Indicadores', '/exemplos/composicao-semantica/dashboard'],
	] as const;
	for (const [name, path] of destinations) {
		await page.goto('/catalogo');
		const link = page
			.getByRole('navigation', { name: 'Exemplos administrativos integrados' })
			.getByRole('link', { name });
		await link.focus();
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(new RegExp(`${path}$`));
	}
});
