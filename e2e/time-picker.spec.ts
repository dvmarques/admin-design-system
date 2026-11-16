import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

test('AdsTimePicker: catálogo com valor controlado, formato 12h e estados acessíveis', async ({
	page,
}) => {
	await page.goto('/catalogo/time-picker');
	await expect(page.getByRole('heading', { name: 'AdsTimePicker' })).toBeVisible();
	const hour = page.getByRole('combobox', { name: 'Horário controlado' });
	await hour.selectOption('16');
	await expect(page.getByText('Valor: 16:30')).toBeVisible();
	await page.getByRole('button', { name: 'Alternar 12h/24h' }).click();
	await expect(page.getByRole('combobox', { name: 'Período' })).toHaveValue('PM');
	await expect(page.getByRole('combobox', { name: 'Horário obrigatório' })).toHaveAttribute(
		'aria-invalid',
		'true',
	);
	await expect(page.getByRole('combobox', { name: 'Horário desabilitado' })).toBeDisabled();
	await expectNoAxeViolations(page);
});

test('AdsTimePicker funciona junto de data sem acoplamento', async ({ page }) => {
	await page.goto('/componentes/datas');
	await expect(page.getByRole('heading', { name: 'Seleção de datas e horários' })).toBeVisible();
	await page.getByRole('combobox', { name: 'Horário controlado' }).selectOption('16');
	await expect(page.getByText('Valor canônico: 16:30')).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'Data independente' })).toHaveValue('05/11/2026');
	await expectNoAxeViolations(page);
});

for (const theme of ['light', 'dark'] as const) {
	test('AdsTimePicker responde em 320px no tema ' + theme, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 720 });
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await page.goto('/componentes/datas');
		await expect(page.getByRole('combobox', { name: 'Horário controlado' })).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
			320,
		);
		await expectNoAxeViolations(page);
	});
}
