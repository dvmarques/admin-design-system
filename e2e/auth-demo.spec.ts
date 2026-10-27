import { expect, test, type Locator, type Page } from '@playwright/test';
import {
	invalidEmailMessage,
	passwordMismatchMessage,
	passwordRulesMessage,
	requiredEmailMessage,
	requiredPasswordMessage,
} from '../apps/admin-demo/lib/auth-demo';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';
import { chooseTheme, themeTrigger } from './theme-control';

const demoEmail = 'demo@exemplo.com.br';
const demoPassword = 'SenhaDemo1';
const strongPassword = 'SenhaForte1';
const baseUrl = 'http://127.0.0.1:3000';

const routes = [
	{ path: '/login', heading: 'Entrar' },
	{ path: '/esqueci-senha', heading: 'Recuperar senha' },
	{ path: '/redefinir-senha', heading: 'Redefinir senha' },
] as const;
type AuthRoute = (typeof routes)[number];
const themes = ['light', 'dark'] as const;
type Theme = (typeof themes)[number];

async function setTheme(page: Page, theme: Theme) {
	await page.context().addCookies([{ name: 'ads-theme', value: theme, url: baseUrl }]);
}

/** Abre a rota, espera o título (SSR) e a hidratação do formulário antes de qualquer interação. */
async function openAuthRoute(page: Page, route: AuthRoute | AuthRoute['path']) {
	const { path, heading } =
		typeof route === 'string' ? routes.find((item) => item.path === route)! : route;
	await page.goto(path);
	await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
	await waitForHydration(page.locator('form'));
}

const openLogin = (page: Page) => openAuthRoute(page, '/login');

/** Avança com Tab até o alvo receber foco (falha se passar de `maxTabs`). */
async function tabTo(page: Page, target: Locator, maxTabs = 12) {
	for (let index = 0; index < maxTabs; index += 1) {
		if (await target.evaluate((node) => node === document.activeElement)) break;
		await page.keyboard.press('Tab');
	}
	await expect(target).toBeFocused();
}

/** Nenhuma senha, token ou credencial em cookies, localStorage ou sessionStorage. */
async function expectNoCredentialStorage(page: Page, secrets: string[]) {
	const storage = await page.evaluate(() => ({
		cookie: document.cookie,
		local: { ...localStorage },
		session: { ...sessionStorage },
	}));
	const contexts = JSON.stringify(await page.context().cookies());
	const everything = JSON.stringify([storage.cookie, storage.local, storage.session, contexts]);
	expect(everything).not.toMatch(/password|token|senha/i);
	for (const secret of secrets) expect(everything).not.toContain(secret);
}

