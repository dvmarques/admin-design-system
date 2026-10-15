import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../../..');
const docs = ['packages/tokens/README.md', 'docs/integration.md'] as const;

// Portal overlays render in a `div[data-theme]` outside `<html>`, which `:root[data-theme]` never matches.
it.each(docs)('%s does not recommend :root[data-theme] for token overrides', async (path) => {
	const text = await readFile(resolve(root, path), 'utf8');
	const recommended = text.split('\n').filter((line) => /^:root\[data-theme/.test(line.trim()));
	expect(recommended).toEqual([]);
});

it('the tokens README documents the portal-safe selectors', async () => {
	const text = await readFile(resolve(root, 'packages/tokens/README.md'), 'utf8');
	expect(text).toContain("[data-theme='dark']");
	expect(text).toMatch(/overlays?/i);
});
