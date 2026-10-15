import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const dataDir = resolve(import.meta.dirname, '../lib/data');

// Rendering twice in one process would not catch a value computed once when the module loads,
// so the static data is also checked at the source level.
describe('static demo data', () => {
	it('never reads the clock or random numbers', async () => {
		const files = (await readdir(dataDir, { recursive: true })).filter((file) =>
			/\.tsx?$/.test(file),
		);
		expect(files.length).toBeGreaterThan(0);

		for (const file of files) {
			const source = await readFile(resolve(dataDir, file), 'utf8');
			expect(source, file).not.toMatch(/\bDate\b|Math\.random|crypto\.randomUUID|performance\.now/);
		}
	});
});
