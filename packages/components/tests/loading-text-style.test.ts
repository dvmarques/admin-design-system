import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(import.meta.dirname, '../src/styles.css'), 'utf8');
const loadingTextCss = css.slice(css.indexOf('@keyframes ads-loading-text-shimmer'));

describe('AdsLoadingText: regressão do shimmer (#228)', () => {
	it('mantém duas camadas de gradiente para brilho e texto-base sempre visível', () => {
		expect(loadingTextCss).toContain(
			'linear-gradient(var(--ads-loading-text-base), var(--ads-loading-text-base))',
		);
		expect(loadingTextCss).toMatch(/background-size:\s+200% 100%,\s+100% 100%/);
		expect(loadingTextCss).toMatch(/background-position:\s+150% center,\s+0 0/);
		expect(loadingTextCss).toMatch(/background-position:\s+-150% center,\s+0 0/);
	});

	it('usa base apagada derivada dos tokens no claro e no escuro, com fallback text-muted', () => {
		expect(loadingTextCss).toContain('--ads-loading-text-base: var(--ads-color-text-muted);');
		expect(loadingTextCss).toContain(
			":where([data-theme='dark']) .ads-loading-text[data-loading='true']",
		);
		expect(loadingTextCss).toContain('var(--ads-color-text-muted) 77%');
		expect(loadingTextCss).toContain('var(--ads-color-surface) 23%');
		expect(loadingTextCss).toContain('var(--ads-color-text-muted) 42%');
		expect(loadingTextCss).toContain('var(--ads-color-surface) 58%');
	});

	it('mantém a razão de contraste base/pico em ~4,2:1 (referência do Daniel) nos dois temas', async () => {
		const tokensUrl = pathToFileURL(resolve(import.meta.dirname, '../../tokens/source/tokens.mjs'));
		const { tokenSource } = (await import(/* @vite-ignore */ tokensUrl.href)) as {
			tokenSource: {
				color: {
					reference: Record<string, string>;
					semantic: Record<'light' | 'dark', Record<string, string>>;
				};
			};
		};
		const rgb = (hex: string) =>
			[1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
		const luminance = (channels: number[]) => {
			const [red, green, blue] = channels.map((channel) => {
				const value = channel / 255;
				return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
			});
			return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
		};
		const ratio = (first: number[], second: number[]) => {
			const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
			return (light + 0.05) / (dark + 0.05);
		};
		const tokenRgb = (theme: 'light' | 'dark', role: string) =>
			rgb(tokenSource.color.reference[tokenSource.color.semantic[theme][role].slice(17, -1)]);
		// Ordem no CSS: claro (padrão), dark explícito e dark do sistema.
		const shares = [...loadingTextCss.matchAll(/var\(--ads-color-text-muted\) (\d+)%/g)].map(
			(match) => Number(match[1]) / 100,
		);
		expect(shares).toEqual([0.77, 0.42, 0.42]);
		const mutedShare = { light: shares[0], dark: shares[1] };
		for (const theme of ['light', 'dark'] as const) {
			const muted = tokenRgb(theme, 'textMuted');
			const surface = tokenRgb(theme, 'surface');
			const base = muted.map(
				(channel, index) => channel * mutedShare[theme] + surface[index] * (1 - mutedShare[theme]),
			);
			const peak = tokenRgb(theme, 'textPrimary');
			expect(ratio(base, peak), `razão base/pico no tema ${theme}`).toBeGreaterThan(4.1);
			expect(ratio(base, peak), `razão base/pico no tema ${theme}`).toBeLessThan(4.3);
		}
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
