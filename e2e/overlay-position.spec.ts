import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

const pageErrors = new WeakMap<Page, string[]>();

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
			const errors: string[] = [];
			pageErrors.set(page, errors);
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('console', (message) => {
				if (message.type() === 'error' && /hydrat|server rendered/i.test(message.text()))
					errors.push(message.text());
			});
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			await page.goto('/componentes/overlays');
		});

		test.afterEach(async ({ page }) => {
			expect(pageErrors.get(page)).toEqual([]);
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
			await page.getByRole('combobox', { name: /^Componente\b/ }).selectOption('Popover');
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

		test.describe('pinch zoom with pan', () => {
			test.use({ viewport: { width: 800, height: 800 }, isMobile: true, hasTouch: true });
			for (const cssAlias of [false, true]) {
				test(`keeps alignment with a panned viewport (CSS alias ${cssAlias})`, async ({ page }) => {
					if (cssAlias) {
						await page.addInitScript(() => {
							const supports = CSS.supports.bind(CSS);
							CSS.supports = ((...args: string[]) =>
								args[0] === '-webkit-backdrop-filter'
									? true
									: args.length === 1
										? supports(args[0]!)
										: supports(args[0]!, args[1]!)) as typeof CSS.supports;
						});
						await page.reload();
					}
					await page.getByRole('combobox', { name: /^Componente\b/ }).selectOption('Popover');
					const trigger = page.getByRole('button', { name: 'Popover na borda', exact: true });
					await trigger.evaluate((element) => {
						const host = element.closest('.ads-popover-anchor')!.parentElement!;
						Object.assign(host.style, {
							left: '220px',
							top: '200px',
							right: 'auto',
							bottom: 'auto',
						});
					});
					await trigger.click();
					const panel = page.getByRole('dialog', { name: 'Popover na borda' });
					await expect(panel).toBeVisible();
					const client = await page.context().newCDPSession(page);
					try {
						await client.send('Emulation.setTouchEmulationEnabled', {
							enabled: true,
							maxTouchPoints: 5,
						});
						await client.send('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
						await expect.poll(() => page.evaluate(() => visualViewport!.scale)).toBe(2);
						await client.send('Input.dispatchTouchEvent', {
							type: 'touchStart',
							touchPoints: [{ x: 300, y: 300, id: 0 }],
						});
						for (let step = 1; step <= 6; step++) {
							await client.send('Input.dispatchTouchEvent', {
								type: 'touchMove',
								touchPoints: [{ x: 300 - step * 15, y: 300 - step * 15, id: 0 }],
							});
							await page.evaluate(
								() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
							);
						}
						await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
						await expect
							.poll(() =>
								page.evaluate(() =>
									Math.min(visualViewport!.offsetLeft, visualViewport!.offsetTop),
								),
							)
							.toBeGreaterThan(40);
						await expect
							.poll(() =>
								panel.evaluate((element) => {
									const box = element.getBoundingClientRect();
									// O cabeçalho do demo também tem um popover (conta): ancora pelo gatilho do painel.
									const anchor = document
										.querySelector(`[aria-controls="${element.id}"]`)!
										.closest('.ads-popover-anchor')!
										.getBoundingClientRect();
									return Math.max(
										Math.abs(box.top - anchor.bottom - 8),
										Math.abs(box.left + box.width / 2 - anchor.left - anchor.width / 2),
									);
								}),
							)
							.toBeLessThan(1);
						await expect(panel).toHaveAttribute('data-placement', 'bottom');
					} finally {
						await client.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
						await client.detach();
					}
				});
			}
		});

		test('popover follows a scrolling and resizing anchor', async ({ page }) => {
			await page.getByRole('combobox', { name: /^Componente\b/ }).selectOption('Popover');
			const trigger = page.getByRole('button', { name: 'Popover na borda', exact: true });
			await trigger.evaluate((element) => {
				const host = element.closest('.ads-popover-anchor')!.parentElement!;
				Object.assign(host.style, { position: 'absolute', top: '800px', bottom: 'auto' });
			});
			await trigger.click();
			const panel = page.getByRole('dialog', { name: 'Popover na borda' });
			await insideViewport(panel, page);
			const anchorBefore = (await trigger.boundingBox())!;
			await page.evaluate(() => window.scrollBy({ top: 80, behavior: 'instant' }));
			await expect.poll(async () => (await trigger.boundingBox())!.y).toBeLessThan(anchorBefore.y);
			await expect
				.poll(async () => {
					const anchor = (await trigger.boundingBox())!;
					const box = (await panel.boundingBox())!;
					return (await panel.getAttribute('data-placement')) === 'top'
						? Math.abs(box.y + box.height + 8 - anchor.y)
						: Math.abs(box.y - anchor.y - anchor.height - 8);
				})
				.toBeLessThan(1);
			await trigger.evaluate((element) => {
				element.style.width = '200px';
			});
			await expect
				.poll(async () => {
					const anchor = (await trigger.boundingBox())!;
					const box = (await panel.boundingBox())!;
					const expected = Math.max(
						8,
						Math.min(anchor.x + anchor.width / 2 - box.width / 2, 320 - 8 - box.width),
					);
					return Math.abs(box.x - expected);
				})
				.toBeLessThan(1);
			await insideViewport(panel, page);
		});

		test('dropdown at the lower edge preserves keyboard navigation and focus', async ({ page }) => {
			await page.getByRole('combobox', { name: /^Componente\b/ }).selectOption('Dropdown');
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
