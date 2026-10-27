import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(fileURLToPath(new URL('../src/styles.css', import.meta.url)), 'utf8');
const loadingTextCss = css.slice(css.indexOf('@keyframes ads-loading-text-shimmer'));

describe('AdsLoadingText: regressão do shimmer (#228)', () => {
	it('mantém duas camadas de gradiente para brilho e texto-base sempre visível', () => {
		expect(loadingTextCss).toContain(
			'linear-gradient(var(--ads-loading-text-base), var(--ads-loading-text-base))',
		);
		expect(loadingTextCss).toContain('background-size: 200% 100%, 100% 100%');
		expect(loadingTextCss).toContain('background-position: 150% center, 0 0');
		expect(loadingTextCss).toContain('background-position: -150% center, 0 0');
	});

	it('reforça contraste no tema escuro utilizando tokens existentes', () => {
		expect(loadingTextCss).toContain(
			":where([data-theme='dark']) .ads-loading-text[data-loading='true']",
		);
		expect(loadingTextCss).toContain('var(--ads-color-text-muted) 70%');
		expect(loadingTextCss).toContain('var(--ads-color-surface) 30%');
	});

	it('preserva velocidades, preferências de movimento e fallback acessível', () => {
		expect(loadingTextCss).toContain("data-speed='slow'");
		expect(loadingTextCss).toContain("data-speed='fast'");
		expect(loadingTextCss).toContain('2.5s ease-in-out infinite');
		expect(loadingTextCss).toContain('@media (prefers-reduced-motion: reduce)');
		expect(loadingTextCss).toContain('@media (forced-colors: active)');
		expect(loadingTextCss).toContain(
			'@supports ((-webkit-background-clip: text) or (background-clip: text))',
		);
	});
});
