import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

const owner = (page: Page) =>
	page.getByRole('button', { name: /Responsável \(popover controlado\)/ });

test.beforeEach(async ({ page }) => {
	await page.goto('/catalogo/combobox');
	await waitForHydration(page.getByRole('button', { name: 'Enviar formulário' }));
});

test('popover: gatilho com avatar, busca separada, seleção por teclado e foco de retorno', async ({
	page,
}) => {
	const trigger = owner(page);
	await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	await expect(trigger).toContainText('Bia Lima');
	await trigger.click();

	const panel = page.getByRole('dialog', { name: 'Escolher responsável controlado' });
	await expect(panel).toBeVisible();
	await expect(trigger).toHaveAttribute('aria-controls', (await panel.getAttribute('id')) ?? '');
	const search = panel.getByRole('searchbox');
	await expect(search).toBeFocused();
	await expect(panel.getByRole('listbox')).toBeVisible();
	await expect(panel.getByRole('button', { name: 'Remover responsável' })).toBeVisible();
	await expectNoAxeViolations(page);

	await search.fill('caio');
	await expect(panel.getByRole('option')).toHaveCount(1);
	await page.keyboard.press('Enter');
	await expect(panel).toBeHidden();
	await expect(trigger).toBeFocused();
	await expect(trigger).toContainText('Caio Prado');
	await expect(page.getByLabel('Responsável selecionado')).toHaveText('caio');
});

test('popover: Escape fecha só o painel, o rodapé age fora da lista e Tab segue o fluxo', async ({
	page,
}) => {
	const trigger = owner(page);
	await trigger.click();
	const panel = page.getByRole('dialog', { name: 'Escolher responsável controlado' });
	await page.keyboard.press('Escape');
	await expect(panel).toBeHidden();
	await expect(trigger).toBeFocused();

	await trigger.click();
	await page.keyboard.press('Tab');
	const remove = panel.getByRole('button', { name: 'Remover responsável' });
	await expect(remove).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(panel).toBeHidden();
	// O fluxo da página continua depois do gatilho, não no início do documento.
	await expect(page.getByLabel('Responsável selecionado')).not.toBeFocused();
	await expect(trigger).not.toBeFocused();
	expect(await page.evaluate(() => document.activeElement !== document.body)).toBe(true);

	await trigger.click();
	await panel.getByRole('button', { name: 'Remover responsável' }).click();
	await expect(trigger).toContainText('Sem responsável');
});

test('popover em diálogo: abre acima do modal, Escape fecha só a camada superior', async ({
	page,
}) => {
	await page.getByRole('button', { name: 'Abrir diálogo com combobox' }).click();
	const dialog = page.getByRole('dialog', { name: 'Seleção em diálogo' });
	const trigger = dialog.getByRole('button', { name: /Responsável em diálogo/ });
	await trigger.click();
	const panel = page.getByRole('dialog', { name: 'Escolher responsável no diálogo' });
	await expect(panel).toBeVisible();
	await expect(panel.getByRole('searchbox')).toBeFocused();
	const box = await panel.boundingBox();
	const view = page.viewportSize()!;
	expect(box!.x).toBeGreaterThanOrEqual(0);
	expect(box!.x + box!.width).toBeLessThanOrEqual(view.width);
	await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');

	await page.keyboard.press('Escape');
	await expect(panel).toBeHidden();
	await expect(dialog).toBeVisible();
	await expect(trigger).toBeFocused();

	await trigger.click();
	await panel.getByRole('option', { name: /Bia Lima/ }).click();
	await expect(dialog).toBeVisible();
	await expect(trigger).toContainText('Bia Lima');
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
});

test('popover: formulário obrigatório foca o gatilho inválido e envia só o valor', async ({
	page,
}) => {
	const trigger = page.getByRole('button', { name: /Responsável \(formulário\)/ });
	await page.getByRole('button', { name: 'Enviar formulário' }).click();
	await expect(trigger).toBeFocused();
	await expect(trigger).toHaveAttribute('aria-invalid', 'true');
	await expect(page.getByLabel('Valor enviado')).toHaveText('Nada enviado');

	await trigger.click();
	await page.getByRole('option', { name: /Ana Souza/ }).click();
	await page.getByRole('button', { name: 'Enviar formulário' }).click();
	await expect(page.getByLabel('Valor enviado')).toHaveText('ana');
});

test('popover: estados vazio, carregando, erro e desabilitado', async ({ page }) => {
	await page.getByRole('button', { name: /^Lista vazia/ }).click();
	await expect(
		page.getByRole('status').filter({ hasText: 'Nenhuma opção encontrada' }),
	).toBeVisible();
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: /^Carregando/ }).click();
	await expect(page.getByRole('status').filter({ hasText: 'Buscando opções...' })).toBeVisible();
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: /^Com erro/ }).click();
	await expect(
		page.getByRole('status').filter({ hasText: 'Não foi possível carregar a equipe.' }),
	).toBeVisible();
	await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('button', { name: /^Desabilitado/ }).last()).toBeDisabled();
});

test('popover: viewport de 390px sem rolagem horizontal e painel dentro da tela', async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 800 });
	const trigger = owner(page);
	await trigger.scrollIntoViewIfNeeded();
	await trigger.click();
	const panel = page.getByRole('dialog', { name: 'Escolher responsável controlado' });
	const box = await panel.boundingBox();
	expect(box!.x).toBeGreaterThanOrEqual(0);
	expect(box!.x + box!.width).toBeLessThanOrEqual(390);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true,
	);
	await expectNoAxeViolations(page);
});

test('modo input permanece combobox editável ao lado do popover', async ({ page }) => {
	await expect(page.getByRole('combobox', { name: 'Estado (controlado)' })).toBeVisible();
	await expect(page.getByRole('combobox', { name: /Responsável/ })).toHaveCount(0);
});

for (const theme of ['light', 'dark'] as const) {
	test(`popover: tema ${theme} e reflow equivalente a zoom 200% sem violações de acessibilidade`, async ({
		page,
		context,
	}) => {
		await context.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await page.setViewportSize({ width: 640, height: 400 });
		await page.goto('/catalogo/combobox');
		const trigger = owner(page);
		await waitForHydration(trigger);
		await trigger.scrollIntoViewIfNeeded();
		await trigger.click();
		const panel = page.getByRole('dialog', { name: 'Escolher responsável controlado' });
		await expect(panel).toBeVisible();
		await expect(panel.locator('..')).toHaveAttribute('data-theme', theme);
		const box = await panel.boundingBox();
		expect(box!.x).toBeGreaterThanOrEqual(0);
		expect(box!.x + box!.width).toBeLessThanOrEqual(640);
		expect(box!.y).toBeGreaterThanOrEqual(0);
		expect(box!.y + box!.height).toBeLessThanOrEqual(400);
		await expectNoAxeViolations(page);
	});
}
