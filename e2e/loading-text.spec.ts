import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

const demo = (page: Page) => page.getByRole('region', { name: 'Demonstração interativa' });
const texts = (page: Page) => demo(page).locator('.ads-loading-text');

async function openDemo(page: Page) {
	await page.goto('/catalogo/loading-text');
	await expect(page.getByRole('heading', { name: 'AdsLoadingText', level: 1 })).toBeVisible();
	await expect(texts(page)).toHaveCount(4);
}

const shimmerAnimations = (page: Page) =>
	page.evaluate(
		() =>
			document
				.getAnimations()
				.filter(
					(animation) =>
						animation instanceof CSSAnimation &&
						animation.animationName === 'ads-loading-text-shimmer' &&
						animation.effect?.getComputedTiming().iterations === Infinity,
				).length,
	);

test.describe('AdsLoadingText no catálogo', () => {
	test.beforeEach(({ page }) =>
		page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' }),
	);

	test('anima só com loading=true, com as três velocidades, sem alterar o layout', async ({
		page,
	}) => {
		await openDemo(page);
		const items = texts(page);
		await expect(items.first()).toHaveAttribute('data-loading', 'true');
		expect(await shimmerAnimations(page)).toBe(4);
		const durations = await items.evaluateAll((elements) =>
			elements.map((element) => getComputedStyle(element).animationDuration),
		);
		expect(durations).toEqual(['4s', '2.5s', '1.5s', '2.5s']);

		const boxes = () =>
			items.evaluateAll((elements) =>
				elements.map((element) => {
					const { width, height } = element.getBoundingClientRect();
					return { width, height, text: element.textContent };
				}),
			);
		const before = await boxes();
		await page.getByRole('button', { name: 'Concluir atualização' }).click();
		await expect(items.first()).not.toHaveAttribute('data-loading', /.*/);
		expect(await shimmerAnimations(page)).toBe(0);
		expect(await boxes()).toEqual(before);
		await expect(items.first()).toBeVisible();
		expect(await items.first().evaluate((element) => getComputedStyle(element).animationName)).toBe(
			'none',
		);
	});

	for (const theme of ['light', 'dark'] as const) {
		test(`texto legível e sem violações de acessibilidade no tema ${theme}`, async ({ page }) => {
			await openDemo(page);
			await page.getByLabel('Tema da demonstração').selectOption(theme);
			for (const loading of [true, false]) {
				if (!loading) await page.getByRole('button', { name: 'Concluir atualização' }).click();
				for (const text of await texts(page).all()) await expect(text).toBeVisible();
				await expectNoAxeViolations(page);
			}
		});
	}

	test('o texto longo quebra linha dentro da largura estreita', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 800 });
		await openDemo(page);
		const long = texts(page).last();
		const metrics = await long.evaluate((element) => ({
			lines: element.getClientRects().length,
			height: element.getBoundingClientRect().height,
			overflow: document.documentElement.scrollWidth <= window.innerWidth,
		}));
		expect(metrics.overflow).toBe(true);
		expect(metrics.height).toBeGreaterThan(30);
		await expect(long).toBeVisible();
	});
});

test.describe('AdsLoadingText com preferências do sistema', () => {
	test('movimento reduzido: sem animação e com texto sólido', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
		await openDemo(page);
		await expect(texts(page).first()).toHaveAttribute('data-loading', 'true');
		expect(await shimmerAnimations(page)).toBe(0);
		const style = await texts(page)
			.first()
			.evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					animation: computed.animationName,
					image: computed.backgroundImage,
					fill: computed.webkitTextFillColor,
					color: computed.color,
				};
			});
		expect(style.animation).toBe('none');
		expect(style.image).toBe('none');
		expect(style.fill).toBe(style.color);
	});

	test('cores forçadas: cor de sistema, sem animação nem gradiente', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active' });
		await openDemo(page);
		expect(await shimmerAnimations(page)).toBe(0);
		const style = await texts(page)
			.first()
			.evaluate((element) => {
				const probe = document.createElement('span');
				probe.style.color = 'CanvasText';
				document.body.append(probe);
				const canvasText = getComputedStyle(probe).color;
				probe.remove();
				const computed = getComputedStyle(element);
				return {
					canvasText,
					animation: computed.animationName,
					image: computed.backgroundImage,
					fill: computed.webkitTextFillColor,
				};
			});
		expect(style.animation).toBe('none');
		expect(style.image).toBe('none');
		expect(style.fill).toBe(style.canvasText);
	});
});
