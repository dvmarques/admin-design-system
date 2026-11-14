import { expect, test, type Page } from '@playwright/test';
import { measureVisualArea } from '../visual-audit/measure-visual-area';

const preview = (page: Page) => page.getByRole('region', { name: 'Demonstração interativa' });

for (const width of [390, 1440]) {
	test(`organização: ambos os iframes acompanham a troca de tema em ${width}px`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/catalogo/organization-switcher');
		const area = preview(page);
		const themes = page.getByLabel('Tema da demonstração');
		const frames = [
			area.frameLocator('iframe[title="Shell com seletor de organização"]'),
			area.frameLocator('iframe[title="Shell sem seletor de organização"]'),
		];
		for (const theme of ['dark', 'light'] as const) {
			await themes.selectOption(theme);
			await expect(area).toHaveAttribute('data-theme', theme);
			for (const frame of frames) {
				await expect(frame.locator('html')).toHaveAttribute('data-theme', theme);
				await expect(frame.getByRole('heading', { name: 'Conteúdo' })).toBeVisible();
			}
		}
	});
}

for (const width of [320, 390]) {
	test(`upload: ações mantêm separação e não sobrepõem em ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/catalogo/file-upload');
		const actions = preview(page).locator('.demo-file-upload-catalog-actions');
		const button = actions.getByRole('button', { name: 'Limpar dados' });
		const link = actions.getByRole('link', { name: 'Testar importação simulada' });
		await expect(button).toBeVisible();
		await expect(link).toBeVisible();
		const gap = await actions.evaluate((node) => parseFloat(getComputedStyle(node).gap));
		expect(gap).toBeGreaterThanOrEqual(8);
		const a = await button.boundingBox();
		const b = await link.boundingBox();
		expect(a).not.toBeNull();
		expect(b).not.toBeNull();
		if (a && b) {
			const overlaps = a.x < b.x + b.width && a.x + a.width > b.x &&
				a.y < b.y + b.height && a.y + a.height > b.y;
			expect(overlaps).toBe(false);
		}
		await link.focus();
		await expect(link).toBeFocused();
	});
}

test('auditor distingue clipping real de overflow visível', async ({ page }) => {
	await page.setContent(`
		<main style="width: 250px;">
			<button id="clipped" style="width: 32px; overflow-x: hidden; white-space: nowrap;">
				Texto propositalmente longo
			</button>
			<button id="visible" style="width: 32px; overflow-x: visible; white-space: nowrap;">
				Texto propositalmente longo
			</button>
		</main>
	`);
	const clipped = page.locator('#clipped');
	const visible = page.locator('#visible');
	for (const control of [clipped, visible]) {
		expect(await control.evaluate((node) => node.scrollWidth - node.clientWidth)).toBeGreaterThan(2);
	}
	expect(await clipped.evaluate((node) => getComputedStyle(node).overflowX)).toBe('hidden');
	expect(await visible.evaluate((node) => getComputedStyle(node).overflowX)).toBe('visible');
	const metrics = await page.locator('main').evaluate(measureVisualArea, 'element');
	expect(metrics.controlsWithOverflow).toBe(1);
});

test('shell: botão de recolher com ícone visível não é falso truncamento', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/catalogo/admin-shell');
	const frame = preview(page).frameLocator('iframe[title="Shell administrativo independente"]');
	const toggle = frame.getByRole('button', { name: 'Recolher barra lateral' });
	await expect(toggle).toBeVisible();
	const data = await toggle.evaluate((node) => ({
		overflowX: getComputedStyle(node).overflowX,
		clientWidth: node.clientWidth,
		scrollWidth: node.scrollWidth,
	}));
	expect(data.overflowX).toBe('visible');
	const metrics = await frame.locator('body').evaluate(measureVisualArea, 'viewport');
	expect(metrics.controlsWithOverflow).toBe(0);
	expect(metrics.controlsOutOfBounds).toBe(0);
});
