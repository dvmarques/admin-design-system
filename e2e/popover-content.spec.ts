import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

for (const theme of ['light', 'dark'] as const) {
	for (const width of [375, 1280]) {
		test.describe(`${theme}, ${width}px`, () => {
			test.beforeEach(async ({ page }) => {
				await page.setViewportSize({ width, height: 900 });
				await page
					.context()
					.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			});

			test('popover preserves content interaction and all closing paths', async ({ page }) => {
				await page.goto('/componentes');
				const trigger = page.getByRole('button', { name: 'Popover', exact: true });
				await trigger.focus();
				await trigger.press('Enter');
				const panel = page.getByRole('dialog', { name: 'Ações rápidas' });
				await expect(panel).toBeVisible();
				await expect(trigger).toHaveAttribute('aria-expanded', 'true');
				await expect(panel).toHaveAttribute('id', (await trigger.getAttribute('aria-controls'))!);
				await expect(panel.locator('..')).toHaveAttribute('data-theme', theme);
				const input = panel.getByRole('textbox', { name: 'Nome do registro' });
				await input.click();
				await input.fill('Ana');
				await expect(panel).toBeVisible();
				await expect(input).toBeFocused();
				await input.press('Tab');
				const clear = panel.getByRole('button', { name: 'Limpar nome' });
				await expect(clear).toBeFocused();
				expect(await clear.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
				await clear.press('Space');
				await expect(input).toHaveValue('');
				await expect(panel).toBeVisible();
				await input.fill('Maria');
				await clear.click();
				await expect(input).toHaveValue('');
				await expect(panel).toBeVisible();
				const bounds = await panel.boundingBox();
				expect(bounds!.x).toBeGreaterThanOrEqual(0);
				expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
				await expectNoAxeViolations(page);
				await input.press('Escape');
				await expect(panel).toBeHidden();
				await expect(trigger).toBeFocused();
				await trigger.press('Space');
				await expect(panel).toBeVisible();
				await trigger.click();
				await expect(panel).toBeHidden();
				await trigger.click();
				await panel.getByRole('button', { name: 'Editar', exact: true }).click();
				await expect(panel).toBeHidden();
				await trigger.click();
				await page.getByRole('heading', { level: 1 }).click();
				await expect(panel).toBeHidden();
				await expect(trigger).toHaveAttribute('aria-expanded', 'false');
			});

			test('date picker keeps month navigation and pending range open', async ({ page }) => {
				await page.goto('/componentes/datas');
				const triggers = page.getByRole('button', { name: 'Abrir calendário' });
				await triggers.first().click();
				const calendar = page.getByRole('grid');
				await page.getByRole('button', { name: 'Próximo mês' }).click();
				await expect(calendar).toBeVisible();
				await expect(page.getByText('abril de 2026', { exact: true })).toBeVisible();
				await page.getByRole('button', { name: 'Mês anterior' }).click();
				await expect(calendar).toBeVisible();
				await calendar.getByRole('button', { name: /(^|\s)15 de março de 2026/ }).click();
				await expect(calendar).toBeHidden();
				await expect(page.getByRole('textbox', { name: 'Data do registro' })).toHaveValue(
					'15/03/2026',
				);
				await expect(triggers.first()).toBeFocused();
				await triggers.nth(1).click();
				await calendar.getByRole('button', { name: /(^|\s)20 de março de 2026/ }).click();
				await expect(calendar).toBeVisible();
				await expect(page.getByRole('textbox', { name: 'Data final' })).toHaveValue('18/03/2026');
				await expectNoAxeViolations(page);
				await calendar.getByRole('button', { name: /(^|\s)25 de março de 2026/ }).click();
				await expect(calendar).toBeHidden();
				await expect(
					page.getByRole('textbox', { name: 'Período do registro', exact: true }),
				).toHaveValue('20/03/2026');
				await expect(page.getByRole('textbox', { name: 'Data final' })).toHaveValue('25/03/2026');
			});
		});
	}
}
