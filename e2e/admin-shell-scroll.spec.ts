import { expect, test, type Page } from '@playwright/test';

const route = '/componentes';

const sidebarNav = (page: Page) =>
	page.locator('.ads-admin-shell-sidebar-desktop .ads-admin-shell-sidebar');
const main = (page: Page) => page.locator('.ads-admin-shell-main');
const header = (page: Page) => page.locator('.ads-admin-shell-header');

function metrics(page: Page) {
	return page.evaluate(() => {
		const root = document.documentElement;
		return {
			pageScrolls: root.scrollHeight > root.clientHeight + 1,
			pageScrollsX: root.scrollWidth > root.clientWidth + 1,
			scrollY: window.scrollY,
		};
	});
}

for (const viewport of [
	{ width: 1280, height: 800 },
	{ width: 768, height: 600 },
	{ width: 1280, height: 420 },
]) {
	test.describe(`shell desktop ${viewport.width}×${viewport.height}`, () => {
		test.use({ viewport });

		test('o main rola sem mover header e sidebar nem rolar a página', async ({ page }) => {
			await page.goto(route);
			await expect(main(page)).toBeVisible();

			const before = {
				header: await header(page).boundingBox(),
				sidebar: await sidebarNav(page).boundingBox(),
			};
			const mainScrolls = await main(page).evaluate((el) => el.scrollHeight > el.clientHeight);
			expect(mainScrolls).toBe(true);

			await main(page).evaluate((el) => el.scrollTo(0, el.scrollHeight));
			expect(await main(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(0);

			expect(await header(page).boundingBox()).toEqual(before.header);
			expect(await sidebarNav(page).boundingBox()).toEqual(before.sidebar);
			expect(await metrics(page)).toEqual({ pageScrolls: false, pageScrollsX: false, scrollY: 0 });
		});

		test('a sidebar rola internamente sem mover o main', async ({ page }) => {
			await page.goto(route);
			const nav = sidebarNav(page);
			const overflows = await nav.evaluate((el) => el.scrollHeight > el.clientHeight);
			test.skip(!overflows, 'itens da sidebar cabem na altura disponível');

			const mainTop = await main(page).evaluate((el) => el.scrollTop);
			await nav.evaluate((el) => el.scrollTo(0, el.scrollHeight));
			expect(await nav.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
			expect(await main(page).evaluate((el) => el.scrollTop)).toBe(mainTop);
			expect((await metrics(page)).pageScrolls).toBe(false);
		});

		test('a sidebar recolhida mantém a largura e a rolagem independente', async ({ page }) => {
			await page.goto(route);
			const aside = page.locator('.ads-admin-shell-sidebar-desktop');
			const expanded = (await aside.boundingBox())!.width;

			await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
			await expect(aside).toHaveAttribute('data-collapsed', 'true');
			await expect.poll(async () => (await aside.boundingBox())!.width).toBeLessThan(expanded);

			await main(page).evaluate((el) => el.scrollTo(0, el.scrollHeight));
			expect((await metrics(page)).pageScrolls).toBe(false);
			expect(await header(page).evaluate((el) => el.getBoundingClientRect().top)).toBe(0);
		});
	});
}

test.describe('header com várias linhas', () => {
	test.use({ viewport: { width: 1280, height: 800 } });

	test('não sobrepõe sidebar nem main', async ({ page }) => {
		await page.goto(route);
		await header(page).evaluate((el) => {
			el.style.minHeight = '9rem';
		});

		const headerBox = (await header(page).boundingBox())!;
		const sidebarBox = (await sidebarNav(page).boundingBox())!;
		const mainBox = (await main(page).boundingBox())!;
		const bottom = headerBox.y + headerBox.height;

		expect(sidebarBox.y).toBeGreaterThanOrEqual(bottom - 1);
		expect(mainBox.y).toBeGreaterThanOrEqual(bottom - 1);
		expect(sidebarBox.y + sidebarBox.height).toBeLessThanOrEqual(800 + 1);
		expect((await metrics(page)).pageScrolls).toBe(false);
	});
});

test.describe('sidebar com poucos itens', () => {
	test.use({ viewport: { width: 1280, height: 800 } });

	test('não apresenta rolagem desnecessária', async ({ page }) => {
		await page.goto(route);
		await sidebarNav(page).evaluate((el) => {
			el.innerHTML = '<a href="#">Único item</a>';
		});
		expect(await sidebarNav(page).evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(true);
	});
});

test.describe('layout móvel 390×844', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('mantém a rolagem da página e o Drawer', async ({ page }) => {
		await page.goto(route);
		expect((await metrics(page)).pageScrolls).toBe(true);
		expect((await metrics(page)).pageScrollsX).toBe(false);

		await page.evaluate(() => window.scrollTo(0, 400));
		expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
		await expect(header(page)).toBeInViewport();

		const trigger = page.getByRole('button', { name: 'Abrir navegação' });
		await trigger.click();
		const drawer = page.getByRole('dialog');
		await expect(drawer).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(drawer).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});
