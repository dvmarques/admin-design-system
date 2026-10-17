import { cookies } from 'next/headers';
import { resolveTheme, themeCookieName, type Theme } from './theme';

/**
 * True when the demo is built as a static site (GitHub Pages). There is no request to read cookies
 * from in that build, so the theme is resolved in the browser instead (see `themeInitScript`).
 */
export const isStaticExport = process.env.GITHUB_PAGES === 'true';

/** The theme the server should render: the saved cookie, or light in the static export. */
export async function readServerTheme(): Promise<Theme> {
	if (isStaticExport) return 'light';

	const cookieStore = await cookies();
	return resolveTheme(cookieStore.get(themeCookieName)?.value);
}
