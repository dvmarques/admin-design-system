import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';
import { chooseTheme, themeTrigger } from './theme-control';

const demoEmail = 'demo@exemplo.com.br';
const demoPassword = 'SenhaDemo1';

async function openLogin(page: Page) {
	await page.goto('/login');
	await expect(page.getByRole('heading', { level: 1, name: 'Entrar' })).toBeVisible();
}

test.describe('fluxo de autenticação demonstrativo', () => {
	test('home permanece aberta sem login e o link opcional leva ao exemplo', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('.ads-admin-shell')).toHaveCount(1);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

		const navigation = page.getByRole('navigation', { name: 'Navegação do demo' });
		await navigation.getByRole('link', { name: 'Login (exemplo)' }).click();
		await expect(page).toHaveURL(/\/login/);
		await expect(page.locator('.ads-admin-shell')).toHaveCount(0);
		await expect(page.getByRole('link', { name: 'Voltar ao Demo' })).toBeVisible();
	});

	test('login simulado válido retorna ao demo sem credenciais persistidas', async ({ page }) => {
		await openLogin(page);
		await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
		await page.getByLabel('Senha', { exact: true }).fill(demoPassword);
		await page.getByRole('button', { name: 'Entrar' }).click();
		await expect(page).toHaveURL('/');
		await expect(page.locator('.ads-admin-shell')).toHaveCount(1);

		const storage = await page.evaluate(() => ({
			cookies: document.cookie,
			local: { ...localStorage },
		}));
		expect(storage.cookies).not.toMatch(/password|token|senha/i);
		for (const value of Object.values(storage.local)) {
			expect(String(value)).not.toMatch(/SenhaDemo|token/i);
		}
	});

	test('validação de login inválido e recuperação com histórico', async ({ page }) => {
		await openLogin(page);
		await page.getByRole('button', { name: 'Entrar' }).click();
		await expect(page.getByText(requiredEmailSnippet())).toBeVisible();

		await page.getByRole('link', { name: 'Esqueci a senha' }).click();
		await expect(page).toHaveURL(/\/esqueci-senha/);
		await page.getByRole('button', { name: 'Enviar instruções simuladas' }).click();
		await expect(page.getByText('Informe o e-mail.')).toBeVisible();

		await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
		await page.getByRole('button', { name: 'Enviar instruções simuladas' }).click();
		await expect(page.getByRole('status')).toContainText('Envio simulado');

		await page.getByRole('button', { name: 'Continuar para redefinição' }).click();
		await expect(page).toHaveURL(/\/redefinir-senha/);
		await page.goBack();
		await expect(page).toHaveURL(/\/esqueci-senha/);
	});

	test('redefinição exige regras e confirmação', async ({ page }) => {
		await page.goto('/redefinir-senha');
		await page.getByLabel('Nova senha', { exact: true }).fill('curta');
		await page.getByLabel('Confirmar senha', { exact: true }).fill('outra');
		await page.getByRole('button', { name: 'Salvar senha simulada' }).click();
		await expect(page.locator('.demo-auth-form-error')).toBeVisible();

		await page.getByLabel('Nova senha', { exact: true }).fill('SenhaForte1');
		await page.getByLabel('Confirmar senha', { exact: true }).fill('SenhaForte1');
		await page.getByRole('button', { name: 'Salvar senha simulada' }).click();
		await expect(page.getByRole('status')).toContainText('simulação');
	});

	test('tema e cor primária persistem no fluxo de auth', async ({ page }) => {
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: 'dark', url: 'http://127.0.0.1:3000' }]);
		await openLogin(page);
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

		await waitForHydration(themeTrigger(page));
		await chooseTheme(page, 'light');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

		const orbFillBefore = await page
			.locator('.demo-auth-panel__orb--one')
			.evaluate((node) => getComputedStyle(node).fill);
		await page.addStyleTag({
			content: `[data-theme='light'] { --ads-color-primary: rgb(200, 80, 40); }`,
		});
		const orbFillAfter = await page
			.locator('.demo-auth-panel__orb--one')
			.evaluate((node) => getComputedStyle(node).fill);
		expect(orbFillAfter).not.toBe(orbFillBefore);
	});

	test('mobile oculta o painel e passa na auditoria de acessibilidade', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		for (const path of ['/login', '/esqueci-senha', '/redefinir-senha']) {
			await page.goto(path);
			await expect(page.locator('.demo-auth-panel')).toBeHidden();
			await expectNoAxeViolations(page);
		}
	});

	test('desktop exibe painel e passa na auditoria nos dois temas', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		for (const theme of ['light', 'dark'] as const) {
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			await page.goto('/login');
			await expect(page.locator('.demo-auth-panel')).toBeVisible();
			await expectNoAxeViolations(page);
		}
	});
});

function requiredEmailSnippet() {
	return 'Informe o e-mail';
}
