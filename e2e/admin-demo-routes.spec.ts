import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { routes, themes, type Theme } from './routes';

function mainNavigation(page: Page) {
	return page.getByRole('navigation', { name: 'Navegação do demo' });
}

async function useTheme(page: Page, theme: Theme) {
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

test.describe('novo cliente', () => {
	const submitButton = (page: Page) => page.getByRole('button', { name: 'Cadastrar cliente' });

	test('valida os campos obrigatórios e leva o foco ao primeiro inválido', async ({ page }) => {
		await page.goto('/clientes/novo');
		await expect(page.getByRole('heading', { level: 1, name: 'Novo cliente' })).toBeVisible();

		await submitButton(page).click();

		await expect(page.getByLabel('Nome')).toBeFocused();
		await expect(page.getByLabel('Nome')).toHaveAttribute('aria-invalid', 'true');
		await expect(page.getByLabel('E-mail')).toHaveAttribute('aria-invalid', 'true');
		await expect(page.getByText('Informe o nome do cliente.')).toBeVisible();
		await expect(page.getByText('Informe o e-mail do cliente.')).toBeVisible();
	});

	test('conclui o cadastro com confirmação, sem mudar a URL nem enviar requisições', async ({
		page,
	}) => {
		await page.goto('/clientes/novo');
		await page.getByLabel('Nome').fill('Ana Souza');
		await page.getByLabel('E-mail').fill('ana.souza@exemplo.com.br');
		// The radio input is visually hidden; people click its label.
		await page.getByText('Trimestral', { exact: true }).click();
		await expect(page.getByRole('radio', { name: 'Trimestral' })).toBeChecked();

		const sent: string[] = [];
		page.on('request', (request) => {
			if (request.method() !== 'GET' || request.isNavigationRequest()) {
				sent.push(`${request.method()} ${request.url()}`);
			}
		});

		await submitButton(page).click();

		const confirmation = page
			.getByRole('status')
			.filter({ hasText: 'Cliente cadastrado com sucesso.' });
		await expect(confirmation).toBeVisible();
		await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
		await expect(page).toHaveURL('/clientes/novo');

		await page.getByRole('button', { name: 'Fechar notificação' }).click();
		await expect(confirmation).toBeHidden();
		expect(sent).toEqual([]);
	});

	async function expectDistinguishableControls(page: Page) {
		const nameField = page.getByLabel('Nome');
		await nameField.focus();
		const focusOutline = await nameField.evaluate((element) => {
			const style = getComputedStyle(element);
			return { style: style.outlineStyle, width: style.outlineWidth };
		});
		expect(focusOutline.style).not.toBe('none');
		expect(focusOutline.width).not.toBe('0px');

		const borderOf = (locator: ReturnType<Page['getByLabel']>) =>
			locator.evaluate((element) => getComputedStyle(element).borderTopColor);
		expect(await borderOf(nameField)).not.toBe(await borderOf(page.getByLabel('Status')));

		const indicatorBackground = (name: string) =>
			page
				.getByRole('radio', { name })
				.locator('xpath=following-sibling::span[1]')
				.evaluate((element) => getComputedStyle(element).backgroundColor);
		expect(await indicatorBackground('Mensal')).not.toBe(await indicatorBackground('Anual'));
	}

	for (const theme of themes) {
		test(`mantém erro, foco e seleção distinguíveis ao alternar o tema (a partir do ${theme})`, async ({
			page,
		}) => {
			await useTheme(page, theme);
			await page.goto('/clientes/novo');
			await submitButton(page).click();
			await expect(page.getByLabel('Nome')).toHaveAttribute('aria-invalid', 'true');

			await expectDistinguishableControls(page);
			await expectNoAxeViolations(page);

			const other = theme === 'light' ? 'dark' : 'light';
			await page
				.getByRole('button', { name: `Usar tema ${other === 'dark' ? 'escuro' : 'claro'}` })
				.click();
			await expect(page.locator('html')).toHaveAttribute('data-theme', other);
			await expect(page.getByLabel('Nome')).toHaveAttribute('aria-invalid', 'true');

			await expectDistinguishableControls(page);
			await expectNoAxeViolations(page);
		});
	}
});

test.describe('preferências', () => {
	const sidebar = (page: Page) => page.locator('.ads-admin-shell-sidebar-desktop');
	const sidebarSwitch = (page: Page) =>
		page.getByRole('checkbox', { name: 'Recolher a barra lateral' });

	test('recolhe e expande a sidebar pelas preferências e volta ao padrão ao recarregar', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/preferencias');
		await expect(page.getByRole('heading', { level: 1, name: 'Preferências' })).toBeVisible();
		await expect(sidebar(page)).toHaveAttribute('data-collapsed', 'false');

		await sidebarSwitch(page).check();
		await expect(sidebar(page)).toHaveAttribute('data-collapsed', 'true');

		await sidebarSwitch(page).uncheck();
		await expect(sidebar(page)).toHaveAttribute('data-collapsed', 'false');

		await sidebarSwitch(page).check();
		await expect(sidebar(page)).toHaveAttribute('data-collapsed', 'true');
		await page.reload();
		await expect(sidebar(page)).toHaveAttribute('data-collapsed', 'false');
		await expect(sidebarSwitch(page)).not.toBeChecked();
	});

	test('em 375 px o controle da sidebar fica desabilitado e informa o motivo', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/preferencias');

		await expect(sidebarSwitch(page)).toBeDisabled();
		await expect(page.getByText('Disponível apenas no layout desktop.')).toBeVisible();
		await expect(sidebarSwitch(page)).toHaveAccessibleDescription(
			'Disponível apenas no layout desktop.',
		);
	});

	test('o tema escolhido é restaurado pelo servidor na renderização seguinte', async ({ page }) => {
		await useTheme(page, 'light');
		await page.goto('/preferencias');

		await page.getByText('Escuro', { exact: true }).click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

		const html = await (await page.request.get('/preferencias')).text();
		expect(html).toMatch(/<html[^>]*data-theme="dark"/);
		expect(html).toMatch(
			/<input[^>]*type="radio"[^>]*value="dark"[^>]*checked|<input[^>]*checked[^>]*value="dark"/,
		);

		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
		await expect(page.getByRole('radio', { name: 'Escuro' })).toBeChecked();
	});

	test('o grupo de tema e o botão do cabeçalho se atualizam mutuamente', async ({ page }) => {
		await useTheme(page, 'light');
		await page.goto('/preferencias');
		await expect(page.getByRole('radio', { name: 'Claro' })).toBeChecked();

		await page.getByRole('button', { name: 'Usar tema escuro' }).click();
		await expect(page.getByRole('radio', { name: 'Escuro' })).toBeChecked();
		await expect(page.getByRole('radio', { name: 'Claro' })).not.toBeChecked();

		await page.getByText('Claro', { exact: true }).click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
		await expect(page.getByRole('button', { name: 'Usar tema escuro' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Usar tema claro' })).toHaveCount(0);
	});

	test('não repete o botão de tema no documento', async ({ page }) => {
		await page.goto('/preferencias');

		await expect(page.getByRole('button', { name: /Usar tema/ })).toHaveCount(1);
	});

	for (const theme of themes) {
		test(`não tem violações de acessibilidade no tema ${theme}`, async ({ page }) => {
			await useTheme(page, theme);
			await page.goto('/preferencias');

			await expectNoAxeViolations(page);
		});
	}
});

test.describe('snapshots visuais', () => {
	const snapshotRoutes = [
		{ path: '/componentes', name: 'componentes' },
		{ path: '/clientes', name: 'clientes' },
		{ path: '/clientes/novo', name: 'clientes-novo' },
		{ path: '/preferencias', name: 'preferencias' },
	] as const;

	for (const route of snapshotRoutes) {
		test(`mantém a apresentação de ${route.path} nos temas claro e escuro`, async ({ page }) => {
			test.skip(Boolean(process.env.CI), 'Snapshots visuais são validados localmente.');

			for (const theme of ['dark', 'light'] as const) {
				await useTheme(page, theme);
				await page.setViewportSize({ width: 1280, height: 800 });
				await page.goto(route.path);
				await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
				await expect(page).toHaveScreenshot(`${route.name}-${theme}.png`, { fullPage: true });
			}
		});
	}
});
