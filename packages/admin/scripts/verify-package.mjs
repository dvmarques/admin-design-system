import { access, readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
for (const path of [
	manifest.exports['.'].import,
	manifest.exports['.'].types,
	manifest.exports['./styles.css'],
]) {
	await access(new URL(`../${path.replace('./', '')}`, import.meta.url));
}

const clientModule = await readFile(
	new URL('../dist/admin-shell-navigation.js', import.meta.url),
	'utf8',
);
if (!clientModule.startsWith("'use client'"))
	throw new Error('Client directive was not preserved in the distributed module');
if (clientModule.includes('react.development'))
	throw new Error('React must not be bundled into the package artifact');
if (!clientModule.includes("from '@admin-ds/components'"))
	throw new Error('Shared components must be consumed through the public package entry');

const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
if (css.includes('@source') || css.includes('@import') || css.includes('/src/'))
	throw new Error('The stylesheet must be self-contained and free of source directives');
if (css.includes('*,:after,:before'))
	throw new Error('The stylesheet must not include a global reset');
for (const selector of [
	'.ads-admin-shell',
	'.ads-admin-shell-sidebar',
	'.ads-admin-shell-main',
	'.ads-metric-card',
	'.ads-dashboard-grid',
	'.ads-dashboard-grid-items',
	'.ads-dashboard-panel',
	'.ads-filter-bar',
	'.ads-filter-bar-header',
	'@container ads-filter-bar (max-width: 40rem)',
	".ads-filter-bar-body[data-expanded='false']",
	'.ads-smart-table',
	'.ads-smart-table-sort',
	'.ads-smart-table .ads-table-row[data-selected]',
	'.ads-bulk-action-bar',
	'.ads-step-form',
	'.ads-step-form-panel[hidden]',
	'.ads-confirm-dialog-actions',
]) {
	if (!css.includes(selector)) throw new Error(`Missing selector: ${selector}`);
}

// A célula de seleção não pode ter largura percentual: com min-width: max-content na tabela,
// 1% faria a tabela inteira ter 100 vezes a largura da coluna (cerca de 5200 px).
const selectCell = css.match(/\.ads-smart-table-select-cell\s*\{([^}]*)\}/)?.[1];
if (selectCell === undefined) throw new Error('Missing selector: .ads-smart-table-select-cell');
if (/width:[^;]*%/.test(selectCell))
	throw new Error('.ads-smart-table-select-cell must not use a percentage width');
const panel = css.match(/\.ads-smart-table-columns-panel\s*\{([^}]*)\}/)?.[1];
if (panel === undefined) throw new Error('Missing selector: .ads-smart-table-columns-panel');
if (/position:\s*(absolute|fixed)/.test(panel))
	throw new Error('.ads-smart-table-columns-panel must be inline, not positioned over the table');
