import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdsAdminShell } from '../src/index.js';
import { installViewport } from './viewport.js';

function Page() {
	return (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar>
					<a href="/dashboard">Dashboard</a>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>Conteúdo</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}

describe('AdsAdminShell SSR and hydration', () => {
	let viewport: ReturnType<typeof installViewport> | undefined;
	afterEach(() => viewport?.restore());

	it('renders deterministic desktop markup on the server without reading the viewport', () => {
		const matchMedia = vi.fn();
		const original = window.matchMedia;
		window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
		try {
			const html = renderToString(<Page />);
			expect(matchMedia).not.toHaveBeenCalled();
			expect(html).toContain('ads-admin-shell-sidebar-desktop');
			expect(html).not.toContain('role="dialog"');
			expect(html).toContain('aria-expanded="false"');
		} finally {
			window.matchMedia = original;
		}
	});

	it('hydrates on a mobile viewport without a hydration mismatch', async () => {
		const html = renderToString(<Page />);
		viewport = installViewport(false);
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		let root!: ReturnType<typeof hydrateRoot>;
		await act(async () => {
			root = hydrateRoot(container, <Page />);
		});

		expect(error).not.toHaveBeenCalled();
		expect(container.querySelector('.ads-admin-shell-sidebar-desktop')).toBeNull();
		expect(container.querySelector('[aria-label="Abrir navegação"]')).toHaveAttribute(
			'aria-expanded',
			'false',
		);
		error.mockRestore();
		act(() => root.unmount());
		container.remove();
	});
});
