import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

test('AdsAlert: feedback persistente, ações e fechamento controlado', async ({ page }) => {
	await page.goto('/catalogo/alert');
	const preview = page.getByRole('region', { name: 'Demonstração interativa' });
	await expect(
		preview.getByRole('status').filter({ hasText: 'Resultado da operação' }),
	).toBeVisible();
	await preview.getByLabel('Variante').selectOption('error');
	await expect(preview.getByRole('alert').first()).toContainText('Não foi possível salvar');
	await preview.getByRole('button', { name: 'Fechar mensagem' }).click();
	await expect(
		preview.getByRole('alert').filter({ hasText: 'Não foi possível salvar' }),
	).toHaveCount(0);
	await preview.getByRole('button', { name: 'Mostrar mensagem' }).click();
	await preview.getByLabel('Apresentação').selectOption('callout');
	await expect(preview.getByRole('alert').first()).toHaveAttribute('data-appearance', 'callout');
	await expectNoAxeViolations(page);
});

test('AdsAlert: botão de fechar operável por teclado', async ({ page }) => {
	await page.goto('/catalogo/alert');
	const preview = page.getByRole('region', { name: 'Demonstração interativa' });
	const close = preview.getByRole('button', { name: 'Fechar mensagem' });
	await close.focus();
	await expect(close).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(
		preview.getByRole('status').filter({ hasText: 'Resultado da operação' }),
	).toHaveCount(0);
	await expect(page.locator('body')).not.toBeFocused();
});

test('AdsAlert: cores forçadas distinguem a severidade sem depender de cor', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' });
	await page.goto('/catalogo/alert');
	const preview = page.getByRole('region', { name: 'Demonstração interativa' });
	await preview.getByLabel('Variante').selectOption('error');
	const style = await preview
		.getByRole('alert')
		.first()
		.evaluate((element) => getComputedStyle(element).borderTopStyle);
	expect(style).toBe('double');
});

test('AdsAlert: o foco ao fechar ignora vizinhos ocultos e vai para o próximo visível', async ({
	page,
}) => {
	await page.goto('/catalogo/alert');
	const preview = page.getByRole('region', { name: 'Demonstração interativa' });
	const alert = preview.getByRole('status').filter({ hasText: 'Resultado da operação' });
	await alert.evaluate((element) => {
		const make = (label: string, style: string) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.textContent = label;
			button.setAttribute('style', style);
			return button;
		};
		element.after(
			make('Oculto display', 'display:none'),
			make('Oculto visibility', 'visibility:hidden'),
			make('Próximo visível', ''),
		);
	});
	await preview.getByRole('button', { name: 'Fechar mensagem' }).focus();
	await page.keyboard.press('Enter');
	await expect(alert).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Próximo visível' })).toBeFocused();
});
