'use client';

import { useEffect } from 'react';
import { readSystemTheme, resolvePreference } from '../lib/theme';

/**
 * Keeps the effective theme in step with the operating system while the preference is `system`.
 * The preference is read from `<html>` inside the effect, never from a server snapshot: during
 * hydration the server value can differ from what the init script applied (the static export), and
 * acting on it would overwrite the saved theme. The listener exists only in `system` mode and is
 * removed when the preference changes or the component unmounts; an explicit light or dark choice
 * is never overwritten by the system.
 */
export function ThemeSystemSync() {
	useEffect(() => {
		const root = document.documentElement;
		let query: MediaQueryList | undefined;
		const sync = () => {
			root.dataset.theme = readSystemTheme();
		};
		const update = () => {
			const following = resolvePreference(root.dataset.themePreference) === 'system';
			if (following && !query && typeof window.matchMedia === 'function') {
				query = window.matchMedia('(prefers-color-scheme: dark)');
				sync();
				query.addEventListener('change', sync);
			} else if (!following && query) {
				query.removeEventListener('change', sync);
				query = undefined;
			}
		};
		update();
		const observer = new MutationObserver(update);
		observer.observe(root, { attributes: true, attributeFilter: ['data-theme-preference'] });
		return () => {
			observer.disconnect();
			query?.removeEventListener('change', sync);
		};
	}, []);

	return null;
}
