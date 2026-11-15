import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { expect, test } from '@playwright/test';

const output = resolve(process.cwd(), 'visual-audit-results');
const scenarios = [
	{
		slug: 'consulta',
		route: '/exemplos/composicao-semantica/consulta',
		heading: 'Consulta administrativa',
	},
	{
		slug: 'formulario',
		route: '/exemplos/composicao-semantica/formulario',
		heading: 'Formulário administrativo',
	},
	{
		slug: 'dashboard',
		route: '/exemplos/composicao-semantica/dashboard',
		heading: 'Dashboard administrativo',
	},
	{
		slug: 'cabecalho-isolado',
		route: '/catalogo-page-header',
		heading: /Consulta administrativa/,
	},
] as const;

for (const theme of ['light', 'dark'] as const) {
	for (const width of [320, 390, 768, 1440] as const) {
		for (const scenario of scenarios) {
			test(`#317: ${scenario.slug} em ${theme} ${width}px`, async ({ page }) => {
				test.setTimeout(90_000);
				await page.setViewportSize({ width, height: 900 });
				if (scenario.slug !== 'cabecalho-isolado') {
					await page
						.context()
						.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
				}
				const url =
					scenario.slug === 'cabecalho-isolado'
						? `${scenario.route}/?theme=${theme}`
						: scenario.route;
				const errors: string[] = [];
				page.on('pageerror', (error) => errors.push(error.message));
				const response = await page.goto(url);
				expect(response?.ok()).toBe(true);
				await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
				await expect(page.getByRole('main')).toHaveCount(1);
				await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
				await expect(page.getByRole('heading', { level: 1, name: scenario.heading })).toBeVisible();
				await page.evaluate(() => document.fonts.ready);
				const metrics = await page.evaluate(() => ({
					documentOverflowPx:
						Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
						document.documentElement.clientWidth,
					h1Visible: !!document.querySelector('h1'),
					shellPresent: !!document.querySelector('.ads-admin-shell'),
				}));
				expect(metrics.documentOverflowPx).toBeLessThanOrEqual(1);
				expect(metrics.h1Visible).toBe(true);
				expect(errors).toEqual([]);

				const directory = join(output, 'screenshots/issue-317');
				mkdirSync(directory, { recursive: true });
				const filename = `${scenario.slug}-${theme}-${width}`;
				await page.screenshot({
					path: join(directory, filename + '.png'),
					fullPage: true,
					animations: 'disabled',
				});
				writeFileSync(
					join(directory, filename + '.json'),
					JSON.stringify(
						{ ...scenario, heading: String(scenario.heading), theme, width, ...metrics, errors },
						null,
						2,
					) + '\n',
				);
			});
		}
	}
}
