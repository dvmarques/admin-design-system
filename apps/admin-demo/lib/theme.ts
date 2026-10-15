export type Theme = 'light' | 'dark';

/** Cookie that carries the theme from the browser to the server render. */
export const themeCookieName = 'ads-theme';

export function resolveTheme(value: string | undefined): Theme {
	return value === 'dark' ? 'dark' : 'light';
}

/**
 * Applies a theme in the browser: the attribute drives the CSS variables and the cookie makes the
 * server render the same theme next time. Only touches `document` when called, so this module
 * stays safe to import from Server Components.
 */
export function applyTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme;
	document.cookie = `${themeCookieName}=${theme}; path=/; max-age=31536000; samesite=lax`;
}
