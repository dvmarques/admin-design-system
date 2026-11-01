import { expect, test } from '@playwright/test';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import type axeCore from 'axe-core';

/** Soma a rolagem da janela (móvel) e do main do shell (desktop, onde a página não rola). */
function readScroll() {
	const main = document.querySelector('.ads-admin-shell-main');
	return { x: scrollX + (main?.scrollLeft ?? 0), y: scrollY + (main?.scrollTop ?? 0) };
}

const requireFromRoot = createRequire(join(process.cwd(), 'noop.js'));

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
