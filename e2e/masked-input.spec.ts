import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

const fixed = (page: Page) => page.getByRole('textbox', { name: 'Código (máscara fixa)' });

async function openDemo(page: Page) {
	await page.goto('/catalogo/masked-input');
	await expect(page.getByRole('heading', { name: 'AdsMaskedInput', level: 1 })).toBeVisible();
	await waitForHydration(fixed(page));
}

const caret = (page: Page) =>
	fixed(page).evaluate((element) => (element as HTMLInputElement).selectionStart);

test('digitação, remoção e edição no meio preservam texto, caret e valores informados', async ({
	page,
}) => {
	await openDemo(page);
	const input = fixed(page);
	await input.click();
	await input.pressSequentially('12a3456');
	await expect(input).toHaveValue('123-456');
	await expect(page.getByText('Formatado: 123-456 · Bruto: 123456 · Completo: sim')).toBeVisible();

	await page.keyboard.press('Control+A');
	await page.keyboard.press('Backspace');
	await expect(input).toHaveValue('');
	await input.pressSequentially('12345');
	await expect(input).toHaveValue('123-45');
	await expect(page.getByText('Formatado: 123-45 · Bruto: 12345 · Completo: não')).toBeVisible();

	await page.keyboard.press('Home');
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('ArrowRight');
	await page.keyboard.type('9');
	await expect(input).toHaveValue('129-345');
	expect(await caret(page)).toBe(3);
	await page.keyboard.press('Backspace');
	await expect(input).toHaveValue('123-45');
	expect(await caret(page)).toBe(2);

	await page.keyboard.press('Control+A');
	await page.keyboard.type('98');
	await expect(input).toHaveValue('98');
	await expect(input).toBeFocused();
});

test('colagem inclui texto formatado ou com caracteres inelegíveis', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await openDemo(page);
	const input = fixed(page);
	await input.click();
	await page.evaluate(() => navigator.clipboard.writeText('a9b8c7-6x5 4 3 2'));
	await page.keyboard.press('Control+V');
	await expect(input).toHaveValue('987-654');
	await page.keyboard.press('Control+A');
	await page.keyboard.insertText('111222333');
	await expect(input).toHaveValue('111-222');
});

test('composição IME não perde caracteres e aplica a máscara ao confirmar', async ({ page }) => {
	await openDemo(page);
	const input = fixed(page);
	await input.focus();
	const session = await page.context().newCDPSession(page);
	await session.send('Input.imeSetComposition', { text: '1', selectionStart: 1, selectionEnd: 1 });
	await session.send('Input.imeSetComposition', { text: '12', selectionStart: 2, selectionEnd: 2 });
	await session.send('Input.imeSetComposition', {
		text: '12345',
		selectionStart: 5,
		selectionEnd: 5,
	});
	await session.send('Input.insertText', { text: '12345' });
	await expect(input).toHaveValue('123-45');
	await expect(input).toBeFocused();
	await page.keyboard.type('6');
	await expect(input).toHaveValue('123-456');
});

test('CPF, CNPJ e documento único (só formatam) informam bruto e completude', async ({ page }) => {
	await openDemo(page);
	const cpf = page.getByRole('textbox', { name: 'CPF (máscara fixa)' });
	await cpf.click();
	await cpf.pressSequentially('11122233344');
	await expect(cpf).toHaveValue('111.222.333-44');
	await expect(
		page.getByText('Formatado: 111.222.333-44 · Bruto: 11122233344 · Completo: sim'),
	).toBeVisible();
	const cnpj = page.getByRole('textbox', { name: 'CNPJ (máscara fixa)' });
	await cnpj.click();
	await cnpj.pressSequentially('11222333000144');
	await expect(cnpj).toHaveValue('11.222.333/0001-44');
	await expect(
		page.getByText('Formatado: 11.222.333/0001-44 · Bruto: 11222333000144 · Completo: sim'),
	).toBeVisible();
	const document = page.getByRole('textbox', { name: 'Documento (CPF ou CNPJ)' });
	await document.click();
	await document.pressSequentially('11122233344');
	await expect(document).toHaveValue('111.222.333-44');
	await expect(page.getByText('Bruto: 11122233344 · Completo: sim').last()).toBeVisible();
	await document.pressSequentially('555');
	await expect(document).toHaveValue('11.122.233/3445-55');
	await expect(document).toHaveAccessibleDescription(/00\.000\.000\/0000-00/);
});

