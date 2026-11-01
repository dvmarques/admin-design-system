import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	applyThemePreference,
	readSystemTheme,
	resolvePreference,
	resolveTheme,
	themeCookieName,
	themeForPreference,
	themeInitScript,
} from '../lib/theme';

function stubSystemScheme(dark: boolean) {
	vi.stubGlobal(
		'matchMedia',
		vi.fn((query: string) => ({ matches: dark && query.includes('dark') })),
	);
}

function reset() {
	delete document.documentElement.dataset.theme;
	delete document.documentElement.dataset.themePreference;
	document.cookie = `${themeCookieName}=; max-age=0; path=/`;
	vi.unstubAllGlobals();
}

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

describe('resolvePreference', () => {
	it.each(['light', 'dark', 'system'] as const)('keeps %s', (value) => {
		expect(resolvePreference(value)).toBe(value);
	});

	it('uses system when there is no saved value or it is unknown', () => {
		expect(resolvePreference(undefined)).toBe('system');
		expect(resolvePreference('sepia')).toBe('system');
	});
});

describe('themeForPreference', () => {
	it('keeps explicit preferences regardless of the system', () => {
		expect(themeForPreference('light', 'dark')).toBe('light');
		expect(themeForPreference('dark', 'light')).toBe('dark');
	});

	it('uses the system theme for system, with a light fallback', () => {
		expect(themeForPreference('system', 'dark')).toBe('dark');
		expect(themeForPreference('system')).toBe('light');
	});
});

describe('readSystemTheme', () => {
	afterEach(reset);

	it('follows prefers-color-scheme', () => {
		stubSystemScheme(true);
		expect(readSystemTheme()).toBe('dark');
		stubSystemScheme(false);
		expect(readSystemTheme()).toBe('light');
	});

	it('falls back to light without matchMedia', () => {
		vi.stubGlobal('matchMedia', undefined);
		expect(readSystemTheme()).toBe('light');
	});
});

describe('applyThemePreference', () => {
	afterEach(reset);

	it('sets the preference, the effective theme and the cookie the server reads', () => {
		applyThemePreference('dark');

		expect(document.documentElement.dataset.themePreference).toBe('dark');
		expect(document.documentElement.dataset.theme).toBe('dark');
		expect(document.cookie).toContain(`${themeCookieName}=dark`);
	});

	it('persists system and applies the effective system theme', () => {
		stubSystemScheme(true);

		applyThemePreference('system');

		expect(document.documentElement.dataset.themePreference).toBe('system');
		expect(document.documentElement.dataset.theme).toBe('dark');
		expect(document.cookie).toContain(`${themeCookieName}=system`);
	});

	it('keeps an explicit preference when the system disagrees', () => {
		stubSystemScheme(true);

		applyThemePreference('light');

		expect(document.documentElement.dataset.theme).toBe('light');
	});

	it('still applies the preference when the cookie cannot be written', () => {
		const setter = vi.spyOn(document, 'cookie', 'set').mockImplementation(() => {
			throw new Error('blocked');
		});

		expect(() => applyThemePreference('dark')).not.toThrow();
		expect(document.documentElement.dataset.theme).toBe('dark');
		expect(document.documentElement.dataset.themePreference).toBe('dark');
		setter.mockRestore();
	});
});

describe('themeInitScript', () => {
	afterEach(reset);

	function run() {
		new Function(themeInitScript)();
	}

	it('applies a saved dark preference before hydration', () => {
		document.cookie = `${themeCookieName}=dark; path=/`;

		run();

		expect(document.documentElement.dataset.theme).toBe('dark');
		expect(document.documentElement.dataset.themePreference).toBe('dark');
	});

	it('keeps a saved explicit light preference even when the system is dark', () => {
		stubSystemScheme(true);
		document.cookie = `${themeCookieName}=light; path=/`;

		run();

		expect(document.documentElement.dataset.theme).toBe('light');
		expect(document.documentElement.dataset.themePreference).toBe('light');
	});

	it('resolves system through prefers-color-scheme', () => {
		stubSystemScheme(true);
		document.cookie = `${themeCookieName}=system; path=/`;

		run();

		expect(document.documentElement.dataset.themePreference).toBe('system');
		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('uses system when there is no saved preference', () => {
		stubSystemScheme(true);

		run();

		expect(document.documentElement.dataset.themePreference).toBe('system');
		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('leaves the server render untouched when matchMedia fails', () => {
		document.documentElement.dataset.theme = 'light';
		vi.stubGlobal('matchMedia', () => {
			throw new Error('unavailable');
		});

		expect(run).not.toThrow();
		expect(document.documentElement.dataset.theme).toBe('light');
	});
});
