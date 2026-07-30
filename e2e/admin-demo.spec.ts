import { expect, test } from '@playwright/test';

test('consome os artefatos públicos, preserva o tema do servidor e alterna pelo teclado', async ({
	page,
}) => {
	const hydrationErrors: string[] = [];

	page.on('console', (message) => {
		if (message.type() === 'error' && /hydration/i.test(message.text())) {
			hydrationErrors.push(message.text());
		}
	});

	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'dark',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.goto('/');

	await expect(page.getByRole('heading', { name: 'Aplicação de referência' })).toBeVisible();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.getByText(/tokens estão disponíveis pela API pública/)).toBeVisible();

	const toggle = page.getByRole('button', { name: 'Usar tema claro' });
	await toggle.focus();
	await toggle.press('Enter');

	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	expect(hydrationErrors).toEqual([]);
});
