import { expect, test, type Page } from '@playwright/test';
import { waitForHydration } from './hydration';
import { themeTrigger } from './theme-control';

const preference = (page: Page) =>
	page.getByRole('region', { name: 'Demonstração interativa' }).getByRole('status');

async function openShowcase(page: Page) {
	await page.goto('/catalogo/theme-control');
	await expect(
		page.getByRole('heading', { level: 1, name: 'AdsThemeControl', exact: true }),
	).toBeVisible();
	await waitForHydration(themeTrigger(page).first());
	await expect(preference(page)).toHaveText('Preferência: system');
}

test('escolhe qualquer modo diretamente, em menu e em grupo, mantendo o foco', async ({ page }) => {
	await openShowcase(page);
	const demo = page.getByRole('region', { name: 'Demonstração interativa' });

	const radios = demo.getByRole('radiogroup', { name: 'Tema' }).first();
	await radios.getByRole('radio', { name: 'Escuro' }).click();
	await expect(preference(page)).toHaveText('Preferência: dark');
	await expect(radios.getByRole('radio', { name: 'Escuro' })).toBeChecked();

	await radios.getByRole('radio', { name: 'Escuro' }).focus();
	await page.keyboard.press('ArrowRight');
	await expect(radios.getByRole('radio', { name: 'Sistema' })).toBeFocused();
	await expect(preference(page)).toHaveText('Preferência: system');

	await demo.getByRole('button', { name: 'Tema: Sistema' }).first().click();
	await page.getByRole('menuitemradio', { name: 'Claro', exact: true }).click();
	await expect(preference(page)).toHaveText('Preferência: light');
	await expect(demo.getByRole('button', { name: 'Tema: Claro' }).first()).toBeFocused();
});

test('o gatilho é compacto e as opções só com ícone têm tooltip por foco e nome acessível', async ({
	page,
}) => {
	await openShowcase(page);
	const demo = page.getByRole('region', { name: 'Demonstração interativa' });

	const trigger = demo.getByRole('button', { name: 'Tema: Sistema' }).first();
	const box = await trigger.boundingBox();
	expect(box?.width).toBeGreaterThanOrEqual(40);
	expect(box?.height).toBeGreaterThanOrEqual(40);
	await expect(trigger).not.toContainText(/\S/);

	const radio = demo.getByRole('radiogroup', { name: 'Tema' }).first().getByRole('radio', {
		name: 'Claro',
	});
	await radio.focus();
	await expect(page.getByRole('tooltip')).toHaveText('Claro');
	await page.keyboard.press('Escape');
	await expect(page.getByRole('tooltip')).toHaveCount(0);
});

test('o menu fecha com Escape devolvendo o foco e o controle cabe em 320 px', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 700 });
	await openShowcase(page);
	const demo = page.getByRole('region', { name: 'Demonstração interativa' });

	const trigger = demo.getByRole('button', { name: 'Tema: Sistema' }).first();
	await trigger.focus();
	await page.keyboard.press('ArrowDown');
	await expect(page.getByRole('menuitemradio', { name: 'Sistema' })).toBeFocused();
	// As opções ficam empilhadas, coerente com as setas para cima e para baixo.
	const tops = await page
		.getByRole('menuitemradio')
		.evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)));
	expect(new Set(tops).size).toBe(3);
	await page.keyboard.press('Escape');
	await expect(page.getByRole('menu')).toHaveCount(0);
	await expect(trigger).toBeFocused();

	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
	expect(overflow).toBeLessThanOrEqual(0);
});
