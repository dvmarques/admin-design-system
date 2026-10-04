import { expect, test, type Page } from '@playwright/test';

async function hideDevelopmentPortal(page: Page) {
	await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
}

test('consome os artefatos públicos, preserva o tema do servidor e alterna pelo teclado', async ({
	page,
}) => {
	const hydrationErrors: string[] = [];

	page.on('console', (message) => {
		if (message.type() === 'error' && /hydration/i.test(message.text())) {
			hydrationErrors.push(message.text());
		}
	});

	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'dark',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.goto('/');
	await expect(page.getByRole('link', { name: /exibi/i })).toHaveAttribute('href', '/data-display');

	await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.getByRole('heading', { name: 'Tokens públicos' })).toBeVisible();

	const darkBackground = await page.locator('body').evaluate((element) => {
		return getComputedStyle(element).backgroundColor;
	});
	const toggle = page.getByRole('button', { name: 'Usar tema claro' });
	await toggle.focus();
	await toggle.press('Enter');

	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	const lightBackground = await page.locator('body').evaluate((element) => {
		return getComputedStyle(element).backgroundColor;
	});
	expect(lightBackground).not.toBe(darkBackground);
	expect(hydrationErrors).toEqual([]);
});

test('mantém a apresentação de referência nos temas claro e escuro', async ({ page }) => {
	test.skip(Boolean(process.env.CI), 'Snapshots visuais são validados localmente.');

	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'dark',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.goto('/');
	await hideDevelopmentPortal(page);
	await expect(page).toHaveScreenshot('admin-demo-dark.png', { fullPage: true });

	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'light',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.reload();
	await hideDevelopmentPortal(page);
	await expect(page).toHaveScreenshot('admin-demo-light.png', { fullPage: true });
});

test('abre e fecha a navegação móvel do Admin Shell pelo teclado', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const trigger = page.getByRole('button', { name: 'Abrir navegação' });
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	await trigger.focus();
	await trigger.press('Enter');

	const drawer = page.getByRole('dialog', { name: 'Navegação do demo' });
	await expect(drawer).toBeVisible();
	await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	await expect(drawer.getByRole('link', { name: 'Formulários' })).toBeVisible();

	await page.getByRole('button', { name: 'Fechar navegação' }).press('Enter');
	await expect(drawer).toBeHidden();
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
