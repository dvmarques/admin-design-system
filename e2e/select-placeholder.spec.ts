import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, type Locator } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

// Os cenários de layout usam apenas o CSS distribuído, como uma aplicação consumidora sem Tailwind.
const css = ['@dvmarques/admin-ds-tokens/styles.css', '@dvmarques/admin-ds-components/styles.css']
	.map((path) => readFileSync(require.resolve(path), 'utf8'))
	.join('\n');

const longLabel =
	'Departamento de operações financeiras, controladoria e planejamento estratégico corporativo da região metropolitana';

test.describe('AdsSelect com placeholder no Admin Demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/catalogo/select');
		await waitForHydration(page.getByRole('combobox', { name: 'Status obrigatório' }));
	});

	const selected = (select: Locator) =>
		select.evaluate((element: HTMLSelectElement) => ({
			index: element.selectedIndex,
			label: element.selectedOptions[0]?.textContent,
			value: element.value,
			valid: element.checkValidity(),
			missing: element.validity.valueMissing,
		}));

	test('ausência é inválida com required e a opção real vazia é válida', async ({ page }) => {
		const status = page.getByRole('combobox', { name: 'Status obrigatório' });
		const team = page.getByRole('combobox', { name: 'Equipe (vazio válido)' });
		const submitted = page.getByLabel('Dados enviados');

		expect(await selected(status)).toMatchObject({ index: 0, label: 'Selecione…', missing: true });
		expect(await selected(team)).toMatchObject({ label: 'Sem equipe', value: '', valid: true });
		expect(await status.evaluate((element: HTMLSelectElement) => element.reportValidity())).toBe(
			false,
		);

		await page.getByRole('button', { name: 'Enviar' }).click();
		await expect(submitted).toHaveText('');

		await status.selectOption('a');
		await page.getByRole('button', { name: 'Enviar' }).click();
		await expect(submitted).toHaveText('[["status","a"],["team",""]]');
	});

	test('limpar restaura ausência e valor vazio inicial sem identificadores internos', async ({
		page,
	}) => {
		const status = page.getByRole('combobox', { name: 'Status obrigatório' });
		const team = page.getByRole('combobox', { name: 'Equipe (vazio válido)' });
		await status.selectOption('i');
		await team.selectOption('fin');
		await page.getByRole('button', { name: 'Limpar' }).click();
		expect(await selected(status)).toMatchObject({ index: 0, label: 'Selecione…', missing: true });
		expect(await selected(team)).toMatchObject({ label: 'Sem equipe', value: '', valid: true });
		const values = await status
			.locator('option')
			.evaluateAll((nodes) => nodes.map((node) => (node as HTMLOptionElement).value));
		expect(values).toEqual(['', 'a', 'i']);
	});

	test('valor controlado distingue ausência (null) de valor vazio real', async ({ page }) => {
		const select = page.getByRole('combobox', { name: 'Placeholder controlado' });
		const output = page.getByTestId('select-controlled-value');
		await expect(output).toHaveText('ausente');
		expect((await selected(select)).label).toBe('Selecione…');
		await select.selectOption({ label: 'Sem status (valor vazio)' });
		await expect(output).toHaveText('vazio');
		expect((await selected(select)).label).toBe('Sem status (valor vazio)');
		await select.selectOption('a');
		await expect(output).toHaveText('a');
	});

	test('não tem violações de acessibilidade', async ({ page }) => {
		await expectNoAxeViolations(page);
	});
});

async function renderMarkup(dir: 'ltr' | 'rtl' = 'ltr') {
	const { AdsField, AdsInput, AdsSelect, AdsTextarea } =
		await import('@dvmarques/admin-ds-components');
	const option = (value: string, label: string) => createElement('option', { value }, label);
	return renderToStaticMarkup(
		createElement(
			'div',
			{ dir, style: { display: 'grid', gap: '16px', padding: '16px' } },
			...(['sm', 'md', 'lg'] as const).map((size) =>
				createElement(
					'div',
					{ id: `cell-${size}`, key: size },
					createElement(
						AdsField,
						{ label: `Departamento ${size}`, description: 'Ajuda', validationState: 'default' },
						createElement(
							AdsSelect,
							{ defaultValue: 'long', size },
							option('long', longLabel),
							option('short', 'Curto'),
						),
					),
				),
			),
			createElement(
				'div',
				{ id: 'cell-placeholder' },
				createElement(
					AdsSelect,
					{ 'aria-label': 'Ausente', placeholder: 'Selecione…', required: true },
					option('a', 'Alfa'),
				),
			),
			createElement(
				'div',
				{ id: 'cell-filled' },
				createElement(
					AdsSelect,
					{ 'aria-label': 'Preenchido', placeholder: 'Selecione…', defaultValue: 'a' },
					option('a', 'Alfa'),
				),
			),
			createElement(
				'div',
				{ id: 'cell-multiple' },
				createElement(
					AdsSelect,
					{ 'aria-label': 'Múltiplo', multiple: true, placeholder: 'Selecione…' },
					option('a', 'Alfa'),
					option('b', 'Beta'),
				),
			),
			createElement(
				'div',
				{ id: 'cell-input' },
				createElement(AdsInput, { 'aria-label': 'Texto' }),
			),
			createElement(
				'div',
				{ id: 'cell-textarea' },
				createElement(AdsTextarea, { 'aria-label': 'Descrição' }),
			),
		),
	);
}

