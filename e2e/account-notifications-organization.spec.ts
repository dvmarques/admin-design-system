import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

const accountTrigger = (page: Page) =>
	page.getByRole('banner').getByRole('button', { name: 'Menu da conta: AS Ana Souza' });
const bell = (page: Page) =>
	page.getByRole('banner').getByRole('button', { name: /^Notificações(, \d+ não lidas?)?$/ });
const organizationTrigger = (page: Page) =>
	page.getByRole('button', { name: /^Organização atual: / });

async function openDemo(page: Page, path = '/') {
	await page.goto(path);
	await waitForHydration(accountTrigger(page));
}

for (const theme of ['light', 'dark'] as const) {
	test.describe(`${theme}`, () => {
		test.beforeEach(async ({ context }) => {
			await context.addCookies([{ name: 'ads-theme', value: theme, url: 'http://127.0.0.1:3000' }]);
		});

		test('o avatar abre a conta compacta, que fecha com Escape devolvendo o foco', async ({
			page,
		}) => {
			await page.setViewportSize({ width: 1280, height: 800 });
			await openDemo(page);
			const trigger = accountTrigger(page);
			await expect(trigger).toHaveAttribute('aria-expanded', 'false');
			await expect(trigger).toHaveAccessibleName('Menu da conta: AS Ana Souza');

			await trigger.click();

			const panel = page.getByRole('dialog', { name: 'Conta' });
			await expect(panel).toBeVisible();
			await expect(panel.locator('..')).toHaveAttribute('data-theme', theme);
			await expect(trigger).toHaveAttribute('aria-expanded', 'true');
			await expect(panel.getByText('ana.souza@exemplo.com.br')).toBeVisible();
			await expect(panel.getByRole('button', { name: 'Minha conta' })).toBeFocused();
			await expect(page.getByRole('menu')).toHaveCount(0);
			const box = await panel.boundingBox();
			expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
			await expectNoAxeViolations(page);

			await page.keyboard.press('ArrowDown');
			await expect(panel.getByRole('button', { name: 'Preferências' })).toBeFocused();
			await page.keyboard.press('Escape');
			await expect(panel).toBeHidden();
			await expect(trigger).toBeFocused();
		});

		test('Sair é uma ação de demonstração assíncrona e não encerra a sessão', async ({ page }) => {
			await openDemo(page);
			const demoUrl = page.url();
			await accountTrigger(page).click();
			const signOut = page.getByRole('button', { name: 'Sair' });

			await signOut.click();
			await expect(signOut).toHaveAttribute('aria-busy', 'true');
			await expect(page.getByRole('dialog', { name: 'Conta' })).toBeVisible();

			await expect(page.getByRole('status').filter({ hasText: 'Saída simulada' })).toBeVisible();
			await expect(page.getByRole('dialog', { name: 'Conta' })).toBeHidden();
			await expect(page).toHaveURL(demoUrl);
			await expect(page.getByRole('main')).toBeVisible();
		});

		test('o sino abre o painel lateral direito sem marcar nada como lido', async ({ page }) => {
			await page.setViewportSize({ width: 1280, height: 800 });
			await openDemo(page);
			await expect(bell(page)).toHaveAccessibleName('Notificações, 4 não lidas');

			await bell(page).click();

			const panel = page.getByRole('dialog', { name: 'Notificações' });
			await expect(panel).toBeVisible();
			await expect(panel).toHaveAttribute('aria-modal', 'true');
			const box = await panel.boundingBox();
			expect(Math.round(box!.x + box!.width)).toBe(1280);
			await expect(bell(page)).toHaveAccessibleName('Notificações, 4 não lidas');
			await expect(panel.getByRole('button', { name: 'Todas', exact: true })).toHaveAttribute(
				'aria-pressed',
				'true',
			);
			await expectNoAxeViolations(page);

			await panel.getByRole('button', { name: 'Não lidas' }).click();
			await expect(panel.getByText('Revisão agendada')).toHaveCount(0);
			await panel.getByRole('button', { name: 'Marcar como lida: Pedido aprovado' }).click();
			await expect(panel.getByText('Pedido aprovado')).toHaveCount(0);
			await expect(bell(page)).toHaveAccessibleName('Notificações, 3 não lidas');

			await panel.getByRole('button', { name: 'Marcar todas como lidas' }).click();
			await expect(panel.getByRole('status')).toHaveText('Nenhuma notificação não lida.');
			await expect(bell(page)).toHaveAccessibleName('Notificações');

			await page.keyboard.press('Escape');
			await expect(panel).toBeHidden();
			await expect(bell(page)).toBeFocused();
		});

		test('carrega mais notificações e mantém a lista com rolagem interna', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 600 });
			await openDemo(page);
			await bell(page).click();
			const panel = page.getByRole('dialog', { name: 'Notificações' });
			const box = await panel.boundingBox();
			expect(Math.round(box!.width)).toBe(375);
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
			).toBe(true);

			await panel.getByRole('button', { name: 'Carregar mais' }).click();
			await expect(panel.getByText('Meio de pagamento a vencer')).toBeVisible();
			await expect(panel.getByRole('button', { name: 'Fechar notificações' })).toBeVisible();
			await expect(panel.getByRole('button', { name: 'Marcar todas como lidas' })).toBeVisible();
		});

		test('o seletor de organização troca de forma assíncrona na sidebar expandida', async ({
			page,
		}) => {
			await page.setViewportSize({ width: 1280, height: 800 });
			await openDemo(page);
			const trigger = organizationTrigger(page);
			await expect(trigger).toContainText('Acme Brasil');
			await expect(trigger).toHaveAccessibleName(/Organização atual: AB Acme Brasil/);
			await expect(
				page.getByRole('navigation', { name: 'Navegação do demo' }).locator('> *').first(),
			).toHaveClass(/ads-organization-switcher/);

			await trigger.click();
			const panel = page.getByRole('dialog', { name: 'Trocar de organização' });
			await expect(panel.getByRole('searchbox', { name: 'Buscar organização' })).toBeFocused();
			await expectNoAxeViolations(page);

			await panel.getByRole('searchbox').fill('globex');
			await expect(panel.getByRole('option')).toHaveCount(1);
			await panel.getByRole('option', { name: /^Globex/ }).click();
			await expect(panel.getByRole('status')).toHaveText('Trocando de organização');
			await expect(trigger).toContainText('Acme Brasil');

			await expect(panel).toBeHidden();
			await expect(trigger).toContainText('Globex Logística');
			await expect(trigger).toBeFocused();
		});

		test('na sidebar recolhida o gatilho é compacto e a seleção funciona sem expandir', async ({
			page,
		}) => {
			await page.setViewportSize({ width: 1280, height: 800 });
			await openDemo(page);
			await page.getByRole('button', { name: 'Recolher barra lateral' }).click();
			const trigger = organizationTrigger(page);
			await expect(trigger).toHaveAttribute('aria-label', /Acme Brasil/);
			const box = await trigger.boundingBox();
			expect(box!.width).toBeLessThan(80);

			await trigger.click();
			const panel = page.getByRole('dialog', { name: 'Trocar de organização' });
			await expect(panel).toBeVisible();
			await panel.getByRole('searchbox').fill('initech');
			await panel.getByRole('option', { name: /^Initech/ }).click();
			await expect(panel).toBeHidden();
			await expect(trigger).toHaveAttribute('aria-label', /Initech/);
			await expect(page.getByRole('button', { name: 'Expandir barra lateral' })).toBeVisible();
		});

		test('no menu móvel o painel da organização é uma camada acima do drawer', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 700 });
			await openDemo(page);
			await page.getByRole('button', { name: 'Abrir navegação' }).click();
			const drawer = page.getByRole('dialog', { name: 'Navegação do demo' });
			await expect(drawer).toBeVisible();

			await drawer.getByRole('button', { name: /^Organização atual: / }).click();
			const panel = page.getByRole('dialog', { name: 'Trocar de organização' });
			await expect(panel).toBeVisible();
			const box = await panel.boundingBox();
			expect(box!.x).toBeGreaterThanOrEqual(0);
			expect(box!.x + box!.width).toBeLessThanOrEqual(375);
			await panel.getByRole('searchbox').fill('wayne');
			await panel.getByRole('option', { name: /^Wayne/ }).click();
			await expect(drawer.getByRole('button', { name: /^Organização atual: / })).toContainText(
				'Wayne Participações',
			);

			await drawer.getByRole('button', { name: /^Organização atual: / }).click();
			await expect(panel).toBeVisible();
			await page.keyboard.press('Escape');
			await expect(panel).toBeHidden();
			await expect(drawer).toBeVisible();
			await expect(drawer.getByRole('button', { name: /^Organização atual: / })).toBeFocused();
		});

		test('tema, sino e conta coexistem no cabeçalho sem sobreposição nem fechamento em cascata', async ({
			page,
		}) => {
			await page.setViewportSize({ width: 320, height: 700 });
			await openDemo(page);
			const header = page.getByRole('banner');
			const boxes = await Promise.all(
				[header.getByRole('button', { name: /^Tema: / }), bell(page), accountTrigger(page)].map(
					(locator) => locator.boundingBox(),
				),
			);
			for (const box of boxes) expect(box).not.toBeNull();
			const [theme, notifications, account] = boxes as NonNullable<(typeof boxes)[number]>[];
			expect(theme!.x + theme!.width).toBeLessThanOrEqual(notifications!.x + 1);
			expect(notifications!.x + notifications!.width).toBeLessThanOrEqual(account!.x + 1);
			expect(account!.x + account!.width).toBeLessThanOrEqual(320);

			await accountTrigger(page).click();
			await expect(page.getByRole('dialog', { name: 'Conta' })).toBeVisible();
			await bell(page).click();
			await expect(page.getByRole('dialog', { name: 'Conta' })).toBeHidden();
			await expect(page.getByRole('dialog', { name: 'Notificações' })).toBeVisible();
			await page.keyboard.press('Escape');
			await expect(page.getByRole('dialog', { name: 'Notificações' })).toBeHidden();
			await expect(bell(page)).toBeFocused();
			await header.getByRole('button', { name: /^Tema: / }).click();
			await expect(page.getByRole('menuitemradio', { name: 'Claro' })).toBeVisible();
		});
	});
}

