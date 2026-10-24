import { readServerPreference } from '../../../lib/server-theme';
import { PreferencesContent } from './preferences-content';

export default async function PreferencesPage() {
	const preference = await readServerPreference();

	return <PreferencesContent initialPreference={preference} />;
}
