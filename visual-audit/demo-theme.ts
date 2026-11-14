import { expect, type Locator, type Page } from '@playwright/test';

/** Aguarda hidratação do controle antes de simular interação (evita perda de `selectOption`). */
async function waitForHydration(locator: Locator) {
	await expect
		.poll(() =>
			locator.evaluate((element) =>
				Object.keys(element).some((key) => key.startsWith('__reactProps$')),
			),
		)
		.toBe(true);
}

/**
 * Aplica o tema da demonstração e aguarda `data-theme` na região de preview e em `<html>`,
 * repetindo a seleção se a atualização React/atributos atrasar (corrida com workers paralelos).
 */
export async function applyDemoTheme(page: Page, preview: Locator, theme: 'light' | 'dark') {
	const themeSelect = page.getByLabel('Tema da demonstração');
	await expect(themeSelect).toBeVisible();
	await waitForHydration(themeSelect);
	await expect
		.poll(
			async () => {
				const previewTheme = await preview.getAttribute('data-theme');
				const rootTheme = await page.evaluate(() => document.documentElement.dataset.theme ?? '');
				if (previewTheme === theme && rootTheme === theme) return true;
				await themeSelect.selectOption(theme);
				await page
					.waitForFunction(
						(expected) => {
							const region = document.querySelector('[aria-label="Demonstração interativa"]');
							const previewOk = region?.getAttribute('data-theme') === expected;
							const rootOk = document.documentElement.dataset.theme === expected;
							return previewOk && rootOk;
						},
						theme,
						{ timeout: 5_000 },
					)
					.catch(() => undefined);
				const afterPreview = await preview.getAttribute('data-theme');
				const afterRoot = await page.evaluate(() => document.documentElement.dataset.theme ?? '');
				return afterPreview === theme && afterRoot === theme;
			},
			{ timeout: 20_000 },
		)
		.toBe(true);
	await expect(preview).toHaveAttribute('data-theme', theme);
	await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}
