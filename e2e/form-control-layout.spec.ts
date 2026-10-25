import { readFileSync } from 'node:fs';
import { createElement, Fragment } from 'react';
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

async function renderSizesMarkup(size: 'sm' | 'md' | 'lg') {
	const { AdsInput, AdsSelect } = await import('@admin-ds/components');
	return renderToStaticMarkup(
		createElement(
			'div',
			{ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px' } },
			createElement(
				'div',
				{ id: 'cell-input' },
				createElement(AdsInput, { 'aria-label': 'Busca', size }),
			),
			createElement(
				'div',
				{ id: 'cell-select' },
				createElement(
					AdsSelect,
					{ 'aria-label': 'Status', size },
					createElement('option', { value: 'all' }, 'Todos'),
				),
			),
		),
	);
}

for (const size of ['sm', 'md', 'lg'] as const) {
	for (const viewport of [
		{ name: 'desktop', width: 1280, height: 800 },
		{ name: 'mobile', width: 390, height: 844 },
	]) {
		test(`input e select têm a mesma altura em ${size} no ${viewport.name}`, async ({ page }) => {
			const markup = await renderSizesMarkup(size);
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await page.setContent(
				`<!doctype html><html data-theme="light"><head><style>${css}</style></head><body>${markup}</body></html>`,
			);

			const box = async (selector: string) => {
				const rect = await page.locator(selector).boundingBox();
				if (!rect) throw new Error(`Elemento ausente: ${selector}`);
				return { top: rect.y, height: rect.height };
			};
			const input = await box('#cell-input input');
			const select = await box('#cell-select select');

			expect(select.height).toBeCloseTo(input.height, 0);
			expect(select.top).toBeCloseTo(input.top, 0);
		});
	}
}

async function renderInputGroupMarkup(size: 'sm' | 'md' | 'lg') {
	const { AdsButton, AdsInput, AdsInputGroup } = await import('@admin-ds/components');
	const group = (id: string, props: Record<string, unknown>) =>
		createElement(
			'div',
			{ id },
			createElement(
				AdsInputGroup,
				props,
				createElement(AdsInput, { 'aria-label': `Campo ${id}`, size }),
			),
		);
	// O botão é de um tamanho diferente do campo de propósito: a altura do grupo é a do campo.
	const button = (label: string, variant: 'primary' | 'secondary') =>
		createElement(AdsButton, { size: 'lg', type: 'button', variant }, label);
	return renderToStaticMarkup(
		createElement(
			'div',
			{ style: { display: 'grid', gap: '16px', padding: '16px' } },
			group('text', { endContent: 'BRL', startContent: 'R$' }),
			group('end', { endContent: button('Buscar', 'primary') }),
			group('start', { startContent: button('Filtros', 'secondary') }),
			group('multi', {
				endContent: [button('Limpar', 'secondary'), button('Buscar', 'primary')].map((node, key) =>
					createElement(Fragment, { key }, node),
				),
			}),
		),
	);
}

for (const size of ['sm', 'md', 'lg'] as const) {
	for (const viewport of [
		{ name: 'desktop', width: 1280, height: 800 },
		{ name: 'mobile', width: 390, height: 844 },
	]) {
		test(`botão no adendo do grupo tem a altura do campo em ${size} no ${viewport.name}`, async ({
			page,
		}) => {
			const markup = await renderInputGroupMarkup(size);
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await page.setContent(
				`<!doctype html><html data-theme="light"><head><style>${css}</style></head><body>${markup}</body></html>`,
			);

			const box = async (selector: string) => {
				const rect = await page.locator(selector).boundingBox();
				if (!rect) throw new Error(`Elemento ausente: ${selector}`);
				return { top: rect.y, height: rect.height };
			};
			const reference = await box('#text .ads-input-group');
			for (const id of ['end', 'start']) {
				const group = await box(`#${id} .ads-input-group`);
				const input = await box(`#${id} input`);
				const button = await box(`#${id} button`);
				expect(group.height).toBeCloseTo(reference.height, 0);
				expect(input.height).toBeCloseTo(reference.height, 0);
				expect(button.height).toBeCloseTo(reference.height, 0);
				expect(button.top).toBeCloseTo(input.top, 0);
			}

			// Vários botões no mesmo adendo: mesma altura e topo, contíguos (junção de 1px sobreposta).
			const first = await box('#multi button:nth-of-type(1)');
			const second = await box('#multi button:nth-of-type(2)');
			expect(first.height).toBeCloseTo(reference.height, 0);
			expect(second.height).toBeCloseTo(reference.height, 0);
			expect(first.top).toBeCloseTo(second.top, 0);
			const edge = async (selector: string) => {
				const rect = await page.locator(selector).boundingBox();
				if (!rect) throw new Error(`Elemento ausente: ${selector}`);
				return { left: rect.x, right: rect.x + rect.width };
			};
			const firstEdge = await edge('#multi button:nth-of-type(1)');
			const secondEdge = await edge('#multi button:nth-of-type(2)');
			expect(secondEdge.left).toBeCloseTo(firstEdge.right - 1, 0);

			// O hover não desloca o botão, que abriria uma fresta de 1px junto ao campo.
			const before = await box('#end button');
			await page.locator('#end button').hover();
			await expect.poll(async () => (await box('#end button')).top).toBeCloseTo(before.top, 0);
		});
	}
}

for (const theme of ['light', 'dark'] as const) {
	for (const width of [390, 1280]) {
		test(`mensagens ficam próximas aos campos sem reset em ${theme} a ${width}px`, async ({
			page,
		}) => {
			const { AdsField, AdsInput, AdsSelect, AdsTextarea, AdsFieldDescription, AdsFieldMessage } =
				await import('@admin-ds/components');
			const controls = [
				createElement(AdsInput),
				createElement(AdsTextarea),
				createElement(AdsSelect, {}, createElement('option', {}, 'Ativo')),
			];
			const help =
				'Orientação longa para preencher corretamente este campo em uma tela estreita sem perder a legibilidade.';
			const error =
				'Revise o valor informado antes de continuar e preencha todas as informações solicitadas neste campo.';
			const markup = renderToStaticMarkup(
				createElement(
					'main',
					{},
					...controls.map((children, index) =>
						createElement(AdsField, {
							key: index,
							label: `Campo ${index}`,
							description: help,
							error,
							validationState: 'error',
							children,
						}),
					),
					createElement(AdsField, {
						label: 'Somente erro',
						error,
						validationState: 'error',
						children: createElement(AdsInput),
					}),
					createElement(AdsField, {
						label: 'Somente ajuda',
						description: help,
						children: createElement(AdsInput),
					}),
					createElement(AdsFieldDescription, { children: help, id: 'manual-help' }),
					createElement(AdsFieldMessage, { children: error, id: 'manual-error' }),
				),
			);
			await page.setViewportSize({ width, height: 900 });
			await page.setContent(
				`<!doctype html><html data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`,
			);
			for (const field of await page.locator('.ads-field').all()) {
				const geometry = await field.evaluate((element) => {
					const children = [...element.children];
					return children.map((child, index) => ({
						gap: index
							? child.getBoundingClientRect().top -
								children[index - 1].getBoundingClientRect().bottom
							: 0,
						margin: getComputedStyle(child).margin,
					}));
				});
				expect(geometry[1].gap).toBeCloseTo(width < 768 ? 6 : 8, 1);
				for (const message of geometry.slice(2)) {
					expect(message.gap).toBeCloseTo(4, 1);
					expect(message.margin).toBe('0px');
				}
				const control = field.locator('input, textarea, select');
				await expect(control).toHaveAccessibleName(/\S/);
				await expect(control).toHaveAccessibleDescription(new RegExp('Orientação|Revise'));
				if (await field.getByRole('alert').count())
					await expect(control).toHaveAttribute('aria-invalid', 'true');
			}
			await expect(page.locator('#manual-help')).toHaveCSS('margin', '0px');
			await expect(page.locator('#manual-error')).toHaveCSS('margin', '0px');
			await expect
				.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
				.toBeLessThanOrEqual(0);
			await page
				.locator('html')
				.evaluate((element) => element.style.setProperty('--ads-spacing-1', '6px'));
			await expect(page.locator('.ads-field').first()).toHaveCSS('row-gap', '6px');
		});
	}
}
