import { access, readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await access(new URL(`../${manifest.exports['.'].import.replace('./', '')}`, import.meta.url));
await access(new URL(`../${manifest.exports['.'].types.replace('./', '')}`, import.meta.url));
