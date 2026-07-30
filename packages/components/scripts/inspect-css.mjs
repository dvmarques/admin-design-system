import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
const requiredSelectors = ['.bg-surface', '.border-primary', '.bg-danger'];

for (const selector of requiredSelectors) {
	if (!css.includes(selector)) throw new Error(`Missing compiled selector: ${selector}`);
}

if (css.includes('@source') || css.includes('/src/')) {
	throw new Error('The compiled stylesheet contains source directives or workspace paths');
}

if (css.includes('*,:after,:before')) {
	throw new Error('The default component stylesheet must not include Tailwind preflight');
}
