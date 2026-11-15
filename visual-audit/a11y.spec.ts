import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { catalogEntries } from '../apps/admin-demo/app/catalogo/catalog-data';
import { applyDemoTheme } from './demo-theme';
import { measureVisualArea } from './measure-visual-area';

type Scenario = {
	id: string;
	name: string;
	state: string;
	theme: 'light' | 'dark';
	width: number;
	action: string;
	media?: 'reduced-motion' | 'forced-colors';
};
type ZoomMetrics = {
	innerWidth: number;
	devicePixelRatio: number;
	visualScale: number;
	outerWidth: number;
};
type Evidence = Scenario & {
	route: string;
	status: 'approved' | 'failed' | 'pending';
	humanReview: 'pending';
	screenshot: string | null;
	checks: string[];
	error: string | null;
	zoom: {
		method: string;
		requestedPercent: number | null;
		verified: boolean;
		measuredPercent: number | null;
		before?: ZoomMetrics;
		after?: ZoomMetrics;
	} | null;
};

const root = resolve(process.cwd());
const output = join(root, 'visual-audit-results');
const scenarios = (
	JSON.parse(readFileSync(join(root, 'visual-audit/a11y-scenarios.json'), 'utf8')) as {
		scenarios: Scenario[];
	}
).scenarios;

async function focusPaint(locator: Locator) {
	return locator.evaluate((node) => {
		const snapshots: string[] = [];
		for (
			let target: Element | null = node, depth = 0;
			target && depth < 3;
			target = target.parentElement, depth++
		) {
			for (const pseudo of [null, '::before', '::after']) {
				const css = getComputedStyle(target, pseudo);
				snapshots.push(
					[
						css.outlineStyle,
						css.outlineWidth,
						css.outlineColor,
						css.outlineOffset,
						css.boxShadow,
						css.borderTopColor,
						css.borderTopWidth,
						css.backgroundColor,
						css.textDecorationLine,
					].join('|'),
				);
			}
		}
		return snapshots.join(';');
	});
}

async function verifyVisibleKeyboardFocus(locator: Locator, before: string, checks: string[]) {
	await expect(locator).toBeFocused();
	await expect.poll(() => locator.evaluate((node) => node.matches(':focus-visible'))).toBe(true);
	const after = await focusPaint(locator);
	expect(
		after,
		'foco visível precisa mudar propriedade de pintura, não apenas activeElement',
	).not.toBe(before);
	const geometry = await locator.evaluate((node) => {
		const r = node.getBoundingClientRect();
		const middle = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		const hit = node.ownerDocument.elementFromPoint(middle.x, middle.y);
		return {
			inViewport:
				r.width > 1 &&
				r.height > 1 &&
				r.left >= -2 &&
				r.right <= window.innerWidth + 2 &&
				r.top >= -2 &&
				r.bottom <= window.innerHeight + 2,
			uncovered: hit != null && (hit === node || node.contains(hit)),
		};
	});
	expect(geometry.inViewport, 'controle focado fora da viewport').toBe(true);
	expect(geometry.uncovered, 'controle focado obstruído no ponto central').toBe(true);
	checks.push('keyboard-focus-visible-paint-delta', 'focused-control-in-viewport-and-uncovered');
}

async function assertDocumentReflow(preview: Locator, checks: string[]) {
	const metrics = await preview.evaluate(measureVisualArea, 'viewport');
	expect(metrics.documentOverflowPx, 'rolagem horizontal no documento').toBeLessThanOrEqual(2);
	checks.push('document-horizontal-overflow<=2px');
	if (
		metrics.previewOverflowPx > 2 ||
		metrics.controlsOutOfBounds > 0 ||
		metrics.controlsWithOverflow > 0
	) {
		checks.push('preview-geometry-requires-human-review');
	}
}

async function assertPanelBounds(panel: Locator, checks: string[]) {
	const rect = await panel.evaluate((node) => {
		const r = node.getBoundingClientRect();
		return {
			left: r.left,
			right: r.right,
			top: r.top,
			bottom: r.bottom,
			width: window.innerWidth,
			height: window.innerHeight,
		};
	});
	expect(rect.left).toBeGreaterThanOrEqual(-2);
	expect(rect.right).toBeLessThanOrEqual(rect.width + 2);
	expect(rect.top).toBeGreaterThanOrEqual(-2);
	expect(rect.bottom).toBeLessThanOrEqual(rect.height + 2);
	checks.push('overlay-panel-within-viewport');
}

