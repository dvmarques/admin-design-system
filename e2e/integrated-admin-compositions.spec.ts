import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

const base = '/exemplos/composicao-semantica';

async function noOverflow(page: Page) {
	return page.evaluate(
		() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
	);
}

for (const theme of ['light', 'dark'] as const) {
	test(`integração ADS: ${theme}, quatro cenários, axe, SSR/hidratação e reflow`, async ({
		page,
	}) => {
		test.setTimeout(120000);
		await page
			.context()
			.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		const hydrationErrors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && /hydration/i.test(message.text())) {
				hydrationErrors.push(message.text());
			}
		});
		for (const [path, heading] of [
			['/exemplos/integracao', 'Integração administrativa ADS'],
			[`${base}/consulta`, 'Consulta administrativa'],
			[`${base}/formulario`, 'Formulário administrativo'],
			[`${base}/dashboard`, 'Dashboard administrativo'],
		] as const) {
			await page.setViewportSize({ width: 1440, height: 900 });
			await page.goto(path);
			await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
			await expect(page.getByRole('main')).toHaveCount(1);
			await expect(page.getByRole('heading', { level: 1, name: heading })).toHaveCount(1);
			await expectNoAxeViolations(page);
			for (const width of [320, 390, 768, 1440]) {
				await page.setViewportSize({ width, height: 900 });
				expect(await noOverflow(page), `${path}, ${theme}, ${width}px`).toBe(true);
			}
		}
		expect(hydrationErrors).toEqual([]);
	});
}

test('índice integra shell, links, navegação por teclado e footer opt-in', async ({ page }) => {
	await page.goto('/exemplos/integracao');
	await expect(page.locator('.ads-admin-shell')).toHaveCount(1);
	await expect(page.locator('.ads-card')).toHaveCount(0);
	const nav = page.getByRole('navigation', { name: 'Cenários integrados' });
	await expect(nav.getByRole('link', { name: 'Abrir consulta' })).toBeVisible();
	await expect(nav.getByRole('link', { name: 'Abrir formulário' })).toBeVisible();
	await expect(nav.getByRole('link', { name: 'Abrir indicadores' })).toBeVisible();
	const link = nav.getByRole('link', { name: 'Abrir consulta' });
	await link.focus();
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/composicao-semantica\/consulta/);
	await expect(page.getByRole('contentinfo')).toHaveCount(1);
	await expect(
		page.getByRole('heading', { level: 1, name: 'Consulta administrativa' }),
	).toBeVisible();
});

test('consulta: paginação, filtro, ações, vazio, carregamento, erro e retry', async ({ page }) => {
	await page.goto(`${base}/consulta`);
	const filter = page.getByRole('searchbox', { name: 'Filtrar clientes' });
	await waitForHydration(filter);
	await expect(page.getByRole('status')).toHaveText('3 registros encontrados');
	const pagination = page.getByRole('navigation', { name: 'Paginação da consulta' });
	await pagination.getByRole('button', { name: 'Página 2', exact: true }).click();
	await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');
	await expect(page.getByRole('cell', { name: 'Carla Souza' })).toBeVisible();
	const detail = page.getByRole('button', { name: 'Detalhes do registro 103' });
	await detail.focus();
	await page.keyboard.press('Enter');
	await expect(detail).toBeFocused();
	const detailAlert = page.getByRole('alert').filter({ hasText: 'Carla Souza' });
	await expect(detailAlert).toBeVisible();
	await filter.fill('nome inexistente');
	await expect(page.getByText('Nenhum registro encontrado.')).toBeVisible();
	await expect(pagination).toHaveCount(0);
	await page.getByRole('button', { name: 'Simular carregamento' }).click();
	await expect(page.getByRole('status')).toHaveText('Carregando registros de demonstração.');
	await expect(page.getByRole('table', { name: 'Resultados da consulta' })).toHaveCount(0);
	await page.getByRole('button', { name: 'Simular erro' }).click();
	const errorAlert = page.getByRole('alert').filter({ hasText: 'Não foi possível carregar' });
	await expect(errorAlert).toBeVisible();
	await page.getByRole('button', { name: 'Tentar novamente' }).click();
	await expect(page.getByText('Nenhum registro encontrado.')).toBeVisible();
	await page.getByRole('button', { name: 'Limpar filtro' }).click();
	await expect(page.getByRole('status')).toHaveText('3 registros encontrados');
	await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');
});

test('formulário: headings, campo desabilitado, validação e sucesso sem backend', async ({
	page,
}) => {
	await page.goto(`${base}/formulario`);
	const name = page.getByRole('textbox', { name: 'Nome' });
	await waitForHydration(name);
	await expect(page.getByRole('textbox', { name: 'Código (somente leitura)' })).toBeDisabled();
	await expect(page.getByRole('heading', { level: 2, name: 'Identificação' })).toBeVisible();
	const submit = page.getByRole('button', { name: 'Validar cadastro' });
	await submit.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByText('Informe o nome.')).toBeVisible();
	await name.fill('Ana Silva');
	await page.getByRole('textbox', { name: 'E-mail' }).fill('ana@example.com');
	await submit.click();
	await expect(page.getByRole('status')).toHaveText('Cadastro válido (simulação).');
	await page.getByRole('button', { name: 'Limpar dados' }).click();
	await expect(page.getByRole('status')).toHaveText('Nenhum cadastro validado.');
});
