import { expect, test } from '@playwright/test';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import type axeCore from 'axe-core';
import { waitForHydration } from './hydration';

/** Soma a rolagem da janela (móvel) e do main do shell (desktop, onde a página não rola). */
function readScroll() {
	const main = document.querySelector('.ads-admin-shell-main');
	return { x: scrollX + (main?.scrollLeft ?? 0), y: scrollY + (main?.scrollTop ?? 0) };
}

const requireFromRoot = createRequire(join(process.cwd(), 'noop.js'));

test('portaled dropdown preserves focus when a descendant cancels Tab', async ({ page }) => {
	await page.goto('/catalogo/dropdown');
	const trigger = page.getByRole('button', { name: 'Abrir ações', exact: true });
	await waitForHydration(trigger);
	await trigger.focus();
	await page.keyboard.press('ArrowDown');
	const item = page.getByRole('menuitem', { name: 'Editar', exact: true });
	await expect(item).toBeFocused();
	await item.evaluate((element) =>
		element.addEventListener('keydown', (event) => {
			if (event.key === 'Tab') event.preventDefault();
		}),
	);
	for (const key of ['Tab', 'Shift+Tab']) {
		await page.keyboard.press(key);
		await expect(page.getByRole('menu')).toBeVisible();
		await expect(item).toBeFocused();
	}
});

for (const position of ['first', 'last', 'only'] as const) {
	for (const backwards of [false, true]) {
		test(`portaled dropdown preserves native Tab at ${position} (backwards=${backwards})`, async ({
			page,
		}) => {
			const frame = page.frameLocator('#boundary-frame');
			const trigger = frame.getByRole('button', { name: 'Abrir ações', exact: true });
			const configure = async () => {
				// Parent controls make leaving the child document observable in every headless engine.
				await page.setContent(
					'<button id="before-frame">Antes</button><iframe id="boundary-frame" src="http://127.0.0.1:3000/catalogo/dropdown" width="1440" height="900"></iframe><button id="after-frame">Depois</button>',
				);
				await waitForHydration(trigger);
				await trigger.evaluate((element, placement) => {
					// Isolate the actual React dropdown's tab sequence without adding a product-only test route.
					for (const node of document.querySelectorAll<HTMLElement>(
						'a,button,input,select,textarea,[tabindex],summary,iframe',
					)) {
						if (node !== element) node.tabIndex = -1;
					}
					const sibling = document.createElement('button');
					sibling.id = 'boundary-neighbour';
					sibling.textContent = 'Outro controle';
					if (placement === 'first') element.parentElement!.after(sibling);
					if (placement === 'last') element.parentElement!.before(sibling);
				}, position);
			};
			const key = backwards ? 'Shift+Tab' : 'Tab';
			const active = async () => ({
				parent: await page.evaluate(() => document.activeElement?.id),
				child: await trigger.evaluate(() => ({
					tag: document.activeElement?.tagName,
					id: document.activeElement?.id,
					focused: document.hasFocus(),
				})),
			});
			for (const opening of ['keyboard', 'pointer'] as const) {
				await configure();
				// A native clone has the same DOM/tab position but no React dropdown handlers.
				// Include pointer modality in the baseline: WebKit may focus a clicked button
				// on the first backward Tab before leaving it on the next press.
				await trigger.evaluate((element) => element.replaceWith(element.cloneNode(true)));
				await trigger.focus();
				if (opening === 'keyboard') await page.keyboard.press('ArrowDown');
				else {
					await trigger.click();
					await trigger.focus();
				}
				await page.keyboard.press(key);
				const hasNeighbour =
					(position === 'first' && !backwards) || (position === 'last' && backwards);
				// Adjacent stops follow the menu contract immediately; only document boundaries
				// delegate to native behavior (including WebKit's pointer modality).
				const nativeTarget = hasNeighbour
					? {
							parent: 'boundary-frame',
							child: { tag: 'BUTTON', id: 'boundary-neighbour', focused: true },
						}
					: await active();
				let nextNativeTarget: Awaited<ReturnType<typeof active>> | undefined;
				if (
					!hasNeighbour &&
					nativeTarget.parent === 'boundary-frame' &&
					nativeTarget.child.tag === 'BUTTON' &&
					nativeTarget.child.id === ''
				) {
					await page.keyboard.press(key);
					nextNativeTarget = await active();
				}
				await configure();
				await trigger.focus();
				if (opening === 'keyboard') {
					await page.keyboard.press('ArrowDown');
					await expect(frame.getByRole('menuitem', { name: 'Editar', exact: true })).toBeFocused();
				} else {
					await trigger.click();
					// WebKit pointer clicks do not focus buttons; exercise Tab at the trigger explicitly.
					await trigger.focus();
				}
				await expect(frame.getByRole('menu')).toBeVisible();
				await page.keyboard.press(key);
				await expect(frame.getByRole('menu')).toBeHidden();
				await expect.poll(active).toEqual(nativeTarget);
				if (nextNativeTarget) {
					await page.keyboard.press(key);
					await expect.poll(active).toEqual(nextNativeTarget);
				}
			}
		});
	}
}

