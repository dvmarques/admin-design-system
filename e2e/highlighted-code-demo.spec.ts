import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';
import { chooseTheme, themeTrigger } from './theme-control';

test('snippet opcional possui página própria e continua vinculado ao exemplo antigo', async ({ page }) => {
	await page.goto('/catalogo');
	await page.getByRole('searchbox', { name: 'Buscar componente' }).fill('HighlightedCodeSnippet');
	await page.getByRole('link', { name: 'AdsHighlightedCodeSnippet' }).click();
	await expect(page.getByRole('heading', { name: 'AdsHighlightedCodeSnippet', level: 1 })).toBeVisible();
	const preview = page.getByRole('region', { name: 'Demonstração interativa' });
	await preview.getByLabel('Linguagem').selectOption('json');
	await expect(preview.locator('.ads-highlighted-code-snippet').getByRole('code')).toContainText('Admin DS');
	await preview.getByLabel('Linguagem').selectOption('unknown');
	await expect(preview.getByRole('code')).toContainText('sem destaque');
	await preview.getByRole('link', { name: 'Ver demonstração avançada de código destacado' }).click();
	await expect(page.getByRole('heading', { name: 'Código destacado', level: 1 })).toBeVisible();
	await page.getByRole('link', { name: 'Ver a página oficial do componente no catálogo' }).click();
	await expect(page).toHaveURL(/\/catalogo\/highlighted-code-snippet$/);
});

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

	test('cores do snippet antes da resolução seguem o data-theme válido mais próximo', async ({
		page,
	}) => {
		await page.goto('/exemplos/codigo-destacado');
		await waitForHydration(themeTrigger(page));
		const surfaces = await page.evaluate(() => {
			const root = document.documentElement;
			const previous = root.getAttribute('data-theme');
			const read = (themeOnRoot: string, themeOnChild: string | null) => {
				root.setAttribute('data-theme', themeOnRoot);
				const child = document.createElement('div');
				if (themeOnChild) child.setAttribute('data-theme', themeOnChild);
				document.body.append(child);
				child.style.background = 'var(--ads-hc-surface)';
				const value = getComputedStyle(child).backgroundColor;
				child.remove();
				return value;
			};
			const result = {
				dark: read('dark', null),
				light: read('light', null),
				lightInDark: read('dark', 'light'),
				invalidInDark: read('dark', 'system'),
				invalidInLight: read('light', 'system'),
			};
			if (previous === null) root.removeAttribute('data-theme');
			else root.setAttribute('data-theme', previous);
			return result;
		});
		expect(surfaces).toEqual({
			dark: 'rgb(30, 30, 30)',
			light: 'rgb(255, 255, 255)',
			lightInDark: 'rgb(255, 255, 255)',
			invalidInDark: 'rgb(30, 30, 30)',
			invalidInLight: 'rgb(255, 255, 255)',
		});
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
