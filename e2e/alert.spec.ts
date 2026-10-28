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