test.describe('fluxo de autenticação demonstrativo', () => {
	test('home permanece aberta sem login e o link opcional leva ao exemplo', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('.ads-admin-shell')).toHaveCount(1);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

		const navigation = page.getByRole('navigation', { name: 'Navegação do demo' });
		await navigation.getByRole('link', { name: 'Login (exemplo)' }).click();
		await expect(page).toHaveURL(/\/login/);
		await expect(page.locator('.ads-admin-shell')).toHaveCount(0);
		await expect(page.getByRole('link', { name: 'Voltar ao Demo' })).toBeVisible();
	});

	test('o link opcional também está no menu de navegação móvel', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');
		const trigger = page.getByRole('button', { name: 'Abrir navegação' });
		await waitForHydration(trigger);
		await trigger.click();

		const drawer = page.getByRole('dialog', { name: 'Navegação do demo' });
		await expect(drawer).toBeVisible();
		await drawer.getByRole('link', { name: 'Login (exemplo)' }).click();
		await expect(page).toHaveURL(/\/login/);
		await expect(page.getByRole('heading', { level: 1, name: 'Entrar' })).toBeVisible();
	});

	test('login simulado válido retorna ao demo sem credenciais persistidas', async ({ page }) => {
		await openLogin(page);
		await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
		await page.getByLabel('Senha', { exact: true }).fill(demoPassword);
		await page.getByRole('button', { name: 'Entrar' }).click();
		await expect(page).toHaveURL('/');
		await expect(page.locator('.ads-admin-shell')).toHaveCount(1);
		await expectNoCredentialStorage(page, [demoPassword]);
	});

	test('validação de login inválido e recuperação com histórico', async ({ page }) => {
		await openLogin(page);
		await page.getByRole('button', { name: 'Entrar' }).click();
		await expect(page.getByText(requiredEmailMessage, { exact: true })).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'E-mail' })).toBeFocused();

		await page.getByRole('textbox', { name: 'E-mail' }).fill('invalido');
		await page.getByRole('button', { name: 'Entrar' }).click();
		await expect(page.getByText(invalidEmailMessage, { exact: true })).toBeVisible();

		await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
		await page.getByRole('button', { name: 'Entrar' }).click();
		await expect(page.getByText(requiredPasswordMessage, { exact: true })).toBeVisible();
		await expect(page.getByLabel('Senha', { exact: true })).toBeFocused();

		await page.getByRole('link', { name: 'Esqueci a senha' }).click();
		await expect(page).toHaveURL(/\/esqueci-senha/);
		await waitForHydration(page.locator('form'));
		await page.getByRole('button', { name: 'Enviar instruções simuladas' }).click();
		await expect(page.getByText(requiredEmailMessage, { exact: true })).toBeVisible();

		await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
		await page.getByRole('button', { name: 'Enviar instruções simuladas' }).click();
		await expect(page.getByRole('status')).toContainText('Envio simulado');

		await page.getByRole('link', { name: 'Continuar para redefinição' }).click();
		await expect(page).toHaveURL(/\/redefinir-senha/);
		await page.goBack();
		await expect(page).toHaveURL(/\/esqueci-senha/);
	});

	test('após o envio da recuperação o foco vai para a confirmação anunciada', async ({ page }) => {
		await openAuthRoute(page, '/esqueci-senha');
		await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
		await page.getByRole('button', { name: 'Enviar instruções simuladas' }).click();

		const status = page.getByRole('status');
		await expect(status).toContainText('Envio simulado');
		await expect(status).toBeFocused();
		await expect(page.getByRole('link', { name: 'Continuar para redefinição' })).toHaveAttribute(
			'href',
			/\/redefinir-senha/,
		);
		await expect(page.getByRole('link', { name: 'Voltar ao login' })).toHaveAttribute(
			'href',
			/\/login/,
		);
	});

	test('redefinição exige regras e confirmação', async ({ page }) => {
		await openAuthRoute(page, '/redefinir-senha');
		const password = page.getByLabel('Nova senha', { exact: true });
		const confirm = page.getByLabel('Confirmar senha', { exact: true });
		const submit = page.getByRole('button', { name: 'Salvar senha simulada' });

		// Regras não atendidas: erro no campo da nova senha, com foco.
		await password.fill('curta');
		await confirm.fill('outra');
		await submit.click();
		await expect(page.getByText(passwordRulesMessage, { exact: true })).toBeVisible();
		await expect(password).toHaveAttribute('aria-invalid', 'true');
		await expect(password).toBeFocused();

		// Regras atendidas, confirmação diferente: erro no campo de confirmação, com foco.
		await password.fill(strongPassword);
		await confirm.fill('SenhaForte2');
		await submit.click();
		await expect(page.getByText(passwordMismatchMessage, { exact: true })).toBeVisible();
		await expect(confirm).toHaveAttribute('aria-invalid', 'true');
		await expect(confirm).toBeFocused();
		await expect(page.getByText('Senha redefinida')).toHaveCount(0);

		// Sucesso simulado: mensagem com foco e retorno ao login por link.
		await confirm.fill(strongPassword);
		await submit.click();
		const status = page.getByRole('status');
		await expect(status).toContainText('simulação');
		await expect(status).toBeFocused();
		await expect(page.getByRole('link', { name: 'Voltar ao login' })).toHaveAttribute(
			'href',
			/\/login/,
		);
		await expectNoCredentialStorage(page, [strongPassword, 'SenhaForte2']);
	});

	test('tema e cor primária persistem no fluxo de auth', async ({ page }) => {
		await setTheme(page, 'dark');
		await openLogin(page);
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

		await waitForHydration(themeTrigger(page));
		await chooseTheme(page, 'light');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

		const orbFillBefore = await page
			.locator('.demo-auth-panel__orb--one')
			.evaluate((node) => getComputedStyle(node).fill);
		await page.addStyleTag({
			content: `[data-theme='light'] { --ads-color-primary: rgb(200, 80, 40); }`,
		});
		const orbFillAfter = await page
			.locator('.demo-auth-panel__orb--one')
			.evaluate((node) => getComputedStyle(node).fill);
		expect(orbFillAfter).not.toBe(orbFillBefore);
	});

	test('login pelo teclado: Tab até o botão e Enter', async ({ page }) => {
		await openLogin(page);
		await page.getByRole('textbox', { name: 'E-mail' }).focus();
		await page.keyboard.type(demoEmail);
		await page.keyboard.press('Tab');
		await expect(page.getByLabel('Senha', { exact: true })).toBeFocused();
		await page.keyboard.type(demoPassword);

		await tabTo(page, page.getByRole('button', { name: 'Entrar' }));
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL('/');
	});

	test('recuperação pelo teclado: Tab até o botão e Enter', async ({ page }) => {
		await openAuthRoute(page, '/esqueci-senha');
		await page.getByRole('textbox', { name: 'E-mail' }).focus();
		await page.keyboard.type(demoEmail);

		await tabTo(page, page.getByRole('button', { name: 'Enviar instruções simuladas' }));
		await page.keyboard.press('Enter');
		await expect(page.getByRole('status')).toContainText('Envio simulado');
		await expect(page.getByRole('status')).toBeFocused();
	});
	test('redefinição pelo teclado: Tab até o botão e Enter', async ({ page }) => {
		await openAuthRoute(page, '/redefinir-senha');
		const confirm = page.getByLabel('Confirmar senha', { exact: true });
		await page.getByLabel('Nova senha', { exact: true }).focus();
		await page.keyboard.type(strongPassword);

		await tabTo(page, confirm);
		await page.keyboard.type(strongPassword);
		await tabTo(page, page.getByRole('button', { name: 'Salvar senha simulada' }));
		await page.keyboard.press('Enter');
		await expect(page.getByRole('status')).toContainText('simulação');
		await expect(page.getByRole('status')).toBeFocused();
	});
});

