import { readFile } from 'node:fs/promises';
import { createArtifacts } from './generate-tokens.mjs';
import { tokenSource } from '../source/tokens.mjs';

const expected = createArtifacts(tokenSource);
const [css, module] = await Promise.all([
	readFile(new URL('../dist/tokens.css', import.meta.url), 'utf8'),
	readFile(new URL('../src/generated.ts', import.meta.url), 'utf8'),
]);
if (css !== expected.css || module !== expected.module)
	throw new Error('Generated token artifacts are outdated. Run npm run generate.');
