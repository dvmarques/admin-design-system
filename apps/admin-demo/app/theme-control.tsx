'use client';

import { AdsThemeControl } from '@dvmarques/admin-ds-components';
import { applyThemePreference, type ThemePreference } from '../lib/theme';
import { useThemePreference } from './use-theme';

/**
 * Theme menu for the header: icon-only trigger (with tooltip) and options with icon and text, so
 * the choices are named when the menu opens. Shares its state with the preferences page.
 */
export function ThemeControl({
	initialPreference = 'system',
}: {
	initialPreference?: ThemePreference;
}) {
	const preference = useThemePreference(initialPreference);

	return (
		<AdsThemeControl
			optionDisplay="icon-text"
			triggerVariant="ghost"
			onValueChange={applyThemePreference}
			value={preference}
		/>
	);
}
