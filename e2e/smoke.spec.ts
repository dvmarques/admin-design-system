import { expect, test, type Page } from '@playwright/test';
import { waitForHydration } from './hydration';
import { routes } from './routes';
import { themeTrigger } from './theme-control';

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
		await waitForHydration(themeTrigger(page));

		expect(errors).toEqual([]);
	});
}

test('navega pelo menu principal entre as rotas cobertas', async ({ page }) => {
	await page.goto('/');
	const navigation = page.getByRole('navigation', { name: 'Navegação do demo' });
	await waitForHydration(themeTrigger(page));

	for (const route of smokeRoutes.filter(({ path }) => path !== '/')) {
		await navigation.getByRole('link', { name: route.label, exact: true }).click();
		await expect(page).toHaveURL(new RegExp(`${route.path}$`));
		await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
	}
});

test('o logo da composição responsiva carrega', async ({ page }) => {
	await page.goto('/');

	const logo = page.locator('.demo-brand-heading img:visible');
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

	await expect(page.locator('.demo-brand-heading img:visible')).toBeVisible();
	await expect(page.locator('.demo-mobile-brand .demo-brand-heading strong')).toHaveText(
		'Admin DS',
	);
	const height = await page
		.locator('header')
		.first()
		.evaluate((header) => header.getBoundingClientRect().height);
	expect(height).toBeLessThanOrEqual(64);
});

test('mantém seleção proporcional, recuo lateral e seletor de largura estável', async ({
	page,
}) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/');
	const nav = page.getByRole('navigation', { name: 'Navegação do demo' });
	const active = nav.getByRole('link', { name: 'Visão geral', exact: true });
	const organization = nav.getByRole('button', { name: /^Organização atual/ });
	await waitForHydration(organization);
	const initialWidth = (await organization.boundingBox())!.width;
	expect(
		Math.abs(
			initialWidth - (await page.locator('.ads-organization-switcher').boundingBox())!.width,
		),
	).toBeLessThanOrEqual(1);
	for (const name of ['Initech', 'Globex Logística']) {
		await organization.click();
		await page
			.getByRole('dialog', { name: 'Trocar de organização' })
			.getByRole('button', { name: new RegExp('^' + name) })
			.click();
		await expect(organization).toHaveAccessibleName(new RegExp('Organização atual: ' + name));
		await expect(page.getByRole('dialog', { name: 'Trocar de organização' })).toBeHidden();
		expect((await organization.boundingBox())!.width).toBe(initialWidth);
	}
	// Reserve a real scrollbar gutter even when all items fit, then also test the default behavior.
	for (const gutter of ['stable', 'auto']) {
		await nav.evaluate((el, value) => {
			el.style.scrollbarGutter = value;
		}, gutter);
		const expanded = (await active.boundingBox())!;
		await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
		const collapsed = (await active.boundingBox())!;
		expect(collapsed.width).toBeCloseTo(44, 0);
		expect(collapsed.height).toBeCloseTo(44, 0);
		expect(Math.abs(collapsed.x - expanded.x)).toBeLessThanOrEqual(1);
		expect((await page.locator('.ads-admin-shell-sidebar-desktop').boundingBox())!.width).toBe(72);
		await expect(organization).toHaveCSS('border-left-color', 'rgba(0, 0, 0, 0)');
		const before = (await organization.locator('.ads-avatar').boundingBox())!;
		await organization.evaluate((el) => {
			el.style.borderColor = 'gray';
		});
		expect(await organization.locator('.ads-avatar').boundingBox()).toEqual(before);
		await organization.evaluate((el) => {
			el.style.removeProperty('border-color');
		});
		await page.getByRole('button', { name: 'Expandir barra lateral' }).click();
	}
});