for (const width of [1280, 375]) {
	test(`os três controles do cabeçalho têm o mesmo intervalo visível em ${width}px`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 700 });
		await openDemo(page);
		const header = page.getByRole('banner');
		// Mede o que se vê (ícones e avatar), não as caixas dos botões, que têm respiros diferentes.
		const [theme, notifications, avatar] = await Promise.all([
			header.locator('.ads-theme-control-trigger svg').boundingBox(),
			header.locator('.ads-notification-center-trigger svg').boundingBox(),
			header.locator('.ads-account-menu .ads-avatar').boundingBox(),
		]);
		const first = notifications!.x - (theme!.x + theme!.width);
		const second = avatar!.x - (notifications!.x + notifications!.width);
		expect(Math.abs(first - second)).toBeLessThanOrEqual(1);
	});
}

test('a sidebar sem seletor de organização não deixa espaço residual', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/catalogo-organizacao/?variante=sem');
	const nav = page.getByRole('navigation', { name: 'Navegação do exemplo' });
	await expect(nav.getByRole('link', { name: 'Início' })).toBeVisible();
	await expect(page.locator('.ads-organization-switcher')).toHaveCount(0);
	const navBox = await nav.boundingBox();
	const linkBox = await nav.getByRole('link', { name: 'Início' }).boundingBox();
	// Só o padding da sidebar separa o primeiro item do topo.
	expect(linkBox!.y - navBox!.y).toBeLessThanOrEqual(24);

	await page.goto('/catalogo-organizacao/?variante=com');
	await expect(page.locator('.ads-organization-switcher')).toHaveCount(1);
	await expect(page.getByRole('button', { name: /^Organização atual: / })).toBeVisible();
});

