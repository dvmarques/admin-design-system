import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdsAdminShell } from '../src/index.js';
import { installViewport } from './viewport.js';

function Page({ branded = false }: { branded?: boolean }) {
	return (
		<AdsAdminShell layout={branded ? 'sidebar-header' : 'standard'}>
			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar
					header={
						branded ? (
							<>
								<span>Produto</span>
								<AdsAdminShell.SidebarToggle />
							</>
						) : undefined
					}
				>
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

	it.each([false, true])('hydrates on mobile without mismatch (branding=%s)', async (branded) => {
		const html = renderToString(<Page branded={branded} />);
		viewport = installViewport(false);
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.appendChild(container);
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		let root!: ReturnType<typeof hydrateRoot>;
		await act(async () => {
			root = hydrateRoot(container, <Page branded={branded} />);
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
