import { expect, test, type Page } from '@playwright/test';

/** O foco real do navegador deve permanecer dentro da camada modal enquanto ela estiver aberta. */
async function expectFocusInside(page: Page, role: 'dialog' | 'alertdialog', name: string) {
	const layer = page.getByRole(role, { name });
	await expect
		.poll(() => layer.evaluate((element) => element.contains(document.activeElement)))
		.toBe(true);
}

for (const [slug, label, title] of [
	['dialog', 'Dialog', 'Exemplo de Dialog'],
	['drawer', 'Drawer', 'Exemplo de Drawer'],
] as const) {
	test.describe(`${label}: Tab com controles inelegíveis nas pontas`, () => {
		test('o ciclo pula campos em fieldset desabilitado e se adapta a mudanças com o modal aberto', async ({
			page,
		}) => {
			await page.goto(`/catalogo/${slug}`);
			const trigger = page.getByRole('button', { name: `Abrir ${label}`, exact: true });
			await trigger.click();
			const layer = page.getByRole('dialog', { name: title });
			const close = layer.getByRole('button', { name: 'Fechar', exact: true });
			const name = layer.getByRole('textbox', { name: 'Nome do registro' });
			const toggle = layer.getByRole('button', { name: 'Bloquear campos finais' });
			const notes = layer.getByRole('textbox', { name: 'Observação' });
			await expect(close).toBeFocused();

			// Fluxo nativo nos controles intermediários.
			await page.keyboard.press('Tab');
			await expect(name).toBeFocused();
			await page.keyboard.press('Tab');
			await expect(toggle).toBeFocused();
			await page.keyboard.press('Tab');
			await expect(notes).toBeFocused();
			await page.keyboard.press('Tab');
			await expect(close).toBeFocused();
			await page.keyboard.press('Shift+Tab');
			await expect(notes).toBeFocused();

			// Com os campos finais bloqueados, o último destino elegível passa a ser o botão.
			await toggle.click();
			await expect(layer.getByRole('button', { name: 'Liberar campos finais' })).toBeFocused();
			await page.keyboard.press('Tab');
			await expect(close).toBeFocused();
			await page.keyboard.press('Shift+Tab');
			await expect(layer.getByRole('button', { name: 'Liberar campos finais' })).toBeFocused();
			await page.keyboard.press('Tab');
			await expect(close).toBeFocused();
			await expectFocusInside(page, 'dialog', title);

			// O controle focado fica inelegível com o modal aberto: a próxima navegação volta ao ciclo.
			await layer.getByRole('button', { name: 'Liberar campos finais' }).click();
			await notes.focus();
			await layer
				.getByRole('group', { name: 'Campos finais' })
				.evaluate((fieldset: HTMLFieldSetElement) => {
					fieldset.disabled = true;
				});
			await page.keyboard.press('Tab');
			await expectFocusInside(page, 'dialog', title);
			await expect(close).toBeFocused();

			await page.keyboard.press('Escape');
			await expect(layer).toHaveCount(0);
			await expect(trigger).toBeFocused();
		});
	});
}

test.describe('ConfirmDialog: Tab com controles inelegíveis no início', () => {
	test('Shift+Tab no primeiro controle elegível vai à última ação e Tab volta', async ({
		page,
	}) => {
		await page.goto('/catalogo/confirm-dialog');
		const trigger = page.getByRole('button', { name: 'Abrir ConfirmDialog', exact: true });
		await trigger.click();
		const layer = page.getByRole('alertdialog', { name: 'Exemplo de ConfirmDialog' });
		const reason = layer.getByRole('textbox', { name: 'Motivo (opcional)' });
		const confirm = layer.getByRole('button', { name: 'Confirmar', exact: true });
		await expect(reason).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(confirm).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(reason).toBeFocused();
		await expectFocusInside(page, 'alertdialog', 'Exemplo de ConfirmDialog');

		await page.keyboard.press('Escape');
		await expect(layer).toHaveCount(0);
		await expect(trigger).toBeFocused();
	});
});

