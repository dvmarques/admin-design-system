import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AdsAdminShell } from '../src/index.js';

function ExampleShell({ onNavigationOpenChange }: { onNavigationOpenChange?: (open: boolean) => void }) {
	return (
		<AdsAdminShell onNavigationOpenChange={onNavigationOpenChange}>
			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<span>Admin Abril</span>
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar>
					<a href="/dashboard">Dashboard</a>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<h1>Visão geral</h1>
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}

describe('AdsAdminShell', () => {
	it('renders the administrative landmarks and consumer content', () => {
		render(<ExampleShell />);
		expect(screen.getByRole('banner')).toHaveTextContent('Admin Abril');
		expect(screen.getByRole('main')).toHaveTextContent('Visão geral');
		expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toHaveTextContent(
			'Dashboard',
		);
	});

	it('opens responsive navigation from the accessible trigger without duplicate ids', () => {
		const onNavigationOpenChange = vi.fn();
		const { container } = render(<ExampleShell onNavigationOpenChange={onNavigationOpenChange} />);
		const trigger = screen.getByRole('button', { name: 'Abrir navegação' });
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		fireEvent.click(trigger);
		expect(onNavigationOpenChange).toHaveBeenCalledWith(true);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		const dialog = screen.getByRole('dialog', { name: 'Navegação principal' });
		expect(dialog).toHaveAttribute('id', trigger.getAttribute('aria-controls'));
		const controlledId = trigger.getAttribute('aria-controls');
		expect(controlledId).toBeTruthy();
		expect(container.ownerDocument.querySelectorAll(`[id="${controlledId}"]`)).toHaveLength(1);
		expect(screen.getAllByRole('navigation', { name: 'Navegação principal' })).toHaveLength(2);
	});

	it('supports controlled responsive navigation state', () => {
		const onNavigationOpenChange = vi.fn();
		const { rerender } = render(
			<AdsAdminShell navigationOpen={false} onNavigationOpenChange={onNavigationOpenChange}>
				<AdsAdminShell.NavigationTrigger />
			</AdsAdminShell>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Abrir navegação' }));
		expect(onNavigationOpenChange).toHaveBeenCalledWith(true);
		rerender(
			<AdsAdminShell navigationOpen onNavigationOpenChange={onNavigationOpenChange}>
				<AdsAdminShell.NavigationTrigger />
			</AdsAdminShell>,
		);
		expect(screen.getByRole('button', { name: 'Abrir navegação' })).toHaveAttribute(
			'aria-expanded',
			'true',
		);
	});
});
