import { expect, test } from '@playwright/test';
import { catalogEntries } from '../apps/admin-demo/app/catalogo/catalog-data';
import { expectNoAxeViolations } from './axe';
import { waitForHydration } from './hydration';

for (const theme of ['light', 'dark'] as const) {
	for (const width of [390, 1280]) {
		test(`catálogo: todos os exports, ${theme}, ${width}px`, async ({ page }) => {
			test.setTimeout(180000);
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('console', (message) => {
				if (message.type() === 'error') errors.push(message.text());
			});
			await page.setViewportSize({ width, height: 900 });
			await page.goto('/catalogo');
			await waitForHydration(page.getByRole('button', { name: /^Usar tema/ }));
			if (theme === 'dark')
				await page.getByRole('button', { name: 'Usar tema escuro', exact: true }).click();
			for (const entry of catalogEntries) {
				await page.goto(entry.href);
				await expect(
					page.getByRole('heading', { name: entry.name, exact: true, level: 1 }),
				).toBeVisible();
				await page.getByLabel('Tema da demonstração').selectOption(theme);
				await expect(page.getByRole('region', { name: 'Demonstração interativa' })).toBeVisible();
				expect(
					await page
						.getByRole('region', { name: 'Demonstração interativa' })
						.locator(':scope > *')
						.count(),
				).toBeGreaterThan(0);
				await expect(page.getByRole('code')).toContainText(entry.name);
				expect(
					await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
					entry.name,
				).toBe(true);
			}
			expect(errors).toEqual([]);
		});
	}
}

test('busca, vazio, deep link, cópia, largura e navegação móvel por teclado', async ({
	page,
	context,
}) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.goto('/catalogo');
	await page.getByRole('searchbox', { name: 'Buscar componente' }).fill('adsbutton');
	await expect(page.getByRole('status')).toHaveText('1 resultados');
	await page.getByRole('link', { name: 'AdsButton', exact: true }).last().click();
	await page.getByLabel('Largura da demonstração').selectOption('320px');
	await expect(page.getByRole('region', { name: 'Demonstração interativa' })).toHaveCSS(
		'width',
		'320px',
	);
	const primary = page.getByRole('button', { name: 'primary', exact: true });
	await primary.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('status').first()).toHaveText('1 ações');
	await page.getByRole('button', { name: 'Copiar código' }).click();
	await expect(page.getByText('Código copiado.', { exact: true })).toBeVisible();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
		'export function ButtonDemo',
	);
	await page.goto('/catalogo');
	await page.getByRole('searchbox').fill('inexistente');
	await expect(page.getByText('Nenhum componente encontrado', { exact: true })).toBeVisible();
	await page.setViewportSize({ width: 390, height: 844 });
	await page.getByRole('button', { name: 'Abrir navegação' }).click();
	const navigation = page.getByRole('navigation', { name: 'Navegação do demo' });
	const summary = navigation.locator('summary').filter({ hasText: 'Básicos' });
	await summary.focus();
	await page.keyboard.press('Enter');
	await navigation.getByRole('link', { name: 'AdsButton', exact: true }).click();
	await expect(page).toHaveURL(/\/catalogo\/button$/);
	await expect(page.getByRole('dialog')).toHaveCount(0);
});

for (const theme of ['light', 'dark'] as const) {
	test(`acessibilidade das composições: ${theme}`, async ({ page }) => {
		test.setTimeout(240000);
		const demos = [...new Map(catalogEntries.map((entry) => [entry.demo, entry])).values()];
		for (const entry of demos) {
			await page.goto(entry.href);
			await page.getByLabel('Tema da demonstração').selectOption(theme);
			await expectNoAxeViolations(page);
		}
	});
}

test('interações de abas, campos, tabela e etapas', async ({ page }) => {
	await page.goto('/catalogo/tabs');
	await page.getByRole('tab', { name: 'Resumo', exact: true }).focus();
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('Enter');
	await expect(page.getByRole('tabpanel')).toContainText('Histórico de alterações');
	await page.goto('/catalogo/input-group');
	await page.getByRole('button', { name: 'Alternar erro' }).click();
	await expect(page.getByRole('textbox', { name: 'Valor em reais' })).toHaveAttribute(
		'aria-invalid',
		'true',
	);
	await page.getByRole('button', { name: 'Limpar valor' }).click();
	await expect(page.getByRole('textbox', { name: 'Valor em reais' })).toHaveValue('0');
	await page.goto('/catalogo/smart-table');
	await page.getByRole('checkbox', { name: /Ana/ }).focus();
	await page.keyboard.press('Space');
	await expect(page.getByLabel('Seleção atual')).toHaveText('1');
	await page.getByLabel('Estado da tabela').selectOption('error');
	await page.getByRole('button', { name: /Tentar novamente/ }).click();
	await expect(page.getByLabel('Estado da tabela')).toHaveValue('ready');
	await page.goto('/catalogo/step-form');
	await page.getByRole('button', { name: 'Próxima', exact: true }).click();
	await expect(page.getByRole('textbox', { name: 'Nome', exact: true })).toHaveAttribute(
		'aria-invalid',
		'true',
	);
	await page.getByRole('textbox', { name: 'Nome', exact: true }).fill('Ana');
	await page.getByRole('button', { name: 'Próxima', exact: true }).click();
	await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
	await expect(page.getByText('Cadastro confirmado', { exact: true })).toBeVisible();
	const response = await page.goto('/catalogo/componente-inexistente');
	expect(response?.status()).toBe(404);
});

