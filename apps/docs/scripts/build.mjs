import { mkdir, writeFile } from 'node:fs/promises';

await mkdir(new URL('../storybook-static/', import.meta.url), { recursive: true });
await writeFile(
	new URL('../storybook-static/index.html', import.meta.url),
	'<!doctype html><title>Admin DS docs</title>',
	'utf8',
);
