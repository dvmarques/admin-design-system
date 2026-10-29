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
				.locator('fieldset')
				.last()
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
