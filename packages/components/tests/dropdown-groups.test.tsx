import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdsDropdown } from '../src/dropdown';

function Groups({ defaultOpen = false }: { defaultOpen?: boolean }) {
	return (
		<div>
			<button type="button">Anterior</button>
			<AdsDropdown defaultOpen={defaultOpen}>
				<AdsDropdown.Trigger>Opções</AdsDropdown.Trigger>
				<AdsDropdown.Content aria-label="Ações">
					<AdsDropdown.Header id="group-title">Operações</AdsDropdown.Header>
					<div aria-labelledby="group-title" role="group">
						<AdsDropdown.Item disabled>Indisponível</AdsDropdown.Item>
						<AdsDropdown.Item>Editar</AdsDropdown.Item>
					</div>
					<AdsDropdown.Divider />
					<AdsDropdown.Header>Exportação</AdsDropdown.Header>
					<AdsDropdown.Item>Exportar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>
			<button type="button">Próximo</button>
		</div>
	);
}

describe('semantic dropdown grouping', () => {
	it('renders static headers and a semantic separator outside the keyboard item sequence', async () => {
		render(<Groups />);
		const trigger = screen.getByRole('button', { name: 'Opções' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });
		const first = await screen.findByRole('menuitem', { name: 'Editar' });
		await waitFor(() => expect(first).toHaveFocus());
		expect(screen.getByRole('group', { name: 'Operações' })).toContainElement(first);
		expect(screen.getByText('Operações')).not.toHaveAttribute('tabindex');
		expect(screen.getByText('Exportação')).not.toHaveAttribute('tabindex');
		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
		fireEvent.keyDown(first, { key: 'ArrowDown' });
		expect(screen.getByRole('menuitem', { name: 'Exportar' })).toHaveFocus();
		fireEvent.keyDown(document.activeElement!, { key: 'Home' });
		expect(first).toHaveFocus();
		fireEvent.keyDown(first, { key: 'End' });
		expect(screen.getByRole('menuitem', { name: 'Exportar' })).toHaveFocus();
		fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
		expect(trigger).toHaveFocus();
		expect(screen.queryByRole('menu')).toBeNull();
	});

	it.each([
		['Tab', 'Próximo'],
		['Shift+Tab', 'Anterior'],
	] as const)('closes the portal on %s and advances relative to the trigger', async (key, next) => {
		render(<Groups />);
		const trigger = screen.getByRole('button', { name: 'Opções' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'Enter' });
		const first = await screen.findByRole('menuitem', { name: 'Editar' });
		await waitFor(() => expect(first).toHaveFocus());
		fireEvent.keyDown(first, { key: 'Tab', shiftKey: key === 'Shift+Tab' });
		expect(screen.queryByRole('menu')).toBeNull();
		expect(screen.getByRole('button', { name: next })).toHaveFocus();
	});

	it('mirrors the source theme in a portaled menu and updates while open', async () => {
		const { rerender } = render(
			<div data-theme="dark">
				<Groups defaultOpen />
			</div>,
		);
		const menu = await screen.findByRole('menu');
		await waitFor(() => expect(menu.parentElement).toHaveAttribute('data-theme', 'dark'));
		rerender(
			<div data-theme="light">
				<Groups defaultOpen />
			</div>,
		);
		await waitFor(() => expect(menu.parentElement).toHaveAttribute('data-theme', 'light'));
	});
});
