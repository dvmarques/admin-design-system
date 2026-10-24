'use client';

import { AdsThemeControl } from '@admin-ds/components';
import { applyThemePreference, type ThemePreference } from '../lib/theme';
import { useThemePreference } from './use-theme';

/** Compact icon-only theme menu for the header; shares its state with the preferences page. */
export function ThemeControl({
	initialPreference = 'system',
}: {
	initialPreference?: ThemePreference;
}) {
	const preference = useThemePreference(initialPreference);

	return <AdsThemeControl onValueChange={applyThemePreference} value={preference} />;
}
