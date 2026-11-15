import { expect, type Locator, type Page } from '@playwright/test';
import { waitForHydration } from '../e2e/hydration';

/**
 * Aplica o tema da demonstração e aguarda `data-theme` na região de preview e em `<html>`,
 * repetindo a seleção se a atualização React/atributos atrasar (corrida com workers paralelos).
 *
 * Hidratação: o select do catálogo é um Client Component (`CatalogPreview`) sem expor sinal
 * público de mount; o helper reutiliza {@link waitForHydration} de `e2e/hydration.ts`, que
 * detecta propriedades internas do React 19 (`__reactProps$*`). Esse acoplamento é deliberado e
 * compartilhado com a suíte E2E regular: não há `data-testid` nem evento estável na demo sem
 * ampliar o escopo da issue #152. Se o React alterar nomes internos, atualizar `e2e/hydration.ts`
 * restaura auditoria e E2E juntos. A confirmação primária continua sendo `data-theme` em preview e
 * raiz após `selectOption`.
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
