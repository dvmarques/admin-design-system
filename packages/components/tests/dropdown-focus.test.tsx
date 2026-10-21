import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdsDropdown } from '../src/dropdown';

function Fixture({
	controlled = false,
	onSelect = () => {},
}: {
	controlled?: boolean;
	onSelect?: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [count, setCount] = useState(0);
	return (
		<AdsDropdown {...(controlled ? { open, onOpenChange: setOpen } : {})}>
			<AdsDropdown.Trigger>Mais</AdsDropdown.Trigger>
			<AdsDropdown.Content aria-label="Ações">
				<AdsDropdown.Item disabled>Indisponível</AdsDropdown.Item>
				<AdsDropdown.Item onClick={() => setCount(count + 1)}>Editar {count}</AdsDropdown.Item>
				<AdsDropdown.Item disabled href="#disabled">
					Link indisponível
				</AdsDropdown.Item>
				<AdsDropdown.Item onSelect={onSelect}>Duplicar</AdsDropdown.Item>
			</AdsDropdown.Content>
		</AdsDropdown>
	);
}

describe('dropdown keyboard focus', () => {
	for (const controlled of [false, true]) {
		it.each(['ArrowDown', 'Enter', ' '])(
			'focuses the first enabled item after %s (controlled=' + controlled + ')',
			async (key) => {
				render(
					<StrictMode>
						<Fixture controlled={controlled} />
					</StrictMode>,
				);
				const trigger = screen.getByRole('button', { name: 'Mais' });
				trigger.focus();
				fireEvent.keyDown(trigger, { key });
				const first = await screen.findByRole('menuitem', { name: 'Editar 0' });
				await waitFor(() => expect(first).toHaveFocus());
				expect(trigger).toHaveAttribute('aria-expanded', 'true');
				expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('menu').id);
				fireEvent.keyDown(first, { key: 'Escape' });
				expect(screen.queryByRole('menu')).not.toBeInTheDocument();
				expect(trigger).toHaveFocus();
				fireEvent.keyDown(trigger, { key });
				await waitFor(() =>
					expect(screen.getByRole('menuitem', { name: 'Editar 0' })).toHaveFocus(),
				);
			},
		);
	}

	it('navigates enabled items with arrows and Home/End and selects an action', async () => {
		const select = vi.fn();
		render(<Fixture onSelect={select} />);
		screen.getByRole('button', { name: 'Mais' }).focus();
		fireEvent.keyDown(screen.getByRole('button', { name: 'Mais' }), { key: 'ArrowDown' });
		const first = await screen.findByRole('menuitem', { name: 'Editar 0' });
		const last = screen.getByRole('menuitem', { name: 'Duplicar' });
		await waitFor(() => expect(first).toHaveFocus());
		for (const [key, target] of [
			['ArrowDown', last],
			['ArrowDown', first],
			['ArrowUp', last],
			['Home', first],
			['End', last],
		] as const) {
			fireEvent.keyDown(document.activeElement!, { key });
			expect(target).toHaveFocus();
		}
		fireEvent.click(last);
		expect(select).toHaveBeenCalledOnce();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('preserves mouse focus after a keyboard opening and does not refocus on rerender', async () => {
		const { rerender } = render(<Fixture />);
		const trigger = screen.getByRole('button', { name: 'Mais' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });
		await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Editar 0' })).toHaveFocus());
		const last = screen.getByRole('menuitem', { name: 'Duplicar' });
		last.focus();
		rerender(<Fixture />);
		expect(last).toHaveFocus();
		fireEvent.keyDown(last, { key: 'Escape' });
		fireEvent.click(trigger);
		await screen.findByRole('menu');
		expect(trigger).toHaveFocus();
		fireEvent.mouseDown(document.body);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('waits for the consumer to accept a controlled keyboard opening', async () => {
		const change = vi.fn();
		const content = (
			<>
				<AdsDropdown.Trigger>Mais</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item>Editar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</>
		);
		const { rerender } = render(
			<AdsDropdown open={false} onOpenChange={change}>
				{content}
			</AdsDropdown>,
		);
		const trigger = screen.getByRole('button', { name: 'Mais' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'Enter' });
		expect(change).toHaveBeenCalledWith(true);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		rerender(
			<AdsDropdown open onOpenChange={change}>
				{content}
			</AdsDropdown>,
		);
		await waitFor(() => expect(screen.getByRole('menuitem')).toHaveFocus());
	});

	it.each([false, true])(
		'handles a menu with no eligible items (disabled=%s)',
		async (disabled) => {
			render(
				<AdsDropdown>
					<AdsDropdown.Trigger>Mais</AdsDropdown.Trigger>
					<AdsDropdown.Content>
						{disabled ? <AdsDropdown.Item disabled>Indisponível</AdsDropdown.Item> : null}
					</AdsDropdown.Content>
				</AdsDropdown>,
			);
			const trigger = screen.getByRole('button', { name: 'Mais' });
			trigger.focus();
			fireEvent.keyDown(trigger, { key: 'ArrowDown' });
			await screen.findByRole('menu');
			expect(trigger).toHaveFocus();
			fireEvent.keyDown(trigger, { key: 'Escape' });
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		},
	);

	it.each([false, true])(
		'does not reuse an abandoned controlled focus request (returnToTrigger=%s)',
		async (returnToTrigger) => {
			const blur = vi.fn();
			const content = (
				<>
					<AdsDropdown.Trigger onBlur={blur}>Mais</AdsDropdown.Trigger>
					<AdsDropdown.Content>
						<AdsDropdown.Item>Editar</AdsDropdown.Item>
					</AdsDropdown.Content>
				</>
			);
			const { rerender } = render(
				<>
					<AdsDropdown open={false} onOpenChange={() => {}}>
						{content}
					</AdsDropdown>
					<button>Outro controle</button>
				</>,
			);
			const trigger = screen.getByRole('button', { name: 'Mais' });
			const outside = screen.getByRole('button', { name: 'Outro controle' });
			trigger.focus();
			fireEvent.keyDown(trigger, { key: 'Enter' });
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
			outside.focus();
			expect(blur).toHaveBeenCalledOnce();
			if (returnToTrigger) trigger.focus();
			rerender(
				<>
					<AdsDropdown open onOpenChange={() => {}}>
						{content}
					</AdsDropdown>
					<button>Outro controle</button>
				</>,
			);
			await screen.findByRole('menu');
			expect(returnToTrigger ? trigger : outside).toHaveFocus();
		},
	);
	it('respects a prevented trigger key', () => {
		render(
			<AdsDropdown>
				<AdsDropdown.Trigger onKeyDown={(event) => event.preventDefault()}>
					Mais
				</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item>Editar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		fireEvent.keyDown(screen.getByRole('button', { name: 'Mais' }), { key: 'Enter' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});
});
