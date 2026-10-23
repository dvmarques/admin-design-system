import type { Page } from '@playwright/test';

/**
 * No desktop o shell limita a altura à viewport e rola o main por dentro, então uma captura
 * `fullPage` mostraria só a primeira tela. Libera a altura apenas para a captura, preservando as
 * linhas de base do conteúdo completo da página.
 */
export async function releaseShellHeight(page: Page) {
	await page.addStyleTag({
		content:
			'.ads-admin-shell{height:auto!important;overflow:visible!important}' +
			'.ads-admin-shell-main{overflow:visible!important}',
	});
}
