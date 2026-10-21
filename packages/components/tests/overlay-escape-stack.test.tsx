import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { useState, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { AdsButton } from '../src/button';
import { AdsDatePicker } from '../src/date-picker';
import { AdsDropdown } from '../src/dropdown';
import { AdsPopover } from '../src/overlay-anchored';
import { AdsDialog } from '../src/overlay-dialog';

function Host({
	children,
	closeOnEscape,
	onDialogClose,
}: {
	children: ReactNode;
	closeOnEscape?: boolean;
	onDialogClose?: () => void;
}) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<AdsButton onClick={() => setOpen(true)}>Abrir diálogo</AdsButton>
			<AdsDialog
				{...(closeOnEscape === undefined ? {} : { closeOnEscape })}
				onOpenChange={(next) => {
					setOpen(next);
					if (!next) onDialogClose?.();
				}}
				open={open}
				title="Diálogo pai"
			>
				{children}
			</AdsDialog>
		</>
	);
}

function PopoverInside({ closeOnEscape }: { closeOnEscape?: boolean } = {}) {
	const [open, setOpen] = useState(false);
	return (
		<Host {...(closeOnEscape === undefined ? {} : { closeOnEscape })}>
			<AdsPopover
				aria-label="Ações internas"
				content={<AdsButton>Editar</AdsButton>}
				onOpenChange={setOpen}
				open={open}
			>
				<AdsButton variant="secondary">Mais ações</AdsButton>
			</AdsPopover>
		</Host>
	);
}

async function openParent() {
	const origin = screen.getByRole('button', { name: 'Abrir diálogo' });
	origin.focus();
	fireEvent.click(origin);
	await screen.findByRole('dialog', { name: 'Diálogo pai' });
	return origin;
}

describe('Escape in nested overlays', () => {
	it('closes only the popover first, then the dialog, restoring focus at each step', async () => {
		render(<PopoverInside />);
		const origin = await openParent();
		const trigger = screen.getByRole('button', { name: 'Mais ações' });
		trigger.focus();
		fireEvent.click(trigger);
		await screen.findByRole('dialog', { name: 'Ações internas' });

		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { name: 'Ações internas' })).not.toBeInTheDocument(),
		);
		expect(screen.getByRole('dialog', { name: 'Diálogo pai' })).toBeInTheDocument();
		await waitFor(() => expect(trigger).toHaveFocus());

		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { name: 'Diálogo pai' })).not.toBeInTheDocument(),
		);
		await waitFor(() => expect(origin).toHaveFocus());
	});

	it('closes only the calendar first when a date picker is inside the dialog', async () => {
		render(
			<Host>
				<AdsDatePicker defaultValue="2026-03-10" />
			</Host>,
		);
		const origin = await openParent();
		const calendarTrigger = screen.getByRole('button', { name: 'Abrir calendário' });
		calendarTrigger.focus();
		fireEvent.click(calendarTrigger);
		await screen.findByRole('grid');

		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
		expect(screen.getByRole('dialog', { name: 'Diálogo pai' })).toBeInTheDocument();
		await waitFor(() => expect(calendarTrigger).toHaveFocus());

		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { name: 'Diálogo pai' })).not.toBeInTheDocument(),
		);
		await waitFor(() => expect(origin).toHaveFocus());
	});

	it('closes only the menu first when a dropdown is inside the dialog', async () => {
		render(
			<Host>
				<AdsDropdown>
					<AdsDropdown.Trigger>Menu</AdsDropdown.Trigger>
					<AdsDropdown.Content aria-label="Ações do menu">
						<AdsDropdown.Item>Editar</AdsDropdown.Item>
					</AdsDropdown.Content>
				</AdsDropdown>
			</Host>,
		);
		const origin = await openParent();
		const trigger = screen.getByRole('button', { name: 'Menu' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });
		const item = await screen.findByRole('menuitem', { name: 'Editar' });
		await waitFor(() => expect(item).toHaveFocus());

		fireEvent.keyDown(item, { key: 'Escape' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(screen.getByRole('dialog', { name: 'Diálogo pai' })).toBeInTheDocument();
		expect(trigger).toHaveFocus();

		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { name: 'Diálogo pai' })).not.toBeInTheDocument(),
		);
		await waitFor(() => expect(origin).toHaveFocus());
	});

	it('does not close the dialog when the top layer disallows closing, and absorbs Escape', async () => {
		function FixedLayer() {
			const [open, setOpen] = useState(false);
			return (
				<>
					<AdsButton onClick={() => setOpen(true)}>Abrir fixo</AdsButton>
					<AdsDialog closeOnEscape={false} onOpenChange={setOpen} open={open} title="Camada fixa">
						Conteúdo
					</AdsDialog>
				</>
			);
		}
		render(
			<Host>
				<FixedLayer />
			</Host>,
		);
		await openParent();
		fireEvent.click(screen.getByRole('button', { name: 'Abrir fixo' }));
		await screen.findByRole('dialog', { name: 'Camada fixa' });
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.getByRole('dialog', { name: 'Diálogo pai' })).toBeInTheDocument();
		expect(screen.getByRole('dialog', { name: 'Camada fixa' })).toBeInTheDocument();
	});

	it('does not stop the propagation of a handled Escape', async () => {
		render(<PopoverInside />);
		await openParent();
		const trigger = screen.getByRole('button', { name: 'Mais ações' });
		fireEvent.click(trigger);
		await screen.findByRole('dialog', { name: 'Ações internas' });
		let seenByOthers = false;
		const observer = () => {
			seenByOthers = true;
		};
		document.body.addEventListener('keydown', observer);
		fireEvent.keyDown(document.body, { key: 'Escape' });
		document.body.removeEventListener('keydown', observer);
		expect(seenByOthers).toBe(true);
		await waitFor(() =>
			expect(screen.queryByRole('dialog', { name: 'Ações internas' })).not.toBeInTheDocument(),
		);
		expect(screen.getByRole('dialog', { name: 'Diálogo pai' })).toBeInTheDocument();
	});

	it('marks a handled Escape as defaultPrevented', async () => {
		render(<PopoverInside />);
		await openParent();
		fireEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
		await screen.findByRole('dialog', { name: 'Ações internas' });
		const notPrevented = fireEvent.keyDown(document, { key: 'Escape' });
		expect(notPrevented).toBe(false);
	});

	it('keeps the stack consistent when the inner layer reopens', async () => {
		render(<PopoverInside />);
		await openParent();
		const trigger = screen.getByRole('button', { name: 'Mais ações' });
		for (let round = 0; round < 2; round += 1) {
			fireEvent.click(trigger);
			await screen.findByRole('dialog', { name: 'Ações internas' });
			fireEvent.keyDown(document, { key: 'Escape' });
			await waitFor(() =>
				expect(screen.queryByRole('dialog', { name: 'Ações internas' })).not.toBeInTheDocument(),
			);
			expect(screen.getByRole('dialog', { name: 'Diálogo pai' })).toBeInTheDocument();
		}
	});

	it('has no detectable accessibility violations with a popover open in a dialog', async () => {
		render(<PopoverInside />);
		await openParent();
		fireEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
		await screen.findByRole('dialog', { name: 'Ações internas' });
		const results = await axe.run(document.body, {
			rules: { 'color-contrast': { enabled: false } },
		});
		expect(results.violations.map((violation) => violation.id)).toEqual([]);
	});
});
