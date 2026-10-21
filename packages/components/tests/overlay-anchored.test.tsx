import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdsButton } from '../src/button';
import { AdsDialog, AdsDrawer } from '../src/overlay-dialog';
import { AdsPopover, AdsTooltip } from '../src/overlay-anchored';

function PopoverFixture() {
	const [open, setOpen] = useState(false);
	return (
		<AdsPopover
			aria-label="Ações rápidas"
			content={<AdsButton>Editar</AdsButton>}
			onOpenChange={setOpen}
			open={open}
		>
			<AdsButton>Mais ações</AdsButton>
		</AdsPopover>
	);
}

describe('anchored overlays', () => {
	it('keeps panel interactions open and preserves consumer handlers and bubbling', async () => {
		const onOpenChange = vi.fn();
		const onTriggerClick = vi.fn();
		const onPanelClick = vi.fn();
		const onAncestorClick = vi.fn();
		const onAction = vi.fn();
		function InteractivePopover() {
			const [open, setOpen] = useState(false);
			return (
				<div onClick={onAncestorClick}>
					<AdsPopover
						aria-label="Edição rápida"
						content={
							<>
								<input aria-label="Nome" />
								<AdsButton onClick={onAction}>Aplicar</AdsButton>
								<AdsButton onClick={() => setOpen(false)}>Concluir</AdsButton>
							</>
						}
						onClick={onPanelClick}
						onOpenChange={(next) => {
							onOpenChange(next);
							setOpen(next);
						}}
						open={open}
					>
						<AdsButton onClick={onTriggerClick}>
							<span>Editar nome</span>
						</AdsButton>
					</AdsPopover>
				</div>
			);
		}
		render(<InteractivePopover />);
		const trigger = screen.getByRole('button', { name: 'Editar nome' });
		trigger.focus();
		fireEvent.click(screen.getByText('Editar nome'));
		const panel = await screen.findByRole('dialog', { name: 'Edição rápida' });
		expect(trigger).toHaveAttribute('aria-controls', panel.id);
		expect(onTriggerClick).toHaveBeenCalledTimes(1);
		expect(onOpenChange.mock.calls).toEqual([[true]]);
		onAncestorClick.mockClear();
		const input = screen.getByRole('textbox', { name: 'Nome' });
		fireEvent.mouseDown(input);
		fireEvent.click(input);
		fireEvent.change(input, { target: { value: 'Ana' } });
		expect(input).toHaveValue('Ana');
		fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
		expect(onAction).toHaveBeenCalledTimes(1);
		expect(onPanelClick).toHaveBeenCalledTimes(2);
		expect(onAncestorClick).toHaveBeenCalledTimes(2);
		expect(panel).toBeVisible();
		expect(onOpenChange.mock.calls).toEqual([[true]]);
		expect((await axe.run(panel)).violations).toEqual([]);
		fireEvent.click(screen.getByText('Editar nome'));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(onTriggerClick).toHaveBeenCalledTimes(2);
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		fireEvent.click(trigger);
		fireEvent.click(screen.getByRole('button', { name: 'Concluir' }));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(onOpenChange.mock.calls).toEqual([[true], [false], [true]]);
	});

	it('preserves a trigger handler that stops propagation', () => {
		const onOpenChange = vi.fn();
		const onClick = vi.fn();
		render(
			<AdsPopover content="Conteúdo" onOpenChange={onOpenChange} open={false}>
				<AdsButton
					onClick={(event) => {
						onClick();
						event.stopPropagation();
					}}
				>
					Gatilho
				</AdsButton>
			</AdsPopover>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Gatilho' }));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('shows a tooltip on focus without capturing focus', async () => {
		render(
			<AdsTooltip content="Ajuda contextual">
				<AdsButton>Ajuda</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Ajuda' });
		trigger.focus();
		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent('Ajuda contextual');
		expect(tooltip).toHaveClass('z-[var(--ads-layer-overlay)]');
		expect(tooltip).toHaveAttribute('data-placement', 'top');
		expect(tooltip.firstElementChild).toHaveAttribute('aria-hidden', 'true');
		expect(tooltip.firstElementChild).toHaveClass('-bottom-1', 'rotate-45');
		expect(document.activeElement).toBe(trigger);
		fireEvent.blur(trigger);
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('shows a tooltip while the pointer hovers the trigger', async () => {
		render(
			<AdsTooltip content="Ajuda por hover">
				<AdsButton>Detalhes</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Detalhes' });
		fireEvent.pointerEnter(trigger);
		expect(await screen.findByRole('tooltip')).toHaveTextContent('Ajuda por hover');
		fireEvent.pointerLeave(trigger);
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('dismisses a focus-opened tooltip with Escape without moving focus', async () => {
		render(
			<AdsTooltip content="Ajuda contextual">
				<AdsButton>Ajuda</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Ajuda' });
		trigger.focus();
		const tooltip = await screen.findByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		expect(document.activeElement).toBe(trigger);
		expect(trigger).not.toHaveAttribute('aria-describedby');
	});

	it('dismisses a hover-opened tooltip with Escape and reopens only on a new pointer entry', async () => {
		render(
			<AdsTooltip content="Ajuda por hover">
				<AdsButton>Detalhes</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Detalhes' });
		fireEvent.pointerEnter(trigger);
		await screen.findByRole('tooltip');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		expect(document.activeElement).not.toBe(trigger);
		fireEvent.pointerLeave(trigger);
		fireEvent.pointerEnter(trigger);
		const reopened = await screen.findByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', reopened.id);
	});

	it('keeps a dismissed tooltip closed while focus stays and reopens on a new focus', async () => {
		render(
			<AdsTooltip content="Ajuda contextual">
				<AdsButton>Ajuda</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Ajuda' });
		trigger.focus();
		await screen.findByRole('tooltip');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		fireEvent.keyDown(trigger, { key: 'a' });
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		trigger.blur();
		trigger.focus();
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();
	});

	it('reopens a focus-dismissed tooltip when the pointer enters the trigger again', async () => {
		render(
			<AdsTooltip content="Ajuda contextual">
				<AdsButton>Ajuda</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Ajuda' });
		trigger.focus();
		await screen.findByRole('tooltip');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		fireEvent.pointerEnter(trigger);
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();
	});

	it.each([
		['AdsDialog', AdsDialog],
		['AdsDrawer', AdsDrawer],
	] as const)(
		'closes only the tooltip on the first Escape inside an %s',
		async (_name, Overlay) => {
			const onOpenChange = vi.fn();
			render(
				<Overlay onOpenChange={onOpenChange} open title="Diálogo">
					<AdsTooltip content="Ajuda">
						<AdsButton>Dica</AdsButton>
					</AdsTooltip>
				</Overlay>,
			);
			const trigger = screen.getByRole('button', { name: 'Dica' });
			// O diálogo move o foco inicial para o primeiro controle; só depois o gatilho recebe foco.
			await waitFor(() =>
				expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Fechar' })),
			);
			trigger.focus();
			await screen.findByRole('tooltip');
			fireEvent.keyDown(document, { key: 'Escape' });
			await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
			expect(onOpenChange).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(trigger);
			fireEvent.keyDown(document, { key: 'Escape' });
			expect(onOpenChange).toHaveBeenCalledWith(false);
		},
	);

	it('closes only the topmost layer when a tooltip and a popover are open', async () => {
		render(
			<>
				<PopoverFixture />
				<AdsTooltip content="Ajuda">
					<AdsButton>Dica</AdsButton>
				</AdsTooltip>
			</>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
		await screen.findByRole('dialog', { name: 'Ações rápidas' });
		screen.getByRole('button', { name: 'Dica' }).focus();
		await screen.findByRole('tooltip');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		expect(screen.getByRole('dialog', { name: 'Ações rápidas' })).toBeInTheDocument();
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('opens a popover from its trigger and closes on Escape with focus restoration', async () => {
		render(<PopoverFixture />);
		const trigger = screen.getByRole('button', { name: 'Mais ações' });
		trigger.focus();
		fireEvent.click(trigger);
		const popover = await screen.findByRole('dialog', { name: 'Ações rápidas' });
		expect(popover).toBeVisible();
		expect(popover).toHaveClass('z-[var(--ads-layer-overlay)]');
		expect(popover).toHaveClass('font-sans');
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	it('closes a popover when clicking outside the anchor and panel', async () => {
		render(<PopoverFixture />);
		fireEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
		await screen.findByRole('dialog', { name: 'Ações rápidas' });
		fireEvent.mouseDown(document.body);
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('keeps anchored content within the viewport bounds', async () => {
		render(<PopoverFixture />);
		fireEvent.click(screen.getByRole('button', { name: 'Mais ações' }));
		const popover = await screen.findByRole('dialog', { name: 'Ações rápidas' });
		await waitFor(() => expect(popover).toHaveStyle({ left: '8px', top: '8px' }));
	});

	it('has no detectable accessibility violations', async () => {
		const { container } = render(
			<AdsTooltip content="Informação">
				<AdsButton>Info</AdsButton>
			</AdsTooltip>,
		);
		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});

	it('has no detectable accessibility violations with the tooltip open', async () => {
		render(
			<AdsTooltip content="Informação">
				<AdsButton>Info</AdsButton>
			</AdsTooltip>,
		);
		screen.getByRole('button', { name: 'Info' }).focus();
		await screen.findByRole('tooltip');
		const results = await axe.run(document.body, {
			rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
		});
		expect(results.violations).toEqual([]);
	});
});
