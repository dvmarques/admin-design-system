import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { catalogEntries } from '../apps/admin-demo/app/catalogo/catalog-data';

type Scenario = {
	id: string;
	name: string;
	state: string;
	action: string;
	theme: 'light' | 'dark';
	width: 320 | 390 | 768 | 1440;
	media?: 'forced-colors' | 'reduced-motion';
};
type Evidence = Scenario & {
	route: string;
	screenshot: string | null;
	checks: string[];
	error: string | null;
};
const root = resolve(process.cwd());
const output = join(root, 'visual-audit-results');
const plan = JSON.parse(readFileSync(join(root, 'visual-audit/coverage-matrix.json'), 'utf8')) as {
	scenarios: Scenario[];
};

async function performAction(page: Page, preview: Locator, scenario: Scenario, checks: string[]) {
	const action = scenario.action;
	if (action === 'button-hover' || action === 'button-focus' || action === 'button-keyboard-focus') {
		const button = preview.getByRole('button', { name: 'primary', exact: true });
		await expect(button).toBeVisible();
		if (action === 'button-hover') {
			await button.hover();
			checks.push('hover-target-visible');
		} else if (action === 'button-focus') {
			await button.focus();
			await expect(button).toBeFocused();
			checks.push('focus-visible');
		} else {
			await button.focus();
			await page.keyboard.press('Tab');
			await expect(preview.getByRole('button', { name: 'secondary', exact: true })).toBeFocused();
			checks.push('keyboard-tab-focus');
		}
		return;
	}
	if (action === 'button-disabled' || action === 'button-loading') {
		const button = preview.getByRole('button', {
			name: action === 'button-disabled' ? 'Desabilitado' : 'Salvando',
		});
		await expect(button).toBeDisabled();
		checks.push('disabled-semantic-state');
		return;
	}
	if (action === 'input-error' || action === 'input-success') {
		const name = action === 'input-error' ? 'Inválido' : 'Válido';
		const field = preview.getByRole('textbox', { name });
		await expect(field).toBeVisible();
		if (action === 'input-error') {
			await expect(field).toHaveAttribute('aria-invalid', 'true');
			await expect(preview.getByRole('alert', { name: '' }).first()).toContainText('Revise o valor');
			checks.push('invalid-aria-and-error-message');
		} else {
			await expect(field).not.toHaveAttribute('aria-invalid', 'true');
			await expect(field).toHaveClass(/border-form-success/);
			checks.push('valid-border-and-no-invalid-aria');
		}
		return;
	}
	if (action === 'checkbox-selected') {
		const checkbox = preview.getByRole('checkbox', { name: 'sm' });
		await checkbox.check();
		await expect(checkbox).toBeChecked();
		checks.push('checked-semantic-state');
		return;
	}
	if (action === 'tabs-selected') {
		const tab = preview.getByRole('tab', { name: 'Histórico' });
		await tab.click();
		await expect(tab).toHaveAttribute('aria-selected', 'true');
		checks.push('tab-selected');
		return;
	}
	if (action === 'accordion-open') {
		const trigger = preview.getByRole('button', { name: 'Segunda seção' });
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		checks.push('accordion-expanded');
		return;
	}
	if (action === 'dropdown-open') {
		await preview.getByRole('button', { name: 'Abrir ações' }).click();
		await expect(page.getByRole('menuitem', { name: 'Exportar' })).toBeVisible();
		checks.push('dropdown-open');
		return;
	}
	if (action === 'dialog-open' || action === 'drawer-open') {
		const kind = action === 'dialog-open' ? 'Dialog' : 'Drawer';
		const trigger = preview.getByRole('button', { name: 'Abrir ' + kind });
		await trigger.click();
		const dialog = page.getByRole('dialog', { name: 'Exemplo de ' + kind });
		await expect(dialog).toBeVisible();
		// O foco deve entrar na camada antes da inspeção, sem pressupor cor do ring.
		await expect.poll(async () => dialog.locator(':focus').count()).toBeGreaterThan(0);
		checks.push('dialog-visible-and-focused');
		return;
	}
	if (action === 'popover-open') {
		await preview.getByRole('button', { name: 'Abrir popover' }).click();
		await expect(page.getByRole('button', { name: 'Concluir' })).toBeVisible();
		checks.push('popover-open');
		return;
	}
	if (action === 'tooltip-open') {
		await preview.getByRole('button', { name: 'Ajuda' }).hover();
		await expect(page.getByRole('tooltip')).toBeVisible();
		checks.push('tooltip-visible');
		return;
	}
	if (action === 'table-compact') {
		const table = preview.getByRole('table');
		await expect(table).toBeVisible();
		const initialDensity = await table.getAttribute('class');
		await preview.getByRole('button', { name: 'Alternar densidade' }).click();
		await expect.poll(async () => table.getAttribute('class')).not.toBe(initialDensity);
		checks.push('table-density-attribute-changed');
		return;
	}
	if (action.startsWith('smart-table-')) {
		const value = action.slice('smart-table-'.length);
		const select = preview.getByRole('combobox', { name: 'Estado da tabela' });
		await select.selectOption(value);
		await expect(select).toHaveValue(value);
		const table = preview.locator('.ads-smart-table');
		await expect(table).toBeVisible();
		if (value === 'empty') {
			await expect(table.getByText('Nenhum registro encontrado')).toBeVisible();
			checks.push('table-empty-state-visible');
		} else if (value === 'error') {
			await expect(table.getByRole('alert')).toContainText('Não foi possível carregar os dados');
			checks.push('table-error-alert-visible');
		} else if (value === 'loading') {
			await expect(table).toHaveAttribute('data-loading', '');
			await expect(table.locator('.ads-smart-table-skeleton').first()).toBeVisible();
			checks.push('table-loading-skeleton-visible');
		} else {
			throw new Error('Estado de tabela não suportado: ' + value);
		}
		return;
	}
	if (action === 'shell-collapsed' || action === 'shell-mobile') {
		const frame = preview.frameLocator('iframe[title="Shell administrativo independente"]');
		if (action === 'shell-collapsed') {
			const toggle = frame.getByRole('button', { name: 'Recolher barra lateral' });
			await expect(toggle).toBeVisible();
			await toggle.click();
			await expect(frame.getByRole('button', { name: 'Expandir barra lateral' })).toBeVisible();
			checks.push('sidebar-collapsed');
		} else {
			const toggle = frame.getByRole('button', { name: 'Abrir navegação' });
			await expect(toggle).toBeVisible();
			await toggle.click();
			await expect(frame.getByRole('dialog')).toBeVisible();
			checks.push('sidebar-mobile-drawer-open');
		}
		return;
	}
	throw new Error('Ação ainda não implementada: ' + action);
}

