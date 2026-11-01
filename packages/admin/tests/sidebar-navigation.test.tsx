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
		expect(screen.getByRole('group', { name: 'Componentes' })).toContainElement(
			screen.getByRole('link', { name: 'Button' }),
		);
		expect(screen.getByText('Básicos').closest('summary')).not.toBeNull();
		expect(screen.getByRole('link', { name: 'Button' })).toHaveAttribute('href', '/button');
	});
	it('mantém ids de título únicos entre instâncias e estáveis ao renderizar novamente', () => {
		const sections = (
			<>
				<AdsAdminShell.NavigationSection label="Componentes">
					Primeira
				</AdsAdminShell.NavigationSection>
				<AdsAdminShell.NavigationSection label="Componentes">
					Segunda
				</AdsAdminShell.NavigationSection>
			</>
		);
		const { rerender } = render(sections);
		const groups = screen.getAllByRole('group', { name: 'Componentes' });
		const ids = groups.map((group) => group.getAttribute('aria-labelledby'));
		expect(new Set(ids).size).toBe(2);
		rerender(sections);
		expect(
			screen
				.getAllByRole('group', { name: 'Componentes' })
				.map((group) => group.getAttribute('aria-labelledby')),
		).toEqual(ids);
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
