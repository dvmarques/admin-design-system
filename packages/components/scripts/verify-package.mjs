import { access, readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
for (const path of [
	manifest.exports['.'].import,
	manifest.exports['.'].types,
	manifest.exports['./styles.css'],
]) {
	await access(new URL(`../${path.replace('./', '')}`, import.meta.url));
}

const clientModule = await readFile(new URL('../dist/theme-toggle.js', import.meta.url), 'utf8');
if (!clientModule.startsWith("'use client'"))
	throw new Error('Client directive was not preserved in the distributed module');
if (clientModule.includes('react.development'))
	throw new Error('React must not be bundled into the package artifact');
