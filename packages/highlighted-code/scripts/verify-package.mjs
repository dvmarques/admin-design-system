import { access, readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
for (const path of [
	manifest.exports['.'].import,
	manifest.exports['.'].types,
	manifest.exports['./styles.css'],
]) {
	await access(new URL(`../${path.replace('./', '')}`, import.meta.url));
}

const source = await readFile(
	new URL('../dist/highlighted-code-snippet.js', import.meta.url),
	'utf8',
);
if (!source.startsWith("'use client'"))
	throw new Error('Client directive was not preserved in highlighted-code-snippet');
if (source.includes('react.development'))
	throw new Error('React must not be bundled into the package artifact');
