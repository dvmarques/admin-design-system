import { AdsAdminShell } from '@admin-ds/admin';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PreferencesContent } from '../app/(admin)/preferencias/preferences-content';
import type { Theme } from '../lib/theme';

function render(initialTheme: Theme) {
	const container = document.createElement('div');
	// `useAdsAdminShell` throws outside the shell, so the preferences render inside it.
	container.innerHTML = renderToString(
		<AdsAdminShell>
			<PreferencesContent initialTheme={initialTheme} />
		</AdsAdminShell>,
	);
	return container;
}

function themeRadio(container: HTMLElement, value: Theme) {
	return container.querySelector<HTMLInputElement>(`input[type="radio"][value="${value}"]`);
}

describe('PreferencesContent', () => {
	it.each<[Theme, Theme]>([
		['light', 'dark'],
		['dark', 'light'],
	])(
		'checks only the %s radio (and not the %s one) for the server-rendered theme',
		(initial, other) => {
			const view = render(initial);

			expect(themeRadio(view, initial)?.checked).toBe(true);
			expect(themeRadio(view, other)?.checked).toBe(false);
		},
	);

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
