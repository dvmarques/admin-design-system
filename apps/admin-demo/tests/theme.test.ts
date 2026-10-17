import { afterEach, describe, expect, it } from 'vitest';
import { applyTheme, resolveTheme, themeCookieName, themeInitScript } from '../lib/theme';

describe('resolveTheme', () => {
	it('uses light as the deterministic fallback', () => {
		expect(resolveTheme(undefined)).toBe('light');
	});

	it('preserves an explicit dark theme', () => {
		expect(resolveTheme('dark')).toBe('dark');
	});

	it('falls back to light for unknown values', () => {
		expect(resolveTheme('sepia')).toBe('light');
	});
});

describe('applyTheme', () => {
	afterEach(() => {
		delete document.documentElement.dataset.theme;
		document.cookie = `${themeCookieName}=; max-age=0; path=/`;
	});

	it('sets the data-theme attribute and the cookie the server reads', () => {
		applyTheme('dark');

		expect(document.documentElement.dataset.theme).toBe('dark');
		expect(document.cookie).toContain(`${themeCookieName}=dark`);
	});

	it('replaces a previous theme', () => {
		applyTheme('dark');
		applyTheme('light');

		expect(document.documentElement.dataset.theme).toBe('light');
		expect(document.cookie).toContain(`${themeCookieName}=light`);
	});
});

describe('themeInitScript', () => {
	afterEach(() => {
		delete document.documentElement.dataset.theme;
		document.cookie = `${themeCookieName}=; max-age=0; path=/`;
	});

	it('applies the saved dark theme before hydration', () => {
		document.cookie = `${themeCookieName}=dark; path=/`;

		new Function(themeInitScript)();

		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('leaves the theme untouched without a saved preference', () => {
		new Function(themeInitScript)();

		expect(document.documentElement.dataset.theme).toBeUndefined();
	});
});
