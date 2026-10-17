import { readServerTheme } from '../../../lib/server-theme';
import { PreferencesContent } from './preferences-content';

export default async function PreferencesPage() {
	const theme = await readServerTheme();

	return <PreferencesContent initialTheme={theme} />;
}
