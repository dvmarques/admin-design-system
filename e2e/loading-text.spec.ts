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
		const measure = () =>
			texts(page)
				.last()
				.evaluate((element) => ({
					height: element.getBoundingClientRect().height,
					fits: document.documentElement.scrollWidth <= window.innerWidth,
				}));
		await page.setViewportSize({ width: 1280, height: 800 });
		await openDemo(page);
		const wide = await measure();
		await page.setViewportSize({ width: 320, height: 800 });
		const narrow = await measure();
		// Mais estreito, o mesmo texto ocupa mais altura (quebrou linha) e não gera rolagem horizontal.
		expect(narrow.height).toBeGreaterThan(wide.height);
		expect(narrow.fits).toBe(true);
		await expect(texts(page).last()).toBeVisible();
	});
});

test.describe('AdsLoadingText em RTL', () => {
	test('o brilho inverte o sentido em RTL sem alterar o layout', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
		await openDemo(page);
		const state = () =>
			texts(page).evaluateAll((elements) =>
				elements.map((element) => {
					const { width, height } = element.getBoundingClientRect();
					return { direction: getComputedStyle(element).animationDirection, width, height };
				}),
			);
		const ltr = await state();
		expect(ltr.map((item) => item.direction)).toEqual(['normal', 'normal', 'normal', 'normal']);
		await page.evaluate(() => {
			document.documentElement.dir = 'rtl';
			// O build do Next converte :dir(rtl) em :lang(ar, he, ...) para navegadores antigos; vale para os dois.
			document.documentElement.lang = 'ar';
		});
		const rtl = await state();
		expect(rtl.map((item) => item.direction)).toEqual(['reverse', 'reverse', 'reverse', 'reverse']);
		expect(await shimmerAnimations(page)).toBe(4);
		const sizes = rtl.map(({ width, height }) => ({ width, height }));
		await page.getByRole('button', { name: 'Concluir atualização' }).click();
		await expect(texts(page).first()).not.toHaveAttribute('data-loading', /.*/);
		expect((await state()).map(({ width, height }) => ({ width, height }))).toEqual(sizes);
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
