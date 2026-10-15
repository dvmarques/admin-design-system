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
		return page.getByRole('link', { name: `Página ${number}`, exact: true });
	}

	function bodyRows(page: Page) {
		return customersTable(page).locator('tbody tr');
	}

	test('lista os registros da página e navega pela paginação', async ({ page }) => {
		await page.goto('/clientes');

		await expect(page.getByRole('heading', { level: 1, name: 'Clientes' })).toBeVisible();
		await expect(customersTable(page).getByRole('row')).toHaveCount(6);
		await expect(
			customersTable(page).getByRole('cell', { name: 'Mariana Costa', exact: true }),
		).toBeVisible();
		await expect(pageButton(page, 1)).toHaveAttribute('aria-current', 'page');

		await pageButton(page, 2).click();

		await expect(page).toHaveURL('/clientes?pagina=2');
		await expect(pageButton(page, 2)).toHaveAttribute('aria-current', 'page');
		await expect(
			customersTable(page).getByRole('cell', { name: 'Eduardo Pires', exact: true }),
		).toBeVisible();
		await expect(
			customersTable(page).getByRole('cell', { name: 'Mariana Costa', exact: true }),
		).toHaveCount(0);
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
			await expect(bodyRows(page)).not.toHaveCount(0);
		});
	}

	test('filtra pela busca, guarda o filtro na URL e volta para a página 1', async ({ page }) => {
		await page.goto('/clientes?pagina=3');

		await page.getByRole('textbox', { name: 'Busca' }).fill('mariana');

		await expect(page).toHaveURL('/clientes?q=mariana');
		await expect(bodyRows(page)).toHaveCount(1);
		await expect(
			customersTable(page).getByRole('cell', { name: 'Mariana Costa', exact: true }),
		).toBeVisible();
		await expect(page.getByText('1 cliente encontrado')).toBeVisible();
		await expect(page.getByRole('button', { name: /Remover filtro Busca: mariana/ })).toBeVisible();
	});

	test('filtra por status e limpa os filtros', async ({ page }) => {
		await page.goto('/clientes');

		await page.getByRole('combobox', { name: 'Status' }).selectOption('Inativo');

		await expect(page).toHaveURL('/clientes?status=Inativo');
		const rows = await bodyRows(page).count();
		expect(rows).toBeGreaterThan(0);
		await expect(customersTable(page).getByText('Ativo', { exact: true })).toHaveCount(0);

		await page.getByRole('button', { name: 'Limpar filtros' }).click();

		await expect(page).toHaveURL('/clientes');
		await expect(bodyRows(page)).toHaveCount(5);
	});

	test('aplica filtros da URL de forma determinística no servidor', async ({ page }) => {
		const url = '/clientes?status=Ativo&plano=Empresarial,Essencial&de=2022-01-01&ate=2023-12-31';
		await page.goto(url);
		const first = await customersTable(page).locator('tbody').innerText();
		await page.reload();

		expect(await customersTable(page).locator('tbody').innerText()).toBe(first);
		expect(first).not.toBe('');
		await expect(page.getByRole('textbox', { name: 'Busca' })).toHaveValue('');
		await expect(page.getByRole('button', { name: /Remover filtro Status: Ativo/ })).toBeVisible();
	});

	test('ordena pelos cabeçalhos, alterna a direção e preserva a ordenação na paginação', async ({
		page,
	}) => {
		await page.goto('/clientes');
		const sortByName = customersTable(page).getByRole('button', { name: 'Nome' });

		await sortByName.click();
		await expect(page).toHaveURL('/clientes?ordem=name%3Aasc');
		await expect(customersTable(page).getByRole('columnheader', { name: 'Nome' })).toHaveAttribute(
			'aria-sort',
			'ascending',
		);
		await expect(bodyRows(page).first()).toContainText('Beatriz Almeida');

		await pageButton(page, 2).click();
		await expect(page).toHaveURL('/clientes?ordem=name%3Aasc&pagina=2');

		await customersTable(page).getByRole('button', { name: 'Nome' }).click();
		await expect(page).toHaveURL('/clientes?ordem=name%3Adesc');
		await expect(customersTable(page).getByRole('columnheader', { name: 'Nome' })).toHaveAttribute(
			'aria-sort',
			'descending',
		);
	});

	test('ordenação e filtros inválidos na URL são ignorados', async ({ page }) => {
		await page.goto('/clientes?ordem=email:asc&status=Desconhecido&de=ontem&plano=x');

		await expect(bodyRows(page)).toHaveCount(5);
		await expect(
			customersTable(page).getByRole('cell', { name: 'Mariana Costa', exact: true }),
		).toBeVisible();
		await expect(page.getByText('Nenhum filtro ativo')).toBeVisible();
	});

	test('seleciona linhas e anuncia a quantidade', async ({ page }) => {
		await page.goto('/clientes');

		await page.getByRole('checkbox', { name: 'Selecionar Mariana Costa' }).press('Space');
		await expect(page.getByRole('status').filter({ hasText: '1 item selecionado' })).toBeVisible();

		await page
			.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' })
			.press('Space');
		await expect(
			page.getByRole('status').filter({ hasText: '5 itens selecionados' }),
		).toBeVisible();
	});

	test('oculta e mostra colunas, sem ocultar o nome', async ({ page }) => {
		await page.goto('/clientes');

		await page.getByRole('button', { name: 'Colunas' }).click();
		await page.getByRole('checkbox', { name: 'E-mail' }).press('Space');
		await expect(customersTable(page).getByRole('columnheader', { name: 'E-mail' })).toHaveCount(0);
		await expect(page.getByRole('checkbox', { name: 'Nome' })).toBeDisabled();

		await page.getByRole('checkbox', { name: 'E-mail' }).press('Space');
		await expect(customersTable(page).getByRole('columnheader', { name: 'E-mail' })).toBeVisible();
	});

	test('filtros sem resultado mostram o estado vazio e a ação de limpar', async ({ page }) => {
		await page.goto('/clientes?q=zzz-sem-resultado');

		await expect(page.getByText('Nenhum cliente encontrado')).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Busca' })).toHaveValue('zzz-sem-resultado');
		await page.getByRole('link', { name: 'Limpar filtros' }).click();

		await expect(page).toHaveURL('/clientes');
		await expect(bodyRows(page)).toHaveCount(5);
	});

	test('estado vazio exibe a mensagem e oferece a volta à lista', async ({ page }) => {
		await page.goto('/clientes?estado=vazio');

		await expect(page.getByText('Nenhum cliente encontrado')).toBeVisible();
		await expect(page.getByText('Nenhum cliente corresponde à seleção atual.')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Ver todos os clientes' })).toHaveAttribute(
			'href',
			'/clientes',
		);
	});

	test('estado de erro é anunciado e permite tentar novamente', async ({ page }) => {
		await page.goto('/clientes?estado=erro');

		await expect(
			page.getByRole('alert').filter({ hasText: 'Não foi possível carregar os clientes' }),
		).toBeVisible();
		await expect(
			customersTable(page).getByRole('cell', { name: 'Mariana Costa', exact: true }),
		).toHaveCount(0);

		await page.getByRole('button', { name: 'Tentar novamente' }).click();

		await expect(page).toHaveURL('/clientes');
		await expect(
			customersTable(page).getByRole('cell', { name: 'Mariana Costa', exact: true }),
		).toBeVisible();
	});

	test('estado carregando preserva a estrutura sem valores dos registros', async ({ page }) => {
		await page.goto('/clientes?estado=carregando');

		await expect(customersTable(page)).toHaveAttribute('aria-busy', 'true');
		await expect(page.getByRole('status').filter({ hasText: 'Carregando clientes' })).toHaveCount(
			1,
		);
		await expect(page.getByText('Mariana Costa')).toHaveCount(0);
		await expect(bodyRows(page)).toHaveCount(5);
		const cellTexts = await customersTable(page).locator('tbody td').allTextContents();
		expect(cellTexts.join('').trim()).toBe('');
	});

	test('?estado desconhecido exibe os dados normais', async ({ page }) => {
		await page.goto('/clientes?estado=desconhecido');

		await expect(
			customersTable(page).getByRole('cell', { name: 'Mariana Costa', exact: true }),
		).toBeVisible();
	});

	test('a tabela rola dentro do contêiner em 375 px sem rolar a página', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/clientes');

		const overflow = await page
			.getByRole('region', { name: 'Clientes', exact: true })
			.evaluate((element) => ({
				content: element.scrollWidth,
				visible: element.clientWidth,
			}));
		expect(overflow.content).toBeGreaterThan(overflow.visible);
	});

	test('a tabela cabe no contêiner em 1280 px com todas as colunas visíveis', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/clientes');

		const container = page.getByRole('main');
		const table = customersTable(page);
		const bounds = await container.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return { left: rect.left, right: rect.right };
		});
		const tableBounds = await table.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return { left: rect.left, right: rect.right };
		});

		expect(tableBounds.left).toBeGreaterThanOrEqual(bounds.left - 1);
		expect(tableBounds.right).toBeLessThanOrEqual(bounds.right + 1);

		for (const column of ['Nome', 'E-mail', 'Status', 'Plano', 'Pedidos', 'Cliente desde']) {
			await expect(customersTable(page).getByRole('columnheader', { name: column })).toBeVisible();
		}
	});

	test('exibe ações em massa com confirmação destrutiva na seleção', async ({ page }) => {
		await page.goto('/clientes');

		await expect(page.getByRole('group', { name: 'Ações em massa' })).toHaveCount(0);
		await page.getByRole('checkbox', { name: 'Selecionar Mariana Costa' }).press('Space');
		const bulk = page.getByRole('group', { name: 'Ações em massa' });
		await expect(bulk).toBeVisible();
		await bulk.getByRole('button', { name: 'Excluir selecionados' }).click();

		const dialog = page.getByRole('dialog', { name: 'Excluir 1 cliente?' });
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: 'Excluir' }).click();
		await expect.poll(async () => await dialog.count()).toBe(0);
		await expect(page.getByText('Exclusão demonstrada com sucesso.')).toBeVisible();
		await expect(page.getByRole('group', { name: 'Ações em massa' })).toHaveCount(0);
	});

	test('mantém o diálogo e o foco fora do body enquanto a exclusão está pendente', async ({
		page,
	}) => {
		await page.goto('/clientes');
		await page.getByRole('checkbox', { name: 'Selecionar Mariana Costa' }).press('Space');
		await page
			.getByRole('group', { name: 'Ações em massa' })
			.getByRole('button', { name: 'Excluir selecionados' })
			.click();

		const dialog = page.getByRole('dialog', { name: 'Excluir 1 cliente?' });
		await dialog.getByRole('button', { name: 'Excluir' }).click();

		await expect
			.poll(async () =>
				page.evaluate(() => {
					const active = document.activeElement;
					return active !== null && active !== document.body;
				}),
			)
			.toBe(true);
		await page.keyboard.press('Escape');
		await expect(dialog).toBeVisible();

		await expect.poll(async () => await dialog.count()).toBe(0);
		await expect(page.getByText('Exclusão demonstrada com sucesso.')).toBeVisible();
	});

	test('limpar seleção move o foco para selecionar todas no cabeçalho', async ({ page }) => {
		await page.goto('/clientes');
		await page.getByRole('checkbox', { name: 'Selecionar Mariana Costa' }).press('Space');
		await page.getByRole('button', { name: 'Limpar seleção' }).click();

		const selectAll = page.locator('thead .ads-smart-table-select-cell input[type="checkbox"]');
		await expect(selectAll).toBeFocused();
		await expect(page.getByRole('group', { name: 'Ações em massa' })).toHaveCount(0);
	});

	test('devolve o foco ao checkbox selecionar todas após excluir', async ({ page }) => {
		await page.goto('/clientes');
		await page.getByRole('checkbox', { name: 'Selecionar Mariana Costa' }).press('Space');
		await page
			.getByRole('group', { name: 'Ações em massa' })
			.getByRole('button', { name: 'Excluir selecionados' })
			.click();

		const dialog = page.getByRole('dialog', { name: 'Excluir 1 cliente?' });
		await dialog.getByRole('button', { name: 'Excluir' }).click();
		await expect.poll(async () => await dialog.count()).toBe(0);

		const selectAll = page.locator('thead .ads-smart-table-select-cell input[type="checkbox"]');
		await expect(selectAll).toBeFocused();
		await expect(page.evaluate(() => document.activeElement === document.body)).resolves.toBe(
			false,
		);
	});

	const queries = [
		'',
		'?estado=vazio',
		'?estado=carregando',
		'?estado=erro',
		'?status=Ativo&plano=Essencial&ordem=name:asc',
	];
	for (const query of queries) {
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
	const nextButton = (page: Page) => page.getByRole('button', { name: 'Próxima' });
	const submitButton = (page: Page) => page.getByRole('button', { name: 'Cadastrar cliente' });

	test('valida os campos obrigatórios e leva o foco ao primeiro inválido', async ({ page }) => {
		await page.goto('/clientes/novo');
		await expect(page.getByRole('heading', { level: 1, name: 'Novo cliente' })).toBeVisible();

		await nextButton(page).click();

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
		await nextButton(page).click();
		// The radio input is visually hidden; people click its label.
		await page.getByText('Trimestral', { exact: true }).click();
		await expect(page.getByRole('radio', { name: 'Trimestral' })).toBeChecked();
		await nextButton(page).click();

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

		// As cores de borda e do indicador têm transição; uma leitura única logo após o erro
		// ou a troca de tema pode pegar o início dela, então as comparações usam retry.
		const borderOf = (locator: ReturnType<Page['getByLabel']> | ReturnType<Page['getByRole']>) =>
			locator.evaluate((element) => getComputedStyle(element).borderTopColor);
		const neutralControl = page.getByRole('button', { name: 'Próxima' });
		await expect
			.poll(async () => (await borderOf(nameField)) !== (await borderOf(neutralControl)), {
				message: 'a borda do campo com erro deve diferir da de um controle neutro',
			})
			.toBe(true);
	}

	for (const theme of themes) {
		test(`mantém erro, foco e seleção distinguíveis ao alternar o tema (a partir do ${theme})`, async ({
			page,
		}) => {
			await useTheme(page, theme);
			await page.goto('/clientes/novo');
			await nextButton(page).click();
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
