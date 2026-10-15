import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// `npm test` builds `dist/styles.css` first, so this checks the stylesheet consumers receive.
const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');

const classes = [
	'text-text-muted',
	'text-text-secondary',
	'hover:text-text',
	'hover:bg-surface-hover',
	'bg-surface-selected',
	'text-on-surface-selected',
	'border-b-primary',
	'border-b-border',
	'no-underline',
] as const;

describe('navigation styles in the distributed CSS', () => {
	it.each(classes)('contains the %s utility used by tabs and breadcrumb', (name) => {
		expect(css).toContain(`.${name.replace(':', '\\:')}`);
	});
});
