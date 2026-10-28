import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

test('combobox: teclado, value real, limpar e validação', async ({ page }) => {
	await page.goto('/catalogo/combobox');
	const input = page.getByRole('combobox', { name: 'Estado (controlado)' });
	await input.focus();
	await input.press('ArrowDown');
	await input.press('ArrowDown');
	await input.press('Enter');
	await expect(input).toHaveValue('Rio de Janeiro');
	await expect(page.getByLabel('Valor selecionado')).toHaveText('RJ');
	await expect(input).toBeFocused();
	await page.locator('.ads-combobox').filter({ has: input }).getByRole('button', { name: 'Limpar seleção' }).click();
	await expect(page.getByLabel('Valor selecionado')).toHaveText('Nenhum');
	await expect(input).toHaveValue('');
	await expectNoAxeViolations(page);
});

test('autocomplete: local e API simulada, erro, vazio e debounce', async ({ page }) => {
	await page.goto('/catalogo/autocomplete');
	const local = page.getByRole('combobox', { name: 'Busca local' });
	await local.fill('Minas');
	await local.press('ArrowDown');
	await local.press('Enter');
	await expect(page.getByLabel('Valor da busca local')).toHaveText('MG');
	const remote = page.getByRole('combobox', { name: 'Busca remota simulada' });
	await remote.fill('erro');
	await expect(page.getByText('Falha simulada da API')).toBeVisible();
	await remote.fill('vazio');
	await expect(page.getByText('Nenhuma opção encontrada')).toBeVisible();
	await remote.fill('Rio');
	await expect(page.getByRole('option', { name: 'Rio de Janeiro' })).toBeVisible();
	await expectNoAxeViolations(page);
});


test('combobox em diálogo: lista em portal, Escape não fecha o modal', async ({ page }) => {
	await page.goto('/catalogo/combobox');
	await page.getByRole('button', { name: 'Abrir diálogo com combobox' }).click();
	const dialog = page.getByRole('dialog');
	const input = dialog.getByRole('combobox', { name: 'Estado em diálogo' });
	await input.fill('Rio');
	await expect(page.getByRole('option', { name: 'Rio de Janeiro' })).toBeVisible();
	await input.press('Escape');
	await expect(dialog).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
});


test('editar uma seleção limpa o value anterior no formulário', async ({ page }) => {
	await page.goto('/catalogo/combobox');
	const input = page.getByRole('combobox', { name: 'Estado (controlado)' });
	await expect(page.getByLabel('Valor selecionado')).toHaveText('SP');
	await input.fill('Rio');
	await expect(page.getByLabel('Valor selecionado')).toHaveText('Nenhum');
	await expect(input).toHaveValue('Rio');
});
