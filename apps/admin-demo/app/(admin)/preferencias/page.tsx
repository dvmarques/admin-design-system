import { cookies } from 'next/headers';
import { resolveTheme, themeCookieName } from '../../../lib/theme';
import { PreferencesContent } from './preferences-content';

export default async function PreferencesPage() {
	const cookieStore = await cookies();
	const theme = resolveTheme(cookieStore.get(themeCookieName)?.value);

	return <PreferencesContent initialTheme={theme} />;
}
