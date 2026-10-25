import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsAccountMenu, AdsNotificationCenter, AdsOrganizationSwitcher } from '../src/index.js';

function Page() {
	return (
		<>
			<AdsOrganizationSwitcher
				organizations={[{ id: 'a', name: 'Acme', description: 'Enterprise' }]}
				value="a"
			/>
			<AdsNotificationCenter
				notifications={[
					{ id: '1', title: 'Pedido', read: false, timestamp: '2026-10-25T12:00:00Z' },
				]}
			/>
			<AdsAccountMenu
				groups={[{ id: 'g', actions: [{ id: 'x', label: 'Sair', onSelect: () => undefined }] }]}
				user={{ name: 'Ana Souza', email: 'ana@example.com' }}
			/>
		</>
	);
}

describe('account menu, notification center and organization switcher SSR', () => {
	it('renders only the closed triggers on the server, without touching the DOM', () => {
		const matchMedia = vi.fn();
		const original = window.matchMedia;
		window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
		try {
			const html = renderToString(<Page />);

			expect(matchMedia).not.toHaveBeenCalled();
			expect(html).toContain('Menu da conta: Ana Souza');
			expect(html).toContain('Notificações, 1 não lida');
			expect(html).toContain('Organização atual');
			expect(html).not.toContain('role="dialog"');
			expect(html.match(/aria-expanded="false"/g)).toHaveLength(3);
			expect(html).not.toContain('Intl');
			expect(html).not.toContain('2026');
		} finally {
			window.matchMedia = original;
		}
	});

	it('hydrates the server markup without mismatches', async () => {
		const html = renderToString(<Page />);
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.append(container);
		const errors: unknown[] = [];
		const spy = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args));

		await act(async () => {
			hydrateRoot(container, <Page />, { onRecoverableError: (error) => errors.push(error) });
		});

		expect(errors).toEqual([]);
		expect(container.querySelectorAll('button[aria-expanded="false"]')).toHaveLength(3);
		spy.mockRestore();
		container.remove();
	});
});
