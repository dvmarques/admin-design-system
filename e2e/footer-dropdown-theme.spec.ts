import { expect, test } from '@playwright/test';
import { waitForHydration } from './hydration';

for (const width of [320, 390, 768, 1440]) {
	test(`optional footer and scrollable shell at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/catalogo-shell/');
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

for (const width of [320, 390, 768, 1440]) {
	test(`real Admin Demo uses an optional footer and grouped actions at ${width}px`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		await expect(page.getByRole('contentinfo')).toHaveCount(0);
		await page.goto('/exemplos/composicao-semantica/consulta');
		await expect(page.locator('.ads-admin-shell')).toHaveCount(1);
		await expect(page.getByRole('main')).toHaveCount(1);
		await expect(page.getByRole('navigation', { name: 'Navegação do demo' })).toHaveCount(1);
		const footer = page.getByRole('contentinfo');
		await expect(footer).toHaveCount(1);
		await expect(footer).toContainText('Consulta administrativa');
		await expect(footer.getByRole('link', { name: 'Preferências do Demo' })).toHaveAttribute(
			'href',
			'/preferencias',
		);
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
		).toBe(true);

		const trigger = page.getByRole('button', { name: 'Mais ações' });
		await waitForHydration(trigger);
		await trigger.focus();
		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('group', { name: 'Cadastros' })).toBeVisible();
		await expect(page.getByRole('group', { name: 'Configurações' })).toBeVisible();
		await expect(page.getByRole('separator')).toBeVisible();
		await expect(page.getByRole('menuitem', { name: 'Ver clientes' })).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();

		await trigger.click();
		await page.getByRole('menuitem', { name: 'Ver clientes' }).click();
		await expect(page).toHaveURL('/clientes');
		await expect(page.getByRole('contentinfo')).toHaveCount(0);
	});
}

for (const theme of ['light', 'dark'] as const) {
	test(`grouped action menu in the real Demo inherits the ${theme} theme`, async ({
		page,
	}) => {
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await page.goto('/exemplos/composicao-semantica/consulta');
		const trigger = page.getByRole('button', { name: 'Mais ações' });
		await waitForHydration(trigger);
		await trigger.click();
		await expect(page.getByRole('menu').locator('..')).toHaveAttribute('data-theme', theme);
		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});
}
