'use client';

import { useSyncExternalStore } from 'react';
import { resolvePreference, resolveTheme, type Theme, type ThemePreference } from '../lib/theme';

function subscribeTo(attribute: string) {
	return (onChange: () => void) => {
		const observer = new MutationObserver(onChange);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: [attribute] });
		return () => observer.disconnect();
	};
}

const subscribeToPreference = subscribeTo('data-theme-preference');
const subscribeToTheme = subscribeTo('data-theme');

/**
 * Reads the preference from `data-theme-preference` on `<html>`, so every control stays in sync no
 * matter which one changed it, without remounting. `initialPreference` is what the server rendered
 * (from the cookie): it is the server snapshot, which keeps hydration consistent.
 */
export function useThemePreference(initialPreference: ThemePreference): ThemePreference {
	return useSyncExternalStore(
		subscribeToPreference,
		() => resolvePreference(document.documentElement.dataset.themePreference),
		() => initialPreference,
	);
}

/** The effective theme (`data-theme`), which follows the system while the preference is `system`. */
export function useTheme(initialTheme: Theme): Theme {
	return useSyncExternalStore(
		subscribeToTheme,
		() => resolveTheme(document.documentElement.dataset.theme),
		() => initialTheme,
	);
}
