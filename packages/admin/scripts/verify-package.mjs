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
for (const selector of ['.ads-admin-shell', '.ads-admin-shell-sidebar', '.ads-admin-shell-main']) {
	if (!css.includes(selector)) throw new Error(`Missing selector: ${selector}`);
}