async function keyboardAction(page: Page, preview: Locator, scenario: Scenario, checks: string[]) {
	switch (scenario.action) {
		case 'tab-order':
		case 'reverse-tab': {
			const primary = preview.getByRole('button', { name: 'primary', exact: true });
			const secondary = preview.getByRole('button', { name: 'secondary', exact: true });
			const primaryBefore = await focusPaint(primary);
			const secondaryBefore = await focusPaint(secondary);
			await primary.focus();
			await page.keyboard.press('Tab');
			await verifyVisibleKeyboardFocus(secondary, secondaryBefore, checks);
			await page.keyboard.press('Shift+Tab');
			await verifyVisibleKeyboardFocus(primary, primaryBefore, checks);
			checks.push('Tab-and-Shift+Tab-logical-order');
			break;
		}
		case 'input-type': {
			const field = preview.getByRole('textbox', { name: 'Tamanho md' });
			const before = await focusPaint(field);
			await field.focus();
			await page.keyboard.press('Shift+Tab');
			await page.keyboard.press('Tab');
			await verifyVisibleKeyboardFocus(field, before, checks);
			await page.keyboard.type('audit');
			await expect(field).toHaveValue('audit');
			checks.push('form-input-typed-via-real-keyboard');
			break;
		}
		case 'select-arrows': {
			const select = preview.getByRole('combobox', { name: 'Tamanho md' });
			const before = await focusPaint(select);
			await select.focus();
			await page.keyboard.press('Shift+Tab');
			await page.keyboard.press('Tab');
			await verifyVisibleKeyboardFocus(select, before, checks);
			await page.keyboard.press('ArrowDown');
			await expect(select).toHaveValue('a');
			checks.push('native-select-changed-via-ArrowDown');
			break;
		}
		case 'checkbox-space': {
			const checkbox = preview.getByRole('checkbox', { name: 'sm', exact: true });
			const indicator = checkbox.locator('xpath=following-sibling::span[1]');
			const before = await focusPaint(indicator);
			await checkbox.focus();
			await page.keyboard.press('Shift+Tab');
			await page.keyboard.press('Tab');
			await expect(checkbox).toBeFocused();
			await expect
				.poll(() => checkbox.evaluate((node) => node.matches(':focus-visible')))
				.toBe(true);
			expect(await focusPaint(indicator), 'indicador visível associado ao input sr-only').not.toBe(
				before,
			);
			await page.keyboard.press('Space');
			await expect(checkbox).toBeChecked();
			checks.push('checkbox-focus-indicator-and-Space-activation');
			break;
		}
		case 'table-select-space': {
			const checkbox = preview.getByRole('checkbox', { name: 'Selecionar Ana' });
			await checkbox.focus();
			await page.keyboard.press('Shift+Tab');
			await page.keyboard.press('Tab');
			await expect(checkbox).toBeFocused();
			await page.keyboard.press('Space');
			await expect(checkbox).toBeChecked();
			await expect(preview.getByRole('status', { name: 'Seleção atual' })).toContainText('1');
			checks.push('smart-table-row-selected-by-Space');
			break;
		}
		case 'tab-arrows': {
			const first = preview.getByRole('tab', { name: 'Resumo', exact: true });
			const next = preview.getByRole('tab', { name: 'Histórico', exact: true });
			const before = await focusPaint(next);
			await first.focus();
			await page.keyboard.press('ArrowRight');
			await verifyVisibleKeyboardFocus(next, before, checks);
			await page.keyboard.press('Enter');
			await expect(next).toHaveAttribute('aria-selected', 'true');
			checks.push('ArrowRight-and-Enter-select-tab');
			break;
		}
		case 'dialog':
		case 'drawer':
		case 'reflow-dialog': {
			const kind = scenario.action === 'drawer' ? 'Drawer' : 'Dialog';
			const trigger = preview.getByRole('button', { name: 'Abrir ' + kind });
			await trigger.focus();
			await page.keyboard.press('Enter');
			const dialog = page.getByRole('dialog', { name: 'Exemplo de ' + kind });
			await expect(dialog).toBeVisible();
			await expect.poll(() => dialog.locator(':focus').count()).toBeGreaterThan(0);
			await assertPanelBounds(dialog, checks);
			// Modal: Tab e Shift+Tab não podem abandonar o painel.
			for (const key of ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab']) {
				await page.keyboard.press(key);
				expect(
					await dialog.evaluate((node) => node.contains(node.ownerDocument.activeElement)),
					'foco saiu do modal com ' + key,
				).toBe(true);
			}
			checks.push('modal-initial-focus-and-Tab-containment');
			await page.keyboard.press('Escape');
			await expect(dialog).not.toBeVisible();
			await expect(trigger).toBeFocused();
			checks.push('Escape-closes-and-restores-trigger-focus');
			break;
		}
		case 'dropdown': {
			const trigger = preview.getByRole('button', { name: 'Abrir ações' });
			await trigger.focus();
			await page.keyboard.press('ArrowDown');
			const first = page.getByRole('menuitem', { name: 'Exportar' });
			await expect(first).toBeFocused();
			await expect.poll(() => first.evaluate((node) => node.matches(':focus-visible'))).toBe(true);
			const visibleOutline = await first.evaluate((node) => {
				const css = getComputedStyle(node);
				return css.outlineStyle !== 'none' && Number.parseFloat(css.outlineWidth) > 0;
			});
			expect(visibleOutline, 'menuitem precisa exibir indicador visual de foco').toBe(true);
			const disabled = page.getByRole('menuitem', { name: 'Indisponível' });
			await expect(disabled).toHaveAttribute('aria-disabled', 'true');
			await page.keyboard.press('ArrowDown');
			await expect(first).toBeFocused();
			checks.push('dropdown-ArrowDown-skips-disabled-items-and-visible-outline');
			await page.keyboard.press('Escape');
			await expect(first).not.toBeVisible();
			await expect(trigger).toBeFocused();
			checks.push('dropdown-Escape-focus-return');
			break;
		}
		case 'popover': {
			const trigger = preview.getByRole('button', { name: 'Abrir popover' });
			await trigger.focus();
			await page.keyboard.press('Enter');
			const action = page.getByRole('button', { name: 'Concluir' });
			await expect(action).toBeVisible();
			await page.keyboard.press('Escape');
			await expect(action).not.toBeVisible();
			await expect(trigger).toBeFocused();
			checks.push('popover-keyboard-open-Escape-and-return');
			break;
		}
		case 'shell': {
			const frame = preview.frameLocator('iframe[title="Shell administrativo independente"]');
			const trigger = frame.getByRole('button', { name: 'Abrir navegação' });
			await trigger.focus();
			await page.keyboard.press('Enter');
			const dialog = frame.getByRole('dialog');
			await expect(dialog).toBeVisible();
			await page.keyboard.press('Escape');
			await expect(dialog).not.toBeVisible();
			await expect(trigger).toBeFocused();
			checks.push('iframe-shell-mobile-keyboard-open-Escape-focus-return');
			break;
		}
		case 'focus-preference': {
			const primary = preview.getByRole('button', { name: 'primary', exact: true });
			const secondary = preview.getByRole('button', { name: 'secondary', exact: true });
			const before = await focusPaint(secondary);
			await primary.focus();
			await page.keyboard.press('Tab');
			await verifyVisibleKeyboardFocus(secondary, before, checks);
			break;
		}
		case 'reflow': {
			await expect(preview.getByRole('table').first()).toBeVisible();
			checks.push('data-table-remains-visible-in-narrow-viewport');
			break;
		}
		default:
			throw new Error('Ação de auditoria não suportada: ' + scenario.action);
	}
}

