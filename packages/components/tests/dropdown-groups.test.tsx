import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
	it('does not apply a pending Tab close to a newly reopened menu', async () => {
		render(
			<AdsDropdown>
				<AdsDropdown.Trigger>Único controle</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item>Ação</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		const trigger = screen.getByRole('button', { name: 'Único controle' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'Enter' });
		await waitFor(() => expect(screen.getByRole('menuitem')).toHaveFocus());
		fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'Tab' });
		fireEvent.keyDown(trigger, { key: 'Escape' });
		expect(screen.queryByRole('menu')).toBeNull();
		fireEvent.keyDown(trigger, { key: 'Enter' });
		await new Promise((resolve) => window.requestAnimationFrame(resolve));
		expect(screen.getByRole('menu')).toBeVisible();
	});

	it('cancels a pending boundary close when the dropdown unmounts', async () => {
		const change = vi.fn();
		const { unmount } = render(
			<AdsDropdown onOpenChange={change}>
				<AdsDropdown.Trigger>Único controle</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item>Ação</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		const trigger = screen.getByRole('button', { name: 'Único controle' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'Enter' });
		const item = await screen.findByRole('menuitem');
		await waitFor(() => expect(item).toHaveFocus());
		change.mockClear();
		fireEvent.keyDown(item, { key: 'Tab' });
		unmount();
		await new Promise((resolve) => window.requestAnimationFrame(resolve));
		expect(change).not.toHaveBeenCalled();
	});

	it.each([false, true])('leaves boundary Tab to the browser (shift=%s)', async (shiftKey) => {
		render(
			<AdsDropdown>
				<AdsDropdown.Trigger>Único controle</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item>Ação</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		const trigger = screen.getByRole('button', { name: 'Único controle' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'Enter' });
		const item = await screen.findByRole('menuitem');
		await waitFor(() => expect(item).toHaveFocus());
		expect(fireEvent.keyDown(item, { key: 'Tab', shiftKey })).toBe(true);
		expect(trigger).toHaveFocus(); // jsdom does not run the default Tab action; browser tests do.
		await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
	});

	it.each(['content', 'descendant'] as const)(
		'respects keyboard cancellation by %s',
		async (source) => {
			const cancel = (event: React.KeyboardEvent) => event.preventDefault();
			render(
				<AdsDropdown>
					<AdsDropdown.Trigger>Opções canceladas</AdsDropdown.Trigger>
					<AdsDropdown.Content onKeyDown={source === 'content' ? cancel : undefined}>
						<div onKeyDown={source === 'descendant' ? cancel : undefined}>
							<AdsDropdown.Item>Primeira</AdsDropdown.Item>
							<AdsDropdown.Item>Segunda</AdsDropdown.Item>
						</div>
					</AdsDropdown.Content>
				</AdsDropdown>,
			);
			const trigger = screen.getByRole('button', { name: 'Opções canceladas' });
			trigger.focus();
			fireEvent.keyDown(trigger, { key: 'Enter' });
			const item = await screen.findByRole('menuitem', { name: 'Primeira' });
			await waitFor(() => expect(item).toHaveFocus());
			for (const key of ['Tab', 'ArrowDown', 'End']) {
				for (const shiftKey of [false, true]) {
					expect(fireEvent.keyDown(item, { key, shiftKey })).toBe(false);
					expect(screen.getByRole('menu')).toBeVisible();
					expect(item).toHaveFocus();
				}
			}
		},
	);

	it.each([false, true])('closes on Tab at the trigger (shift=%s)', async (shiftKey) => {
		render(<Groups />);
		const trigger = screen.getByRole('button', { name: 'Opções' });
		trigger.focus();
		fireEvent.click(trigger);
		await screen.findByRole('menu');
		expect(trigger).toHaveFocus();
		expect(fireEvent.keyDown(trigger, { key: 'Tab', shiftKey })).toBe(false);
		expect(screen.queryByRole('menu')).toBeNull();
		expect(screen.getByRole('button', { name: shiftKey ? 'Anterior' : 'Próximo' })).toHaveFocus();
	});

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
