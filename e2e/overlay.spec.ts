import { expect, test } from '@playwright/test';

test.describe('public overlays', () => {
	test('applies themed close controls to dialog, drawer, and toast', async ({ page }) => {
		const colorsOf = async (locator: ReturnType<typeof page.locator>) =>
			locator.evaluate((element) => {
				const styles = getComputedStyle(element);
				return {
					background: styles.backgroundColor,
					color: styles.color,
					outline: styles.outlineColor,
				};
			});

		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: 'light', url: 'http://127.0.0.1:3000' }]);
		await page.goto('/');

		await page.getByRole('button', { name: 'Abrir diálogo' }).first().click();
		const dialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
		const dialogClose = dialog.getByRole('button', { name: 'Fechar', exact: true }).first();
		await expect(dialog).toBeVisible();
		expect(await colorsOf(dialogClose)).toMatchObject({
			background: 'rgb(241, 245, 249)',
			color: 'rgb(15, 23, 42)',
		});
		await dialogClose.hover();
		await expect
			.poll(async () => (await colorsOf(dialogClose)).background)
			.toBe('rgb(226, 232, 240)');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Shift+Tab');
		await expect(dialogClose).toBeFocused();
		await expect.poll(async () => (await colorsOf(dialogClose)).outline).toBe('rgb(37, 99, 235)');
		await page.keyboard.press('Escape');

		await page.getByRole('button', { name: 'Abrir drawer' }).click();
		const drawerClose = page
			.getByRole('dialog', { name: 'Exemplo de drawer' })
			.getByRole('button', { name: 'Fechar', exact: true });
		await expect(drawerClose).toBeVisible();
		expect(await colorsOf(drawerClose)).toMatchObject({
			background: 'rgb(241, 245, 249)',
			color: 'rgb(15, 23, 42)',
		});
		await page.keyboard.press('Escape');

		await page.getByRole('button', { name: 'Mostrar toast' }).click();
		const toastClose = page.getByRole('button', { name: 'Fechar notificação' });
		await expect(toastClose).toBeVisible();
		expect(await colorsOf(toastClose)).toMatchObject({
			background: 'rgb(241, 245, 249)',
			color: 'rgb(15, 23, 42)',
		});

		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: 'dark', url: 'http://127.0.0.1:3000' }]);
		await page.reload();
		await page.getByRole('button', { name: 'Abrir diálogo' }).first().click();
		const darkDialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
		const darkClose = darkDialog.getByRole('button', { name: 'Fechar', exact: true }).first();
		await expect(darkDialog).toBeVisible();
		expect(await colorsOf(darkDialog)).toMatchObject({ background: 'rgb(30, 41, 59)' });
		expect(await colorsOf(darkClose)).toMatchObject({
			background: 'rgb(51, 65, 85)',
			color: 'rgb(248, 250, 252)',
		});
	});

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
