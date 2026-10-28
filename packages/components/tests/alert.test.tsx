import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { AdsAlert } from '../src/alert';

describe('AdsAlert', () => {
	it.each(['info', 'success', 'warning'] as const)('announces %s as status', (variant) => {
		render(
			<AdsAlert variant={variant} title="Resultado">
				Descrição
			</AdsAlert>,
		);
		expect(screen.getByRole('status')).toHaveAttribute('data-variant', variant);
		expect(screen.getByText('Resultado')).toBeVisible();
	});
	it('exposes errors with role alert without redundant aria-live', () => {
		render(<AdsAlert variant="error">Erro ao salvar</AdsAlert>);
		expect(screen.getByRole('alert')).not.toHaveAttribute('aria-live');
	});
	it('allows uncontrolled dismissal and calls onClose once', () => {
		const onClose = vi.fn();
		render(
			<AdsAlert dismissible onClose={onClose}>
				Mensagem
			</AdsAlert>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem' }));
		expect(screen.queryByText('Mensagem')).not.toBeInTheDocument();
		expect(onClose).toHaveBeenCalledOnce();
	});
	it('keeps controlled visibility until parent changes open', () => {
		const onClose = vi.fn();
		const { rerender } = render(
			<AdsAlert dismissible open onClose={onClose}>
				Mensagem
			</AdsAlert>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem' }));
		expect(screen.getByText('Mensagem')).toBeVisible();
		expect(onClose).toHaveBeenCalledOnce();
		rerender(
			<AdsAlert open={false} dismissible>
				Mensagem
			</AdsAlert>,
		);
		expect(screen.queryByText('Mensagem')).not.toBeInTheDocument();
	});
	it('supports composition, action and callout appearance', () => {
		render(
			<AdsAlert appearance="callout" icon={null} actions={<button type="button">Revisar</button>}>
				Conteúdo
			</AdsAlert>,
		);
		expect(screen.getByRole('status')).toHaveAttribute('data-appearance', 'callout');
		expect(screen.getByRole('button', { name: 'Revisar' })).toBeVisible();
		expect(screen.getByRole('status').querySelector('.ads-alert-icon')).toBeNull();
	});
	it.each(['light', 'dark'] as const)(
		'has no detectable accessibility violations with %s theme',
		async (theme) => {
			const { container } = render(
				<div data-theme={theme}>
					<AdsAlert variant="warning" title="Atenção" dismissible>
						Ajuste os campos.
					</AdsAlert>
				</div>,
			);
			const result = await axe.run(container);
			expect(result.violations).toEqual([]);
		},
	);
});
