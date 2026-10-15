import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { routes, themes, type Theme } from './routes';

const widths = [375, 768, 1280] as const;
const overrideColor = 'rgb(12, 34, 56)';

async function useTheme(page: Page, theme: Theme) {
	await page
		.context()
		.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
}

async function pageScrollsHorizontally(page: Page) {
	return page.evaluate(
		() => document.documentElement.scrollWidth > document.documentElement.clientWidth,
	);
}

for (const route of routes) {
	for (const theme of themes) {
		test(`${route.path} (${theme}): hidratação, acessibilidade, layout e tokens`, async ({
			page,
		}) => {
			const hydrationErrors: string[] = [];
			page.on('console', (message) => {
				if (message.type() === 'error' && /hydration/i.test(message.text())) {
					hydrationErrors.push(message.text());
				}
			});
			await useTheme(page, theme);
			await page.setViewportSize({ width: 1280, height: 800 });
			await page.goto(route.path);

			await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
			await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

			// Audit before overriding any token, so an arbitrary color cannot affect the contrast.
			await expectNoAxeViolations(page);

			for (const width of widths) {
				await page.setViewportSize({ width, height: 800 });
				expect(await pageScrollsHorizontally(page), `${route.path} em ${width} px`).toBe(false);
			}

			await page.setViewportSize({ width: 375, height: 812 });
			const trigger = page.getByRole('button', { name: 'Abrir navegação' });
			await expect(trigger).toBeVisible();

			// Override a public token the way a consuming application would: after the library
			// stylesheets, on `[data-theme]` (no `:root`), so it also reaches overlay portals.
			await page.addStyleTag({
				content: `[data-theme='${theme}'] { --ads-color-text: ${overrideColor}; }`,
			});
			await expect(page.locator('body')).toHaveCSS('color', overrideColor);

			await trigger.click();
			await expect(page.getByRole('dialog', { name: 'Navegação do demo' })).toHaveCSS(
				'color',
				overrideColor,
			);

			expect(hydrationErrors).toEqual([]);
		});
	}
}

test('a sobrescrita em :root[data-theme] não alcança overlays em portal', async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/');
	await page.addStyleTag({
		content: `:root[data-theme='light'] { --ads-color-text: ${overrideColor}; }`,
	});
	await expect(page.locator('body')).toHaveCSS('color', overrideColor);

	await page.getByRole('button', { name: 'Abrir navegação' }).click();

	const color = await page
		.getByRole('dialog', { name: 'Navegação do demo' })
		.evaluate((element) => getComputedStyle(element).color);
	expect(color).not.toBe(overrideColor);
});
