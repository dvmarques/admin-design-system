import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '../src/theme-toggle';

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
});
