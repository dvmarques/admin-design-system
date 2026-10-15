import { expect, test, type Page } from '@playwright/test';

const routes = [
	{ path: '/', label: 'Visão geral' },
	{ path: '/componentes', label: 'Componentes' },
	{ path: '/data-display', label: 'Exibição de dados' },
] as const;

const themes = ['light', 'dark'] as const;

function mainNavigation(page: Page) {
	return page.getByRole('navigation', { name: 'Navegação do demo' });
}

async function useTheme(page: Page, theme: (typeof themes)[number]) {
	await page
		.context()
		.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
}

for (const route of routes) {
	test(`${route.path} tem um único shell, main e h1`, async ({ page }) => {
		const hydrationErrors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && /hydration/i.test(message.text())) {
				hydrationErrors.push(message.text());
			}
		});

		await page.goto(route.path);

		await expect(page.locator('.ads-admin-shell')).toHaveCount(1);
		await expect(page.getByRole('main')).toHaveCount(1);
		await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
		await expect(mainNavigation(page)).toHaveCount(1);
		expect(hydrationErrors).toEqual([]);
	});

	for (const theme of themes) {
		test(`${route.path} destaca o item atual da navegação no tema ${theme}`, async ({ page }) => {
			await useTheme(page, theme);
			await page.goto(route.path);

			const navigation = mainNavigation(page);
			const current = navigation.getByRole('link', { name: route.label });
			await expect(current).toHaveAttribute('aria-current', 'page');
			await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);

			const others = navigation.locator('a:not([aria-current="page"])');
			const backgroundOf = (locator: typeof current) =>
				locator.evaluate((element) => getComputedStyle(element).backgroundColor);
			const currentBackground = await backgroundOf(current);
			expect(await backgroundOf(others.first())).not.toBe(currentBackground);
		});
	}
}

test('fecha a navegação móvel ao trocar de rota e mantém o drawer aberto até lá', async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/');

	const trigger = page.getByRole('button', { name: 'Abrir navegação' });
	await trigger.click();
	const drawer = page.getByRole('dialog', { name: 'Navegação do demo' });
	await expect(drawer).toBeVisible();

	// Let any effect that runs right after mounting the drawer settle before asserting again.
	await page.evaluate(
		() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
	);
	await expect(drawer).toBeVisible();
	await expect(trigger).toHaveAttribute('aria-expanded', 'true');

	await drawer.getByRole('link', { name: 'Componentes' }).click();

	await expect(page).toHaveURL('/componentes');
	await expect(drawer).toBeHidden();
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	await expect(
		page.getByRole('heading', { level: 1, name: 'Catálogo de componentes' }),
	).toBeVisible();
	await expect(trigger).toBeFocused();
});

test('mantém o tema e a sidebar recolhida ao navegar entre rotas sem recarregar', async ({
	page,
}) => {
	await useTheme(page, 'dark');
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/');
	await page.evaluate(() => {
		(window as unknown as { navigationMarker?: boolean }).navigationMarker = true;
	});

	await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
	const sidebar = page.locator('.ads-admin-shell-sidebar-desktop');
	await expect(sidebar).toHaveAttribute('data-collapsed', 'true');

	for (const route of routes.slice(1)) {
		await mainNavigation(page).getByRole('link', { name: route.label }).click();
		await expect(page).toHaveURL(route.path);
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		await expect(sidebar).toHaveAttribute('data-collapsed', 'true');
	}

	// Client-side navigation: a full page load would have discarded the marker.
	expect(
		await page.evaluate(
			() => (window as unknown as { navigationMarker?: boolean }).navigationMarker,
		),
	).toBe(true);
});

test('permite navegar pelo teclado com foco visível e ativar com Enter', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/');

	const link = mainNavigation(page).getByRole('link', { name: 'Componentes' });
	await link.focus();
	await expect(link).toBeFocused();
	await expect(link).toHaveCSS('outline-style', 'solid');
	await expect(link).toHaveCSS('outline-width', '2px');

	await link.press('Enter');
	await expect(page).toHaveURL('/componentes');
});

test('abre o catálogo pela navegação principal com os cenários de avaliação', async ({ page }) => {
	await page.goto('/');
	await mainNavigation(page).getByRole('link', { name: 'Componentes' }).click();

	await expect(page).toHaveURL('/componentes');
	await expect(page.getByLabel('Sincronizando dados')).toBeVisible();
	await expect(page.getByLabel('Erro', { exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Excluir registro' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Abrir diálogo' }).first()).toBeVisible();
});
