import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';
import { chooseTheme, themeTrigger } from './theme-control';

test.describe('demonstração de código destacado', () => {
	test('exemplos Java, SQL e TSX com cópia e controles', async ({ page, context }) => {
		await context.grantPermissions(['clipboard-read', 'clipboard-write']);
		await page.goto('/exemplos/codigo-destacado');
		await waitForHydration(themeTrigger(page));
		await expect(page.getByRole('heading', { name: 'Código destacado', level: 1 })).toBeVisible();
		const snippet = page.locator('.ads-highlighted-code-snippet');
		for (const sample of ['TSX (React)', 'Java', 'SQL']) {
			await page.getByLabel('Exemplo', { exact: true }).selectOption({ label: sample });
			await expect(snippet.getByRole('code')).toBeVisible();
		}
		await page.getByLabel('Exibir números').click();
		await page.getByLabel('Quebrar linhas longas').click();
		await page.getByLabel('Exemplo', { exact: true }).selectOption({ label: 'TSX (React)' });
		await page.getByRole('button', { name: 'Copiar código' }).click();
		await expect(page.getByText('Código copiado.', { exact: true })).toBeVisible();
		const copied = await page.evaluate(() => navigator.clipboard.readText());
		expect(copied).toContain('AdsButton');
	});

	test('mantém a altura das linhas vazias depois do destaque', async ({ page }) => {
		await page.goto('/exemplos/codigo-destacado');
		await waitForHydration(themeTrigger(page));
		const snippet = page.locator('.ads-highlighted-code-snippet');
		await expect(snippet).toHaveAttribute('data-resolved-theme', /light|dark/);
		await expect(
			snippet.locator('.ads-highlighted-code-snippet__line-content span[style*="color"]').first(),
		).toBeVisible();
		const heights = await snippet
			.locator('.ads-highlighted-code-snippet__line')
			.evaluateAll((lines) => lines.map((line) => line.getBoundingClientRect().height));
		expect(heights.length).toBeGreaterThan(3);
		expect(Math.min(...heights)).toBeGreaterThan(12);
	});

	for (const width of [320, 375, 1280]) {
		for (const theme of ['light', 'dark'] as const) {
			test(`axe e layout ${theme} em ${width}px`, async ({ page }) => {
				await page.setViewportSize({ width, height: 900 });
				await page.goto('/exemplos/codigo-destacado');
				await waitForHydration(themeTrigger(page));
				if (theme === 'dark') await chooseTheme(page, 'dark');
				await page
					.getByLabel('Tema do snippet')
					.selectOption(theme === 'dark' ? 'Escuro' : 'Claro');
				await expectNoAxeViolations(page);
				expect(
					await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
				).toBe(true);
			});
		}
	}
});
