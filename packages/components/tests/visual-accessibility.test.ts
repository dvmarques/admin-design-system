import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const srcDir = resolve(import.meta.dirname, '../src');
const sourceFiles = (await readdir(srcDir)).filter((name) => /\.tsx?$/.test(name));
const sources = await Promise.all(
	sourceFiles.map(async (name) => [name, await readFile(resolve(srcDir, name), 'utf8')] as const),
);
// `npm test` builds `dist/styles.css` first, so this checks the stylesheet consumers receive.
const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');

/** Arquivos autorizados a manter uma animação sem `motion-reduce:`; informe o motivo. */
const animationExceptions: Record<string, string> = {};

describe('reduced motion in component sources', () => {
	it.each(sources)('%s uses motion tokens for durations', (name, source) => {
		const literalDurations = source.match(/\bduration-\d+\b/g) ?? [];
		expect(literalDurations, `${name} usa duração literal em vez de --ads-motion-*`).toEqual([]);
	});

	it.each(sources)('%s disables looping animations with motion-reduce', (name, source) => {
		if (name in animationExceptions) return;
		const animated = /\banimate-(?!none\b)[a-z-]+/.test(source);
		if (animated)
			expect(source, `${name} anima sem motion-reduce:animate-none`).toContain(
				'motion-reduce:animate-none',
			);
	});
});

describe('distributed CSS for user preferences', () => {
	it('drives default transition durations from the motion token', () => {
		expect(css).toMatch(/--default-transition-duration:\s*var\(--ads-motion-fast\)/);
	});

	it('maps the control border role used by form controls', () => {
		expect(css).toMatch(/--color-border-control:\s*var\(--ads-color-border-control\)/);
		expect(css).toContain('.border-border-control');
	});

	it('limits the readonly look to the readonly attribute, not to select elements', () => {
		// `select` casa com `:read-only`, o que apagaria a borda de controle do AdsSelect.
		expect(css).not.toContain(':read-only');
		expect(css).toMatch(/\[readonly\]/);
	});

	it('styles selection indicators with system colors under forced-colors', () => {
		const forced = css.slice(css.indexOf('@media (forced-colors:active)'));
		expect(forced).toContain('highlight');
		expect(forced).toContain('highlighttext');
		expect(forced).toContain('forced-color-adjust:none');
		expect(forced).toMatch(/aria-selected=true\]>\.ads-date-picker__day/);
	});
});
