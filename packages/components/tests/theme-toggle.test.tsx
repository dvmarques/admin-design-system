import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '../src/theme-toggle';
import { renderWithTheme } from './test-utils';

describe('ThemeToggle', () => {
	it('is operable by keyboard and reports the selected theme', () => {
		const onThemeChange = vi.fn();
		render(<ThemeToggle onThemeChange={onThemeChange} />);
		const button = screen.getByRole('button', { name: /usar tema escuro/i });
		button.focus();
		fireEvent.keyDown(button, { key: 'Enter' });
		fireEvent.click(button);
		expect(onThemeChange).toHaveBeenCalledWith('dark');
		expect(button).toHaveAttribute('aria-pressed', 'true');
	});

	it('does not have detectable accessibility violations', async () => {
		const { container } = render(<ThemeToggle />);
		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});

	it.each(['light', 'dark'])(
		'renders in the %s theme without relying on Tailwind internals',
		(theme) => {
			const { container } = renderWithTheme(<ThemeToggle />, theme);
			expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
			expect(screen.getByRole('button')).toBeVisible();
		},
	);
});
