'use client';

import { useSyncExternalStore } from 'react';
import { resolveTheme, type Theme } from '../lib/theme';

function subscribe(onChange: () => void) {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	return () => observer.disconnect();
}

/**
 * Reads the theme from the `data-theme` attribute of `<html>`, so every control stays in sync no
 * matter which one changed it. `initialTheme` is the theme the server rendered (from the cookie):
 * it is the server snapshot, which keeps hydration consistent.
 */
export function useTheme(initialTheme: Theme): Theme {
	return useSyncExternalStore(
		subscribe,
		() => resolveTheme(document.documentElement.dataset.theme),
		() => initialTheme,
	);
}
