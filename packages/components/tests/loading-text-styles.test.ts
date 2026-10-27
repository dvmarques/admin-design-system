import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// `npm test` builds `dist/styles.css` first, so this checks the stylesheet consumers receive.
const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');
const contrastPairs = await readFile(
	resolve(import.meta.dirname, '../../tokens/tests/contrast-pairs.mjs'),
	'utf8',
);

/** Corpo da primeira regra cujo seletor é exatamente `selector` (CSS minificado do build). */
function ruleBody(source: string, selector: string) {
	const start = source.indexOf(`${selector}{`);
	expect(start, `regra ${selector} ausente no CSS distribuído`).toBeGreaterThanOrEqual(0);
	return source.slice(start + selector.length + 1, source.indexOf('}', start));
}

/** Todos os blocos `@media query{...}` (chaves balanceadas) que estilizam AdsLoadingText. */
function mediaBlock(query: string) {
	const blocks: string[] = [];
	for (
		let start = css.indexOf(`@media ${query}{`);
		start >= 0;
		start = css.indexOf(`@media ${query}{`, start + 1)
	) {
		let depth = 0;
		for (let index = css.indexOf('{', start); index < css.length; index += 1) {
			if (css[index] === '{') depth += 1;
			if (css[index] === '}' && --depth === 0) {
				blocks.push(css.slice(start, index + 1));
				break;
			}
		}
	}
	const own = blocks.filter((block) => block.includes('.ads-loading-text['));
	expect(own, `@media ${query} sem regra de AdsLoadingText`).toHaveLength(1);
	return own[0];
}

const active = '.ads-loading-text[data-loading=true]';

describe('AdsLoadingText no CSS distribuído', () => {
	it('anima somente com loading=true e não tem regra base que afete o layout', () => {
		expect(css).not.toContain('.ads-loading-text{');
		const body = ruleBody(css, active);
		expect(body).toContain('animation:2.5s ease-in-out infinite ads-loading-text-shimmer');
		expect(css).toContain('@keyframes ads-loading-text-shimmer');
	});

	it('limita o brilho aos glifos sem alterar caixa, dimensões ou posicionamento', () => {
		const body = ruleBody(css, active);
		expect(body).toContain('background-clip:text');
		expect(body).toContain('-webkit-text-fill-color:transparent');
		expect(body).not.toMatch(
			/(^|;)(display|position|width|height|margin|padding|font-[a-z-]+|line-height):/,
		);
		// O keyframe anima somente a posição do fundo (sem propriedades de layout).
		expect(css).toContain('@keyframes ads-loading-text-shimmer{to{background-position:-150% 0}}');
	});

	it('define as três velocidades, com normal em 2,5 segundos', () => {
		expect(css).toContain('.ads-loading-text[data-speed=slow]{animation-duration:4s}');
		expect(css).toContain('.ads-loading-text[data-speed=fast]{animation-duration:1.5s}');
		expect(css).not.toContain('data-speed=normal');
	});

	it('usa apenas tokens semânticos de texto, sem cores literais', () => {
		const rules = [
			ruleBody(css, active),
			mediaBlock('(prefers-reduced-motion:reduce)'),
			mediaBlock('(forced-colors:active)'),
		].join('\n');
		expect(rules).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i);
		const tokens = new Set([...rules.matchAll(/var\((--[\w-]+)\)/g)].map((match) => match[1]));
		expect(tokens).toEqual(
			new Set(['--ads-color-text', '--ads-color-text-muted', '--ads-color-text-primary']),
		);
	});

	it('mantém os papéis de cor usados dentro da verificação de contraste WCAG dos tokens', () => {
		for (const role of ['text', 'textPrimary', 'textMuted'])
			expect(contrastPairs).toContain(`against('text', '${role}', surfaces)`);
	});

	it('desliga animação e gradiente com movimento reduzido, preservando o texto sólido', () => {
		const block = mediaBlock('(prefers-reduced-motion:reduce)');
		expect(block).toContain(active);
		expect(block).toContain('animation:none');
		expect(block).toContain('background-image:none');
		expect(block).toContain('-webkit-text-fill-color:currentColor');
	});

	it('usa cores de sistema com forced-colors, sem depender do gradiente', () => {
		const block = mediaBlock('(forced-colors:active)');
		expect(block).toContain('animation:none');
		expect(block).toContain('background-image:none');
		expect(block).toContain('-webkit-text-fill-color:CanvasText');
		expect(block).toContain('color:canvastext');
	});
});
