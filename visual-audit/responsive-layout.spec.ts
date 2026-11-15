import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { expect, test } from '@playwright/test';

const output = resolve(process.cwd(), 'visual-audit-results/screenshots/issue-318');
const routes = ['consulta', 'formulario', 'dashboard'] as const;

for (const theme of ['light', 'dark'] as const) {
	for (const width of [320, 390, 768, 1440]) {
		for (const route of routes) {
			test(`#318: ${route} ${theme} ${width}px`, async ({ page }) => {
				test.setTimeout(90000);
				await page
					.context()
					.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
				await page.setViewportSize({ width, height: 900 });
				const errors: string[] = [];
				page.on('pageerror', (error) => errors.push(error.message));
				const response = await page.goto(`/exemplos/composicao-semantica/${route}`);
				expect(response?.ok()).toBe(true);
				await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
				await expect(page.locator('.ads-layout-container')).toBeVisible();
				await page.evaluate(() => document.fonts.ready);
				const metrics = await page.evaluate(() => ({
					overflowPx:
						Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
						document.documentElement.clientWidth,
					gridCount: document.querySelectorAll('.ads-layout-grid').length,
				}));
				expect(metrics.overflowPx).toBeLessThanOrEqual(1);
				expect(errors).toEqual([]);
				mkdirSync(output, { recursive: true });
				const key = `${route}-${theme}-${width}`;
				await page.screenshot({
					path: join(output, key + '.png'),
					fullPage: true,
					animations: 'disabled',
				});
				writeFileSync(join(output, key + '.json'), JSON.stringify({ route, theme, width, ...metrics, errors }, null, 2) + '\n');
			});
		}
	}
}
