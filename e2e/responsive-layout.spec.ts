import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

const routes = [
	{ slug: 'consulta', heading: 'Consulta administrativa' },
	{ slug: 'formulario', heading: 'Formulário administrativo' },
	{ slug: 'dashboard', heading: 'Dashboard administrativo' },
] as const;

async function noDocumentOverflow(page: Page) {
	return page.evaluate(
		() =>
			Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <=
			document.documentElement.clientWidth + 1,
	);
}

for (const theme of ['light', 'dark'] as const) {
	for (const width of [320, 390, 768, 1440]) {
		test(`layout #318: ${theme} ${width}px, três composições sem overflow`, async ({ page }) => {
			test.setTimeout(120000);
			await page
				.context()
				.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
			await page.setViewportSize({ width, height: 900 });
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			for (const route of routes) {
				await page.goto(`/exemplos/composicao-semantica/${route.slug}`);
				await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
				await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
				await expect(page.locator('.ads-layout-container')).toHaveCount(1);
				await expect(page.locator('.demo-semantic-page')).toHaveCSS('display', 'flex');
				await expect(page.locator('.ads-layout-container')).toHaveCSS('width', /px/);
				expect(await noDocumentOverflow(page), `${route.slug} ${theme} ${width}px`).toBe(true);
				// Garante que a palavra mais longa do H1 caiba inteira em 320px:
				// a auditoria visual #318 detectou última letra órfã por gutter duplicado.
				if (width === 320) {
					const longestWordFits = await page
						.getByRole('heading', { level: 1, name: route.heading })
						.evaluate(async (title) => {
							await document.fonts.ready;
							const context = document.createElement('canvas').getContext('2d');
							if (!context) return false;
							context.font = getComputedStyle(title).font;
							const words = (title.textContent ?? '').trim().split(/\s+/);
							const longest = Math.max(
								...words.map((word) => context.measureText(word).width),
							);
							return longest <= title.clientWidth + 1;
						});
					expect(longestWordFits, `Palavra do H1 deve caber em ${route.slug} 320px`).toBe(
						true,
					);
				}
				if (route.slug === 'formulario' || route.slug === 'dashboard') {
					await expect(page.locator('.ads-layout-grid').first()).toHaveCSS('display', 'grid');
				}
				if (route.slug === 'formulario') {
					const layout = await page.locator('.demo-semantic-form-fields > *').evaluateAll((items) =>
						items.map((item) => {
							const rect = item.getBoundingClientRect();
							return { top: rect.top, left: rect.left, width: rect.width };
						}),
					);
					expect(layout).toHaveLength(2);
					expect(layout.every((item) => item.width > 0)).toBe(true);
					if (width === 320) expect(Math.abs(layout[0].top - layout[1].top)).toBeGreaterThan(1);
					if (width === 1440) expect(Math.abs(layout[0].top - layout[1].top)).toBeLessThan(1);
				}
				if (route.slug === 'dashboard') {
					await expect(page.locator('.ads-layout-grid .ads-layout-grid')).toHaveCount(0);
					await expect(page.locator('.demo-semantic-nested .ads-layout-stack')).toHaveCount(2);
				}
			}
			expect(errors).toEqual([]);
		});
	}

	test(`layout #318: ${theme} acessível, grid aninhado e interações por teclado`, async ({
		page,
	}) => {
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await page.setViewportSize({ width: 390, height: 844 });
		for (const route of routes) {
			await page.goto(`/exemplos/composicao-semantica/${route.slug}`);
			await expectNoAxeViolations(page);
			await expect(page.getByRole('main')).toHaveCount(1);
		}
		await page.goto('/exemplos/composicao-semantica/formulario');
		const submit = page.getByRole('button', { name: 'Validar cadastro' });
		await waitForHydration(submit);
		await submit.focus();
		await page.keyboard.press('Enter');
		await expect(page.getByText('Informe o nome.')).toBeVisible();
		await expect(submit).toBeVisible();
		await page.goto('/exemplos/composicao-semantica/dashboard');
		await expect(page.getByRole('heading', { level: 4, name: 'Atendimento' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 4, name: 'Operações' })).toBeVisible();
	});
}

test('layout #318: propriedades lógicas em RTL e reflow estreito aninhado', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/exemplos/composicao-semantica/dashboard');
	const wrapper = page.locator('.ads-layout-container');
	await wrapper.evaluate((element) => element.setAttribute('dir', 'rtl'));
	await expect(wrapper).toHaveAttribute('dir', 'rtl');
	const style = await wrapper.evaluate((element) => {
		const computed = getComputedStyle(element);
		return {
			direction: computed.direction,
			paddingStart: computed.paddingInlineStart,
			paddingEnd: computed.paddingInlineEnd,
		};
	});
	expect(style.direction).toBe('rtl');
	expect(style.paddingStart).toBe(style.paddingEnd);
	expect(await noDocumentOverflow(page)).toBe(true);
	for (const width of [195, 640]) {
		await page.setViewportSize({ width, height: 800 });
		await expect(page.locator('.ads-layout-grid').first()).toHaveCSS('display', 'grid');
		const hasLocalOverflow = await page
			.locator('.demo-semantic-nested')
			.evaluate((node) => node.scrollWidth > node.clientWidth + 1);
		expect(hasLocalOverflow).toBe(false);
	}
	// Larguras efetivas simulam reflow. Zoom nativo 200% exige validação humana separada.
});
