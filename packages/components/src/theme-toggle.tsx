'use client';

import { useState } from 'react';

export interface ThemeToggleProps {
	initialTheme?: 'light' | 'dark';
	onThemeChange?: (theme: 'light' | 'dark') => void;
}

/** Minimal client boundary used by consumer integrations and documentation. */
export function ThemeToggle({ initialTheme = 'light', onThemeChange }: ThemeToggleProps) {
	const [theme, setTheme] = useState(initialTheme);
	const nextTheme = theme === 'light' ? 'dark' : 'light';

	return (
		<button
			type="button"
			aria-pressed={theme === 'dark'}
			className="rounded-md border border-border bg-surface px-3 py-2 text-text"
			onClick={() => {
				setTheme(nextTheme);
				onThemeChange?.(nextTheme);
			}}
		>
			Usar tema {nextTheme === 'dark' ? 'escuro' : 'claro'}
		</button>
	);
}