const typedSecret = 'SegredoReal123';

/**
 * Preenche a rota com valores reais e envia pelo botão, esperando a navegação nativa do
 * navegador (GET). Sem o atributo `name`, a URL final não pode carregar nenhum valor.
 */
async function submitNativeAndExpectCleanUrl(page: Page, route: AuthRoute) {
	let submit: Locator;
	if (route.path === '/redefinir-senha') {
		await page.getByLabel('Nova senha', { exact: true }).fill(typedSecret);
		await page.getByLabel('Confirmar senha', { exact: true }).fill(typedSecret);
		submit = page.getByRole('button', { name: 'Salvar senha simulada' });
	} else if (route.path === '/login') {
		await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
		await page.getByLabel('Senha', { exact: true }).fill(typedSecret);
		submit = page.getByRole('button', { name: 'Entrar' });
	} else {
		await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
		submit = page.getByRole('button', { name: 'Enviar instruções simuladas' });
	}
	await Promise.all([page.waitForEvent('framenavigated'), submit.click()]);
	await page.waitForLoadState('load');

	const url = new URL(page.url());
	expect(url.pathname).toBe(route.path);
	expect(url.search).toBe('');
	expect(page.url()).not.toContain(typedSecret);
	expect(page.url()).not.toContain(encodeURIComponent(demoEmail));
	expect(page.url()).not.toContain(demoEmail);
}

