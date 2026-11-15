import { expect, test } from '@playwright/test';

for (const width of [320, 390, 768, 1440]) {
	test(`optional footer and scrollable shell at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/catalogo/admin-shell');
		const footer = page.locator('.ads-admin-shell-footer');
		await expect(footer).toHaveCount(1);
		await expect(footer).toContainText('Footer opcional');
		await page.getByRole('button', { name: 'Conteúdo longo' }).click();
		await expect(footer).toBeVisible();
		await page.getByRole('button', { name: 'Remover footer' }).click();
		await expect(footer).toHaveCount(0);
		await page.getByRole('button', { name: 'Mostrar footer' }).click();
		await expect(footer).toHaveCount(1);
	});
}

for (const theme of ['light', 'dark'] as const) {
	test(`grouped dropdown keyboard and portal in ${theme}`, async ({ page }) => {
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await page.goto('/catalogo/dropdown');
		const trigger = page.getByRole('button', { name: 'Abrir ações' });
		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		const first = page.getByRole('menuitem', { name: 'Editar' });
		await expect(first).toBeFocused();
		await expect(page.getByRole('group', { name: 'Operações' })).toBeVisible();
		await expect(page.getByRole('separator')).toBeVisible();
		await page.keyboard.press('End');
		await expect(page.getByRole('menuitem', { name: 'Exportar' })).toBeFocused();
		await expect(page.getByRole('menu').locator('..')).toHaveAttribute('data-theme', theme);
		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
		await page.keyboard.press('ArrowDown');
		await expect(first).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByRole('menu')).toBeHidden();
	});
}

test('consumer-controlled light, dark and system preference reaches a portaled menu', async ({
	page,
}) => {
	await page.goto('/catalogo/theme-control');
	const groups = page.getByRole('radiogroup', { name: 'Tema' });
	const group = groups.first();
	for (const [label, theme] of [
		['Escuro', 'dark'],
		['Claro', 'light'],
	] as const) {
		await group.getByRole('radio', { name: label }).click();
		const trigger = page.getByRole('button', { name: `Overlay no tema ${theme}` });
		await trigger.click();
		await expect(page.getByRole('menu').locator('..')).toHaveAttribute('data-theme', theme);
		await page.keyboard.press('Escape');
	}
	await group.getByRole('radio', { name: 'Sistema' }).click();
	await expect(page.getByRole('status').filter({ hasText: 'Preferência: system' })).toBeVisible();
});
