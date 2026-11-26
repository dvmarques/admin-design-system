import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

const path = '/componentes/tabela-avancada';

test.beforeEach(async ({ page }) => {
	await page.goto(path);
	await waitForHydration(page.getByLabel('Virtualizar linhas'));
});

test('virtualiza 10 mil linhas, mantém o total para leitores de tela e rola', async ({ page }) => {
	const table = page.getByRole('table', { name: 'Pessoas' });
	await expect(table).toHaveAttribute('aria-rowcount', '10001');
	expect(await table.locator('tbody tr[aria-rowindex]').count()).toBeLessThan(30);
	const region = page.getByRole('region', { name: 'Pessoas' });
	await region.evaluate((node) => {
		node.scrollTop = 44 * 5000;
	});
	await expect(table.getByRole('cell', { name: 'Pessoa 5001', exact: true })).toBeVisible();
	await expect(table.getByRole('cell', { name: 'Pessoa 1', exact: true })).toHaveCount(0);
	const height = await region.evaluate((node) => node.clientHeight);
	expect(height).toBeLessThanOrEqual(361);
});

test('mantém o foco e a seleção ao rolar', async ({ page }) => {
	const table = page.getByRole('table', { name: 'Pessoas' });
	await page.getByRole('checkbox', { name: 'Selecionar Pessoa 2' }).press('Space');
	await expect(page.getByLabel('Seleção atual')).toHaveText('1 selecionadas');
	await page.getByRole('checkbox', { name: 'Selecionar Pessoa 3' }).focus();
	await page.getByRole('region', { name: 'Pessoas' }).evaluate((node) => {
		node.scrollTop = 44 * 5000;
	});
	await expect(page.getByRole('checkbox', { name: 'Selecionar Pessoa 3' })).toBeFocused();
	await page.getByRole('checkbox', { name: 'Selecionar Pessoa 5002' }).press('Space');
	await expect(page.getByLabel('Seleção atual')).toHaveText('2 selecionadas');
	await expect(table).toHaveAttribute('aria-rowcount', '10001');
});

test('redimensiona a coluna pelo teclado e pelo ponteiro', async ({ page }) => {
	const header = page.getByRole('columnheader', { name: /^Nome/ });
	const separator = page.getByRole('separator', { name: 'Redimensionar coluna Nome' });
	await separator.focus();
	const before = (await header.boundingBox())!.width;
	await page.keyboard.press('Shift+ArrowRight');
	await expect
		.poll(async () => Math.round((await header.boundingBox())!.width))
		.toBe(Math.round(before) + 50);
	await page.keyboard.press('Home');
	await expect.poll(async () => Math.round((await header.boundingBox())!.width)).toBe(96);
	const box = (await separator.boundingBox())!;
	const x = box.x + box.width - 2;
	const y = box.y + box.height / 2;
	await page.mouse.move(x, y);
	await page.mouse.down();
	await page.mouse.move(x + 80, y, { steps: 4 });
	await page.mouse.up();
	await expect.poll(async () => Math.round((await header.boundingBox())!.width)).toBe(176);
	await expect(separator).toHaveAttribute('aria-valuenow', '176');
	await separator.focus();
	await page.keyboard.press('Enter');
	await expect.poll(async () => (await header.boundingBox())!.width).toBeGreaterThan(96);
});

test('exporta as linhas selecionadas como CSV', async ({ page }) => {
	await page.getByRole('checkbox', { name: 'Selecionar Pessoa 2' }).press('Space');
	await page.getByRole('button', { name: 'Exportar' }).click();
	const csv = page.getByLabel('CSV gerado');
	await expect(csv).toContainText('Nome,E-mail,Perfil,Status');
	await expect(csv).toContainText('Pessoa 2,pessoa2@exemplo.com,Editor,Inativo');
	await expect(csv).not.toContainText('Pessoa 1,');
});

for (const theme of ['light', 'dark']) {
	test(`sem violações de acessibilidade no tema ${theme}`, async ({ page, context }) => {
		await context.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await page.goto(path);
		await waitForHydration(page.getByLabel('Virtualizar linhas'));
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		await expectNoAxeViolations(page);
	});
}

test('hidrata sem erros e sem rolagem horizontal da página', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	await page.setViewportSize({ width: 375, height: 800 });
	await page.goto(path);
	await waitForHydration(page.getByLabel('Virtualizar linhas'));
	expect(
		await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
	).toBeLessThanOrEqual(0);
	expect(errors).toEqual([]);
});

for (const theme of ['light', 'dark']) {
	test(`listras preservam o hover e permitem quebra no tema ${theme}`, async ({ page, context }) => {
		await context.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		await page.goto(path);
		await waitForHydration(page.getByLabel('Virtualizar linhas'));
		await page.getByLabel('Virtualizar linhas').uncheck();
		await page.getByLabel('Redimensionar colunas').uncheck();
		await page.getByLabel('Linhas listradas').check();
		const table = page.getByRole('table', { name: 'Pessoas' });
		const region = page.getByRole('region', { name: 'Pessoas' });
		const overflow = () => region.evaluate((node) => node.scrollWidth - node.clientWidth);
		await expect.poll(overflow).toBeGreaterThan(0);
		await page.getByLabel('Quebrar texto').check();
		await expect.poll(overflow).toBeLessThanOrEqual(1);
		const first = table.locator('tbody tr').nth(0);
		const second = table.locator('tbody tr').nth(1);
		const background = (row: typeof first) =>
			row.evaluate((element) => getComputedStyle(element).backgroundColor);
		await expect(table).toHaveAttribute('data-striped', '');
		await expect(table).toHaveAttribute('data-wrap', '');
		await expect(table).toHaveCSS('min-width', '0px');
		await page.getByLabel('Quebrar texto').hover();
		await expect(second).toHaveCSS(
			'background-color',
			theme === 'light' ? 'rgb(232, 238, 245)' : 'rgb(41, 53, 72)',
		);
		const stripe = await background(second);
		expect(stripe).not.toBe(await background(first));
		expect(stripe).not.toBe(await background(table.locator('thead')));
		await second.hover();
		await expect(second).toHaveCSS(
			'background-color',
			theme === 'light' ? 'rgb(248, 250, 252)' : 'rgb(61, 75, 96)',
		);
		await expect(second.getByRole('cell').nth(2)).toHaveCSS('overflow-wrap', 'anywhere');
		await expect(second.getByRole('cell').nth(2)).toHaveCSS('white-space', 'normal');
		await expectNoAxeViolations(page);
	});
}