test.describe('envio nativo sem JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	for (const route of routes) {
		test(`${route.path} não coloca valores digitados na URL`, async ({ page }) => {
			await page.goto(route.path);
			await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
			await submitNativeAndExpectCleanUrl(page, route);
		});
	}
});

test.describe('envio nativo antes da hidratação', () => {
	for (const route of routes) {
		test(`${route.path} não coloca valores digitados na URL com os chunks JS bloqueados`, async ({
			page,
		}) => {
			// Os scripts do Next nunca chegam: o HTML do servidor fica sem hidratar.
			await page.route(/\/_next\/static\/.*\.js(\?.*)?$/, (request) => request.abort());
			await page.goto(route.path);
			await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
			await submitNativeAndExpectCleanUrl(page, route);
		});
	}
});

test.describe('responsividade do fluxo de autenticação', () => {
	for (const theme of themes) {
		for (const viewport of [
			{ width: 1920, height: 915 },
			{ width: 1280, height: 720 },
			{ width: 768, height: 600 },
			{ width: 390, height: 667 },
			{ width: 320, height: 568 },
		]) {
			test(`login cabe sem rolagem (${theme}, ${viewport.width}×${viewport.height})`, async ({
				page,
			}) => {
				await page.setViewportSize(viewport);
				await setTheme(page, theme);
				await openLogin(page);
				await expect(page.getByRole('link', { name: 'Esqueci a senha' })).toBeInViewport();
				await expect(page.getByRole('heading', { name: 'Entrar', exact: true })).toBeInViewport();
				const overflow = await page.evaluate(() => {
					const root = document.documentElement;
					const main = document.querySelector('.demo-auth-main')!;
					return {
						pageX: root.scrollWidth - root.clientWidth,
						pageY: root.scrollHeight - root.clientHeight,
						formY: main.scrollHeight - main.clientHeight,
					};
				});
				expect(overflow).toEqual({ pageX: 0, pageY: 0, formY: 0 });
			});
		}

		for (const route of routes) {
			test(`altura extrema preserva acesso ao formulário (${theme}, ${route.path})`, async ({
				page,
			}) => {
				await page.setViewportSize({ width: 1280, height: 800 });
				await setTheme(page, theme);
				await openAuthRoute(page, route);
				await page.setViewportSize({ width: 320, height: 256 });
				const main = page.getByRole('main');
				await main.focus();
				await page.keyboard.press('Control+Home');
				await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeInViewport();
				await tabTo(
					page,
					page.getByRole('button', {
						name: /^(Entrar|Enviar instruções simuladas|Salvar senha simulada)$/,
					}),
				);
				await expect(
					page.getByRole('button', {
						name: /^(Entrar|Enviar instruções simuladas|Salvar senha simulada)$/,
					}),
				).toBeInViewport();
				await page.keyboard.press('Enter');
				const firstField = page.getByLabel(
					route.path === '/redefinir-senha' ? 'Nova senha' : 'E-mail',
					{ exact: true },
				);
				await expect(firstField).toBeFocused();
				await expect(firstField).toBeInViewport();
				await main.focus();
				await page.keyboard.press('Control+End');
				await expect(
					page.getByRole('link', { name: /^(Esqueci a senha|Voltar ao login)$/ }),
				).toBeInViewport();
				const metrics = await page.evaluate(() => ({
					x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
					y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
				}));
				expect(metrics).toEqual({ x: 0, y: 0 });
				await expect(page.getByRole('link', { name: 'Voltar ao Demo' })).toBeInViewport();
			});
		}
	}

	for (const width of [320, 375]) {
		test(`abaixo de 48rem o formulário ocupa a largura útil (${width}px)`, async ({ page }) => {
			await page.setViewportSize({ width, height: 812 });
			for (const { path } of routes) {
				await page.goto(path);
				await expect(page.locator('.demo-auth-panel')).toBeHidden();

				const metrics = await page.evaluate(() => {
					const main = document.querySelector('.demo-auth-main')!.getBoundingClientRect();
					const shell = document.querySelector('.demo-auth-form-shell')!.getBoundingClientRect();
					const root = document.documentElement;
					return {
						main: main.width,
						shell: shell.width,
						horizontalOverflow: root.scrollWidth - root.clientWidth,
					};
				});
				// A coluna do formulário ocupa toda a largura (não fica presa a 45%).
				expect(metrics.main).toBeGreaterThanOrEqual(width - 1);
				// Largura do formulário: viewport menos o padding horizontal, limitada a 26rem.
				expect(metrics.shell).toBeGreaterThanOrEqual(Math.min(width * 0.85, 26 * 16) - 1);
				expect(metrics.horizontalOverflow).toBeLessThanOrEqual(0);
			}
		});
	}

	test('desktop exibe painel à direita do formulário em 45/55', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/login');
		await expect(page.locator('.demo-auth-panel')).toBeVisible();

		const boxes = await page.evaluate(() => {
			const rect = (selector: string) => {
				const { left, right, width } = document.querySelector(selector)!.getBoundingClientRect();
				return { left, right, width };
			};
			return { main: rect('.demo-auth-main'), panel: rect('.demo-auth-panel') };
		});
		expect(boxes.panel.left).toBeGreaterThanOrEqual(boxes.main.right - 1);
		expect(boxes.main.width / (boxes.main.width + boxes.panel.width)).toBeCloseTo(0.45, 1);
	});
});

