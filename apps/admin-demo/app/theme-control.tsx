'use client';

import { ThemeToggle } from '@admin-ds/components';
import type { Theme } from '../lib/theme';

export function ThemeControl({ initialTheme }: { initialTheme: Theme }) {
	return (
		<ThemeToggle
			initialTheme={initialTheme}
			onThemeChange={(theme) => {
				document.documentElement.dataset.theme = theme;
				document.cookie = `ads-theme=${theme}; path=/; max-age=31536000; samesite=lax`;
			}}
		/>
	);
}
