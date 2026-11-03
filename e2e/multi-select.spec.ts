import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

test('multi-select: busca, teclado, limite, chip e limpeza', async ({ page }) => {
	await page.goto('/catalogo/multi-select');
	const input = page.getByRole('combobox', { name: 'Áreas (controlado)' });
	await input.focus();
	await input.fill('front');
	await expect(page.getByRole('option', { name: 'Desenvolvimento frontend' })).toBeVisible();
	await input.press('ArrowDown');
	await input.press('Enter');
	await expect(page.getByLabel('Valores selecionados')).toHaveText('design, frontend');
	await page.getByRole('button', { name: 'Remover Design de produto' }).click();
	await expect(page.getByLabel('Valores selecionados')).toHaveText('frontend');
	await input.press('Escape');
	await expect(input).toHaveAttribute('aria-expanded', 'false');
	await expectNoAxeViolations(page);
});

test('multi-select: required e envio de valores reais sem consulta', async ({ page }) => {
	await page.goto('/catalogo/multi-select');
	const required = page.getByRole('combobox', { name: 'Áreas obrigatórias' });
	await page.getByRole('button', { name: 'Enviar valores' }).click();
	await expect(required).toBeFocused();
	await required.fill('produto');
	await page.getByRole('option', { name: 'Design de produto' }).click();
	await required.fill('frontend');
	await page.getByRole('option', { name: 'Desenvolvimento frontend' }).click();
	// A lista permanece aberta para multisseleção; feche antes de acionar o submit abaixo dela.
	await required.press('Escape');
	await expect(required).toHaveAttribute('aria-expanded', 'false');
	await page.getByRole('button', { name: 'Enviar valores' }).click();
	await expect(page.getByLabel('Dados enviados')).toHaveText('["design","frontend"]');
	await page.getByRole('button', { name: 'Reiniciar formulário' }).click();
	await expect(required).toHaveValue('');
	await expectNoAxeViolations(page);
});

for (const theme of ['light', 'dark'] as const) {
	test('multi-select renderiza em 390px e tema ' + theme, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/catalogo/multi-select');
		await page.getByLabel('Tema da demonstração').selectOption(theme);
		await page.getByRole('combobox', { name: 'Áreas (controlado)' }).focus();
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
		).toBe(true);
		await expectNoAxeViolations(page);
	});
}

// Zoom de 200% em 390px equivale a uma janela de 195 pixels CSS.
for (const viewport of [
	{ name: 'zoom 200%', width: 195 },
	{ name: 'mobile 320px', width: 320 },
]) {
	test('multi-select permanece contido e utilizável em ' + viewport.name, async ({ page }) => {
		await page.setViewportSize({ width: viewport.width, height: 800 });
		await page.goto('/catalogo/multi-select');
		const input = page.getByRole('combobox', { name: 'Áreas (controlado)' });
		await input.focus();
		await input.fill('desenvolvimento');
		const option = page.getByRole('option', { name: 'Desenvolvimento frontend' });
		await expect(option).toBeVisible();
		// A lista acompanha a largura do controle, sem ultrapassá-lo em janelas estreitas.
		const popupBox = await page.locator('.ads-multi-select__popup').boundingBox();
		const fieldBox = await page.locator('.ads-multi-select__control').first().boundingBox();
		expect(popupBox && fieldBox).toBeTruthy();
		expect(popupBox!.x).toBeGreaterThanOrEqual(fieldBox!.x - 0.5);
		expect(popupBox!.x + popupBox!.width).toBeLessThanOrEqual(fieldBox!.x + fieldBox!.width + 0.5);
		await option.click();
		const control = page.locator('.ads-multi-select__control').first();
		const controlBox = await control.boundingBox();
		// Chips não ultrapassam o controle, mesmo com rótulos longos em janela estreita.
		for (const chip of await page.locator('.ads-multi-select__chip').all()) {
			const chipBox = await chip.boundingBox();
			if (chipBox && controlBox) {
				expect(chipBox.x + chipBox.width).toBeLessThanOrEqual(
					controlBox.x + controlBox.width + 0.5,
				);
			}
		}
		await expect(input).toBeVisible();
		await expectNoAxeViolations(page);
	});
}

test('multi-select: lista sobrepõe o conteúdo seguinte e fecha por clique externo e Escape', async ({
	page,
}) => {
	await page.goto('/catalogo/multi-select');
	const required = page.getByRole('combobox', { name: 'Áreas obrigatórias' });
	await required.focus();
	await expect(required).toHaveAttribute('aria-expanded', 'true');
	const popup = page.locator('.ads-multi-select__popup');
	const option = page.getByRole('option', { name: 'Design de produto' });
	await expect(option).toBeVisible();
	// A lista cobre o conteúdo abaixo: o ponto central da opção pertence à própria lista.
	await option.scrollIntoViewIfNeeded();
	const box = await option.boundingBox();
	expect(box).not.toBeNull();
	const onTop = await page.evaluate(
		({ x, y }) => {
			const element = document.elementFromPoint(x, y);
			return !!element?.closest('.ads-multi-select__popup');
		},
		{ x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
	);
	expect(onTop).toBe(true);
	// A lista não desloca o layout: o botão seguinte mantém a posição ao abrir e fechar.
	const submit = page.getByRole('button', { name: 'Enviar valores' });
	const before = await submit.boundingBox();
	await required.press('Escape');
	await expect(popup).toHaveCount(0);
	await expect(required).toBeFocused();
	expect(await submit.boundingBox()).toEqual(before);
	// Reabre e fecha por clique fora do componente.
	await required.press('ArrowDown');
	await expect(popup).toBeVisible();
	await page.getByRole('heading', { level: 1 }).click();
	await expect(required).toHaveAttribute('aria-expanded', 'false');
	await expect(popup).toHaveCount(0);
	await expectNoAxeViolations(page);
});
