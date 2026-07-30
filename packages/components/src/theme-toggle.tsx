'use client';

import { useState, type ButtonHTMLAttributes } from 'react';
import { classNames } from './class-names.js';

export interface ThemeToggleProps extends Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'onChange'
> {
	initialTheme?: 'light' | 'dark';
	onThemeChange?: (theme: 'light' | 'dark') => void;
}

/** Minimal client boundary used by consumer integrations and documentation. */
export function ThemeToggle({
	className,
	initialTheme = 'light',
	onClick,
	onThemeChange,
	...props
}: ThemeToggleProps) {
	const [theme, setTheme] = useState(initialTheme);
	const nextTheme = theme === 'light' ? 'dark' : 'light';

	return (
		<button
			{...props}
			type="button"
			aria-pressed={theme === 'dark'}
			className={classNames(
				'rounded-md border border-border bg-surface px-3 py-2 text-text',
				className,
			)}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				setTheme(nextTheme);
				onThemeChange?.(nextTheme);
			}}
		>
			Usar tema {nextTheme === 'dark' ? 'escuro' : 'claro'}
		</button>
	);
}
