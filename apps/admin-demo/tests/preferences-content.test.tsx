import { AdsAdminShell } from '@admin-ds/admin';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PreferencesContent } from '../app/(admin)/preferencias/preferences-content';
import type { ThemePreference } from '../lib/theme';

function render(initialPreference: ThemePreference) {
	const container = document.createElement('div');
	// `useAdsAdminShell` throws outside the shell, so the preferences render inside it.
	container.innerHTML = renderToString(
		<AdsAdminShell>
			<PreferencesContent initialPreference={initialPreference} />
		</AdsAdminShell>,
	);
	return container;
}

const labels = { light: 'Claro', dark: 'Escuro', system: 'Sistema' } as const;

function themeRadio(container: HTMLElement, value: ThemePreference) {
	return Array.from(container.querySelectorAll<HTMLElement>('[role="radio"]')).find((radio) =>
		radio.textContent?.includes(labels[value]),
	);
}

describe('PreferencesContent', () => {
	it.each<[ThemePreference, ThemePreference[]]>([
		['light', ['dark', 'system']],
		['dark', ['light', 'system']],
		['system', ['light', 'dark']],
	])('checks only the %s radio for the server-rendered preference', (initial, others) => {
		const view = render(initial);

		expect(themeRadio(view, initial)?.getAttribute('aria-checked')).toBe('true');
		for (const other of others) {
			expect(themeRadio(view, other)?.getAttribute('aria-checked')).toBe('false');
		}
	});

	it('renders the same markup twice for the same theme', () => {
		expect(render('dark').innerHTML).toBe(render('dark').innerHTML);
	});

	it('exposes the sidebar switch with its help text and a single main heading', () => {
		const view = render('light');

		const sidebarSwitch = view.querySelector<HTMLInputElement>('input[type="checkbox"]');
		expect(sidebarSwitch?.closest('label')?.textContent).toContain('Recolher a barra lateral');
		expect(sidebarSwitch?.getAttribute('aria-describedby')).toBe('sidebar-preference-help');
		expect(view.querySelector('#sidebar-preference-help')).not.toBeNull();
		expect(view.querySelectorAll('h1')).toHaveLength(1);
	});
});
