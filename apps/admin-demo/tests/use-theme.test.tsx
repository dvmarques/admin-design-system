import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeControl } from '../app/theme-control';
import { useTheme } from '../app/use-theme';
import { applyTheme, themeCookieName, type Theme } from '../lib/theme';

function ThemeProbe({ initialTheme }: { initialTheme: Theme }) {
	return <output>{useTheme(initialTheme)}</output>;
}

beforeEach(() => {
	document.documentElement.dataset.theme = 'light';
});

afterEach(() => {
	delete document.documentElement.dataset.theme;
	document.cookie = `${themeCookieName}=; max-age=0; path=/`;
});

describe('useTheme', () => {
	it('reads the theme from the html attribute on the client', () => {
		document.documentElement.dataset.theme = 'dark';

		render(<ThemeProbe initialTheme="light" />);

		expect(screen.getByRole('status')).toHaveTextContent('dark');
	});

	it('follows changes made by any control', () => {
		render(<ThemeProbe initialTheme="light" />);

		act(() => applyTheme('dark'));

		return screen.findByText('dark');
	});

	it('uses the theme rendered by the server as its server snapshot', () => {
		expect(renderToString(<ThemeProbe initialTheme="dark" />)).toContain('dark');
		expect(renderToString(<ThemeProbe initialTheme="light" />)).toContain('light');
	});
});

describe('ThemeControl', () => {
	it('keeps the same button, and its focus, when the toggle itself changes the theme', async () => {
		render(<ThemeControl initialTheme="light" />);
		const toggle = screen.getByRole('button', { name: 'Usar tema escuro' });
		toggle.focus();

		fireEvent.click(toggle);

		const next = await screen.findByRole('button', { name: 'Usar tema claro' });
		expect(next).toBe(toggle);
		expect(next).toHaveFocus();
		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('remounts the toggle when another control changes the theme', async () => {
		render(<ThemeControl initialTheme="light" />);
		const toggle = screen.getByRole('button', { name: 'Usar tema escuro' });

		act(() => applyTheme('dark'));

		const next = await screen.findByRole('button', { name: 'Usar tema claro' });
		expect(next).not.toBe(toggle);
		expect(next).toHaveAttribute('aria-pressed', 'true');
	});

	it('keeps following later changes after an own change', async () => {
		render(<ThemeControl initialTheme="light" />);
		fireEvent.click(screen.getByRole('button', { name: 'Usar tema escuro' }));
		await screen.findByRole('button', { name: 'Usar tema claro' });

		act(() => applyTheme('light'));

		expect(await screen.findByRole('button', { name: 'Usar tema escuro' })).toHaveAttribute(
			'aria-pressed',
			'false',
		);
	});
});