function metrics(page: Page): Promise<ZoomMetrics> {
	return page.evaluate(() => ({
		innerWidth: window.innerWidth,
		devicePixelRatio: window.devicePixelRatio,
		visualScale: window.visualViewport?.scale ?? 1,
		outerWidth: window.outerWidth,
	}));
}

function nativeZoomProven(before: ZoomMetrics, after: ZoomMetrics) {
	const layoutRatio = before.innerWidth / after.innerWidth;
	const dprRatio = after.devicePixelRatio / before.devicePixelRatio;
	return (
		layoutRatio >= 1.85 &&
		layoutRatio <= 2.15 &&
		dprRatio >= 1.85 &&
		dprRatio <= 2.15 &&
		Math.abs(after.visualScale - 1) <= 0.05
	);
}

async function probeNativeZoom(page: Page, evidence: Evidence) {
	const before = await metrics(page);
	let after = before;
	evidence.zoom = {
		method: 'chromium-browser-keyboard-accelerator-probe',
		requestedPercent: 200,
		verified: false,
		measuredPercent: null,
		before,
		after,
	};
	// Não usa transform, CSS zoom, alteração da viewport nem CDP pageScaleFactor.
	// Chromium headless pode ignorar o acelerador: nesse caso o status é pending.
	for (let index = 0; index < 8; index += 1) {
		await page.keyboard.press('Control+=');
		after = await metrics(page);
		if (nativeZoomProven(before, after)) break;
	}
	evidence.zoom.after = after;
	evidence.zoom.measuredPercent = Math.round((before.innerWidth / after.innerWidth) * 100);
	if (!nativeZoomProven(before, after)) {
		evidence.status = 'pending';
		evidence.checks.push('native-browser-zoom-unverified-not-counted-as-pass');
	} else {
		evidence.zoom.verified = true;
		evidence.checks.push('native-zoom-200-layout-viewport-and-DPR-confirmed');
		const image =
			'screenshots/a11y/' +
			evidence.id +
			'-native-200-' +
			evidence.theme +
			'-' +
			evidence.width +
			'.png';
		mkdirSync(join(output, 'screenshots/a11y'), { recursive: true });
		await page.screenshot({ path: join(output, image), animations: 'disabled', timeout: 20_000 });
		evidence.screenshot = image;
	}
	// Cada teste tem contexto isolado; a restauração também é verificada explicitamente.
	await page.keyboard.press('Control+0');
	const restored = await metrics(page);
	if (
		Math.abs(restored.innerWidth - before.innerWidth) > 2 ||
		Math.abs(restored.devicePixelRatio - before.devicePixelRatio) > 0.1
	) {
		throw new Error('Zoom do navegador não restaurado após cenário');
	}
	evidence.checks.push('zoom-restored-between-scenarios');
}

