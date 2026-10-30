import { expect, test, type Locator, type Page } from '@playwright/test';

async function focusInside(layer: Locator) {
	return layer.evaluate((element) => element.contains(document.activeElement));
}

/** Pressiona a tecla várias vezes e exige que o foco real nunca saia da camada modal. */
async function pressStayingInside(
	page: Page,
	layer: Locator,
	key: 'Tab' | 'Shift+Tab',
	times: number,
) {
	for (let index = 0; index < times; index += 1) {
		await page.keyboard.press(key);
		expect(await focusInside(layer), `${key} #${index + 1} saiu do modal`).toBe(true);
	}
}

async function openDialog(page: Page) {
	await page.goto('/catalogo/dialog');
	await page.getByRole('button', { name: 'Abrir Dialog', exact: true }).click();
	const layer = page.getByRole('dialog', { name: 'Exemplo de Dialog' });
	await expect(layer.getByRole('button', { name: 'Fechar', exact: true })).toBeFocused();
	return layer;
}

test.describe('Dialog: grupo de rádio na ponta do ciclo (Chromium)', () => {
	test('Tab e Shift+Tab dão a volta sem sair brevemente para o documento', async ({ page }) => {
		const layer = await openDialog(page);
		await layer.evaluate((element) => {
			const group = document.createElement('div');
			group.setAttribute('role', 'radiogroup');
			group.setAttribute('aria-label', 'Prioridade');
			for (const [value, checked] of [
				['baixa', false],
				['media', true],
				['alta', false],
			] as const) {
				const input = document.createElement('input');
				input.type = 'radio';
				input.name = 'prioridade';
				input.value = value;
				input.checked = checked;
				input.setAttribute('aria-label', value);
				group.append(input);
			}
			element.querySelector('p')?.after(group);
			// Move o grupo para o fim do conteúdo, depois do último controle original.
			element.querySelectorAll('fieldset').forEach((fieldset) => fieldset.after(group));
		});
		const media = layer.getByRole('radio', { name: 'media' });
		const close = layer.getByRole('button', { name: 'Fechar', exact: true });
		await media.focus();
		// O grupo é a última parada: um Tab leva direto ao início do ciclo, sem passar pelo documento.
		await page.keyboard.press('Tab');
		await expect(close).toBeFocused();
		await page.keyboard.press('Shift+Tab');
		await expect(media).toBeFocused();
		await pressStayingInside(page, layer, 'Tab', 8);
		await pressStayingInside(page, layer, 'Shift+Tab', 8);
	});
});

test.describe('Dialog: tabindex positivo (Chromium)', () => {
	test('as pontas seguem a ordem real de tabulação', async ({ page }) => {
		const layer = await openDialog(page);
		await layer.evaluate((element) => {
			const make = (label: string, tabIndex: number) => {
				const button = document.createElement('button');
				button.type = 'button';
				button.textContent = label;
				button.tabIndex = tabIndex;
				return button;
			};
			const host = element.querySelector('p')!.parentElement!;
			host.append(make('Positivo dois', 2), make('Positivo um', 1));
		});
		const um = layer.getByRole('button', { name: 'Positivo um' });
		const dois = layer.getByRole('button', { name: 'Positivo dois' });
		// Ordem real: Positivo um, Positivo dois, depois os demais controles em ordem de documento.
		await um.focus();
		await page.keyboard.press('Tab');
		await expect(dois).toBeFocused();
		await page.keyboard.press('Shift+Tab');
		await expect(um).toBeFocused();
		// Shift+Tab na primeira parada real dá a volta para a última da ordem real, dentro do modal.
		await page.keyboard.press('Shift+Tab');
		expect(await focusInside(layer)).toBe(true);
		await expect(um).not.toBeFocused();
		await pressStayingInside(page, layer, 'Tab', 10);
		await pressStayingInside(page, layer, 'Shift+Tab', 10);
	});
});

test.describe('Dialog: foco inicial', () => {
	test('abrir move o foco para dentro do modal', async ({ page }) => {
		const layer = await openDialog(page);
		expect(await focusInside(layer)).toBe(true);
	});
});
