import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

const sidebar = (page: Page) => page.locator('.ads-admin-shell-sidebar-desktop');
const top = (page: Page) =>
	page.locator('.ads-admin-shell-sidebar-desktop > .ads-admin-shell-sidebar-header');
const header = (page: Page) => page.locator('.ads-admin-shell-header');
const columns = (page: Page) =>
	page
		.locator('.demo-metrics-grid')
		.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
async function noOverflow(page: Page) {
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
		),
	).toBe(true);
	expect(await page.locator('main').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
}

for (const theme of ['light', 'dark'] as const) {
	test.describe(`dashboard e branding ${theme}`, () => {
		test.beforeEach(async ({ page }) => {
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		});
		test('grid segue largura útil e topo acompanha header variável e recolhimento', async ({
			page,
		}) => {
			await page.setViewportSize({ width: 1280, height: 800 });
			await page.goto('/');
			await expect.poll(() => columns(page)).toBe(2);
			await expect(top(page).locator('img')).toBeVisible();
			const organizationAvatar = page
				.getByRole('button', { name: /Organização atual/ })
				.locator('.ads-avatar');
			const accountAvatar = header(page).locator('.ads-avatar');
			expect(await organizationAvatar.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
				await accountAvatar.evaluate((el) => getComputedStyle(el).backgroundColor),
			);
			const active = page.locator('.demo-navigation a[aria-current="page"]');
			const activeColor = await active.evaluate((el) => getComputedStyle(el).backgroundColor);
			await page.setViewportSize({ width: 390, height: 844 });
			await page.getByRole('button', { name: 'Abrir navegação' }).click();
			expect(await active.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(activeColor);
			await page.keyboard.press('Escape');
			await page.setViewportSize({ width: 1280, height: 800 });

			await expect(header(page).locator('.demo-brand-heading')).toBeHidden();
			expect((await header(page).boundingBox())!.height).toBe(64);
			await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
			expect((await header(page).boundingBox())!.height).toBe(64);
			await page.getByRole('button', { name: 'Expandir barra lateral' }).click();
			expect((await header(page).boundingBox())!.height).toBe(64);
			expect((await top(page).boundingBox())!.height).toBe(
				(await header(page).boundingBox())!.height,
			);
			await header(page).evaluate((el) => {
				el.style.minHeight = '9rem';
			});
			expect((await top(page).boundingBox())!.height).toBe(
				(await header(page).boundingBox())!.height,
			);
			await page.getByRole('button', { name: 'Recolher barra lateral' }).press('Enter');
			await expect(sidebar(page)).toHaveAttribute('data-collapsed', 'true');
			await expect.poll(() => columns(page)).toBe(4);
			const toggle = page.getByRole('button', { name: 'Expandir barra lateral' });
			await expect(toggle).toBeFocused();
			const logoBox = (await top(page).locator('img').boundingBox())!;
			const toggleBox = (await toggle.boundingBox())!;
			expect(logoBox.x + logoBox.width).toBeLessThanOrEqual(toggleBox.x);
			expect((await header(page).boundingBox())!.height).toBe(144);
			const railBox = (await sidebar(page).boundingBox())!;
			expect(
				Math.abs(toggleBox.x + toggleBox.width / 2 - (railBox.x + railBox.width)),
			).toBeLessThanOrEqual(1);
			await noOverflow(page);
			await toggle.press('Enter');
			await page.setViewportSize({ width: 1600, height: 900 });
			await expect.poll(() => columns(page)).toBe(4);
			await page
				.locator('.ads-metric-card-value')
				.first()
				.evaluate((el) => {
					el.textContent = 'R$ 123.456.789.012.345,99';
				});
			await top(page)
				.locator('strong')
				.evaluate((el) => {
					el.textContent = 'Admin Design System com nome de produto muito extenso';
				});
			await noOverflow(page);
			await expectNoAxeViolations(page);
		});
		test('mobile e reflow equivalente a zoom 200% preservam menu, marca, foco e organização', async ({
			page,
		}) => {
			// A viewport CSS 640x400 representa a área útil de 1280x800 a 200%.
			for (const width of [640, 390, 320]) {
				await page.setViewportSize({ width, height: 844 });
				await page.goto('/');
				await expect.poll(() => columns(page)).toBe(1);
				await noOverflow(page);
				const trigger = page.getByRole('button', { name: 'Abrir navegação' });
				await expect(trigger).toBeInViewport();
				await expect(header(page).locator('img')).toBeVisible();
				await trigger.press('Enter');
				const drawer = page.getByRole('dialog', { name: 'Navegação do demo' });
				await expect(drawer.locator('.demo-brand-heading')).toHaveText('Admin DS');
				await expect(drawer.getByRole('button', { name: /Organização atual/ })).toBeVisible();
				await expect(drawer.getByRole('button', { name: 'Recolher barra lateral' })).toBeHidden();
				await expectNoAxeViolations(page);
				await page.keyboard.press('Escape');
				await expect(trigger).toBeFocused();
			}
		});
		test('showcase sem organização mantém marca e navegação sem bloco residual', async ({
			page,
		}) => {
			await page.setViewportSize({ width: 1280, height: 800 });
			await page.goto('/catalogo-shell/');
			await expect(top(page).locator('img')).toBeVisible();
			await expect(page.locator('.ads-organization-switcher')).toHaveCount(0);
			const nav = page.getByRole('navigation', { name: 'Navegação do shell de exemplo' });
			expect((await nav.boundingBox())!.y).toBe((await top(page).boundingBox())!.height);
			await expectNoAxeViolations(page);
		});
	});
}
