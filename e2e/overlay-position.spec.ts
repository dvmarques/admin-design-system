import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

async function insideViewport(panel: Locator, page: Page) {
	await expect
		.poll(async () => {
			const box = await panel.boundingBox();
			const view = page.viewportSize()!;
			return (
				!!box &&
				box.x >= 7 &&
				box.y >= 7 &&
				box.x + box.width <= view.width - 7 &&
				box.y + box.height <= view.height - 7
			);
		})
		.toBe(true);
}

for (const theme of ['light', 'dark']) {
	test.describe(`anchored overlay geometry (${theme})`, () => {
		test.use({ viewport: { width: 320, height: 568 } });
		test.beforeEach(async ({ page }) => {
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			await page.goto('/componentes/overlays');
		});

		for (const [side, corner, effective] of [
			['top', 'top-left', 'bottom'],
			['bottom', 'bottom-right', 'top'],
			['left', 'top-left', 'right'],
			['right', 'bottom-right', 'left'],
		] as const) {
			test(`tooltip flips ${side}, shifts and points toward its anchor`, async ({ page }) => {
				await page.getByLabel('Canto').selectOption(corner);
				await page.getByLabel('Lado preferido').selectOption(side);
				const trigger = page.getByRole('button', { name: 'Tooltip na borda' });
				await trigger.focus();
				const panel = page.getByRole('tooltip');
				await expect(panel).toHaveAttribute('data-placement', effective);
				await insideViewport(panel, page);
				await expect(trigger).toHaveAttribute(
					'aria-describedby',
					(await panel.getAttribute('id'))!,
				);
				// Verifica o CSS distribuído, incluindo a transformação da seta.
				const geometry = await panel.evaluate((element) => {
					const arrow = element.querySelector('[aria-hidden]')!;
					const box = element.getBoundingClientRect();
					const tip = arrow.getBoundingClientRect();
					return {
						position: getComputedStyle(element).position,
						box: { left: box.left, right: box.right, top: box.top, bottom: box.bottom },
						tip: { x: tip.left + tip.width / 2, y: tip.top + tip.height / 2 },
					};
				});
				expect(geometry.position).toBe('fixed');
				const edge =
					effective === 'bottom'
						? geometry.box.top
						: effective === 'top'
							? geometry.box.bottom
							: effective === 'right'
								? geometry.box.left
								: geometry.box.right;
				expect(
					Math.abs(
						(effective === 'top' || effective === 'bottom' ? geometry.tip.y : geometry.tip.x) -
							edge,
					),
				).toBeLessThan(2);
				await page.keyboard.press('Escape');
				await expect(panel).toHaveCount(0);
				await expect(trigger).toBeFocused();
			});
		}

		test('popover follows dynamic content, scroll, resize and pinch zoom', async ({ page }) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await page.getByLabel('Componente').selectOption('Popover');
			await page.getByRole('button', { name: 'Popover na borda', exact: true }).click();
			const panel = page.getByRole('dialog', { name: 'Popover na borda' });
			await expect(panel).toHaveAttribute('data-placement', 'top');
			await insideViewport(panel, page);
			const before = (await panel.boundingBox())!;
			await panel.getByRole('button', { name: 'Alternar conteúdo' }).click();
			await expect
				.poll(async () => (await panel.boundingBox())!.height)
				.toBeGreaterThan(before.height);
			await insideViewport(panel, page);
			await page.evaluate(() => window.scrollBy(0, 200));
			await insideViewport(panel, page);
			await page.setViewportSize({ width: 390, height: 700 });
			await insideViewport(panel, page);
			await expectNoAxeViolations(page);
			const client = await page.context().newCDPSession(page);
			await client.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1.25 });
			await expect
				.poll(() =>
					panel.evaluate((element) => {
						const box = element.getBoundingClientRect();
						const view = window.visualViewport!;
						return (
							box.left >= view.offsetLeft + 7 &&
							box.top >= view.offsetTop + 7 &&
							box.right <= view.offsetLeft + view.width - 7 &&
							box.bottom <= view.offsetTop + view.height - 7
						);
					}),
				)
				.toBe(true);
			await client.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
			await client.detach();
			await page.keyboard.press('Escape');
			await expect(panel).toHaveCount(0);
			expect(errors).toEqual([]);
		});

		test('dropdown at the lower edge preserves keyboard navigation and focus', async ({ page }) => {
			await page.getByLabel('Componente').selectOption('Dropdown');
			const trigger = page.getByRole('button', { name: 'Dropdown na borda' });
			await trigger.focus();
			await trigger.press('ArrowDown');
			const menu = page.getByRole('menu', { name: 'Ações na borda' });
			await expect(menu).toHaveAttribute('data-placement', 'top');
			await insideViewport(menu, page);
			await expect(menu.getByRole('menuitem', { name: 'Editar registro' })).toBeFocused();
			await page.keyboard.press('ArrowDown');
			await expect(menu.getByRole('menuitem', { name: 'Duplicar registro' })).toBeFocused();
			await page.keyboard.press('Escape');
			await expect(menu).toHaveCount(0);
			await expect(trigger).toBeFocused();
		});
	});
}
