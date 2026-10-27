import { readFileSync } from 'node:fs';
import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, type Page } from '@playwright/test';
import type * as AdsComponents from '@admin-ds/components';

// Apenas o CSS distribuído, como em uma aplicação consumidora sem Tailwind.
const css = ['@admin-ds/tokens/styles.css', '@admin-ds/components/styles.css']
	.map((path) => readFileSync(require.resolve(path), 'utf8'))
	.join('\n');

const sizes = ['sm', 'md', 'lg'] as const;
const long = 'Enviar relatório mensal consolidado';

type Components = typeof AdsComponents;
interface Case {
	name: string;
	/** Largura do contêiner; omitida, o botão usa a largura do conteúdo. */
	width?: number;
	style?: Record<string, string>;
	label: (c: Components) => ReactNode;
}
const cases: Case[] = [
	{ name: 'texto curto', label: () => 'Ok' },
	{ name: 'texto longo', label: () => long },
	{
		name: 'ícone e texto',
		label: (c) => [createElement(c.AdsIcon, { key: 'i', name: 'settings' }), 'Configurar'],
	},
	{
		name: 'somente ícone',
		label: (c) => createElement(c.AdsIcon, { name: 'settings', label: 'Configurar' }),
	},
	{ name: 'largura total', width: 320, style: { width: '100%' }, label: () => 'Salvar' },
	{ name: 'rótulo com quebra', width: 140, style: { maxWidth: '100%' }, label: () => long },
];

// Os pacotes só exportam ESM; o import dinâmico funciona também com o carregador CJS do Playwright.
async function renderMarkup(isLoading: boolean, dir: 'ltr' | 'rtl') {
	const components = await import('@admin-ds/components');
	return renderToStaticMarkup(
		createElement(
			'div',
			{ dir, style: { display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' } },
			...sizes.flatMap((size) =>
				cases.map((item, index) =>
					createElement(
						'div',
						{
							key: `${size}-${index}`,
							id: `cell-${size}-${index}`,
							style: item.width ? { width: `${item.width}px` } : undefined,
						},
						createElement(
							components.AdsButton,
							{ size, isLoading, style: item.style },
							item.label(components),
						),
					),
				),
			),
		),
	);
}

async function measure(page: Page, selector: string) {
	return page.locator(selector).evaluate((cell) => {
		const button = cell.querySelector('button')!.getBoundingClientRect();
		const label = cell.querySelector('button > span > span:first-child')!.getBoundingClientRect();
		return { w: button.width, h: button.height, lx: label.x, ly: label.y, lw: label.width };
	});
}

for (const dir of ['ltr', 'rtl'] as const) {
	for (const theme of ['light', 'dark'] as const) {
		test(`alternar isLoading preserva largura, altura e posição do rótulo em ${dir}, tema ${theme}`, async ({
			page,
		}) => {
			const document = (markup: string) =>
				`<!doctype html><html dir="${dir}" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`;
			const cells = sizes.flatMap((size) =>
				cases.map((item, i) => ({ id: `#cell-${size}-${i}`, item })),
			);

			await page.setContent(document(await renderMarkup(false, dir)));
			const before = new Map<string, Awaited<ReturnType<typeof measure>>>();
			for (const { id } of cells) before.set(id, await measure(page, id));

			await page.setContent(document(await renderMarkup(true, dir)));
			for (const { id, item } of cells) {
				const name = `${id} (${item.name})`;
				const after = await measure(page, id);
				const initial = before.get(id)!;
				expect(after.w, `${name} largura`).toBeCloseTo(initial.w, 1);
				expect(after.h, `${name} altura`).toBeCloseTo(initial.h, 1);
				expect(after.lx, `${name} posição x do rótulo`).toBeCloseTo(initial.lx, 1);
				expect(after.ly, `${name} posição y do rótulo`).toBeCloseTo(initial.ly, 1);
				expect(after.lw, `${name} largura do rótulo`).toBeCloseTo(initial.lw, 1);
				// O indicador fica centralizado sobre o rótulo, sem ocupar espaço no fluxo.
				const indicator = await page.locator(`${id} .ads-loading-indicator`).boundingBox();
				const content = await page.locator(`${id} button > span > span:first-child`).boundingBox();
				expect(indicator!.x + indicator!.width / 2, `${name} indicador x`).toBeCloseTo(
					content!.x + content!.width / 2,
					0,
				);
				expect(indicator!.y + indicator!.height / 2, `${name} indicador y`).toBeCloseTo(
					content!.y + content!.height / 2,
					0,
				);
			}
		});
	}
}

for (const position of ['absolute', 'fixed'] as const) {
	for (const isLoading of [false, true]) {
		test(`className do consumidor com ${position} não é sobrescrito (isLoading=${isLoading})`, async ({
			page,
		}) => {
			const { AdsButton } = await import('@admin-ds/components');
			const markup = renderToStaticMarkup(
				createElement(AdsButton, { className: `${position} right-2 top-2`, isLoading }, 'Fechar'),
			);
			await page.setContent(
				`<!doctype html><html data-theme="light"><head><style>${css}</style></head><body>${markup}</body></html>`,
			);
			await expect(page.getByRole('button', { name: 'Fechar' })).toHaveCSS('position', position);
		});
	}
}