test.describe('Dialog: elegibilidade dinâmica e conteúdo recolhido', () => {
	for (const [kind, apply] of [
		['inert', (el: HTMLElement) => el.setAttribute('inert', '')],
		['visibility: hidden', (el: HTMLElement) => (el.style.visibility = 'hidden')],
	] as const) {
		test(`o ativo que fica inelegível por ${kind} volta ao ciclo`, async ({ page }) => {
			await page.goto('/catalogo/dialog');
			await page.getByRole('button', { name: 'Abrir Dialog', exact: true }).click();
			const layer = page.getByRole('dialog', { name: 'Exemplo de Dialog' });
			const close = layer.getByRole('button', { name: 'Fechar', exact: true });
			await expect(close).toBeFocused();
			await layer.getByRole('textbox', { name: 'Observação' }).focus();
			await layer
				.getByRole('group', { name: 'Campos finais' })
				.evaluate(apply as (el: HTMLElement) => void);
			await page.keyboard.press('Tab');
			await expectFocusInside(page, 'dialog', 'Exemplo de Dialog');
			await expect(close).toBeFocused();
		});
	}

	test('<summary> é parada de Tab e Enter alterna os controles internos do <details>', async ({
		page,
	}) => {
		await page.goto('/catalogo/dialog');
		await page.getByRole('button', { name: 'Abrir Dialog', exact: true }).click();
		const layer = page.getByRole('dialog', { name: 'Exemplo de Dialog' });
		const close = layer.getByRole('button', { name: 'Fechar', exact: true });
		await expect(close).toBeFocused();
		await layer.evaluate((panel) => {
			panel.insertAdjacentHTML(
				'beforeend',
				'<details><summary>Mais opções</summary><button type="button">Dentro</button></details>',
			);
		});
		const summary = layer.getByText('Mais opções');
		const inside = layer.getByRole('button', { name: 'Dentro' });
		const isFocused = (locator: typeof summary) =>
			locator.evaluate((element) => element === document.activeElement);
		// Fechado: o <summary> é a última parada; os controles internos não são candidatos.
		await page.keyboard.press('Shift+Tab');
		await expect.poll(() => isFocused(summary)).toBe(true);
		await page.keyboard.press('Tab');
		await expect(close).toBeFocused();
		await page.keyboard.press('Shift+Tab');
		await expect.poll(() => isFocused(summary)).toBe(true);
		// Enter abre: o controle interno passa a ser tabulável e a última parada do ciclo.
		await page.keyboard.press('Enter');
		await expect(inside).toBeVisible();
		await page.keyboard.press('Tab');
		await expect(inside).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(close).toBeFocused();
		await page.keyboard.press('Shift+Tab');
		await expect(inside).toBeFocused();
		await page.keyboard.press('Shift+Tab');
		await expect.poll(() => isFocused(summary)).toBe(true);
		// Enter fecha: o controle interno sai do ciclo de novo.
		await page.keyboard.press('Enter');
		await expect(inside).toBeHidden();
		await page.keyboard.press('Tab');
		await expect(close).toBeFocused();
		await expectFocusInside(page, 'dialog', 'Exemplo de Dialog');
	});
});

test.describe('Popover em portal dentro do modal', () => {
	test('o ciclo do modal não fecha nem interrompe o popover descendente', async ({ page }) => {
		await page.goto('/componentes');
		await page.getByRole('button', { name: 'Abrir diálogo' }).first().click();
		const dialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
		await dialog.getByRole('button', { name: 'Detalhes' }).click();
		const popover = page.getByRole('dialog', { name: 'Detalhes internos' });
		await expect(popover).toBeVisible();
		await popover.getByRole('button', { name: 'Entendi' }).focus();
		await page.keyboard.press('Tab');
		await expect(popover).toBeVisible();
		await expect(dialog).toBeVisible();
		await page.keyboard.press('Escape');
		await page.keyboard.press('Escape');
		await expect(dialog).toHaveCount(0);
	});
});
