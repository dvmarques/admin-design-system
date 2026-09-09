import { expect, test, type Page } from '@playwright/test';

async function hideDevelopmentPortal(page: Page) {
	await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
}

test('preserva semântica e acesso aos dados em viewport estreita', async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/data-display');

	await expect(
		page.getByRole('heading', {
			level: 1,
			name: 'Apresentação de dados administrativos',
		}),
	).toBeVisible();
	await expect(page.getByRole('table', { name: 'Clientes recentes' })).toBeVisible();
	await expect(page.getByRole('columnheader', { name: 'Cliente' })).toBeVisible();
	await expect(page.getByRole('cell', { name: 'Mariana Costa' })).toBeVisible();
	await expect(page.locator('.ads-table-container')).toHaveCSS('overflow-x', 'auto');
});

test('expõe progresso e estado vazio sem semântica de erro implícita', async ({ page }) => {
	await page.goto('/data-display');

	await expect(page.getByRole('progressbar', { name: 'Importação' })).toHaveAttribute(
		'aria-valuenow',
		'65',
	);
	await expect(page.getByRole('progressbar', { name: 'Processando' })).not.toHaveAttribute(
		'aria-valuenow',
	);
	await expect(page.getByText('Nenhum resultado')).toBeVisible();
	await expect(page.locator('.ads-empty-state').getByRole('alert')).toHaveCount(0);
});

test('alterna visualmente o tema e permite voltar à página inicial', async ({ page }) => {
	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'light',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.goto('/data-display');

	const lightBackground = await page.locator('body').evaluate((element) => {
		return getComputedStyle(element).backgroundColor;
	});
	await page.getByRole('button', { name: 'Usar tema escuro' }).click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	const darkBackground = await page.locator('body').evaluate((element) => {
		return getComputedStyle(element).backgroundColor;
	});
	expect(darkBackground).not.toBe(lightBackground);
	await expect(page.getByRole('link', { name: 'Voltar para a página inicial' })).toHaveAttribute(
		'href',
		'/',
	);
});

test('mantém a apresentação de dados nos temas claro e escuro', async ({ page }) => {
	test.skip(Boolean(process.env.CI), 'Snapshots visuais são validados localmente.');

	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'dark',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.goto('/data-display');
	await hideDevelopmentPortal(page);
	await expect(page).toHaveScreenshot('data-display-dark.png', { fullPage: true });

	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'light',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.reload();
	await hideDevelopmentPortal(page);
	await expect(page).toHaveScreenshot('data-display-light.png', { fullPage: true });
});
