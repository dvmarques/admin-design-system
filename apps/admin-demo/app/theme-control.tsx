'use client';

import { ThemeToggle } from '@admin-ds/components';
import { useEffect, useRef, useState } from 'react';
import type { Theme } from '../lib/theme';
import { applyTheme } from '../lib/theme';
import { useTheme } from './use-theme';

export function ThemeControl({ initialTheme = 'light' }: { initialTheme?: Theme }) {
	const theme = useTheme(initialTheme);
	const ownChange = useRef(false);
	const previousTheme = useRef(theme);
	const [externalChanges, setExternalChanges] = useState(0);

	// `ThemeToggle` keeps its own state and cannot be controlled, so a change made elsewhere (for
	// example by the preferences page) remounts it through `key`. A click on the toggle itself
	// must not remount it, or the button would lose keyboard focus.
	useEffect(() => {
		if (previousTheme.current === theme) return;
		previousTheme.current = theme;
		if (ownChange.current) {
			ownChange.current = false;
			return;
		}
		setExternalChanges((count) => count + 1);
	}, [theme]);

	return (
		<ThemeToggle
			initialTheme={theme}
			key={externalChanges}
			onThemeChange={(next) => {
				ownChange.current = true;
				applyTheme(next);
			}}
		/>
	);
}