test.describe('acessibilidade do fluxo de autenticação (axe)', () => {
	const widths = [320, 375, 1280];

	for (const route of routes) {
		for (const theme of themes) {
			for (const width of widths) {
				test(`${route.path} sem violações (${theme}, ${width}px)`, async ({ page }) => {
					await page.setViewportSize({ width, height: width < 768 ? 812 : 800 });
					await setTheme(page, theme);
					await openAuthRoute(page, route);
					await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
					if (width >= 768) await expect(page.locator('.demo-auth-panel')).toBeVisible();
					else await expect(page.locator('.demo-auth-panel')).toBeHidden();
					await expectNoAxeViolations(page);
				});
			}
		}
	}

	const states: { route: AuthRoute; state: 'erro' | 'sucesso' }[] = [
		{ route: routes[0], state: 'erro' },
		{ route: routes[1], state: 'erro' },
		{ route: routes[1], state: 'sucesso' },
		{ route: routes[2], state: 'erro' },
		{ route: routes[2], state: 'sucesso' },
	];
	for (const { route, state } of states) {
		for (const theme of themes) {
			for (const width of [320, 375, 1280]) {
				test(`${route.path} sem violações após ${state} (${theme}, ${width}px)`, async ({
					page,
				}) => {
					await page.setViewportSize({ width, height: width < 768 ? 812 : 800 });
					await setTheme(page, theme);
					await openAuthRoute(page, route);

					if (route.path === '/redefinir-senha') {
						const password = page.getByLabel('Nova senha', { exact: true });
						await password.fill(state === 'erro' ? 'curta' : strongPassword);
						await page.getByLabel('Confirmar senha', { exact: true }).fill(strongPassword);
						await page.getByRole('button', { name: 'Salvar senha simulada' }).click();
					} else if (route.path === '/esqueci-senha') {
						if (state === 'sucesso') {
							await page.getByRole('textbox', { name: 'E-mail' }).fill(demoEmail);
						}
						await page.getByRole('button', { name: 'Enviar instruções simuladas' }).click();
					} else {
						await page.getByRole('button', { name: 'Entrar' }).click();
					}

					if (state === 'sucesso') {
						await expect(page.getByRole('status')).toBeVisible();
					} else {
						await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible();
					}
					await expectNoAxeViolations(page);
				});
			}
		}
	}
});