test('overlays e ações administrativas do catálogo', async ({ page }) => {
	for (const [slug, label] of [
		['dialog', 'Dialog'],
		['drawer', 'Drawer'],
		['confirm-dialog', 'ConfirmDialog'],
	] as const) {
		await page.goto(`/catalogo/${slug}`);
		const trigger = page.getByRole('button', { name: `Abrir ${label}`, exact: true });
		await trigger.click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(trigger).toBeFocused();
	}
	await page.goto('/catalogo/dropdown');
	await page.getByRole('button', { name: 'Abrir ações' }).focus();
	await page.keyboard.press('ArrowDown');
	await page.getByRole('menuitem', { name: 'Exportar', exact: true }).click();
	await expect(page.getByText('Exportado', { exact: true })).toBeVisible();
	await page.goto('/catalogo/list-flow');
	await page.getByRole('textbox', { name: 'Buscar nome' }).fill('Bruno');
	await expect(page.getByRole('cell', { name: 'Bruno', exact: true })).toBeVisible();
	await page.getByRole('checkbox', { name: 'Selecionar Bruno', exact: true }).focus();
	await page.keyboard.press('Space');
	await expect(page.getByRole('button', { name: 'Concluir seleção' })).toBeVisible();
	await page.getByRole('button', { name: 'Concluir seleção' }).click();
	await expect(page.getByLabel('Seleção atual')).toHaveText('Nenhuma seleção');
});

for (const theme of ['light', 'dark']) {
	test(`shell isolado acessível no tema ${theme}`, async ({ page }) => {
		await page.goto(`/catalogo-shell/?theme=${theme}`);
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		await expect(page.getByRole('main')).toHaveCount(1);
		await expectNoAxeViolations(page);
	});
}

test('breadcrumb usa navegação Next.js e preserva links ao expandir', async ({ page }) => {
	await page.goto('/catalogo/breadcrumb');
	const preview = page.getByRole('region', { name: 'Demonstração interativa' });
	await preview.getByRole('button', { name: 'Mostrar caminho completo' }).click();
	await preview.getByRole('link', { name: 'Catálogo', exact: true }).click();
	await expect(page).toHaveURL(/\/catalogo$/);
});

test('sidebar preserva expansão manual entre rotas e abre o grupo ativo', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/catalogo');
	await waitForHydration(page.getByRole('button', { name: /^Usar tema/ }));
	const nav = page.getByRole('navigation', { name: 'Navegação do demo' });
	const group = (label: string) =>
		nav
			.locator('details')
			.filter({ has: page.locator('summary').filter({ hasText: new RegExp(`^${label}$`) }) });
	const basics = group('Básicos');
	const forms = group('Formulários');
	const applications = group('Exemplos de aplicação');
	await basics.locator('summary').click();
	await applications.locator('summary').click();
	await basics.getByRole('link', { name: 'AdsButton', exact: true }).click();
	await expect(basics).toHaveAttribute('open', '');
	await expect(applications).not.toHaveAttribute('open');
	// Uma rota de outra categoria abre seu grupo, preservando as escolhas anteriores.
	await page.getByRole('link', { name: 'Voltar ao catálogo', exact: true }).click();
	await page.getByRole('main').getByRole('link', { name: 'AdsInput', exact: true }).click();
	await expect(forms).toHaveAttribute('open', '');
	await expect(basics).toHaveAttribute('open', '');
	await expect(applications).not.toHaveAttribute('open');
	await forms.locator('summary').click();
	await page.goBack();
	await expect(forms).not.toHaveAttribute('open');
	await expect(basics).toHaveAttribute('open', '');
	await page.goForward();
	await expect(forms).toHaveAttribute('open', '');
	await expect(nav.getByRole('link', { name: 'AdsInput', exact: true })).toHaveAttribute(
		'aria-current',
		'page',
	);
	await expect(applications).not.toHaveAttribute('open');
});
