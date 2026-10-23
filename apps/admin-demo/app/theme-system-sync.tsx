'use client';

import { useEffect } from 'react';
import { readSystemTheme, type ThemePreference } from '../lib/theme';
import { useThemePreference } from './use-theme';

/**
 * Keeps the effective theme in step with the operating system while the preference is `system`.
 * The listener exists only in that mode and is removed when the preference changes or the component
 * unmounts; an explicit light or dark choice is never overwritten by the system.
 */
export function ThemeSystemSync({ initialPreference }: { initialPreference: ThemePreference }) {
	const preference = useThemePreference(initialPreference);

	useEffect(() => {
		if (preference !== 'system' || typeof window.matchMedia !== 'function') return;
		const query = window.matchMedia('(prefers-color-scheme: dark)');
		const sync = () => {
			document.documentElement.dataset.theme = readSystemTheme();
		};
		sync();
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	}, [preference]);

	return null;
}
