import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

const samples = [
	{ slug: 'consulta', heading: 'Consulta administrativa', section: 'Registros' },
	{ slug: 'formulario', heading: 'Formulário administrativo', section: 'Identificação' },
	{ slug: 'dashboard', heading: 'Dashboard administrativo', section: 'Indicadores' },
] as const;

async function noDocumentOverflow(page: Page) {
	return page.evaluate(
		() => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
	);
}

for (const theme of ['light', 'dark'] as const) {
	test(`composições semânticas: ${theme}, H1, landmarks, responsividade e axe`, async ({
		page,
	}) => {
		test.setTimeout(120000);
		await page.context().addCookies([
			{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' },
		]);
		const hydrationErrors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && /hydration/i.test(message.text())) {
				hydrationErrors.push(message.text());
			}
		});
		for (const sample of samples) {
			await page.setViewportSize({ width: 1280, height: 800 });
			await page.goto(`/exemplos/composicao-semantica/${sample.slug}`);
			await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
			await expect(page.getByRole('main')).toHaveCount(1);
			await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
			await expect(
				page.getByRole('heading', { level: 1, name: sample.heading }),
			).toBeVisible();
			await expect(page.getByRole('heading', { level: 2, name: sample.section })).toBeVisible();
			await expect(page.locator('.ads-page-header')).toHaveCount(1);
			await expectNoAxeViolations(page);
			for (const width of [320, 390, 768, 1280]) {
				await page.setViewportSize({ width, height: 800 });
				expect(await noDocumentOverflow(page), `${sample.slug} em ${width}px, ${theme}`).toBe(
					true,
				);
			}
		}
		expect(hydrationErrors).toEqual([]);
	});
}

test('consulta filtra e limpa tabela sem card de página', async ({ page }) => {
	await page.goto('/exemplos/composicao-semantica/consulta');
	await expect(page.locator('.ads-card')).toHaveCount(0);
	await expect(page.getByRole('table', { name: 'Resultados da consulta' })).toBeVisible();
	const filter = page.getByRole('searchbox', { name: 'Filtrar clientes' });
	await waitForHydration(filter);
	await filter.fill('Ana');
	await expect(page.getByRole('status')).toHaveText('1 registro encontrado');
	await expect(page.getByRole('cell', { name: 'Ana Silva' })).toBeVisible();
	await expect(page.getByRole('cell', { name: 'Bruno Costa' })).toHaveCount(0);
	await page.getByRole('button', { name: 'Limpar filtro' }).focus();
	await expect(page.getByRole('button', { name: 'Limpar filtro' })).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('status')).toHaveText('3 registros encontrados');
});

test('formulário mantém heading H3 subordinado e valida pelo teclado', async ({ page }) => {
	await page.goto('/exemplos/composicao-semantica/formulario');
	const name = page.getByRole('textbox', { name: 'Nome' });
	await waitForHydration(name);
	await expect(page.getByRole('heading', { level: 3, name: 'Comunicações' })).toBeVisible();
	await expect(page.locator('.ads-card')).toHaveCount(0);
	const submit = page.getByRole('button', { name: 'Validar cadastro' });
	await submit.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByText('Informe o nome.')).toBeVisible();
	await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
	await name.fill('Ana Silva');
	await page.getByRole('textbox', { name: 'E-mail' }).fill('ana@exemplo.com');
	await submit.click();
	await expect(page.getByRole('status')).toHaveText('Cadastro válido (simulação).');
	await page.getByRole('button', { name: 'Limpar dados' }).click();
	await expect(page.getByRole('status')).toHaveText('Nenhum cadastro validado.');
});

test('dashboard usa cards apenas nas métricas e no resumo', async ({ page }) => {
	await page.goto('/exemplos/composicao-semantica/dashboard');
	await expect(page.getByRole('heading', { level: 2, name: 'Resumos' })).toBeVisible();
	await expect(page.getByRole('heading', { level: 3, name: 'Leitura operacional' })).toBeVisible();
	await expect(page.locator('.ads-page-header .ads-card')).toHaveCount(0);
	await expect(page.locator('.ads-metric-card')).toHaveCount(2);
	await expect(page.locator('.ads-card:not(.ads-metric-card)')).toHaveCount(1);
});
