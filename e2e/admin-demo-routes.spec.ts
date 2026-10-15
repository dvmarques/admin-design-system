import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';

const routes = [
	{ path: '/', label: 'Visão geral' },
	{ path: '/clientes', label: 'Clientes' },
	{ path: '/componentes', label: 'Componentes' },
	{ path: '/data-display', label: 'Exibição de dados' },
] as const;

const themes = ['light', 'dark'] as const;

function mainNavigation(page: Page) {
	return page.getByRole('navigation', { name: 'Navegação do demo' });
}

async function useTheme(page: Page, theme: (typeof themes)[number]) {
	await page
		.context()
		.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
}

for (const route of routes) {
	test(`${route.path} tem um único shell, main e h1`, async ({ page }) => {
		const hydrationErrors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error' && /hydration/i.test(message.text())) {
				hydrationErrors.push(message.text());
			}
		});

		await page.goto(route.path);

		await expect(page.locator('.ads-admin-shell')).toHaveCount(1);
		await expect(page.getByRole('main')).toHaveCount(1);
		await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
		await expect(mainNavigation(page)).toHaveCount(1);
		expect(hydrationErrors).toEqual([]);
	});

	for (const theme of themes) {
		test(`${route.path} destaca o item atual da navegação no tema ${theme}`, async ({ page }) => {
			await useTheme(page, theme);
			await page.goto(route.path);

			const navigation = mainNavigation(page);
			const current = navigation.getByRole('link', { name: route.label });
			await expect(current).toHaveAttribute('aria-current', 'page');
			await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);

			const others = navigation.locator('a:not([aria-current="page"])');
			const backgroundOf = (locator: typeof current) =>
				locator.evaluate((element) => getComputedStyle(element).backgroundColor);
			const currentBackground = await backgroundOf(current);
			expect(await backgroundOf(others.first())).not.toBe(currentBackground);
		});
	}
}

test('fecha a navegação móvel ao trocar de rota e mantém o drawer aberto até lá', async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/');

	const trigger = page.getByRole('button', { name: 'Abrir navegação' });
	await trigger.click();
	const drawer = page.getByRole('dialog', { name: 'Navegação do demo' });
	await expect(drawer).toBeVisible();

	// Let any effect that runs right after mounting the drawer settle before asserting again.
	await page.evaluate(
		() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
	);
	await expect(drawer).toBeVisible();
	await expect(trigger).toHaveAttribute('aria-expanded', 'true');

	await drawer.getByRole('link', { name: 'Componentes' }).click();

	await expect(page).toHaveURL('/componentes');
	await expect(drawer).toBeHidden();
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
	await expect(
		page.getByRole('heading', { level: 1, name: 'Catálogo de componentes' }),
	).toBeVisible();
	await expect(trigger).toBeFocused();
});

test('mantém o tema e a sidebar recolhida ao navegar entre rotas sem recarregar', async ({
	page,
}) => {
	await useTheme(page, 'dark');
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/');
	await page.evaluate(() => {
		(window as unknown as { navigationMarker?: boolean }).navigationMarker = true;
	});

	await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
	const sidebar = page.locator('.ads-admin-shell-sidebar-desktop');
	await expect(sidebar).toHaveAttribute('data-collapsed', 'true');

	for (const route of routes.slice(1)) {
		await mainNavigation(page).getByRole('link', { name: route.label }).click();
		await expect(page).toHaveURL(route.path);
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		await expect(sidebar).toHaveAttribute('data-collapsed', 'true');
	}

	// Client-side navigation: a full page load would have discarded the marker.
	expect(
		await page.evaluate(
			() => (window as unknown as { navigationMarker?: boolean }).navigationMarker,
		),
	).toBe(true);
});

test('permite navegar pelo teclado com foco visível e ativar com Enter', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/');

	const link = mainNavigation(page).getByRole('link', { name: 'Componentes' });
	await link.focus();
	await expect(link).toBeFocused();
	await expect(link).toHaveCSS('outline-style', 'solid');
	await expect(link).toHaveCSS('outline-width', '2px');

	await link.press('Enter');
	await expect(page).toHaveURL('/componentes');
});

test('abre o catálogo pela navegação principal com os cenários de avaliação', async ({ page }) => {
	await page.goto('/');
	await mainNavigation(page).getByRole('link', { name: 'Componentes' }).click();

	await expect(page).toHaveURL('/componentes');
	await expect(page.getByLabel('Sincronizando dados')).toBeVisible();
	await expect(page.getByLabel('Erro', { exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Excluir registro' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Abrir diálogo' }).first()).toBeVisible();
});

test.describe('visão geral', () => {
	test('expõe indicadores, progresso e atividade com nomes acessíveis', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { level: 1, name: 'Visão geral' })).toBeVisible();
		for (const name of ['Indicadores', 'Progresso', 'Atividade recente']) {
			await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
		}
		for (const name of ['Clientes ativos', 'Pedidos no mês', 'Receita recorrente']) {
			await expect(page.getByRole('group', { name })).toBeVisible();
		}
		await expect(page.getByRole('progressbar', { name: 'Importação de clientes' })).toHaveAttribute(
			'aria-valuenow',
			'65',
		);
		await expect(page.getByRole('progressbar', { name: 'Meta mensal de receita' })).toHaveAttribute(
			'aria-valuenow',
			'92',
		);
		await expect(
			page.getByRole('list', { name: 'Atividade recente' }).getByRole('listitem'),
		).toHaveCount(4);
	});

	for (const theme of themes) {
		test(`não tem violações de acessibilidade no tema ${theme}`, async ({ page }) => {
			await useTheme(page, theme);
			await page.goto('/');

			await expectNoAxeViolations(page);
		});
	}
});

