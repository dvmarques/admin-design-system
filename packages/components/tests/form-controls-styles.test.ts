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

describe('typography in the distributed CSS without preflight', () => {
	it('includes the tokenized font-sans utility used by native text controls', () => {
		expect(css).toMatch(/\.font-sans\{font-family:var\(--ads-typography-font-family\)\}/);
	});
});

describe('date picker trigger height in the distributed CSS', () => {
	it('contains the utilities that let the trigger follow the field height', () => {
		expect(css).toContain(
			'.\\[\\&\\>\\.ads-popover-anchor\\]\\:self-stretch>.ads-popover-anchor{align-self:stretch}',
		);
		expect(css).toContain('.min-h-0\\!{min-height:0!important}');
	});
});

describe('AdsSelect long text and placeholder in the distributed CSS', () => {
	const rule = (selector: string) => css.match(new RegExp(`${selector}\\{([^}]*)\\}`))?.[1] ?? '';

	it('truncates the selected text only for the simple select', () => {
		const body = rule('select\\.ads-select:not\\(\\[multiple\\]\\):not\\(\\[size\\]\\)');
		expect(body).toContain('text-overflow:ellipsis');
		expect(body).toContain('white-space:nowrap');
		expect(body).toContain('min-width:0');
		expect(body).toContain('padding-inline-end:2.25rem');
	});

	it('does not leak the truncation into the shared form control classes', () => {
		expect(css).not.toMatch(/\.ads-form-control\{[^}]*text-overflow/);
	});

	it('mutes only the placeholder state and keeps the option text color', () => {
		expect(css).toContain(
			'.ads-select:has(>[data-ads-select-placeholder]:checked){color:var(--ads-color-text-muted)}',
		);
		expect(css).toContain(
			'.ads-select:has(>[data-ads-select-placeholder]:checked) option{color:var(--ads-color-text)}',
		);
	});
});
