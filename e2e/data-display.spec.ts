import { expect, test } from '@playwright/test';

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
	await expect(page.getByRole('alert')).toHaveCount(0);
});