for (const theme of ['light', 'dark'] as const) {
	for (const width of [390, 1280]) {
		test(`dropdown keyboard focus in ${theme} at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			await page.goto('/componentes');
			const trigger = page.getByRole('button', { name: 'Ações do relatório', exact: true });
			const menu = page.getByRole('menu');
			const first = page.getByRole('menuitem', { name: 'Exportar', exact: true });
			const last = page.getByRole('menuitem', { name: 'Duplicar', exact: true });
			const disabled = page.getByRole('menuitem', { name: 'Arquivar', exact: true });
			await trigger.evaluate((element) =>
				element.scrollIntoView({ behavior: 'instant', block: 'center' }),
			);
			await trigger.focus();
			// Use native Tab to establish keyboard modality before opening.
			await page.keyboard.press('Tab');
			await page.keyboard.press('Shift+Tab');
			await expect(trigger).toBeFocused();
			for (const key of ['ArrowDown', 'Enter', 'Space']) {
				const scrollBefore = await page.evaluate(readScroll);
				expect(scrollBefore.y).toBeGreaterThan(0);
				await page.keyboard.press(key);
				await expect(first).toBeFocused();
				expect(await page.evaluate(readScroll)).toEqual(scrollBefore);
				await expect(trigger).toHaveAttribute('aria-expanded', 'true');
				await expect(menu).toHaveAttribute('id', (await trigger.getAttribute('aria-controls'))!);
				await expect(disabled).toHaveAttribute('aria-disabled', 'true');
				expect(await first.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
				await expect(first).toHaveCSS(
					'background-color',
					await first.evaluate((element) => {
						const probe = document.createElement('span');
						probe.style.color = 'var(--ads-color-surface-hover)';
						element.append(probe);
						const color = getComputedStyle(probe).color;
						probe.remove();
						return color;
					}),
				);
				await expect(menu.locator('..')).toHaveAttribute('data-theme', theme);
				await page.keyboard.press('ArrowDown');
				await expect(last).toBeFocused();
				await page.keyboard.press('ArrowDown');
				await expect(first).toBeFocused();
				await page.keyboard.press('ArrowUp');
				await expect(last).toBeFocused();
				await page.keyboard.press('Home');
				await expect(first).toBeFocused();
				await page.keyboard.press('End');
				await expect(last).toBeFocused();
				await page.keyboard.press('Escape');
				await expect(menu).toBeHidden();
				await expect(trigger).toBeFocused();
			}
			await trigger.click();
			await expect(menu).toBeVisible();
			expect(await menu.evaluate((element) => element.contains(document.activeElement))).toBe(
				false,
			);
			await page.keyboard.press('Escape');
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('ArrowDown');
			await expect(last).toBeFocused();
			await page.keyboard.press('Enter');
			await expect(menu).toBeHidden();
			await trigger.focus();
			await page.keyboard.press('Enter');
			await expect(first).toBeFocused();
			await page.keyboard.press('Enter');
			await expect(page).toHaveURL(/#export$/);
			await expect(menu).toBeHidden();
			await trigger.focus();
			await page.keyboard.press('ArrowDown');
			await expect(first).toBeFocused();
			await page.addScriptTag({ path: requireFromRoot.resolve('axe-core/axe.min.js') });
			const violations = await menu.evaluate(async (element) => {
				const axe = (window as unknown as { axe: typeof axeCore }).axe;
				// Audit the portalled menu's WCAG rules; page landmark best practices
				// are covered by the existing route audits with overlays closed.
				const result = await axe.run(element, {
					runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
				});
				return result.violations.map(({ id }) => id);
			});
			expect(violations).toEqual([]);
		});
	}
}
