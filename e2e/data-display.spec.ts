import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

async function hideDevelopmentPortal(page: Page) {
	await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
}

test('preserva semântica e acesso aos dados em viewport estreita', async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/data-display');

	await expect(
		page.getByRole('heading', {
			level: 1,
			name: 'Apresentação de dados administrativos',
		}),
	).toBeVisible();
	await expect(page.getByRole('table', { name: 'Clientes recentes', exact: true })).toBeVisible();
	await expect(page.getByRole('columnheader', { name: 'Cliente' })).toBeVisible();
	await expect(page.getByRole('cell', { name: 'Mariana Costa' })).toBeVisible();
	await expect(page.locator('.ads-table-container').first()).toHaveCSS('overflow-x', 'auto');
});

test('a tabela compacta usa menos espaçamento vertical que a confortável', async ({ page }) => {
	await page.goto('/data-display');

	const comfortable = page
		.getByRole('table', { name: 'Clientes recentes', exact: true })
		.getByRole('cell', { name: 'Mariana Costa' });
	const compact = page
		.getByRole('table', { name: 'Clientes recentes (compacta)' })
		.getByRole('cell', { name: 'Helena Prado' });
	await expect(page.getByRole('table', { name: 'Clientes recentes (compacta)' })).toHaveAttribute(
		'data-density',
		'compact',
	);
	const padding = (cell: typeof compact) =>
		cell.evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingTop));
	expect(await padding(compact)).toBeLessThan(await padding(comfortable));
});

test('expõe progresso e estado vazio sem semântica de erro implícita', async ({ page }) => {
	await page.goto('/data-display');

	await expect(page.getByRole('progressbar', { name: 'Importação' })).toHaveAttribute(
		'aria-valuenow',
		'65',
	);
	await expect(page.getByRole('progressbar', { name: 'Processando' })).not.toHaveAttribute(
		'aria-valuenow',
	);
	await expect(page.getByText('Nenhum resultado')).toBeVisible();
	await expect(page.locator('.ads-empty-state').getByRole('alert')).toHaveCount(0);
});

test('alterna visualmente o tema e permite voltar à visão geral pela sidebar', async ({ page }) => {
	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'light',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.goto('/data-display');

	const lightBackground = await page.locator('body').evaluate((element) => {
		return getComputedStyle(element).backgroundColor;
	});
	await page.getByRole('button', { name: 'Usar tema escuro' }).click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	const darkBackground = await page.locator('body').evaluate((element) => {
		return getComputedStyle(element).backgroundColor;
	});
	expect(darkBackground).not.toBe(lightBackground);
	await page
		.getByRole('navigation', { name: 'Navegação do demo' })
		.getByRole('link', { name: 'Visão geral' })
		.click();
	await expect(page).toHaveURL('/');
});

test('exibe os sparklines com alternativa textual', async ({ page }) => {
	await page.goto('/data-display');

	await expect(page.getByRole('heading', { level: 2, name: 'Sparkline' })).toBeVisible();
	await expect(
		page.getByRole('img', { name: /^Visitas por dia: 7 pontos, de 12 a 25/ }),
	).toBeVisible();
	await expect(
		page.getByRole('img', { name: /^Receita semanal: 4 pontos, de 8 \(S1\) a 15 \(S6\)/ }),
	).toBeVisible();
	await expect(page.getByRole('img', { name: 'Novo indicador: 1 ponto, valor 7.' })).toBeVisible();
	await expectNoAxeViolations(page);
});

test('mantém a apresentação de dados nos temas claro e escuro', async ({ page }) => {
	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'dark',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.goto('/data-display');
	await hideDevelopmentPortal(page);
	await expect(page).toHaveScreenshot('data-display-dark.png', { fullPage: true });

	await page.context().addCookies([
		{
			name: 'ads-theme',
			value: 'light',
			url: 'http://127.0.0.1:3000',
		},
	]);
	await page.reload();
	await hideDevelopmentPortal(page);
	await expect(page).toHaveScreenshot('data-display-light.png', { fullPage: true });
});
