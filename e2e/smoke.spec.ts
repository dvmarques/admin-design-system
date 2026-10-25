// Exercise actual scrollbar layout; Chromium hides scrollbars by default in headless mode.
import { expect, test, type Page } from '@playwright/test';
import { waitForHydration } from './hydration';
import { routes } from './routes';
import { themeTrigger } from './theme-control';

test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

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
	expect(Math.abs(initialWidth - (await active.boundingBox())!.width)).toBeLessThanOrEqual(1);
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
	await page.addStyleTag({
		content: '.ads-admin-shell-sidebar::-webkit-scrollbar { width: 16px; }',
	});
	for (const height of [800, 420]) {
		await page.setViewportSize({ width: 1280, height });
		for (const gutter of ['stable', 'auto']) {
			await nav.evaluate((el, value) => {
				el.style.scrollbarGutter = value;
			}, gutter);
			const expanded = (await active.boundingBox())!;
			const expandedOrganization = (await organization.boundingBox())!;
			expect(Math.abs(expandedOrganization.width - expanded.width)).toBeLessThanOrEqual(1);
			expect(Math.abs(expandedOrganization.x - expanded.x)).toBeLessThanOrEqual(1);
			const mark = page.locator('.ads-admin-shell-sidebar-header .demo-brand-heading img');
			const expandedMark = (await mark.boundingBox())!;

			await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
			const collapsed = (await active.boundingBox())!;
			if (height === 420)
				expect(await nav.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
			const collapsedMark = (await mark.boundingBox())!;
			expect(Math.abs(collapsedMark.x - expandedMark.x)).toBeLessThanOrEqual(0.5);
			expect(collapsedMark.y).toBe(expandedMark.y);

			expect(collapsed.width).toBeCloseTo(44, 0);
			expect(collapsed.height).toBeCloseTo(44, 0);
			expect(
				await active.evaluate((el) => {
					const r = el.getBoundingClientRect();
					return [r.left + 1, r.right - 1].every((x) =>
						el.contains(document.elementFromPoint(x, r.top + r.height / 2)),
					);
				}),
			).toBe(true);

			expect(Math.abs(collapsed.x - expanded.x)).toBeLessThanOrEqual(1);
			expect((await page.locator('.ads-admin-shell-sidebar-desktop').boundingBox())!.width).toBe(
				72,
			);
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
	}
});

test('menu móvel cobre a viewport e usa somente a marca como identificação visível', async ({
	page,
}) => {
	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 320, height: 568 },
		{ width: 740, height: 390 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto('/');
		const trigger = page.getByRole('button', { name: 'Abrir navegação' });
		await waitForHydration(trigger);
		await trigger.click();
		const drawer = page.getByRole('dialog', { name: 'Navegação do demo' });
		await expect(drawer).toBeVisible();
		const box = (await drawer.boundingBox())!;
		expect(box.x).toBe(0);
		expect(box.y).toBe(0);
		expect(box.width).toBe(viewport.width);
		expect(box.height).toBe(viewport.height);
		await expect(drawer.getByRole('heading', { name: 'Navegação do demo' })).toHaveCount(0);
		await expect(drawer.locator('.demo-brand-heading')).toHaveText('Admin DS');
		const close = drawer.getByRole('button', { name: 'Fechar navegação' });
		expect(
			await close.evaluate((el) => {
				const b = el.getBoundingClientRect();
				return el.contains(document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2));
			}),
		).toBe(true);
		await drawer.evaluate((el) => el.scrollTo(0, el.scrollHeight));
		expect(await drawer.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	}
});
