import { expect, test, type Locator, type Page } from '@playwright/test';
import { waitForHydration } from './hydration';

async function fits(nav: Locator) {
	await expect
		.poll(() =>
			nav.locator('.ads-pagination-scroll').evaluate((node) => node.scrollWidth - node.clientWidth),
		)
		.toBeLessThanOrEqual(1);
}
async function current(nav: Locator, n: number) {
	await expect(nav.locator('[aria-current="page"]')).toHaveText(String(n));
}
async function resize(page: Page, value: string) {
	await page.getByLabel('Largura do contêiner').selectOption(value);
}

for (const theme of ['light', 'dark']) {
	test.describe(theme, () => {
		test.beforeEach(async ({ page }) => {
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			await page.goto('/componentes/paginacao');
			await waitForHydration(page.getByLabel('Largura do contêiner'));
			await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		});
		test('adapta ao contêiner e sidebar, mantém páginas obrigatórias e estabiliza', async ({
			page,
		}) => {
			const nav = page.getByRole('navigation', { name: 'Paginação de exemplo' });
			await page.getByLabel('Navegar por setas').check();
			await fits(nav);
			const initial = await nav.locator('[data-page]').count();
			await resize(page, '280');
			await fits(nav);
			await current(nav, 25);
			await expect(nav.getByRole('button', { name: 'Página 1', exact: true })).toBeVisible();
			await expect(nav.getByRole('button', { name: 'Página 50', exact: true })).toBeVisible();
			expect(await nav.locator('[data-page]').count()).toBeLessThan(initial);
			const widths: number[] = [];
			for (let i = 0; i < 5; i++) {
				await page.evaluate(() => new Promise(requestAnimationFrame));
				widths.push(await nav.locator('ul').evaluate((n) => n.getBoundingClientRect().width));
			}
			expect(new Set(widths).size).toBe(1);
			const sidebar = page.getByRole('button', { name: /^(Recolher|Expandir) barra lateral$/ });
			await expect(sidebar).toBeVisible();
			await sidebar.click();
			await fits(nav);
			await resize(page, '800');
			await expect.poll(() => nav.locator('[data-page]').count()).toBe(initial);
		});
		test('navega com teclado, salto por Enter/clique, valida e mantém foco', async ({ page }) => {
			const nav = page.getByRole('navigation', { name: 'Paginação de exemplo' });
			const field = nav.getByRole('spinbutton');
			await field.fill('30');
			await field.press('Enter');
			await current(nav, 30);
			await expect(field).toBeFocused();
			await field.fill('0');
			await field.press('Enter');
			await expect(field).toHaveAttribute('aria-invalid', 'true');
			await current(nav, 30);
			await field.fill('31');
			await nav.getByRole('button', { name: 'Ir', exact: true }).click();
			await current(nav, 31);
			const next = nav.getByRole('button', { name: 'Próxima página' });
			await next.focus();
			await page.keyboard.press('Enter');
			await current(nav, 32);
			await expect(next).toBeFocused();
			await page.keyboard.press('Tab');
			await expect(field).toBeFocused();
		});
		test('suporta links no salto e loading sem interativos aninhados ou navegação duplicada', async ({
			page,
		}) => {
			await page.getByLabel('Usar links').check();
			const nav = page.getByRole('navigation', { name: 'Paginação de exemplo' });
			await nav.getByRole('spinbutton').fill('40');
			await nav.getByRole('spinbutton').press('Enter');
			await current(nav, 40);
			await expect(page).toHaveURL(/#pagina-40$/);
			await expect(nav.locator('a button,button a,a a,form form')).toHaveCount(0);
			await page.getByLabel('Carregando', { exact: true }).check();
			await expect(nav).toHaveAttribute('aria-busy', 'true');
			const target = nav.getByRole('link', { name: 'Página 50', exact: true });
			await target.focus();
			await page.keyboard.press('Enter');
			await current(nav, 40);
			await expect(target).toHaveAttribute('aria-disabled', 'true');
			await page.getByLabel('Carregando', { exact: true }).uncheck();
			await target.click();
			await current(nav, 50);
		});
		test('trata totais dinâmicos 0/1/2 e limites de primeira/última', async ({ page }) => {
			const nav = page.getByRole('navigation', { name: 'Paginação de exemplo' });
			await page.getByLabel('Controles de primeira e última').check();
			await nav.getByRole('button', { name: 'Última página', exact: true }).click();
			await current(nav, 50);
			await page.getByLabel('Total de páginas').fill('2');
			await current(nav, 2);
			await expect(page.getByLabel('Página atual', { exact: true })).toHaveValue('2');
			await expect(nav.getByRole('button', { name: 'Última página', exact: true })).toBeDisabled();
			await nav.getByRole('button', { name: 'Primeira página', exact: true }).click();
			await current(nav, 1);
			await page.getByLabel('Total de páginas').fill('1');
			await expect(nav.locator('[data-page]')).toHaveCount(1);
			await page.getByLabel('Total de páginas').fill('0');
			await expect(nav.locator('[aria-current]')).toHaveCount(0);
			await expect(nav.getByRole('spinbutton')).toBeDisabled();
		});
		test('combina resumo, seletor e salto na SmartTable estreita', async ({ page }) => {
			await resize(page, '280');
			await page.getByLabel('Navegar por setas').check();
			const section = page.getByRole('region', { name: 'Exemplo de tabela' });
			const nav = section.getByRole('navigation');
			await fits(nav);
			await expect(section.getByText('Exibindo 241–250 de 497 registros')).toBeVisible();
			await section.getByRole('combobox', { name: 'Registros por página' }).selectOption('25');
			await current(nav, 1);
			await expect(section.getByText('Exibindo 1–25 de 1247 registros')).toBeVisible();
			await nav.getByRole('spinbutton').fill('50');
			await nav.getByRole('spinbutton').press('Enter');
			await current(nav, 50);
			await expect(section.getByText('Exibindo 1226–1247 de 1247 registros')).toBeVisible();
			await expect
				.poll(() => section.evaluate((n) => n.scrollWidth - n.clientWidth))
				.toBeLessThanOrEqual(1);
		});
		for (const zoom of [1.25, 2])
			test(`zoom CSS ${zoom * 100}% preserva geometria e foco`, async ({ page }) => {
				await page.setViewportSize({ width: 1280, height: 1000 });
				await page.getByRole('button', { name: 'Recolher barra lateral', exact: true }).click();
				await page.evaluate((z) => {
					document.documentElement.style.zoom = String(z);
				}, zoom);
				await page.getByLabel('Navegar por setas').check();
				await resize(page, '280');
				const nav = page.getByRole('navigation', { name: 'Paginação de exemplo' });
				await fits(nav);
				const target = nav.getByRole('button', { name: 'Página 25', exact: true });
				await target.focus();
				await target.hover();
				const geometry = await target.evaluate((n) => {
					const rect = n.getBoundingClientRect(),
						viewport = n.closest('.ads-pagination-scroll')!.getBoundingClientRect();
					const style = getComputedStyle(n);
					return {
						top: rect.top - viewport.top,
						bottom: viewport.bottom - rect.bottom,
						outline: parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset),
						height: rect.height,
					};
				});
				expect(geometry.top).toBeGreaterThan(geometry.outline);
				expect(geometry.bottom).toBeGreaterThan(geometry.outline);
				expect(geometry.height).toBeGreaterThanOrEqual(40);
				await expect(target).toBeFocused();
			});
		test('fallback mínimo é nomeado e rolável por teclado, sem clipping vertical', async ({
			page,
		}) => {
			await resize(page, '140');
			const nav = page.getByRole('navigation', { name: 'Paginação de exemplo' });
			const region = nav.getByRole('region', { name: 'Controles de paginação roláveis' });
			await expect(region).toHaveAttribute('tabindex', '0');
			await expect(nav.locator('[data-page]')).toHaveCount(3);
			await region.focus();
			await page.keyboard.press('End');
			const last = nav.getByRole('button', { name: 'Página 50', exact: true });
			await last.focus();
			await expect(last).toBeFocused();
			expect(
				await last.evaluate((n) => {
					const r = n.getBoundingClientRect(),
						v = n.closest('.ads-pagination-scroll')!.getBoundingClientRect();
					return r.top >= v.top + 4 && r.bottom <= v.bottom - 4;
				}),
			).toBe(true);
		});
	});
}

