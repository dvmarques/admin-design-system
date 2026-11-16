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

test('organização: iframes acompanham o tema Sistema ao mudar prefers-color-scheme', async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/catalogo/organization-switcher');
	const area = preview(page);
	await page.getByLabel('Tema da demonstração').selectOption('system');
	const frames = [
		area.frameLocator('iframe[title="Shell com seletor de organização"]'),
		area.frameLocator('iframe[title="Shell sem seletor de organização"]'),
	];
	for (const scheme of ['dark', 'light'] as const) {
		await page.emulateMedia({ colorScheme: scheme });
		await expect(area).toHaveAttribute('data-theme', scheme);
		for (const frame of frames) {
			await expect(frame.locator('html')).toHaveAttribute('data-theme', scheme);
		}
	}
});

for (const width of [320, 390]) {
	test(`upload: ações mantêm separação e não sobrepõem em ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/catalogo/file-upload');
		const button = preview(page).getByRole('button', { name: 'Limpar dados' });
		const link = preview(page).getByRole('link', { name: 'Testar importação simulada' });
		const actions = button.locator('..');
		await expect(button).toBeVisible();
		await expect(link).toBeVisible();
		const gap = await actions.evaluate((node) => parseFloat(getComputedStyle(node).gap));
		expect(gap).toBeGreaterThanOrEqual(8);
		const a = await button.boundingBox();
		const b = await link.boundingBox();
		expect(a).not.toBeNull();
		expect(b).not.toBeNull();
		if (a && b) {
			const horizontalOverlap = a.x < b.x + b.width && a.x + a.width > b.x;
			const verticalOverlap = a.y < b.y + b.height && a.y + a.height > b.y;
			expect(horizontalOverlap && verticalOverlap).toBe(false);
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
		const overflow = await control.evaluate((node) => node.scrollWidth - node.clientWidth);
		expect(overflow).toBeGreaterThan(2);
	}
	expect(await clipped.evaluate((node) => getComputedStyle(node).overflowX)).toBe('hidden');
	expect(await visible.evaluate((node) => getComputedStyle(node).overflowX)).toBe('visible');
	const metrics = await page.locator('main').evaluate(measureVisualArea, 'element');
	expect(metrics.controlsWithOverflow).toBe(1);
});

test('auditor detecta conteúdo recortado por ancestral com overflow oculto', async ({ page }) => {
	await page.setContent(`
		<div style="width: 60px; overflow: hidden;">
			<button style="width: 40px; overflow: visible; white-space: nowrap;">
				Texto propositalmente longo
			</button>
		</div>
	`);
	const metrics = await page.locator('div').evaluate(measureVisualArea, 'element');
	expect(metrics.controlsWithOverflow).toBe(1);
});

test('shell: botão de recolher com ícone visível não é falso truncamento', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/catalogo/admin-shell');
	const frame = preview(page).frameLocator('iframe[title="Shell administrativo independente"]');
	const toggle = frame.getByRole('button', { name: 'Recolher barra lateral' });
	await expect(toggle).toBeVisible();
	const metrics = await frame.locator('body').evaluate(measureVisualArea, 'viewport');
	expect(metrics.controlsWithOverflow).toBe(0);
	expect(metrics.controlsOutOfBounds).toBe(0);
});

test('ThemeToggle: a demo renderiza o tema inicial antes de qualquer clique', async ({ page }) => {
	await page.goto('/catalogo/theme-toggle');
	const area = preview(page);
	await expect(area).toContainText('Tema do exemplo: light');
	await expect(area.locator('[data-theme="light"]').first()).toBeVisible();
});

for (const width of [390, 1440]) {
	test(`superfícies informativas não têm elevação por hover em ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/componentes');

		const audit = await page.evaluate(() => {
			const classes = ['demo-panel', 'demo-utility-panel'] as const;
			const counts = {
				'demo-panel': document.querySelectorAll('.demo-panel').length,
				'demo-utility-panel': document.querySelectorAll('.demo-utility-panel').length,
			};
			const matchedRules: Record<(typeof classes)[number], number> = {
				'demo-panel': 0,
				'demo-utility-panel': 0,
			};
			const hoverElevation: Record<(typeof classes)[number], string[]> = {
				'demo-panel': [],
				'demo-utility-panel': [],
			};
			const classPattern = {
				'demo-panel': /\.demo-panel(?![\w-])/,
				'demo-utility-panel': /\.demo-utility-panel(?![\w-])/,
			};

			const inspect = (rules: CSSRuleList) => {
				for (const rule of Array.from(rules)) {
					if (rule instanceof CSSStyleRule) {
						const selectors = rule.selectorText.split(',');
						for (const name of classes) {
							if (!classPattern[name].test(rule.selectorText)) continue;
							matchedRules[name]++;
							const targetsSurfaceOnHover = selectors.some((selector) => {
								const target = selector.trim().split(/[\s>+~]+/).at(-1) ?? '';
								return classPattern[name].test(target) && target.includes(':hover');
							});
							if (!targetsSurfaceOnHover) continue;
							const effects = ['transform', 'box-shadow', 'translate'].filter((property) =>
								rule.style.getPropertyValue(property) !== '',
							);
							if (effects.length > 0) {
								hoverElevation[name].push(`${rule.selectorText}: ${effects.join(', ')}`);
							}
						}
					}
					if ('cssRules' in rule) inspect((rule as CSSGroupingRule).cssRules);
				}
			};

			for (const sheet of Array.from(document.styleSheets)) {
				try {
					inspect(sheet.cssRules);
				} catch {
					// Folhas externas podem ser inacessíveis; CSS da demo é servido na mesma origem.
				}
			}
			return { counts, matchedRules, hoverElevation };
		});

		for (const name of ['demo-panel', 'demo-utility-panel'] as const) {
			expect(audit.counts[name], `Elementos .${name} ausentes`).toBeGreaterThan(0);
			expect(audit.matchedRules[name], `Regras CSS de .${name} ausentes`).toBeGreaterThan(0);
			expect(audit.hoverElevation[name], `Elevação de hover em .${name}`).toEqual([]);
		}
	});
}
