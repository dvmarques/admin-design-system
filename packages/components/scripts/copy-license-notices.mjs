import { copyFile, mkdir } from 'node:fs/promises';

// @dvmarques/admin-ds-components only publishes dist/. Ship licenses alongside the SVG implementation.
const destination = new URL('../dist/', import.meta.url);
await mkdir(destination, { recursive: true });

for (const name of ['LICENSE.md', 'THIRD_PARTY_NOTICES.md']) {
	await copyFile(new URL(`../../../${name}`, import.meta.url), new URL(name, destination));
}
