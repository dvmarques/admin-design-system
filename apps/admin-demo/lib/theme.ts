/** The theme actually applied to the page. */
export type Theme = 'light' | 'dark';

/** What the person chose; `system` follows `prefers-color-scheme`. */
export type ThemePreference = Theme | 'system';

/** Cookie that carries the preference from the browser to the server render. */
export const themeCookieName = 'ads-theme';

const darkSchemeQuery = '(prefers-color-scheme: dark)';

export function resolveTheme(value: string | undefined): Theme {
	return value === 'dark' ? 'dark' : 'light';
}

/**
 * Reads a saved preference. Cookies written before `system` existed hold `light` or `dark` and stay
 * valid; a missing or unknown value means `system`.
 */
export function resolvePreference(value: string | undefined): ThemePreference {
	return value === 'light' || value === 'dark' ? value : 'system';
}

/**
 * The theme to render for a preference. `systemTheme` is what the operating system prefers: the
 * server does not know it, so it renders the `light` fallback and the init script corrects it
 * before the first paint.
 */
export function themeForPreference(
	preference: ThemePreference,
	systemTheme: Theme = 'light',
): Theme {
	return preference === 'system' ? systemTheme : preference;
}

/** The operating system's scheme. Falls back to `light` where `matchMedia` is unavailable. */
export function readSystemTheme(): Theme {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
	return window.matchMedia(darkSchemeQuery).matches ? 'dark' : 'light';
}

/**
 * Applies a preference in the browser. The attributes of `<html>` are the single source of truth
 * shared by every control: `data-theme-preference` holds the choice and `data-theme` the effective
 * theme that drives the CSS variables. The cookie makes the server render the same preference next
 * time; if it cannot be written (blocked storage), the choice still applies to this session. Only
 * touches `document` when called, so this module stays safe to import from Server Components.
 */
export function applyThemePreference(preference: ThemePreference) {
	const root = document.documentElement;
	root.dataset.themePreference = preference;
	root.dataset.theme = themeForPreference(preference, readSystemTheme());
	try {
		document.cookie = `${themeCookieName}=${preference}; path=/; max-age=31536000; samesite=lax`;
	} catch {
		// Storage is unavailable: the preference lives only in the page.
	}
}

/**
 * Inline script that applies the saved preference to `<html>` before the first paint, in every
 * build: with `system` or no saved value the server could only render the `light` fallback. Kept as
 * a string so it can run before React hydrates.
 */
export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${themeCookieName}=([^;]*)/);var p=m?m[1]:'';if(p!=='light'&&p!=='dark')p='system';var t=p==='system'?(matchMedia('${darkSchemeQuery}').matches?'dark':'light'):p;var d=document.documentElement;d.dataset.themePreference=p;d.dataset.theme=t}catch(e){}})();`;
