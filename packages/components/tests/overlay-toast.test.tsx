import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { AdsToast } from '../src/overlay-toast';

describe('AdsToast', () => {
	it.each(['info', 'success', 'warning'] as const)(
		'uses a polite status region for %s',
		async (variant) => {
			render(<AdsToast variant={variant}>Operação concluída</AdsToast>);
			const toast = await screen.findByRole('status');
			expect(toast).toHaveAttribute('aria-live', 'polite');
			expect(toast).toHaveAttribute('data-variant', variant);
			expect(screen.getByText('Operação concluída')).toHaveClass(
				'ads-typography',
				'text-sm',
				'leading-normal',
				'text-text',
			);
			expect(toast).toHaveClass('font-sans');
		},
	);

	it('uses an assertive alert region for errors without moving focus', async () => {
		const trigger = document.createElement('button');
		trigger.textContent = 'Origem';
		document.body.append(trigger);
		trigger.focus();
		render(<AdsToast variant="error">Falha ao salvar</AdsToast>);
		const toast = await screen.findByRole('alert');
		expect(toast).toHaveAttribute('aria-live', 'assertive');
		expect(document.activeElement).toBe(trigger);
		trigger.remove();
	});

	it('requests dismissal through an accessible keyboard control', async () => {
		const onClose = vi.fn();
		render(<AdsToast onClose={onClose}>Mensagem</AdsToast>);
		const close = await screen.findByRole('button', { name: 'Fechar notificação' });
		expect(close).toHaveClass('h-8', 'w-8', 'hover:bg-surface-muted', 'active:scale-95');
		expect(close.querySelector('.ads-icon')).toHaveClass('h-4', 'w-4');
		close.focus();
		fireEvent.keyDown(close, { key: 'Enter' });
		fireEvent.click(close);
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('supports a non-dismissible toast and no detectable accessibility violations', async () => {
		const { container } = render(
			<AdsToast dismissible={false} variant="success">
				Tudo certo
			</AdsToast>,
		);
		const toast = await screen.findByRole('status');
		expect(toast.querySelector('button')).toBeNull();
		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});

	it('does not render when closed', async () => {
		render(<AdsToast open={false}>Oculto</AdsToast>);
		await waitFor(() => expect(screen.queryByText('Oculto')).not.toBeInTheDocument());
	});
});
