import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AdsAdminShell } from '../src/index.js';

function Shell({
	footer,
	layout = 'standard',
}: {
	footer: boolean;
	layout?: 'standard' | 'sidebar-header';
}) {
	return (
		<AdsAdminShell layout={layout}>
			<AdsAdminShell.Header>Admin</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar>
					<a href="#demo">Menu</a>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main id="demo">Conteúdo</AdsAdminShell.Main>
			</AdsAdminShell.Body>
			{footer ? (
				<AdsAdminShell.Footer
					aria-label="Informações da aplicação"
					data-testid="footer"
					end={<a href="#help">Ajuda</a>}
					start={<span>Versão 1</span>}
				/>
			) : null}
		</AdsAdminShell>
	);
}

describe('optional AdsAdminShell.Footer', () => {
	it.each(['standard', 'sidebar-header'] as const)(
		'adds a semantic footer after Body without changing the main landmark (%s)',
		(layout) => {
			const { container } = render(<Shell footer layout={layout} />);
			const footer = screen.getByRole('contentinfo', { name: 'Informações da aplicação' });
			expect(footer).toHaveTextContent('Versão 1');
			expect(footer).toHaveTextContent('Ajuda');
			expect(footer).toHaveClass('ads-admin-shell-footer');
			expect(screen.getByRole('main')).toHaveTextContent('Conteúdo');
			expect(footer.previousElementSibling).toHaveClass('ads-admin-shell-body');
			expect(container.querySelectorAll('main')).toHaveLength(1);
		},
	);

	it('renders no footer or reserved slot when omitted', () => {
		const { container } = render(<Shell footer={false} />);
		expect(screen.queryByRole('contentinfo')).toBeNull();
		expect(container.querySelector('.ads-admin-shell-footer')).toBeNull();
	});

	it('forwards native attributes and free children without requiring slots', () => {
		render(
			<AdsAdminShell>
				<AdsAdminShell.Footer className="custom" id="page-footer">
					Informação livre
				</AdsAdminShell.Footer>
			</AdsAdminShell>,
		);
		expect(screen.getByRole('contentinfo')).toHaveAttribute('id', 'page-footer');
		expect(screen.getByRole('contentinfo')).toHaveClass('custom');
		expect(screen.getByRole('contentinfo')).toHaveTextContent('Informação livre');
	});

	it.each([false, true])('has deterministic SSR markup (footer=%s)', (footer) => {
		const html = renderToString(<Shell footer={footer} layout="sidebar-header" />);
		expect(html.includes('ads-admin-shell-footer')).toBe(footer);
		expect(html.includes('Versão 1')).toBe(footer);
		expect(html).toContain('class="ads-admin-shell-main"');
	});
});
