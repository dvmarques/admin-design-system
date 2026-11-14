import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { catalogEntries } from '../apps/admin-demo/app/catalogo/catalog-data';

type Theme = 'light' | 'dark';
type AuditSignal = { code: string; detail: string };
type AuditSample = {
	name: string;
	route: string;
	theme: Theme;
	width: number;
	state: 'default';
	screenshot: string | null;
	metrics: Record<string, number> | null;
	signals: AuditSignal[];
	error: string | null;
};

const output = resolve(process.cwd(), 'visual-audit-results');
const cases = [
	{ width: 390, height: 844 },
	{ width: 1440, height: 900 },
] as const;

// Cada combinação produz seu próprio manifesto, sem disputa de escrita entre workers.
for (const theme of ['light', 'dark'] as const) {
	for (const viewport of cases) {
		test('auditoria ' + theme + ' / ' + viewport.width + 'px', async ({ page }) => {
			test.setTimeout(600_000);
			await page.setViewportSize(viewport);
			const screenshotsDir = join(output, 'screenshots', theme + '-' + viewport.width);
			mkdirSync(screenshotsDir, { recursive: true });
			const samples: AuditSample[] = [];
			const browserErrors: string[] = [];
			page.on('pageerror', (error) => browserErrors.push(error.message));
			page.on('console', (message) => {
				if (message.type() === 'error') browserErrors.push(message.text());
			});

			for (const entry of catalogEntries) {
				browserErrors.length = 0;
				const sample: AuditSample = {
					name: entry.name,
					route: entry.href,
					theme,
					width: viewport.width,
					state: 'default',
					screenshot: null,
					metrics: null,
					signals: [],
					error: null,
				};
				try {
					const response = await page.goto(entry.href, { waitUntil: 'domcontentloaded' });
					if (!response?.ok())
						throw new Error('HTTP ' + String(response?.status() ?? 'sem resposta'));
					await expect(
						page.getByRole('heading', { name: entry.name, exact: true, level: 1 }),
					).toBeVisible({ timeout: 15000 });
					const preview = page.getByRole('region', { name: 'Demonstração interativa' });
					await expect(preview).toBeVisible();
					await page.getByLabel('Tema da demonstração').selectOption(theme);
					await expect(preview).toHaveAttribute('data-theme', theme);

					// Demos com iframe: aguarda cada documento interno antes de capturar e registra o tema aplicado.
					const frameCount = await preview.locator('iframe').count();
					const hasIframe = frameCount > 0;
					const frameThemes: string[] = [];
					let frameWaitError: string | null = null;
					for (let index = 0; index < frameCount; index += 1) {
						const inner = preview.frameLocator('iframe').nth(index);
						try {
							await expect(inner.locator('html[data-theme]')).toBeAttached({ timeout: 15000 });
							await expect(inner.locator('header, main').first()).toBeVisible({ timeout: 15000 });
							frameThemes.push(
								(await inner.locator('html').getAttribute('data-theme')) ?? 'indefinido',
							);
						} catch (error) {
							frameWaitError ??=
								'iframe ' +
								String(index + 1) +
								': ' +
								(error instanceof Error ? error.message.split('\n')[0] : String(error));
						}
					}
					await page.evaluate(() => document.fonts.ready);

					const image = 'screenshots/' + theme + '-' + viewport.width + '/' + entry.slug + '.png';
					await preview.screenshot({
						path: join(output, image),
						animations: 'disabled',
						timeout: 20000,
					});
					sample.screenshot = image;

					// Sinais geométricos: pistas para revisão, NÃO defeitos confirmados.
					// `boundary`: 'element' mede contra a região do exemplo; 'viewport' contra a janela do frame.
					const measure = (element: Element, boundary: string) => {
						const frame =
							boundary === 'element'
								? element.getBoundingClientRect()
								: { left: 0, right: window.innerWidth };
						const controls = [
							...element.querySelectorAll<HTMLElement>(
								'button, input, select, textarea, [role="button"], [role="combobox"]',
							),
						].filter((node) => {
							const style = getComputedStyle(node);
							const rect = node.getBoundingClientRect();
							return (
								style.display !== 'none' &&
								style.visibility !== 'hidden' &&
								rect.width > 0 &&
								rect.height > 0
							);
						});
						const outOfBounds = controls.filter((node) => {
							const rect = node.getBoundingClientRect();
							return rect.left < frame.left - 2 || rect.right > frame.right + 2;
						}).length;
						const clippedLabels = controls.filter((node) => {
							const style = getComputedStyle(node);
							return (
								// Ignora controles visualmente ocultos (ex.: input nativo `sr-only` de 1x1px).
								node.getBoundingClientRect().width > 2 &&
								node.getBoundingClientRect().height > 2 &&
								node.clientWidth > 0 &&
								node.scrollWidth > node.clientWidth + 2 &&
								style.overflowX !== 'auto' &&
								style.overflowX !== 'scroll'
							);
						}).length;
						return {
							documentOverflowPx:
								Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0) -
								window.innerWidth,
							previewOverflowPx: element.scrollWidth - element.clientWidth,
							controlsOutOfBounds: outOfBounds,
							controlsWithOverflow: clippedLabels,
						};
					};
					const addSignals = (m: ReturnType<typeof measure>, scope: string) => {
						const where = scope ? ' ' + scope : '';
						if (m.documentOverflowPx > 2) {
							sample.signals.push({
								code: 'viewport-overflow',
								detail:
									'Documento' + where + ' excede a viewport em ' + m.documentOverflowPx + 'px',
							});
						}
						if (m.previewOverflowPx > 2) {
							sample.signals.push({
								code: 'preview-overflow',
								detail:
									'Área do exemplo' +
									where +
									' apresenta ' +
									m.previewOverflowPx +
									'px de conteúdo horizontal extra; pode ser rolagem intencional',
							});
						}
						if (m.controlsOutOfBounds > 0) {
							sample.signals.push({
								code: 'control-bounds',
								detail:
									String(m.controlsOutOfBounds) +
									' controles' +
									where +
									' excedem as bordas do exemplo; validar layout/rolagem',
							});
						}
						if (m.controlsWithOverflow > 0) {
							sample.signals.push({
								code: 'control-text-overflow',
								detail:
									String(m.controlsWithOverflow) +
									' controles' +
									where +
									' têm scrollWidth acima de clientWidth; validar truncamento intencional',
							});
						}
					};
					const metrics: Record<string, number> = {};
					const parent = await preview.evaluate(measure, 'element');
					Object.assign(metrics, parent);
					addSignals(parent, '');
					if (hasIframe) {
						metrics.hasIframe = 1;
						metrics.frameCount = frameCount;
						metrics.frameAudited = 0;
						if (frameWaitError === null) {
							let outOfBounds = 0;
							let withOverflow = 0;
							let documentOverflow = 0;
							for (let index = 0; index < frameCount; index += 1) {
								const inner = await preview
									.frameLocator('iframe')
									.nth(index)
									.locator('body')
									.evaluate(measure, 'viewport');
								outOfBounds += inner.controlsOutOfBounds;
								withOverflow += inner.controlsWithOverflow;
								documentOverflow = Math.max(documentOverflow, inner.documentOverflowPx);
								addSignals(inner, '(dentro do iframe ' + String(index + 1) + ')');
							}
							metrics.frameAudited = 1;
							metrics.frameDocumentOverflowPx = documentOverflow;
							metrics.frameControlsOutOfBounds = outOfBounds;
							metrics.frameControlsWithOverflow = withOverflow;
							const divergent = frameThemes.filter((value) => value !== theme).length;
							if (divergent > 0) {
								sample.signals.push({
									code: 'iframe-theme-mismatch',
									detail:
										String(divergent) +
										' iframe(s) não aplicam o tema "' +
										theme +
										'" selecionado (tema interno: ' +
										frameThemes.join(', ') +
										'); validar se a demo deveria propagar o tema',
								});
							}
						} else {
							sample.signals.push({
								code: 'iframe-not-audited',
								detail:
									'Conteúdo do iframe não carregou a tempo; métricas internas ausentes: ' +
									frameWaitError.slice(0, 200),
							});
						}
					}
					sample.metrics = metrics;
				} catch (error) {
					sample.error = error instanceof Error ? error.message : String(error);
				}
				for (const message of browserErrors) {
					sample.signals.push({ code: 'browser-console', detail: message.slice(0, 300) });
				}
				samples.push(sample);
			}
			writeFileSync(
				join(output, theme + '-' + viewport.width + '.json'),
				JSON.stringify({ theme, width: viewport.width, samples }, null, 2) + '\n',
			);
			// Falhas de execução quebram a suíte; sinais de geometria exigem revisão humana.
			expect(
				samples.filter((sample) => sample.error),
				'rotas/capturas com falha',
			).toHaveLength(0);
		});
	}
}