for (const scenario of plan.scenarios) {
	test('cobertura de estado / ' + scenario.id, async ({ page }) => {
		test.setTimeout(90_000);
		const entry = catalogEntries.find((candidate) => candidate.name === scenario.name);
		if (!entry) throw new Error('Export não encontrado no catálogo: ' + scenario.name);
		const evidence: Evidence = {
			...scenario,
			route: entry.href,
			screenshot: null,
			checks: [],
			error: null,
		};
		try {
			await page.setViewportSize({ width: scenario.width, height: 900 });
			if (scenario.media === 'reduced-motion') {
				await page.emulateMedia({ reducedMotion: 'reduce' });
				expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
				evidence.checks.push('reduced-motion-active');
			}
			if (scenario.media === 'forced-colors') {
				await page.emulateMedia({ forcedColors: 'active' });
				expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
				evidence.checks.push('forced-colors-active');
			}
			const response = await page.goto(entry.href, { waitUntil: 'domcontentloaded' });
			if (!response?.ok()) throw new Error('Falha HTTP ' + String(response?.status()));
			await expect(page.getByRole('heading', { name: entry.name, level: 1, exact: true })).toBeVisible();
			const preview = page.getByRole('region', { name: 'Demonstração interativa' });
			await page.getByLabel('Tema da demonstração').selectOption(scenario.theme);
			await expect(preview).toHaveAttribute('data-theme', scenario.theme);
			await performAction(page, preview, scenario, evidence.checks);
			await page.evaluate(() => document.fonts.ready);
			const image = 'screenshots/states/' + scenario.id + '-' + scenario.theme + '-' + scenario.width + '.png';
			mkdirSync(join(output, 'screenshots/states'), { recursive: true });
			await page.screenshot({
				path: join(output, image),
				animations: 'disabled',
				timeout: 20_000,
			});
			evidence.screenshot = image;
		} catch (error) {
			evidence.error = error instanceof Error ? error.message : String(error);
		} finally {
			mkdirSync(join(output, 'states'), { recursive: true });
			writeFileSync(join(output, 'states', scenario.id + '.json'), JSON.stringify(evidence, null, 2) + '\n');
		}
		expect(evidence.error, 'erro na execução do cenário ' + scenario.id).toBeNull();
	});
}
