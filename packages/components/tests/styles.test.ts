import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('build distributes static Tailwind utilities without preflight', async () => {
	const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');
	expect(css).toMatch(/\.bg-surface/);
	expect(css).toMatch(/\.border-primary/);
	expect(css).not.toMatch(/\*,:after,:before/);
});
