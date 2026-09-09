'use client';

import { ThemeToggle } from '@admin-ds/components';
import { useEffect, useState } from 'react';
import type { Theme } from '../lib/theme';
import { resolveTheme } from '../lib/theme';

export function ThemeControl({ initialTheme = 'light' }: { initialTheme?: Theme }) {
	const [theme, setTheme] = useState<Theme>(initialTheme);

	useEffect(() => {
		setTheme(resolveTheme(document.documentElement.dataset.theme));
	}, []);

	return (
		<ThemeToggle
			initialTheme={theme}
			key={theme}
			onThemeChange={(theme) => {
				document.documentElement.dataset.theme = theme;
				document.cookie = `ads-theme=${theme}; path=/; max-age=31536000; samesite=lax`;
				setTheme(theme);
			}}
		/>
	);
}
