import { expect, test, type Page } from '@playwright/test';
import { waitForHydration } from '../e2e/hydration';
import { routes } from '../e2e/routes';
import { chooseTheme, themeTrigger } from '../e2e/theme-control';

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
		await waitForHydration(themeTrigger(page));
		expect(errors).toEqual([]);
	});
}

test('demo publicado: navega pela navegação principal sem sair do subcaminho', async ({ page }) => {
	await page.goto(`${base}/`);
	await waitForHydration(themeTrigger(page));

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
		await waitForHydration(themeTrigger(page));
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		expect(errors).toEqual([]);
	});
}

test('demo publicado: o tema alternado persiste ao recarregar', async ({ page }) => {
	await page.goto(`${base}/`);
	await waitForHydration(themeTrigger(page));

	await chooseTheme(page, 'dark');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await page.reload();

	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

for (const theme of ['light', 'dark'] as const) {
	for (const mode of ['expanded', 'collapsed', 'mobile'] as const) {
		test(`demo publicado: Storybook na navegação ${mode}, tema ${theme}`, async ({ page }) => {
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:4173' }]);
			await page.setViewportSize({ width: mode === 'mobile' ? 390 : 1280, height: 844 });
			await page.goto(`${base}/`);
			await waitForHydration(themeTrigger(page));
			if (mode === 'mobile') await page.getByRole('button', { name: 'Abrir navegação' }).click();
			if (mode === 'collapsed')
				await page.getByRole('button', { name: 'Recolher barra lateral' }).click();

			const navigation = page.getByRole('navigation', { name: 'Navegação do demo' });
			const link = navigation.getByRole('link', { name: 'Storybook (abre em nova aba)' });
			await expect(link).toBeVisible();
			await expect(page.getByRole('banner').getByRole('link', { name: /Storybook/ })).toHaveCount(
				0,
			);
			await expect(link).toHaveAttribute('href', `${base}/storybook/`);
			await expect(link).toHaveAttribute('target', '_blank');
			await expect(link).toHaveAttribute('rel', /noopener/);
			await link.focus();
			await expect(link).toBeFocused();
			const popup = page.waitForEvent('popup');
			await page.keyboard.press('Enter');
			const catalog = await popup;
			await expect(catalog).toHaveURL(`http://127.0.0.1:4173${base}/storybook/`);
			await catalog.close();
		});
	}
}

test('storybook publicado: carrega o catálogo em /storybook/', async ({ page, request }) => {
	const errors = collectBrowserErrors(page);

	const index = await request.get(`${base}/storybook/index.json`);
	expect(index.ok()).toBe(true);
	expect(Object.keys((await index.json()).entries).length).toBeGreaterThan(0);

	await page.goto(`${base}/storybook/`);
	await expect(page).toHaveTitle(/Storybook/);
	expect(errors).toEqual([]);
});

for (const theme of ['light', 'dark'] as const) {
	for (const mobile of [false, true]) {
		test(`demo publicado: logo visível carrega em ${mobile ? 'celular' : 'desktop'}, tema ${theme}`, async ({
			page,
		}) => {
			const errors = collectBrowserErrors(page);
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:4173' }]);
			await page.setViewportSize({ width: mobile ? 390 : 1280, height: 844 });
			await page.goto(`${base}/`);
			await waitForHydration(themeTrigger(page));

			const logo = page.locator('.demo-brand-heading img:visible');
			async function expectLoadedLogo() {
				await expect(logo).toHaveCount(1);
				await expect(logo).toHaveAttribute('src', `${base}/icon.svg`);
				await expect
					.poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth))
					.toBeGreaterThan(0);
			}
			await expectLoadedLogo();
			await page
				.getByRole('button', { name: mobile ? 'Abrir navegação' : 'Recolher barra lateral' })
				.click();
			// With a mobile drawer open, scope to its visible brand: the header sits underneath the overlay.
			if (mobile) {
				const drawerLogo = page
					.getByRole('dialog', { name: 'Navegação do demo' })
					.locator('.demo-brand-heading img');
				await expect(drawerLogo).toHaveCount(1);
				await expect(drawerLogo).toHaveAttribute('src', `${base}/icon.svg`);
				await expect
					.poll(() => drawerLogo.evaluate((image: HTMLImageElement) => image.naturalWidth))
					.toBeGreaterThan(0);
			} else {
				await expectLoadedLogo();
			}
			expect(errors).toEqual([]);
		});
	}
}

for (const [name, path] of [
	['manager', `${base}/storybook/`],
	['iframe de preview', `${base}/storybook/iframe.html`],
] as const) {
	test(`storybook publicado: o favicon do ${name} resolve sob /storybook/`, async ({
		page,
		request,
	}) => {
		await page.goto(path);

		const favicon = page.locator('link[rel="icon"][href$="admin-ds-favicon.svg"]');
		await expect(favicon).toHaveCount(1);
		const href = await favicon.evaluate((link: HTMLLinkElement) => link.href);

		expect(href).toBe(`http://127.0.0.1:4173${base}/storybook/admin-ds-favicon.svg`);
		expect((await request.get(href)).ok()).toBe(true);
	});
}
