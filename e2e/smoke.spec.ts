import { expect, test, type Page } from '@playwright/test';
import { waitForHydration } from './hydration';
import { routes } from './routes';

/** Rotas cobertas em todos os navegadores; os snapshots visuais ficam só no Chromium. */
const smokeRoutes = routes.filter(({ path }) => ['/', '/clientes', '/componentes'].includes(path));

function collectBrowserErrors(page: Page) {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	return errors;
}

for (const route of smokeRoutes) {
	test(`carrega ${route.path} sem erros de console nem de hidratação`, async ({ page }) => {
		const errors = collectBrowserErrors(page);

		await page.goto(route.path);
		await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
		await waitForHydration(page.getByRole('button', { name: /^Usar tema (claro|escuro)$/ }));

		expect(errors).toEqual([]);
	});
}

test('navega pelo menu principal entre as rotas cobertas', async ({ page }) => {
	await page.goto('/');
	const navigation = page.getByRole('navigation', { name: 'Navegação do demo' });
	await waitForHydration(page.getByRole('button', { name: /^Usar tema (claro|escuro)$/ }));

	for (const route of smokeRoutes.filter(({ path }) => path !== '/')) {
		await navigation.getByRole('link', { name: route.label, exact: true }).click();
		await expect(page).toHaveURL(new RegExp(`${route.path}$`));
		await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
	}
});

test('o logo do cabeçalho carrega', async ({ page }) => {
	await page.goto('/');

	const logo = page.locator('.demo-brand-heading img');
	await expect(logo).toBeVisible();
	await expect
		.poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth))
		.toBeGreaterThan(0);
});

test('em tela estreita o título do cabeçalho segue acessível e o cabeçalho não cresce', async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	await expect(page.locator('.demo-brand-heading img')).toBeVisible();
	await expect(page.locator('.demo-brand-heading strong')).toHaveText('Admin Design System');
	const height = await page
		.locator('header')
		.first()
		.evaluate((header) => header.getBoundingClientRect().height);
	expect(height).toBeLessThanOrEqual(64);
});