test('SSR contém páginas e hidrata com CSS distribuído sem erros', async ({ page, request }) => {
	const response = await request.get('/componentes/paginacao');
	expect(response.ok()).toBe(true);
	const html = await response.text();
	expect(html).toContain('Paginação de exemplo');
	expect(html).toContain('aria-current="page"');
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	page.on('console', (m) => {
		if (m.type() === 'error') errors.push(m.text());
	});
	await page.goto('/componentes/paginacao');
	await waitForHydration(page.getByLabel('Largura do contêiner'));
	const button = page
		.getByRole('navigation', { name: 'Paginação de exemplo' })
		.getByRole('button', { name: 'Página 25', exact: true });
	expect(await button.evaluate((n) => getComputedStyle(n).borderTopWidth)).toBe('1px');
	expect(await button.evaluate((n) => getComputedStyle(n).minHeight)).toBe('40px');
	expect(errors).toEqual([]);
});

test('preserva o alinhamento original à direita no rodapé da SmartTable', async ({ page }) => {
	await page.goto('/clientes');
	await waitForHydration(page.getByRole('button', { name: /^Usar tema/ }));
	const nav = page.locator('.ads-smart-table-pagination > .ads-pagination');
	await expect
		.poll(() =>
			nav.locator('ul').evaluate((list) => {
				const outer = list.closest('.ads-pagination-scroll')!.getBoundingClientRect();
				return Math.abs(outer.right - list.getBoundingClientRect().right);
			}),
		)
		.toBeLessThanOrEqual(1);
});