test('máscara dinâmica e numérica informam valor bruto e tipado', async ({ page }) => {
	await openDemo(page);
	const phone = page.getByRole('textbox', { name: 'Telefone (máscara dinâmica)' });
	await phone.click();
	await phone.pressSequentially('1133334444');
	await expect(phone).toHaveValue('(11) 3333-4444');
	await phone.pressSequentially('5');
	await expect(phone).toHaveValue('(11) 33334-4445');
	await expect(page.getByText('Formatado: (11) 33334-4445 · Bruto: 11333344445')).toBeVisible();

	const amount = page.getByRole('textbox', { name: 'Quantia (máscara numérica)' });
	await amount.click();
	await amount.pressSequentially('1234,56');
	await expect(amount).toHaveValue('1.234,56');
	await expect(page.getByText('Número: 1234.56')).toBeVisible();

	const free = page.getByRole('textbox', { name: 'Observação (sem máscara)' });
	await free.click();
	await free.pressSequentially('Olá mundo');
	await expect(free).toHaveValue('Olá mundo');
	await expect(page.getByText('Bruto: Olá mundo')).toBeVisible();
});

test('campo controlado segue alterações externas e o não controlado formata o valor inicial', async ({
	page,
}) => {
	await openDemo(page);
	const controlled = page.getByRole('textbox', { name: 'Protocolo (controlado)' });
	await expect(controlled).toHaveValue('123-4');
	await page.getByRole('button', { name: 'Definir 987-654' }).click();
	await expect(controlled).toHaveValue('987-654');
	await page.getByRole('button', { name: 'Limpar protocolo' }).click();
	await expect(controlled).toHaveValue('');
	await controlled.click();
	await controlled.pressSequentially('12');
	await expect(controlled).toHaveValue('12');
	await expect(page.getByRole('textbox', { name: 'Referência (não controlado)' })).toHaveValue(
		'123-456',
	);
});

test('formulário valida a completude, envia o texto formatado e redefine', async ({ page }) => {
	await openDemo(page);
	const code = page.getByRole('textbox', { name: 'Código do formulário' });
	await code.click();
	await code.pressSequentially('123');
	await page.getByRole('button', { name: 'Enviar formulário' }).click();
	await expect(
		page.getByRole('alert').filter({ hasText: 'Preencha os seis dígitos.' }),
	).toBeVisible();
	await expect(code).toHaveAttribute('aria-invalid', 'true');
	await expect(code).toHaveAccessibleDescription(/Preencha os seis dígitos\./);
	await code.press('End');
	await code.pressSequentially('456');
	await page.getByRole('button', { name: 'Enviar formulário' }).click();
	await expect(page.getByText('Enviado o texto formatado: 123-456', { exact: true })).toBeVisible();
	await expect(code).not.toHaveAttribute('aria-invalid', 'true');
	await page.getByRole('button', { name: 'Redefinir formulário' }).click();
	await expect(code).toHaveValue('');
	await expect(page.getByText('Nada enviado.', { exact: true })).toBeVisible();
	await code.pressSequentially('12');
	await expect(code).toHaveValue('12');
});

test('estados desabilitado e somente leitura', async ({ page }) => {
	await openDemo(page);
	await expect(page.getByRole('textbox', { name: 'Desabilitado' })).toBeDisabled();
	const readonly = page.getByRole('textbox', { name: 'Somente leitura' });
	await expect(readonly).toHaveValue('123-456');
	await readonly.click();
	await page.keyboard.type('9');
	await expect(readonly).toHaveValue('123-456');
});

/** Abre o estado de erro do formulário de exemplo: envio incompleto, com foco no campo inválido. */
async function openErrorState(page: Page) {
	const code = page.getByRole('textbox', { name: 'Código do formulário' });
	await code.click();
	await code.pressSequentially('12');
	// Envio implícito pelo teclado: clicar no botão perderia o clique, pois o erro de blur desloca o layout.
	await code.press('Enter');
	await expect(code).toHaveAttribute('aria-invalid', 'true');
	await expect(code).toBeFocused();
	return code;
}

