import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PreferencesContent } from '../app/(admin)/preferencias/preferences-content';
import { ThemeControl } from '../app/theme-control';
import { ThemeSystemSync } from '../app/theme-system-sync';
import { useTheme, useThemePreference } from '../app/use-theme';
import {
	applyThemePreference,
	themeCookieName,
	type Theme,
	type ThemePreference,
} from '../lib/theme';

vi.mock('@admin-ds/admin', () => ({
	useAdsAdminShell: () => ({ collapsed: false, isDesktop: true, setCollapsed: () => {} }),
}));

function PreferenceProbe({ initial }: { initial: ThemePreference }) {
	return <output>{useThemePreference(initial)}</output>;
}

function ThemeProbe({ initial }: { initial: Theme }) {
	return <output>{useTheme(initial)}</output>;
}

class FakeMediaQuery {
	matches = false;
	listeners = new Set<() => void>();
	addEventListener = vi.fn((_: string, listener: () => void) => this.listeners.add(listener));
	removeEventListener = vi.fn((_: string, listener: () => void) => this.listeners.delete(listener));
	set(dark: boolean) {
		this.matches = dark;
		for (const listener of this.listeners) listener();
	}
}

let query: FakeMediaQuery;

beforeEach(() => {
	query = new FakeMediaQuery();
	vi.stubGlobal('matchMedia', () => query);
	document.documentElement.dataset.theme = 'light';
	document.documentElement.dataset.themePreference = 'light';
});

afterEach(() => {
	delete document.documentElement.dataset.theme;
	delete document.documentElement.dataset.themePreference;
	document.cookie = `${themeCookieName}=; max-age=0; path=/`;
	vi.unstubAllGlobals();
});

describe('useThemePreference and useTheme', () => {
	it('read the html attributes on the client', () => {
		document.documentElement.dataset.themePreference = 'system';
		document.documentElement.dataset.theme = 'dark';

		render(
			<>
				<PreferenceProbe initial="light" />
				<ThemeProbe initial="light" />
			</>,
		);

		expect(screen.getAllByRole('status').map((node) => node.textContent)).toEqual([
			'system',
			'dark',
		]);
	});

	it('follow changes made by any control', async () => {
		render(<PreferenceProbe initial="light" />);

		act(() => applyThemePreference('system'));

		expect(await screen.findByText('system')).toBeInTheDocument();
	});

	it('use the server render as their server snapshot', () => {
		expect(renderToString(<PreferenceProbe initial="system" />)).toContain('system');
		expect(renderToString(<ThemeProbe initial="dark" />)).toContain('dark');
	});
});

describe('ThemeControl', () => {
	it('keeps the same trigger, and its focus, when the preference changes elsewhere', async () => {
		render(<ThemeControl initialPreference="light" />);
		const trigger = screen.getByRole('button', { name: 'Tema: Claro' });
		trigger.focus();

		act(() => applyThemePreference('dark'));

		const next = await screen.findByRole('button', { name: 'Tema: Escuro' });
		expect(next).toBe(trigger);
		expect(next).toHaveFocus();
	});

	it('applies the chosen preference, including system, and keeps the monitor icon', async () => {
		query.matches = true;
		render(<ThemeControl initialPreference="light" />);
		fireEvent.click(screen.getByRole('button', { name: 'Tema: Claro' }));

		fireEvent.click(await screen.findByRole('menuitemradio', { name: 'Sistema' }));

		expect(document.documentElement.dataset.themePreference).toBe('system');
		expect(document.documentElement.dataset.theme).toBe('dark');
		expect(document.cookie).toContain(`${themeCookieName}=system`);
		expect(await screen.findByRole('button', { name: 'Tema: Sistema' })).toBeInTheDocument();
	});

	it('is in sync with the preferences group without remounting either', async () => {
		render(
			<>
				<ThemeControl initialPreference="light" />
				<PreferencesContent initialPreference="light" />
			</>,
		);
		const radio = screen.getByRole('radio', { name: 'Escuro' });
		radio.focus();

		fireEvent.click(radio);

		expect(await screen.findByRole('button', { name: 'Tema: Escuro' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Escuro' })).toBe(radio);
		expect(radio).toHaveFocus();
		expect(radio).toHaveAttribute('aria-checked', 'true');
	});
});

describe('PreferencesContent', () => {
	it('offers the three modes and shows the active one', () => {
		document.documentElement.dataset.themePreference = 'system';
		render(<PreferencesContent initialPreference="light" />);

		expect(screen.getByRole('radiogroup', { name: 'Tema' })).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Sistema' })).toHaveAttribute('aria-checked', 'true');
		expect(screen.getByRole('radio', { name: 'Claro' })).toHaveAttribute('aria-checked', 'false');
	});
});

describe('ThemeSystemSync', () => {
	it('follows the system while the preference is system and cleans up on leaving it', async () => {
		document.documentElement.dataset.themePreference = 'system';
		render(
			<>
				<ThemeSystemSync initialPreference="system" />
				<ThemeControl initialPreference="system" />
			</>,
		);
		expect(query.listeners.size).toBe(1);

		act(() => query.set(true));
		expect(document.documentElement.dataset.theme).toBe('dark');
		act(() => query.set(false));
		expect(document.documentElement.dataset.theme).toBe('light');

		await act(async () => applyThemePreference('light'));

		expect(query.listeners.size).toBe(0);
		expect(query.removeEventListener).toHaveBeenCalledTimes(1);
	});

	it('never overwrites an explicit preference', () => {
		render(<ThemeSystemSync initialPreference="light" />);

		expect(query.listeners.size).toBe(0);
		act(() => query.set(true));
		expect(document.documentElement.dataset.theme).toBe('light');
	});

	it('removes its listener on unmount', () => {
		document.documentElement.dataset.themePreference = 'system';
		const { unmount } = render(<ThemeSystemSync initialPreference="system" />);
		expect(query.listeners.size).toBe(1);

		unmount();

		expect(query.listeners.size).toBe(0);
	});

	it('keeps the monitor icon in the trigger when the system changes', async () => {
		document.documentElement.dataset.themePreference = 'system';
		render(
			<>
				<ThemeSystemSync initialPreference="system" />
				<ThemeControl initialPreference="system" />
			</>,
		);

		act(() => query.set(true));

		expect(screen.getByRole('button', { name: 'Tema: Sistema' })).toBeInTheDocument();
	});
});
