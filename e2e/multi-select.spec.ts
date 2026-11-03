import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

test('multi-select: busca, teclado, limite, chip e limpeza', async ({ page }) => {
	await page.goto('/catalogo/multi-select');
	const input = page.getByRole('combobox', { name: 'Áreas (controlado)' });
	await input.focus();
	await input.fill('front');
	await expect(page.getByRole('option', { name: 'Desenvolvimento frontend' })).toBeVisible();
	await input.press('ArrowDown');
	await input.press('Enter');
	await expect(page.getByLabel('Valores selecionados')).toHaveText('design, frontend');
	await page.getByRole('button', { name: 'Remover Design de produto' }).click();
	await expect(page.getByLabel('Valores selecionados')).toHaveText('frontend');
	await input.press('Escape');
	await expect(input).toHaveAttribute('aria-expanded', 'false');
	await expectNoAxeViolations(page);
});

test('multi-select: required e envio de valores reais sem consulta', async ({ page }) => {
	await page.goto('/catalogo/multi-select');
	const required = page.getByRole('combobox', { name: 'Áreas obrigatórias' });
	await page.getByRole('button', { name: 'Enviar valores' }).click();
	await expect(required).toBeFocused();
	await required.fill('produto');
	await page.getByRole('option', { name: 'Design de produto' }).click();
	await required.fill('frontend');
	await page.getByRole('option', { name: 'Desenvolvimento frontend' }).click();
	await page.getByRole('button', { name: 'Enviar valores' }).click();
	await expect(page.getByLabel('Dados enviados')).toHaveText('["design","frontend"]');
	await page.getByRole('button', { name: 'Reiniciar formulário' }).click();
	await expect(required).toHaveValue('');
	await expectNoAxeViolations(page);
});

for (const theme of ['light', 'dark'] as const) {
	test('multi-select renderiza em 390px e tema ' + theme, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/catalogo/multi-select');
		await page.getByLabel('Tema da demonstração').selectOption(theme);
		await page.getByRole('combobox', { name: 'Áreas (controlado)' }).focus();
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
		).toBe(true);
		await expectNoAxeViolations(page);
	});
}
