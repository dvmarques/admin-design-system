import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from '@playwright/test';

// A página usa apenas o CSS distribuído, sem o reset de `box-sizing` do admin demo, como uma
// aplicação consumidora que não define esse reset.
const css = ['@admin-ds/tokens/styles.css', '@admin-ds/components/styles.css']
	.map((path) => readFileSync(require.resolve(path), 'utf8'))
	.join('\n');

// Os pacotes só exportam ESM; o import dinâmico funciona também com o carregador CJS do Playwright.
async function renderMarkup() {
	const { AdsInput, AdsSelect, AdsTextarea } = await import('@admin-ds/components');
	return renderToStaticMarkup(
		createElement(
			'div',
			{ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px' } },
			createElement('div', { id: 'cell-text' }, createElement(AdsInput, { 'aria-label': 'Busca' })),
			createElement(
				'div',
				{ id: 'cell-select' },
				createElement(
					AdsSelect,
					{ 'aria-label': 'Status' },
					createElement('option', { value: 'all' }, 'Todos'),
				),
			),
			createElement(
				'div',
				{ id: 'cell-area', style: { gridColumn: '1 / -1' } },
				createElement(AdsTextarea, { 'aria-label': 'Descrição' }),
			),
		),
	);
}

for (const viewport of [
	{ name: 'desktop', width: 1280, height: 800 },
	{ name: 'mobile', width: 390, height: 844 },
]) {
	test(`controles de texto ficam dentro do contêiner em ${viewport.name}`, async ({ page }) => {
		const markup = await renderMarkup();
		await page.setViewportSize({ width: viewport.width, height: viewport.height });
		await page.setContent(
			`<!doctype html><html data-theme="light"><head><style>${css}</style></head><body>${markup}</body></html>`,
		);

		const box = async (selector: string) => {
			const rect = await page.locator(selector).boundingBox();
			if (!rect) throw new Error(`Elemento ausente: ${selector}`);
			return { left: rect.x, right: rect.x + rect.width };
		};
		const text = await box('#cell-text input');
		const textCell = await box('#cell-text');
		const select = await box('#cell-select select');
		const area = await box('#cell-area textarea');
		const areaCell = await box('#cell-area');

		expect(text.right).toBeLessThanOrEqual(textCell.right + 0.5);
		expect(area.right).toBeLessThanOrEqual(areaCell.right + 0.5);
		expect(text.right).toBeLessThanOrEqual(select.left + 0.5);
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
			.toBeLessThanOrEqual(0);
	});
}

async function renderDatePickerMarkup(size: 'sm' | 'md' | 'lg') {
	const { AdsDatePicker, AdsInput } = await import('@admin-ds/components');
	return renderToStaticMarkup(
		createElement(
			'div',
			{ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px' } },
			createElement(
				'div',
				{ id: 'cell-neighbour' },
				createElement(AdsInput, { 'aria-label': 'Busca', size }),
			),
			createElement('div', { id: 'cell-single' }, createElement(AdsDatePicker, { size })),
			createElement(
				'div',
				{ id: 'cell-range', style: { gridColumn: '1 / -1' } },
				createElement(AdsDatePicker, { mode: 'range', size }),
			),
		),
	);
}

for (const size of ['sm', 'md', 'lg'] as const) {
	for (const viewport of [
		{ name: 'desktop', width: 1280, height: 800 },
		{ name: 'mobile', width: 390, height: 844 },
	]) {
		test(`gatilho do calendário tem a altura do campo em ${size} no ${viewport.name}`, async ({
			page,
		}) => {
			const markup = await renderDatePickerMarkup(size);
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await page.setContent(
				`<!doctype html><html data-theme="light"><head><style>${css}</style></head><body>${markup}</body></html>`,
			);

			const box = async (selector: string) => {
				const rect = await page.locator(selector).first().boundingBox();
				if (!rect) throw new Error(`Elemento ausente: ${selector}`);
				return { top: rect.y, height: rect.height };
			};
			const neighbour = await box('#cell-neighbour input');
			const field = await box('#cell-single input');
			const trigger = await box('#cell-single button');
			const rangeField = await box('#cell-range input');
			const rangeTrigger = await box('#cell-range button');

			expect(trigger.height).toBeCloseTo(field.height, 0);
			expect(field.top).toBeCloseTo(neighbour.top, 0);
			expect(rangeTrigger.height).toBeCloseTo(rangeField.height, 0);
			expect(rangeTrigger.top).toBeCloseTo(rangeField.top, 0);
		});
	}
}
