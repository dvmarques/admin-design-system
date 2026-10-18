import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('build distributes static Tailwind utilities without preflight', async () => {
	const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');
	expect(css).toMatch(/\.bg-surface/);
	expect(css).toMatch(/\.border-primary/);
	expect(css).not.toMatch(/\*,:after,:before/);
});

it('distributes the font-sans utility mapped to the public font family token', async () => {
	const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');
	expect(css).toContain('.font-sans{font-family:var(--ads-typography-font-family)}');
});
