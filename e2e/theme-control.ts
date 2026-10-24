import { expect, type Page } from '@playwright/test';

export type ThemePreference = 'light' | 'dark' | 'system';

const optionNames = { light: 'Claro', dark: 'Escuro', system: 'Sistema' } as const;

/** O gatilho compacto do cabeçalho; o nome acessível é "Tema: <preferência>". */
export const themeTrigger = (page: Page) => page.getByRole('button', { name: /^Tema: / });

/** Abre o menu do cabeçalho e escolhe a preferência diretamente. */
export async function chooseTheme(page: Page, preference: ThemePreference) {
	await themeTrigger(page).click();
	await page.getByRole('menuitemradio', { name: optionNames[preference], exact: true }).click();
	await expect(themeTrigger(page)).toHaveAccessibleName(`Tema: ${optionNames[preference]}`);
	// O foco volta ao gatilho e reabre o tooltip dele; dispensá-lo evita ruído nas verificações de axe.
	await page.keyboard.press('Escape');
	await expect(page.getByRole('tooltip')).toHaveCount(0);
}
