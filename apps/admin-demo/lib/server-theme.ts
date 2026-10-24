import { cookies } from 'next/headers';
import { resolvePreference, themeCookieName, type ThemePreference } from './theme';

/**
 * True when the demo is built as a static site (GitHub Pages). There is no request to read cookies
 * from in that build, so the preference is resolved in the browser instead (see `themeInitScript`).
 */
export const isStaticExport = process.env.GITHUB_PAGES === 'true';

/**
 * The preference the server should render: the saved cookie, or `system` when there is none (and
 * always in the static export). `system` renders the `light` fallback until the init script runs.
 */
export async function readServerPreference(): Promise<ThemePreference> {
	if (isStaticExport) return 'system';

	const cookieStore = await cookies();
	return resolvePreference(cookieStore.get(themeCookieName)?.value);
}
