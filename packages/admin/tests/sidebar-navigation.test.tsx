import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdsAdminShell } from '../src/index.js';

describe('navegação hierárquica do shell', () => {
	it('separa título não interativo, disclosure nativo e link do consumidor', () => {
		render(
			<AdsAdminShell>
				<AdsAdminShell.Navigation>
					<AdsAdminShell.NavigationSection label="Componentes">
						<AdsAdminShell.NavigationGroup label="Básicos" open>
							<AdsAdminShell.NavigationItem>
								<a href="/button" aria-current="page">
									Button
								</a>
							</AdsAdminShell.NavigationItem>
						</AdsAdminShell.NavigationGroup>
					</AdsAdminShell.NavigationSection>
				</AdsAdminShell.Navigation>
			</AdsAdminShell>,
		);
		expect(screen.getByText('Componentes').closest('summary,button,a')).toBeNull();
		expect(screen.getByText('Básicos').closest('summary')).not.toBeNull();
		expect(screen.getByRole('link', { name: 'Button' })).toHaveAttribute('href', '/button');
	});
	it('expande a sidebar recolhida ao acionar uma categoria sem perder o foco', () => {
		render(
			<AdsAdminShell defaultCollapsed>
				<AdsAdminShell.SidebarToggle />
				<AdsAdminShell.NavigationGroup label="Básicos">
					<AdsAdminShell.NavigationItem>
						<a href="/button">Button</a>
					</AdsAdminShell.NavigationItem>
				</AdsAdminShell.NavigationGroup>
			</AdsAdminShell>,
		);
		const summary = screen.getByText('Básicos').closest('summary')!;
		summary.focus();
		fireEvent.click(summary);
		expect(screen.getByRole('button', { name: 'Recolher barra lateral' })).toHaveAttribute(
			'aria-expanded',
			'true',
		);
		expect(summary.closest('details')).toHaveAttribute('open');
		expect(summary).toHaveFocus();
	});
});