test('os showcases do catálogo carregam sem erros de hidratação', async ({ page }) => {
	const problems: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') problems.push(message.text());
	});
	page.on('pageerror', (error) => problems.push(error.message));
	for (const slug of ['account-menu', 'notification-center', 'organization-switcher']) {
		await page.goto(`/catalogo/${slug}`);
		await expect(page.getByRole('region', { name: 'Demonstração interativa' })).toBeVisible();
	}
	// A imagem inexistente do showcase é proposital (falha de imagem do avatar e do logo).
	expect(problems.filter((problem) => !/Failed to load resource/.test(problem))).toEqual([]);
});

test('o showcase de conta demonstra foto, iniciais e falha de imagem', async ({ page }) => {
	await page.goto('/catalogo/account-menu');
	const demo = page.getByRole('region', { name: 'Demonstração interativa' });
	await waitForHydration(demo.getByRole('button', { name: /^Menu da conta: .*Ana Souza$/ }));
	await expect(
		demo.getByRole('button', { name: /^Menu da conta: .*Ana Souza$/ }).locator('img'),
	).toBeVisible();
	await expect(demo.getByRole('button', { name: /^Menu da conta: .*Bruno Lima$/ })).toContainText('BL');
	const failed = demo.getByRole('button', { name: 'Menu da conta: Carla Dias' });
	await expect(failed).toContainText('CD');
	await expect(failed.locator('img')).toHaveCount(0);

	await demo.getByRole('button', { name: /^Menu da conta: .*Bruno Lima$/ }).click();
	await expect(page.getByText('Trocar conta')).toBeVisible();
});
