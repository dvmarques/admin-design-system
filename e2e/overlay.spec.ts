import { expect, test } from '@playwright/test';

test.describe('public overlays', () => {
	test('keeps dialog focus and closes with Escape', async ({ page }) => {
		await page.goto('/');
		const trigger = page.getByRole('button', { name: 'Abrir diálogo' }).first();
		await trigger.focus();
		await trigger.click();
		const dialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
		await expect(dialog).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('supports drawer, anchored context, and toast flows', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Abrir drawer' }).click();
		await expect(page.getByRole('dialog', { name: 'Exemplo de drawer' })).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog', { name: 'Exemplo de drawer' })).toBeHidden();

		const tooltipTrigger = page.getByRole('button', { name: 'Tooltip' });
		await tooltipTrigger.hover();
		await expect(page.getByRole('tooltip')).toHaveText('Ações adicionais');
		await page.getByRole('button', { name: 'Popover' }).hover();
		await expect(page.getByRole('tooltip')).toBeHidden();
		await tooltipTrigger.focus();
		await expect(page.getByRole('tooltip')).toHaveText('Ações adicionais');

		await page.getByRole('button', { name: 'Popover' }).click();
		await expect(page.getByRole('dialog', { name: 'Ações rápidas' })).toBeVisible();
		await page.keyboard.press('Escape');

		await page.getByRole('button', { name: 'Mostrar toast' }).click();
		await expect(page.getByRole('status').filter({ hasText: 'Operação concluída.' })).toBeVisible();
	});
});