async function outlineOf(locator: Locator) {
	return locator.evaluate((element) => {
		const style = getComputedStyle(element);
		return {
			style: style.outlineStyle,
			width: style.outlineWidth,
			color: style.outlineColor,
		};
	});
}

for (const theme of ['light', 'dark'] as const) {
	test(`acessibilidade, foco visível e responsividade em ${theme}`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await openDemo(page);
		await page.getByLabel('Tema da demonstração').selectOption(theme);
		await fixed(page).focus();
		const outline = await outlineOf(fixed(page));
		expect(outline.style).not.toBe('none');
		expect(outline.width).not.toBe('0px');
		expect(outline.color).not.toBe('rgba(0, 0, 0, 0)');
		expect(outline.color).not.toBe('transparent');
		// A página já exibe os campos desabilitado e somente leitura; abrimos também o estado de erro.
		await expect(page.getByRole('textbox', { name: 'Desabilitado' })).toBeDisabled();
		await expect(page.getByRole('textbox', { name: 'Somente leitura' })).toHaveAttribute(
			'readonly',
		);
		const code = await openErrorState(page);
		const invalidOutline = await outlineOf(code);
		expect(invalidOutline.style).not.toBe('none');
		expect(invalidOutline.width).not.toBe('0px');
		expect(invalidOutline.color).not.toBe('rgba(0, 0, 0, 0)');
		await expectNoAxeViolations(page);
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
		).toBe(true);
		// Reflow a 320px (equivalente a 400% de zoom) também sem rolagem horizontal.
		await page.setViewportSize({ width: 320, height: 640 });
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
		).toBe(true);
	});
}

test('forced-colors mantém borda e foco visíveis, também no estado de erro', async ({ page }) => {
	await page.emulateMedia({ forcedColors: 'active' });
	await openDemo(page);
	const input = fixed(page);
	await input.focus();
	const read = (locator: Locator) =>
		locator.evaluate((element) => {
			const style = getComputedStyle(element);
			return { border: style.borderTopStyle, width: style.borderTopWidth };
		});
	for (const target of [input, await openErrorState(page)]) {
		await target.focus();
		const styles = await read(target);
		const outline = await outlineOf(target);
		expect(styles.border).not.toBe('none');
		expect(styles.width).not.toBe('0px');
		expect(outline.style).not.toBe('none');
		expect(outline.width).not.toBe('0px');
		expect(outline.color).not.toBe('rgba(0, 0, 0, 0)');
	}
});

test('consumidor sem Tailwind: só o CSS distribuído estiliza o campo como AdsInput', async ({
	page,
}) => {
	const css = ['@dvmarques/admin-ds-tokens/styles.css', '@dvmarques/admin-ds-components/styles.css']
		.map((path) => readFileSync(require.resolve(path), 'utf8'))
		.join('\n');
	const { AdsInput } = await import('@dvmarques/admin-ds-components');
	const { AdsMaskedInput } = await import('@dvmarques/admin-ds-components/masked-input');
	const markup = renderToStaticMarkup(
		createElement(
			'div',
			{ style: { display: 'grid', gap: '16px', padding: '16px', width: 320 } },
			createElement(AdsInput, { 'aria-label': 'Comum', defaultValue: '123-456' }),
			createElement(AdsMaskedInput, {
				'aria-label': 'Mascarado',
				defaultValue: '123-456',
				mask: '000-000',
			}),
		),
	);
	await page.setContent(
		`<!doctype html><html data-theme="light"><head><style>${css}</style></head><body>${markup}</body></html>`,
	);
	const read = (label: string) =>
		page.getByLabel(label).evaluate((element) => {
			const style = getComputedStyle(element);
			const box = element.getBoundingClientRect();
			return {
				height: box.height,
				width: box.width,
				border: style.borderTopColor,
				radius: style.borderTopLeftRadius,
				font: `${style.fontSize}/${style.fontFamily}`,
				padding: style.paddingLeft,
			};
		});
	expect(await read('Mascarado')).toEqual(await read('Comum'));
});
