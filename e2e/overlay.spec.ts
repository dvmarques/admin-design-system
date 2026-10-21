import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

test.describe('public overlays', () => {
	test('applies themed close controls to dialog, drawer, and toast', async ({ page }) => {
		const colorsOf = async (locator: ReturnType<typeof page.locator>) =>
			locator.evaluate((element) => {
				const styles = getComputedStyle(element);
				return {
					background: styles.backgroundColor,
					color: styles.color,
					outline: styles.outlineColor,
				};
			});

		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: 'light', url: 'http://127.0.0.1:3000' }]);
		await page.goto('/componentes');

		await page.getByRole('button', { name: 'Abrir diálogo' }).first().click();
		const dialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
		const dialogClose = dialog.getByRole('button', { name: 'Fechar', exact: true }).first();
		await expect(dialog).toBeVisible();
		expect(await colorsOf(dialogClose)).toMatchObject({
			background: 'rgb(241, 245, 249)',
			color: 'rgb(15, 23, 42)',
		});
		await dialogClose.hover();
		await expect
			.poll(async () => (await colorsOf(dialogClose)).background)
			.toBe('rgb(226, 232, 240)');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Shift+Tab');
		await expect(dialogClose).toBeFocused();
		await expect.poll(async () => (await colorsOf(dialogClose)).outline).toBe('rgb(37, 99, 235)');
		await page.keyboard.press('Escape');

		await page.getByRole('button', { name: 'Abrir drawer' }).click();
		const drawerClose = page
			.getByRole('dialog', { name: 'Exemplo de drawer' })
			.getByRole('button', { name: 'Fechar', exact: true });
		await expect(drawerClose).toBeVisible();
		expect(await colorsOf(drawerClose)).toMatchObject({
			background: 'rgb(241, 245, 249)',
			color: 'rgb(15, 23, 42)',
		});
		await page.keyboard.press('Escape');

		await page.getByRole('button', { name: 'Mostrar toast' }).click();
		const toastClose = page.getByRole('button', { name: 'Fechar notificação' });
		await expect(toastClose).toBeVisible();
		expect(await colorsOf(toastClose)).toMatchObject({
			background: 'rgb(241, 245, 249)',
			color: 'rgb(15, 23, 42)',
		});

		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: 'dark', url: 'http://127.0.0.1:3000' }]);
		await page.reload();
		await page.getByRole('button', { name: 'Abrir diálogo' }).first().click();
		const darkDialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
		const darkClose = darkDialog.getByRole('button', { name: 'Fechar', exact: true }).first();
		await expect(darkDialog).toBeVisible();
		expect(await colorsOf(darkDialog)).toMatchObject({ background: 'rgb(51, 65, 85)' });
		expect(await colorsOf(darkClose)).toMatchObject({
			background: 'rgb(51, 65, 85)',
			color: 'rgb(248, 250, 252)',
		});
	});

	test('dismisses the tooltip with Escape without moving focus', async ({ page }) => {
		await page.goto('/componentes');
		const trigger = page.getByRole('button', { name: 'Tooltip', exact: true });
		await trigger.focus();
		const tooltip = page.getByRole('tooltip');
		await expect(tooltip).toBeVisible();
		await expect(trigger).toHaveAttribute('aria-describedby', (await tooltip.getAttribute('id'))!);
		await page.keyboard.press('Escape');
		await expect(tooltip).toBeHidden();
		await expect(trigger).toBeFocused();
		await expect(trigger).not.toHaveAttribute('aria-describedby');
	});

	test('keeps dialog focus and closes with Escape', async ({ page }) => {
		await page.goto('/componentes');
		const trigger = page.getByRole('button', { name: 'Abrir diálogo' }).first();
		await trigger.focus();
		await trigger.click();
		const dialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
		await expect(dialog).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('closes only the inner popover on the first Escape and then the dialog', async ({
		page,
	}) => {
		await page.goto('/componentes');
		const origin = page.getByRole('button', { name: 'Abrir diálogo' }).first();
		await origin.focus();
		await origin.click();
		const dialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
		await expect(dialog).toBeVisible();
		const trigger = dialog.getByRole('button', { name: 'Detalhes' });
		await trigger.focus();
		await trigger.click();
		const popover = page.getByRole('dialog', { name: 'Detalhes internos' });
		await expect(popover).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(popover).toBeHidden();
		await expect(dialog).toBeVisible();
		await expect(trigger).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		await expect(origin).toBeFocused();
	});

	test('supports drawer, anchored context, and toast flows', async ({ page }) => {
		await page.goto('/componentes');
		await page.getByRole('button', { name: 'Abrir drawer' }).click();
		await expect(page.getByRole('dialog', { name: 'Exemplo de drawer' })).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog', { name: 'Exemplo de drawer' })).toBeHidden();

		const tooltipTrigger = page.getByRole('button', { name: 'Tooltip' });
		await tooltipTrigger.hover();
		await expect(page.getByRole('tooltip')).toHaveText('Ações adicionais');
		await page.getByRole('button', { name: 'Popover' }).hover();
		await expect(page.getByRole('tooltip')).toBeHidden();
		await tooltipTrigger.focus();
		await expect(page.getByRole('tooltip')).toHaveText('Ações adicionais');

		await page.getByRole('button', { name: 'Popover' }).click();
		await expect(page.getByRole('dialog', { name: 'Ações rápidas' })).toBeVisible();
		await page.keyboard.press('Escape');

		await page.getByRole('button', { name: 'Mostrar toast' }).click();
		await expect(page.getByRole('status').filter({ hasText: 'Operação concluída.' })).toBeVisible();
	});

	test.describe('inert page background', () => {
		// Nomes dos botões expostos na árvore de acessibilidade do Chromium; nós inertes ficam ignorados.
		async function exposedButtons(page: Page) {
			const client = await page.context().newCDPSession(page);
			const { nodes } = (await client.send('Accessibility.getFullAXTree')) as {
				nodes: { ignored?: boolean; role?: { value: string }; name?: { value: string } }[];
			};
			await client.detach();
			return nodes
				.filter((node) => !node.ignored && node.role?.value === 'button')
				.map((node) => node.name?.value);
		}

		test('keeps focus and the accessibility tree inside the dialog and restores them on close', async ({
			page,
		}) => {
			await page.goto('/componentes');
			const origin = page.getByRole('button', { name: 'Abrir diálogo' }).first();
			const drawerTrigger = page.getByRole('button', { name: 'Abrir drawer' });
			expect(await exposedButtons(page)).toContain('Abrir drawer');

			await origin.focus();
			await origin.click();
			const dialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
			await expect(dialog).toBeVisible();
			await expect(page.locator('body > [inert]')).not.toHaveCount(0);

			const focusIsInside = () =>
				page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')));
			for (let step = 0; step < 6; step += 1) {
				await page.keyboard.press('Tab');
				expect(await focusIsInside()).toBe(true);
			}
			await page.keyboard.press('Shift+Tab');
			expect(await focusIsInside()).toBe(true);

			// Um foco programático sobre o fundo inerte não tem efeito.
			await drawerTrigger.focus();
			expect(await focusIsInside()).toBe(true);

			const buttons = await exposedButtons(page);
			expect(buttons).not.toContain('Abrir drawer');
			expect(buttons).not.toContain('Mostrar toast');
			expect(buttons).toContain('Fechar');
			await expectNoAxeViolations(page);

			await page.keyboard.press('Escape');
			await expect(dialog).toBeHidden();
			await expect(page.locator('body > [inert]')).toHaveCount(0);
			await expect(origin).toBeFocused();
			expect(await exposedButtons(page)).toContain('Abrir drawer');
			await drawerTrigger.focus();
			await expect(drawerTrigger).toBeFocused();
		});

		test('makes the page inert under the drawer too', async ({ page }) => {
			await page.goto('/componentes');
			await page.getByRole('button', { name: 'Abrir drawer' }).click();
			await expect(page.getByRole('dialog', { name: 'Exemplo de drawer' })).toBeVisible();
			await expect(page.locator('body > [inert]')).not.toHaveCount(0);
			expect(await exposedButtons(page)).not.toContain('Abrir diálogo');
			await page.keyboard.press('Escape');
			await expect(page.locator('body > [inert]')).toHaveCount(0);
		});

		test('keeps the popover inside the dialog interactive and the toast exposed', async ({
			page,
		}) => {
			await page.goto('/componentes');
			await page.getByRole('button', { name: 'Mostrar toast' }).click();
			const toast = page.getByRole('status').filter({ hasText: 'Operação concluída.' });
			await expect(toast).toBeVisible();

			await page.getByRole('button', { name: 'Abrir diálogo' }).first().click();
			const dialog = page.getByRole('dialog', { name: 'Exemplo de diálogo' });
			await expect(dialog).toBeVisible();
			await dialog.getByRole('button', { name: 'Detalhes' }).click();
			const popover = page.getByRole('dialog', { name: 'Detalhes internos' });
			await expect(popover).toBeVisible();
			await popover.getByRole('button', { name: 'Entendi' }).click();
			await expect(popover).toBeHidden();
			await expect(dialog).toBeVisible();

			// O toast nunca fica inerte: segue exposto na árvore de acessibilidade com o modal aberto.
			await expect(page.locator('[data-ads-overlay-layer="toast"]')).not.toHaveAttribute('inert');
			expect(await exposedButtons(page)).toContain('Fechar notificação');
		});
	});
});
