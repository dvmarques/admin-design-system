import { expect, test, type Page } from '@playwright/test';
import { waitForHydration } from '../e2e/hydration';
import { routes } from '../e2e/routes';

const base = '/admin-design-system';

function collectBrowserErrors(page: Page) {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	page.on('response', (response) => {
		if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
	});
	return errors;
}

for (const route of routes) {
	test(`demo publicado: ${route.path} abre sob o subcaminho`, async ({ page }) => {
		const errors = collectBrowserErrors(page);

		await page.goto(`${base}${route.path === '/' ? '/' : `${route.path}/`}`);

		await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
		await waitForHydration(page.getByRole('button', { name: /^Usar tema (claro|escuro)$/ }));
		expect(errors).toEqual([]);
	});
}

test('demo publicado: navega pela navegação principal sem sair do subcaminho', async ({ page }) => {
	await page.goto(`${base}/`);
	await waitForHydration(page.getByRole('button', { name: /^Usar tema (claro|escuro)$/ }));

	await page
		.getByRole('navigation', { name: 'Navegação do demo' })
		.getByRole('link', { name: 'Clientes' })
		.click();

	await expect(page).toHaveURL(`${base}/clientes/`);
	await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
});

test('demo publicado: filtros da URL funcionam em /clientes sem servidor', async ({ page }) => {
	const errors = collectBrowserErrors(page);

	await page.goto(`${base}/clientes/?status=Inativo`);

	await expect(page.getByRole('region', { name: 'Lista de clientes' })).toBeVisible();
	await expect(page.getByText(/\d+ clientes? encontrados?/)).toBeVisible();
	const filtered = await page.getByText(/\d+ clientes? encontrados?/).innerText();

	await page.goto(`${base}/clientes/`);
	await expect(page.getByText(/\d+ clientes? encontrados?/)).not.toHaveText(filtered);
	expect(errors).toEqual([]);
});

for (const theme of ['light', 'dark'] as const) {
	test(`demo publicado: aplica o tema ${theme} salvo, sem erro de hidratação`, async ({ page }) => {
		const errors = collectBrowserErrors(page);
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:4173' }]);

		await page.goto(`${base}/`);

		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		await waitForHydration(page.getByRole('button', { name: /^Usar tema (claro|escuro)$/ }));
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		expect(errors).toEqual([]);
	});
}

test('demo publicado: o tema alternado persiste ao recarregar', async ({ page }) => {
	await page.goto(`${base}/`);
	const toggle = page.getByRole('button', { name: /^Usar tema (claro|escuro)$/ });
	await waitForHydration(toggle);

	await toggle.click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await page.reload();

	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('demo publicado: o link do cabeçalho leva ao Storybook', async ({ page }) => {
	await page.goto(`${base}/`);

	const link = page.getByRole('link', { name: 'Storybook (abre em nova aba)' });
	await expect(link).toHaveAttribute('href', `${base}/storybook/`);
	await expect(link).toHaveAttribute('target', '_blank');

	const popup = page.waitForEvent('popup');
	await link.click();
	await expect((await popup).url()).toBe(`http://127.0.0.1:4173${base}/storybook/`);
});

test('storybook publicado: carrega o catálogo em /storybook/', async ({ page, request }) => {
	const errors = collectBrowserErrors(page);

	const index = await request.get(`${base}/storybook/index.json`);
	expect(index.ok()).toBe(true);
	expect(Object.keys((await index.json()).entries).length).toBeGreaterThan(0);

	await page.goto(`${base}/storybook/`);
	await expect(page).toHaveTitle(/Storybook/);
	expect(errors).toEqual([]);
});
