import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// `npm test` builds `dist/styles.css` first, so this checks the stylesheet consumers receive.
const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');

const selectionGroupClasses = ['m-0', 'min-w-0', 'border-0', 'p-0'] as const;

describe('selection group reset in the distributed CSS', () => {
	it.each(selectionGroupClasses)('contains the %s utility used by AdsSelectionGroup', (name) => {
		expect(css).toContain(`.${name}`);
	});
});

describe('text control box sizing in the distributed CSS', () => {
	it('contains the box-border utility used by AdsInput, AdsTextarea and AdsSelect', () => {
		expect(css).toContain('.box-border{box-sizing:border-box}');
	});
});
