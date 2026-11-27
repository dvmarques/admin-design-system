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
			await expect(list).toHaveCSS('margin-bottom', '16px');
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
			const header = page.locator('header.ads-page-header');
			const section = page.getByRole('region', { name: 'Lista de clientes' });
			const headerBox = await header.boundingBox();
			const sectionBox = await section.boundingBox();
			expect(sectionBox!.y - (headerBox!.y + headerBox!.height)).toBeCloseTo(24, 0);
			await expect(page.locator('.demo-shell').first()).toHaveClass(/ads-layout-page/);
			await expect(page.locator('.demo-shell').first()).toHaveCSS('row-gap', '24px');
			await expect(header).toHaveCSS('row-gap', '8px');
			await expect(section).toHaveCSS('border-top-width', '0px');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true,
			);
			await page.goto('/componentes/tabela-avancada');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true,
			);
		});
	}
}

for (const route of ['/', '/clientes']) {
	test(`variáveis públicas de ritmo vertical ajustam a página em ${route}`, async ({ page }) => {
		await page.goto(route);
		const shell = page.locator('.demo-shell.ads-layout-page').first();
		const header = shell.locator('> header.ads-page-header');
		const next = shell.locator('> *').nth(1);
		const gapBetween = async () => {
			const h = (await header.boundingBox())!;
			const n = (await next.boundingBox())!;
			return n.y - (h.y + h.height);
		};
		expect(await gapBetween()).toBeCloseTo(24, 0);
		await shell.evaluate((el) => el.style.setProperty('--ads-layout-page-gap', '40px'));
		expect(await gapBetween()).toBeCloseTo(40, 0);

		const eyebrow = header.locator('.ads-page-header__eyebrow');
		const title = header.getByRole('heading', { level: 1 });
		const description = header.locator('.ads-page-header__description');
		const distances = async () => {
			const e = (await eyebrow.boundingBox())!;
			const t = (await title.boundingBox())!;
			const d = (await description.boundingBox())!;
			return [t.y - (e.y + e.height), d.y - (t.y + t.height)];
		};
		const [eyebrowGap, descriptionGap] = await distances();
		expect(eyebrowGap).toBeCloseTo(8, 0);
		expect(descriptionGap).toBeCloseTo(8, 0);
		await header.evaluate((el) =>
			(el as HTMLElement).style.setProperty('--ads-page-header-gap', '12px'),
		);
		const [eyebrowCustom, descriptionCustom] = await distances();
		expect(eyebrowCustom).toBeCloseTo(12, 0);
		expect(descriptionCustom).toBeCloseTo(12, 0);

		// ads-layout-stack mantém o padrão de 16px, independente do ritmo de página.
		const stackGap = await page.evaluate(() => {
			const probe = document.createElement('div');
			probe.className = 'ads-layout-stack';
			document.body.append(probe);
			const value = getComputedStyle(probe).rowGap;
			probe.remove();
			return value;
		});
		expect(stackGap).toBe('16px');
	});
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