test.describe('fase 4 — teclado, foco e zoom', () => {
	test.describe.configure({ mode: 'default' });
	for (const scenario of scenarios) {
		test('acessibilidade visual / ' + scenario.id, async ({ page }) => {
			test.setTimeout(90_000);
			const entry = catalogEntries.find((candidate) => candidate.name === scenario.name);
			if (!entry) throw new Error('Export não encontrado no catálogo: ' + scenario.name);
			const evidence: Evidence = {
				...scenario,
				route: entry.href,
				status: 'approved',
				humanReview: 'pending',
				screenshot: null,
				checks: [],
				error: null,
				zoom: null,
			};
			try {
				await page.setViewportSize({ width: scenario.width, height: 900 });
				if (scenario.media === 'reduced-motion') {
					await page.emulateMedia({ reducedMotion: 'reduce' });
					expect(
						await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
					).toBe(true);
					evidence.checks.push('prefers-reduced-motion-confirmed');
				}
				if (scenario.media === 'forced-colors') {
					await page.emulateMedia({ forcedColors: 'active' });
					expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(
						true,
					);
					evidence.checks.push('forced-colors-confirmed');
				}
				const response = await page.goto(entry.href, { waitUntil: 'domcontentloaded' });
				if (!response?.ok()) throw new Error('HTTP ' + String(response?.status()));
				await expect(
					page.getByRole('heading', { name: entry.name, exact: true, level: 1 }),
				).toBeVisible();
				const preview = page.getByRole('region', { name: 'Demonstração interativa' });
				await applyDemoTheme(page, preview, scenario.theme);
				if (scenario.action === 'zoom-probe') {
					await probeNativeZoom(page, evidence);
				} else {
					if (scenario.state === 'reflow') {
						evidence.zoom = {
							method: 'viewport-reflow-alternative-not-native-zoom',
							requestedPercent: null,
							verified: false,
							measuredPercent: null,
						};
					}
					await keyboardAction(page, preview, scenario, evidence.checks);
					await assertDocumentReflow(preview, evidence.checks);
				}
				if (evidence.status === 'approved' && !evidence.screenshot) {
					await page.evaluate(() => document.fonts.ready);
					const image =
						'screenshots/a11y/' +
						scenario.id +
						'-' +
						scenario.theme +
						'-' +
						scenario.width +
						'.png';
					mkdirSync(join(output, 'screenshots/a11y'), { recursive: true });
					await page.screenshot({
						path: join(output, image),
						animations: 'disabled',
						timeout: 20_000,
					});
					evidence.screenshot = image;
				}
			} catch (error) {
				evidence.status = 'failed';
				evidence.error = error instanceof Error ? error.message : String(error);
			} finally {
				mkdirSync(join(output, 'a11y'), { recursive: true });
				writeFileSync(
					join(output, 'a11y', scenario.id + '.json'),
					JSON.stringify(evidence, null, 2) + '\n',
				);
			}
			expect(evidence.error, 'falha objetiva de ' + scenario.id).toBeNull();
		});
	}
});
