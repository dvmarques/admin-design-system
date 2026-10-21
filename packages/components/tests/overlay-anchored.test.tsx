import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { AdsButton } from '../src/button';
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

	it('keeps the trigger aria-describedby when the tooltip opens on focus', async () => {
		render(
			<AdsTooltip content="Ajuda contextual">
				<AdsButton aria-describedby="ajuda">Campo</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Campo' });
		expect(trigger).toHaveAttribute('aria-describedby', 'ajuda');
		trigger.focus();
		const tooltip = await screen.findByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', `ajuda ${tooltip.id}`);
		fireEvent.keyDown(document, { key: 'Escape' });
		fireEvent.blur(trigger);
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		expect(trigger).toHaveAttribute('aria-describedby', 'ajuda');
	});

	it('keeps the trigger aria-describedby when the tooltip opens on hover', async () => {
		render(
			<AdsTooltip content="Ajuda por hover">
				<AdsButton aria-describedby="ajuda erro">Campo</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Campo' });
		fireEvent.pointerEnter(trigger);
		const tooltip = await screen.findByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', `ajuda erro ${tooltip.id}`);
		fireEvent.pointerLeave(trigger);
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		expect(trigger).toHaveAttribute('aria-describedby', 'ajuda erro');
	});

	it('removes aria-describedby on close when the trigger had none', async () => {
		render(
			<AdsTooltip content="Ajuda">
				<AdsButton>Sem ajuda</AdsButton>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button', { name: 'Sem ajuda' });
		trigger.focus();
		const tooltip = await screen.findByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
		fireEvent.blur(trigger);
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		expect(trigger).not.toHaveAttribute('aria-describedby');
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
});