const html = (markup: string, dir: 'ltr' | 'rtl' = 'ltr') =>
	`<!doctype html><html dir="${dir}" data-theme="light"><head><style>${css}</style></head><body>${markup}</body></html>`;

for (const viewport of [
	{ name: 'desktop', width: 1280 },
	{ name: 'mobile 390px', width: 390 },
	// Zoom de 200% em 390px equivale a uma janela de 195 pixels CSS.
	{ name: 'zoom 200%', width: 195 },
]) {
	test(`texto longo fica contido e truncado antes da seta em ${viewport.name}`, async ({
		page,
	}) => {
		await page.setViewportSize({ width: viewport.width, height: 800 });
		await page.setContent(html(await renderMarkup()));

		for (const size of ['sm', 'md', 'lg']) {
			const select = page.locator(`#cell-${size} select`);
			const cell = await page.locator(`#cell-${size}`).boundingBox();
			const box = await select.boundingBox();
			expect(box && cell && box.x + box.width <= cell.x + cell.width + 0.5).toBe(true);
			const style = await select.evaluate((element) => {
				const computed = getComputedStyle(element);
				return {
					overflow: computed.overflowX,
					textOverflow: computed.textOverflow,
					whiteSpace: computed.whiteSpace,
					paddingEnd: parseFloat(computed.paddingRight),
				};
			});
			expect(style.overflow).toMatch(/^(hidden|clip)$/);
			expect(style).toMatchObject({ textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
			// O espaço da seta (2,25rem) é preservado, logo o texto não a invade.
			expect(style.paddingEnd).toBeGreaterThanOrEqual(36);
			expect(
				await select.evaluate((element: HTMLSelectElement) => element.selectedOptions[0].text),
			).toBe(longLabel);
		}
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
			.toBeLessThanOrEqual(0);
	});
}

test('RTL mantém o espaço da seta no lado inicial do texto', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 800 });
	await page.setContent(html(await renderMarkup('rtl'), 'rtl'));
	const padding = await page.locator('#cell-md select').evaluate((element) => {
		const computed = getComputedStyle(element);
		return { left: parseFloat(computed.paddingLeft), right: parseFloat(computed.paddingRight) };
	});
	expect(padding.left).toBeGreaterThanOrEqual(36);
	expect(padding.right).toBeLessThan(36);
	await expect
		.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
		.toBeLessThanOrEqual(0);
});

test('placeholder renderizado no servidor já é ausência e difere visualmente do valor', async ({
	page,
}) => {
	await page.setContent(html(await renderMarkup()));
	const placeholder = page.locator('#cell-placeholder select');
	const filled = page.locator('#cell-filled select');
	expect(
		await placeholder.evaluate((element: HTMLSelectElement) => ({
			label: element.selectedOptions[0].text,
			valid: element.checkValidity(),
		})),
	).toEqual({ label: 'Selecione…', valid: false });
	expect(
		await filled.evaluate((element: HTMLSelectElement) => element.selectedOptions[0].text),
	).toBe('Alfa');
	const color = (locator: typeof placeholder) =>
		locator.evaluate((element) => getComputedStyle(element).color);
	expect(await color(placeholder)).not.toBe(await color(filled));
});

test('estilos do select não alteram outros controles nem select múltiplo', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 800 });
	await page.setContent(html(await renderMarkup()));
	for (const selector of [
		'#cell-input input',
		'#cell-textarea textarea',
		'#cell-multiple select',
	]) {
		const style = await page.locator(selector).evaluate((element) => {
			const computed = getComputedStyle(element);
			return {
				overflow: computed.overflowX,
				textOverflow: computed.textOverflow,
				ws: computed.whiteSpace,
			};
		});
		expect(style.textOverflow, selector).toBe('clip');
	}
	expect(
		await page
			.locator('#cell-multiple select')
			.evaluate((element: HTMLSelectElement) => element.options.length),
	).toBe(2);
});

test('alto contraste mantém seta nativa e texto contido', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', 'WebKit não emula forced-colors via Playwright.');
	await page.emulateMedia({ forcedColors: 'active' });
	await page.setViewportSize({ width: 390, height: 800 });
	await page.setContent(html(await renderMarkup()));
	const style = await page.locator('#cell-md select').evaluate((element) => {
		const computed = getComputedStyle(element);
		return { backgroundImage: computed.backgroundImage, appearance: computed.appearance };
	});
	expect(style.backgroundImage).toBe('none');
	expect(style.appearance).toBe('auto');
	await expect
		.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
		.toBeLessThanOrEqual(0);
});