test.describe('clientes', () => {
	const pageCount = 5;

	function customersTable(page: Page) {
		return page.getByRole('table', { name: 'Clientes' });
	}

	function pageButton(page: Page, number: number) {
		return page.getByRole('button', { name: `Página ${number}`, exact: true });
	}

	test('lista os registros da página e navega pela paginação', async ({ page }) => {
		await page.goto('/clientes');

		await expect(page.getByRole('heading', { level: 1, name: 'Clientes' })).toBeVisible();
		await expect(customersTable(page).getByRole('row')).toHaveCount(6);
		await expect(customersTable(page).getByRole('cell', { name: 'Mariana Costa' })).toBeVisible();
		await expect(pageButton(page, 1)).toHaveAttribute('aria-current', 'page');

		await pageButton(page, 2).click();

		await expect(page).toHaveURL('/clientes?pagina=2');
		await expect(pageButton(page, 2)).toHaveAttribute('aria-current', 'page');
		await expect(customersTable(page).getByRole('cell', { name: 'Eduardo Pires' })).toBeVisible();
		await expect(customersTable(page).getByRole('cell', { name: 'Mariana Costa' })).toHaveCount(0);
	});

	for (const [value, expected] of [
		[undefined, 1],
		['abc', 1],
		['0', 1],
		['-3', 1],
		['1.7', 1],
		['3', 3],
		['999', pageCount],
	] as const) {
		test(`?pagina=${value ?? '(ausente)'} exibe a página ${expected}`, async ({ page }) => {
			await page.goto(value === undefined ? '/clientes' : `/clientes?pagina=${value}`);

			await expect(pageButton(page, expected)).toHaveAttribute('aria-current', 'page');
			await expect(customersTable(page).getByRole('row')).not.toHaveCount(0);
		});
	}

	test('estado vazio substitui a tabela e oferece a volta à lista', async ({ page }) => {
		await page.goto('/clientes?estado=vazio');

		await expect(page.getByRole('table')).toHaveCount(0);
		await expect(page.getByText('Nenhum cliente encontrado')).toBeVisible();
		await expect(page.getByText('Nenhum cliente corresponde à seleção atual.')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Ver todos os clientes' })).toHaveAttribute(
			'href',
			'/clientes',
		);
	});

	test('estado de erro é anunciado e oferece tentar novamente', async ({ page }) => {
		await page.goto('/clientes?estado=erro');

		await expect(
			page.getByRole('alert').filter({ hasText: 'Não foi possível carregar os clientes' }),
		).toBeVisible();
		await expect(page.getByRole('table')).toHaveCount(0);
		await expect(page.getByRole('link', { name: 'Tentar novamente' })).toHaveAttribute(
			'href',
			'/clientes',
		);
	});

	test('estado carregando preserva a estrutura sem valores dos registros', async ({ page }) => {
		await page.goto('/clientes?estado=carregando');

		await expect(page.locator('[aria-busy="true"]')).toHaveCount(1);
		await expect(customersTable(page)).toBeVisible();
		await expect(customersTable(page).getByRole('columnheader')).toHaveCount(6);
		await expect(page.getByRole('status', { name: 'Carregando clientes' })).toHaveCount(1);
		await expect(page.getByText('Mariana Costa')).toHaveCount(0);
		const cellTexts = await customersTable(page).locator('tbody td').allTextContents();
		expect(cellTexts).toHaveLength(30);
		expect(cellTexts.join('').trim()).toBe('');
	});

	test('?estado desconhecido exibe os dados normais', async ({ page }) => {
		await page.goto('/clientes?estado=desconhecido');

		await expect(customersTable(page).getByRole('cell', { name: 'Mariana Costa' })).toBeVisible();
	});

	test('a tabela rola dentro do contêiner em 375 px sem rolar a página', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/clientes');

		const overflow = await page.locator('.ads-table-container').evaluate((element) => ({
			content: element.scrollWidth,
			visible: element.clientWidth,
		}));
		expect(overflow.content).toBeGreaterThan(overflow.visible);
	});

	for (const query of ['', '?estado=vazio', '?estado=carregando', '?estado=erro']) {
		test(`a página não rola na horizontal em 375 px (${query || 'com dados'})`, async ({
			page,
		}) => {
			await page.setViewportSize({ width: 375, height: 812 });
			await page.goto(`/clientes${query}`);

			const horizontalOverflow = await page.evaluate(
				() => document.documentElement.scrollWidth > document.documentElement.clientWidth,
			);
			expect(horizontalOverflow).toBe(false);
		});

		for (const theme of themes) {
			test(`não tem violações de acessibilidade (${query || 'com dados'}, tema ${theme})`, async ({
				page,
			}) => {
				await useTheme(page, theme);
				await page.goto(`/clientes${query}`);

				await expectNoAxeViolations(page);
			});
		}
	}
});
