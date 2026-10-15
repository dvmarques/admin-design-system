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
	await expect(
		page
			.getByRole('navigation', { name: 'Navegação do demo' })
			.getByRole('link', { name: 'Exibição de dados' }),
	).toHaveAttribute('href', '/data-display');

	await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

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

test('apresenta o catálogo de componentes com os tokens públicos', async ({ page }) => {
	await page.goto('/componentes');

	await expect(
		page.getByRole('heading', { level: 1, name: 'Catálogo de componentes' }),
	).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Tokens públicos' })).toBeVisible();
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
	await expect(drawer.getByRole('link', { name: 'Componentes' })).toBeVisible();

	await expect(drawer.getByRole('heading', { name: 'Navegação do demo' })).toBeVisible();
	const closeButton = page.getByRole('button', { name: 'Fechar navegação' });
	await expect(closeButton).toBeVisible();
	// The close button must be the topmost element at its center, not covered by the navigation,
	// with or without a drawer title (consumers may omit `mobileTitle`).
	const closeButtonOnTop = () =>
		closeButton.evaluate((button) => {
			const rect = button.getBoundingClientRect();
			const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
			return hit !== null && button.contains(hit);
		});
	expect(await closeButtonOnTop()).toBe(true);
	await drawer.getByRole('heading', { name: 'Navegação do demo' }).evaluate((heading) => {
		heading.nextElementSibling?.classList.remove('mt-5');
		heading.remove();
	});
	expect(await closeButtonOnTop()).toBe(true);

	await closeButton.press('Enter');
	await expect(drawer).toBeHidden();
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('encerra a navegação móvel ao entrar no desktop e não a reabre ao voltar', async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const trigger = page.getByRole('button', { name: 'Abrir navegação' });
	await trigger.click();
	await expect(page.getByRole('dialog', { name: 'Navegação do demo' })).toBeVisible();

	await page.setViewportSize({ width: 1280, height: 900 });
	await expect(page.getByRole('dialog')).toHaveCount(0);
	const navigation = page.getByRole('navigation', { name: 'Navegação do demo' });
	await expect(navigation).toHaveCount(1);
	await expect(navigation.getByRole('link', { name: 'Componentes' })).toBeVisible();

	await page.setViewportSize({ width: 390, height: 844 });
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('mantém a apresentação do Admin Shell recolhido e móvel nos temas claro e escuro', async ({
	page,
}) => {
	test.skip(Boolean(process.env.CI), 'Snapshots visuais são validados localmente.');

	for (const theme of ['dark', 'light'] as const) {
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);

		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/');
		await hideDevelopmentPortal(page);
		await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
		const navigation = page.getByRole('navigation', { name: 'Navegação do demo' });
		await expect(navigation.getByRole('link', { name: 'Componentes' })).toBeVisible();
		await expect(page).toHaveScreenshot(`admin-shell-collapsed-${theme}.png`);

		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');
		await hideDevelopmentPortal(page);
		await page.getByRole('button', { name: 'Abrir navegação' }).click();
		await expect(page.getByRole('dialog', { name: 'Navegação do demo' })).toBeVisible();
		await expect(page).toHaveScreenshot(`admin-shell-mobile-open-${theme}.png`);
	}
});
