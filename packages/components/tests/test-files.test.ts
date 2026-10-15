import { readdir } from 'node:fs/promises';
import { expect, it } from 'vitest';

// Vitest only runs `*.test.ts` and `*.test.tsx`; any other test file would silently never run.
it('every test file in the package is picked up by the test runner', async () => {
	const files = await readdir(import.meta.dirname);
	const orphans = files.filter((file) => /\.test\./.test(file) && !/\.test\.tsx?$/.test(file));
	expect(orphans).toEqual([]);
});
