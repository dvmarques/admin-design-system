import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

const themeButton = (page: Page) =>
	page.getByRole('button', { name: /^Usar tema (claro|escuro)$/ });

async function openComponents(page: Page) {
	await page.goto('/componentes');
	await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
	await waitForHydration(themeButton(page));
}

const rootVariable = (page: Page, name: string) =>
	page.evaluate(
		(variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim(),
		name,
	);

test.describe('movimento reduzido', () => {
	test.beforeEach(({ page }) =>
		page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' }),
	);

	test('controles não têm transições e não há animações contínuas', async ({ page }) => {
		await openComponents(page);

		// O CSS do Next serializa `0ms` como `0s`.
		expect(await rootVariable(page, '--ads-motion-normal')).toMatch(/^0(ms|s)$/);
		expect(await rootVariable(page, '--ads-motion-fast')).toMatch(/^0(ms|s)$/);

		const controls = [
			page.getByRole('button', { name: 'Salvar', exact: true }),
			page.getByRole('textbox', { name: 'E-mail' }),
			page.getByRole('checkbox', { name: 'Enviar atualizações por e-mail' }),
		];
		for (const control of controls) {
			const durations = await control.evaluate((element) => {
				// Checkbox e radio desenham o indicador no irmão do input nativo.
				const target = element.classList.contains('sr-only') ? element.nextElementSibling : element;
				return getComputedStyle(target as Element)
					.transitionDuration.split(',')
					.map((value) => value.trim());
			});
			expect(new Set(durations)).toEqual(new Set(['0s']));
		}

		const looping = await page.evaluate(
			() =>
				document
					.getAnimations()
					.filter(
						(animation) =>
							animation instanceof CSSAnimation &&
							animation.effect?.getComputedTiming().iterations === Infinity,
					).length,
		);
		expect(looping).toBe(0);
	});
});

test.describe('cores forçadas', () => {
	test.beforeEach(({ page }) =>
		page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' }),
	);

	test('foco por teclado e indicador marcado usam cores de sistema', async ({ page }) => {
		await openComponents(page);

		await page.getByRole('button', { name: 'Salvar', exact: true }).focus();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Shift+Tab');
		const focus = await page
			.getByRole('button', { name: 'Salvar', exact: true })
			.evaluate((element) => {
				const style = getComputedStyle(element);
				return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
			});
		expect(focus.style).not.toBe('none');
		expect(focus.width).toBeGreaterThan(0);

		const checkbox = page.getByRole('checkbox', { name: 'Enviar atualizações por e-mail' });
		await page.getByText('Enviar atualizações por e-mail').click();
		await expect(checkbox).toBeChecked();
		const indicatorStyle = () =>
			checkbox.evaluate((element) => {
				const probe = document.createElement('span');
				probe.style.backgroundColor = 'Highlight';
				document.body.append(probe);
				const highlight = getComputedStyle(probe).backgroundColor;
				probe.remove();
				const box = getComputedStyle(element.nextElementSibling as Element);
				return { matches: box.backgroundColor === highlight, borderStyle: box.borderTopStyle };
			});
		// O fundo ainda transita até assentar; o valor final é a cor de sistema.
		await expect.poll(async () => (await indicatorStyle()).matches).toBe(true);
		expect((await indicatorStyle()).borderStyle).toBe('solid');
	});
});

test.describe('maior contraste', () => {
	test('tokens de borda de controle e foco ficam mais fortes nos dois temas', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light', contrast: 'more' });
		await openComponents(page);
		expect(await rootVariable(page, '--ads-color-border-control')).toBe('#334155');
		expect(await rootVariable(page, '--ads-color-text-muted')).toBe('#0f172a');
		await expectNoAxeViolations(page);

		await page.getByRole('button', { name: 'Usar tema escuro' }).click();
		expect(await rootVariable(page, '--ads-color-border-control')).toBe('#e2e8f0');
		expect(await rootVariable(page, '--ads-color-focus-ring')).toMatch(/^#(fff|ffffff)$/);
		await expectNoAxeViolations(page);
	});
});
