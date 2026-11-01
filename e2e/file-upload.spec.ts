import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

test('importação simulada permite selecionar, remover e reimportar sem rede', async ({ page }) => {
	await page.goto('/componentes/arquivos');
	await page.getByRole('button', { name: 'Abrir importação' }).click();
	const dialog = page.getByRole('dialog', { name: 'Importar arquivo de dados' });
	await expect(dialog.getByRole('button', { name: 'Simular importação' })).toBeDisabled();
	const upload = dialog.locator('input[type="file"]');
	await upload.setInputFiles({
		name: 'dados.csv',
		mimeType: 'text/csv',
		buffer: Buffer.from('id\n1\n'),
	});
	await expect(dialog.getByText('dados.csv')).toBeVisible();
	await dialog.getByRole('button', { name: 'Remover dados.csv' }).click();
	await expect(dialog.getByRole('button', { name: 'Simular importação' })).toBeDisabled();
	await upload.setInputFiles({
		name: 'dados.csv',
		mimeType: 'text/csv',
		buffer: Buffer.from('id\n1\n'),
	});
	await expect(dialog.getByRole('button', { name: 'Simular importação' })).toBeEnabled();
	await dialog.getByRole('button', { name: 'Simular importação' }).click();
	await expect(page.getByRole('status').filter({ hasText: 'Importação simulada' })).toBeVisible();
	await expect(dialog).toHaveCount(0);
});

test('validação e teclado não dependem de drag-and-drop', async ({ page }) => {
	await page.goto('/componentes/arquivos');
	await page.getByRole('button', { name: 'Abrir importação' }).focus();
	await page.keyboard.press('Enter');
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	await expectNoAxeViolations(page);
	await dialog.locator('input[type="file"]').setInputFiles({
		name: 'invalido.exe',
		mimeType: 'application/octet-stream',
		buffer: Buffer.from('x'),
	});
	await expect(dialog.getByRole('alert')).toContainText('tipo de arquivo não permitido');
	await expect(dialog.getByRole('button', { name: 'Simular importação' })).toBeDisabled();
	await dialog.getByRole('button', { name: 'Cancelar' }).click();
	await expect(dialog).toHaveCount(0);
});

for (const theme of ['light', 'dark'] as const) {
	test(`não há overflow em 320px no tema ${theme}`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 720 });
		await page.context().addCookies([
			{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' },
		]);
		await page.goto('/componentes/arquivos');
		await page.getByRole('button', { name: 'Abrir importação' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
		expect(pageWidth).toBeLessThanOrEqual(320);
		await expectNoAxeViolations(page);
	});
}
