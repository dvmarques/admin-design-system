import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, type Page } from '@playwright/test';

// Apenas o CSS distribuído, como em uma aplicação consumidora sem Tailwind.
const css = ['@admin-ds/tokens/styles.css', '@admin-ds/components/styles.css']
	.map((path) => readFileSync(require.resolve(path), 'utf8'))
	.join('\n');

const sizes = ['sm', 'md', 'lg'] as const;
const labels = { short: 'Ok', long: 'Enviar relatório mensal consolidado' } as const;

// Os pacotes só exportam ESM; o import dinâmico funciona também com o carregador CJS do Playwright.
async function renderMarkup(isLoading: boolean) {
	const { AdsButton } = await import('@admin-ds/components');
	return renderToStaticMarkup(
		createElement(
			'div',
			{ style: { display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' } },
			...sizes.flatMap((size) =>
				Object.entries(labels).map(([key, label]) =>
					createElement(
						'div',
						{ key: `${size}-${key}`, id: `cell-${size}-${key}` },
						createElement(AdsButton, { size, isLoading }, label),
					),
				),
			),
		),
	);
}

async function measure(page: Page, selector: string) {
	return page.locator(selector).evaluate((cell) => {
		const button = cell.querySelector('button')!.getBoundingClientRect();
		// O texto do rótulo, independentemente do contêiner que o envolve.
		const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
		const range = document.createRange();
		range.selectNodeContents(walker.nextNode()!);
		const label = range.getBoundingClientRect();
		return { w: button.width, h: button.height, lx: label.x, ly: label.y, lw: label.width };
	});
}

for (const theme of ['light', 'dark'] as const) {
	test(`alternar isLoading preserva largura, altura e posição do rótulo no tema ${theme}`, async ({
		page,
	}) => {
		const document = (markup: string) =>
			`<!doctype html><html data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`;
		const cells = sizes.flatMap((size) => Object.keys(labels).map((key) => `#cell-${size}-${key}`));

		await page.setContent(document(await renderMarkup(false)));
		const before = new Map<string, Awaited<ReturnType<typeof measure>>>();
		for (const cell of cells) before.set(cell, await measure(page, cell));

		await page.setContent(document(await renderMarkup(true)));
		for (const cell of cells) {
			const after = await measure(page, cell);
			const initial = before.get(cell)!;
			expect(after.w, `${cell} largura`).toBeCloseTo(initial.w, 1);
			expect(after.h, `${cell} altura`).toBeCloseTo(initial.h, 1);
			expect(after.lx, `${cell} posição x do rótulo`).toBeCloseTo(initial.lx, 1);
			expect(after.ly, `${cell} posição y do rótulo`).toBeCloseTo(initial.ly, 1);
			expect(after.lw, `${cell} largura do rótulo`).toBeCloseTo(initial.lw, 1);
			// O indicador fica centralizado sobre o botão, sem ocupar espaço no fluxo.
			const indicator = await page.locator(`${cell} .ads-loading-indicator`).boundingBox();
			const button = await page.locator(`${cell} button`).boundingBox();
			expect(indicator!.x + indicator!.width / 2).toBeCloseTo(button!.x + button!.width / 2, 0);
			expect(indicator!.y + indicator!.height / 2).toBeCloseTo(button!.y + button!.height / 2, 0);
		}
	});
}
