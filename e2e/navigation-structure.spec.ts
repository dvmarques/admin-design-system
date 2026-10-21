import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

test.describe('navegação estrutural', () => {
	test('o accordion alterna por clique e navega por teclado, pulando itens desabilitados', async ({
		page,
	}) => {
		await page.goto('/componentes');
		const password = page.getByRole('button', { name: 'Como altero minha senha?' });
		const exportReports = page.getByRole('button', { name: 'Posso exportar os relatórios?' });
		const integrations = page.getByRole('button', { name: /Integrações/ });

		await expect(password).toHaveAttribute('aria-expanded', 'true');
		await expect(page.getByRole('region', { name: 'Como altero minha senha?' })).toBeVisible();
		await expect(integrations).toBeDisabled();

		await password.focus();
		await page.keyboard.press('ArrowDown');
		await expect(exportReports).toBeFocused();
		await page.keyboard.press('ArrowDown');
		await expect(password).toBeFocused();
		await page.keyboard.press('End');
		await expect(exportReports).toBeFocused();
		await page.keyboard.press('Home');
		await expect(password).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		await expect(exportReports).toHaveAttribute('aria-expanded', 'true');
		await expect(password).toHaveAttribute('aria-expanded', 'false');
		await expect(page.getByRole('region', { name: 'Posso exportar os relatórios?' })).toBeVisible();
		await expect(page.getByRole('region', { name: 'Como altero minha senha?' })).toBeHidden();

		await exportReports.click();
		await expect(exportReports).toHaveAttribute('aria-expanded', 'false');
	});

	test('o accordion com unmountOnCollapse remove o painel fechado do documento', async ({
		page,
	}) => {
		await page.goto('/componentes');
		const shipping = page.getByRole('button', { name: 'Entrega' });
		const payment = page.getByRole('button', { name: 'Pagamento' });

		await expect(page.getByText('Previsão de entrega em três dias úteis.')).toBeVisible();
		await expect(page.getByText('Pago com cartão de crédito em duas parcelas.')).toHaveCount(0);
		await expect(payment).not.toHaveAttribute('aria-controls');

		await payment.click();
		await shipping.click();
		await expect(page.getByText('Pago com cartão de crédito em duas parcelas.')).toBeVisible();
		await expect(page.getByText('Previsão de entrega em três dias úteis.')).toHaveCount(0);
	});

	test('as tabs verticais ativam ao mover o foco e mantêm os painéis inativos ocultos', async ({
		page,
	}) => {
		await page.goto('/componentes');
		const list = page.getByRole('tablist', { name: 'Configurações da conta' });
		const profile = list.getByRole('tab', { name: 'Perfil' });
		const security = list.getByRole('tab', { name: 'Segurança' });

		await expect(list).toHaveAttribute('aria-orientation', 'vertical');
		await expect(list.getByRole('tab', { name: 'Cobrança' })).toBeDisabled();
		await expect(profile).toHaveAttribute('aria-selected', 'true');
		await expect(
			page.getByRole('tabpanel', { name: 'Segurança', includeHidden: true }),
		).toBeHidden();

		await profile.focus();
		await page.keyboard.press('ArrowRight');
		await expect(profile).toBeFocused();
		await page.keyboard.press('ArrowDown');
		await expect(security).toBeFocused();
		await expect(security).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('tabpanel', { name: 'Segurança' })).toBeVisible();
		await expect(page.getByRole('tabpanel', { name: 'Perfil', includeHidden: true })).toBeHidden();

		await page.keyboard.press('ArrowDown');
		await expect(profile).toBeFocused();
	});

	for (const [navigation, expand] of [
		['Trilha de navegação', 'Mostrar caminho completo'],
		['Trilha renderizada no servidor', 'Mostrar trilha do servidor'],
	] as const) {
		test(`o breadcrumb "${navigation}" colapsa e expande no lugar`, async ({ page }) => {
			await page.goto('/componentes');
			const trail = page.getByRole('navigation', { name: navigation });
			const button = trail.getByRole('button', { name: expand });

			await expect(trail.getByRole('link', { name: 'Início' })).toBeVisible();
			await expect(trail.locator('[aria-current="page"]')).toHaveCount(1);
			await expect(button).toBeVisible();
			const before = await trail.getByRole('listitem').count();

			await button.click();
			await expect(button).toHaveCount(0);
			expect(await trail.getByRole('listitem').count()).toBeGreaterThan(before);
			await expect(trail.locator('a:focus')).toHaveCount(1);
			await expect(trail.locator('[aria-current="page"]')).toHaveCount(1);
		});
	}

	for (const theme of ['light', 'dark'] as const) {
		test(`o catálogo de navegação não tem violações de acessibilidade no tema ${theme}`, async ({
			page,
		}) => {
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			await page.goto('/componentes');
			await page.getByRole('heading', { name: 'Navegação pública' }).scrollIntoViewIfNeeded();
			await expectNoAxeViolations(page);
		});
	}

	test('a página não rola na horizontal em 320px', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 800 });
		await page.goto('/componentes');
		await page.getByRole('heading', { name: 'Navegação pública' }).scrollIntoViewIfNeeded();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
});
