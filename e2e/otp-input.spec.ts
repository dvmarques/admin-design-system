import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

async function openDemo(page: Page) {
	await page.goto('/catalogo/otp-input');
	await expect(page.getByRole('heading', { name: 'AdsOTPInput', level: 1 })).toBeVisible();
	await waitForHydration(page.getByRole('textbox', { name: 'Código de 6 dígitos' }));
}

test('digitação, colagem, setas e conclusão no catálogo OTP', async ({ page }) => {
	await openDemo(page);
	const input = page.getByRole('textbox', { name: 'Código de 6 dígitos' });
	await input.click();
	await input.pressSequentially('0012');
	await expect(input).toHaveValue('0012');
	await input.pressSequentially('34');
	await expect(input).toHaveValue('001234');
	await expect(page.getByText('6/6 dígitos. Código completo.', { exact: true })).toBeVisible();
	await page.keyboard.press('ArrowLeft');
	await page.keyboard.press('Backspace');
	await expect(input).toHaveValue('00124');
	await page.keyboard.press('Control+A');
	await page.keyboard.insertText('9x8-7 654');
	await expect(input).toHaveValue('987654');
});

test('estado controlado, erro, desabilitado e leitores de tela', async ({ page }) => {
	await openDemo(page);
	const four = page.getByRole('textbox', { name: 'PIN de 4 dígitos' });
	await page.getByRole('button', { name: 'Preencher PIN 0012' }).click();
	await expect(four).toHaveValue('0012');
	await page.getByRole('button', { name: 'Limpar PIN' }).click();
	await expect(four).toHaveValue('');
	const invalid = page.getByRole('textbox', { name: 'Código inválido' });
	await expect(invalid).toHaveAttribute('aria-invalid', 'true');
	await expect(invalid).toHaveAccessibleDescription(/Código incorreto/);
	await expect(page.getByRole('textbox', { name: 'Código desabilitado' })).toBeDisabled();
	await expectNoAxeViolations(page);
});

for (const theme of ['light', 'dark'] as const) {
	test(`OTP não transborda a largura móvel no tema ${theme}`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 720 });
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await openDemo(page);
		const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
		expect(overflow).toBeLessThanOrEqual(320);
		await expectNoAxeViolations(page);
	});
}
