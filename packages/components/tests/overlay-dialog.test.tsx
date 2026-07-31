import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { AdsButton } from '../src/button';
import { AdsDialog, AdsDrawer } from '../src/overlay-dialog';

function DialogFixture() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<AdsButton onClick={() => setOpen(true)}>Abrir</AdsButton>
			<AdsDialog
				description="Confirme a operação antes de continuar."
				onOpenChange={setOpen}
				open={open}
				title="Confirmar operação"
			>
				<AdsButton>Confirmar</AdsButton>
			</AdsDialog>
		</>
	);
}

describe('overlay dialogs', () => {
	it('opens a named dialog and traps keyboard focus', async () => {
		render(<DialogFixture />);
		const trigger = screen.getByRole('button', { name: 'Abrir' });
		trigger.focus();
		fireEvent.click(trigger);
		const dialog = screen.getByRole('dialog', { name: 'Confirmar operação' });
		expect(dialog).toBeVisible();
		expect(screen.getByRole('heading', { name: 'Confirmar operação' })).toHaveClass(
			'ads-typography',
			'text-xl',
			'font-semibold',
			'leading-tight',
		);
		expect(screen.getByText('Confirme a operação antes de continuar.')).toHaveClass(
			'ads-typography',
			'text-sm',
			'leading-normal',
			'text-text-muted',
		);
		const close = screen.getByRole('button', { name: 'Fechar' });
		expect(close).toHaveClass(
			'h-8',
			'w-8',
			'bg-overlay-close-background',
			'text-overlay-close-content',
			'hover:bg-overlay-close-background-hover',
			'active:scale-95',
		);
		expect(close.querySelector('.ads-icon')).toHaveClass('h-4', 'w-4');
		const confirm = screen.getByRole('button', { name: 'Confirmar' });
		await waitFor(() => expect(document.activeElement).toBe(close));
		confirm.focus();
		fireEvent.keyDown(document, { key: 'Tab' });
		expect(document.activeElement).toBe(close);
		close.focus();
		fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
		expect(document.activeElement).toBe(confirm);
	});

	it('requests close on Escape and restores focus to the trigger', async () => {
		render(<DialogFixture />);
		const trigger = screen.getByRole('button', { name: 'Abrir' });
		trigger.focus();
		fireEvent.click(trigger);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	it('does not close from the backdrop when disabled', () => {
		const onOpenChange = () => undefined;
		render(
			<AdsDialog closeOnBackdrop={false} onOpenChange={onOpenChange} open title="Fixo">
				Conteúdo
			</AdsDialog>,
		);
		fireEvent.mouseDown(document.querySelector('[data-overlay="backdrop"]') as HTMLElement);
		expect(screen.getByRole('dialog', { name: 'Fixo' })).toBeVisible();
	});

	it('renders drawers with responsive semantic dialog structure', () => {
		render(
			<AdsDrawer onOpenChange={() => undefined} open placement="left" title="Filtros">
				Conteúdo do drawer
			</AdsDrawer>,
		);
		const drawer = screen.getByRole('dialog', { name: 'Filtros' });
		expect(drawer).toHaveClass('w-[min(24rem,100vw)]');
		expect(drawer).toHaveClass('font-sans');
		expect(screen.getByRole('heading', { name: 'Filtros' })).toHaveClass('ads-typography');
		expect(screen.getByRole('button', { name: 'Fechar' })).toHaveClass(
			'bg-overlay-close-background',
			'text-overlay-close-content',
		);
	});

	it('preserves the nearest theme in its portal and synchronizes theme changes', async () => {
		const { getByTestId } = render(
			<div data-testid="theme-scope" data-theme="light">
				<AdsDialog onOpenChange={() => undefined} open title="Com tema local">
					Conteúdo
				</AdsDialog>
			</div>,
		);
		const portal = await waitFor(() => {
			const element = document.querySelector<HTMLElement>('[data-ads-overlay-root]');
			expect(element).toHaveAttribute('data-theme', 'light');
			return element!;
		});

		getByTestId('theme-scope').setAttribute('data-theme', 'dark');
		await waitFor(() => expect(portal).toHaveAttribute('data-theme', 'dark'));
	});

	it('has no detectable accessibility violations', async () => {
		const { container } = render(
			<AdsDialog onOpenChange={() => undefined} open title="Acessível">
				Conteúdo
			</AdsDialog>,
		);
		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});
