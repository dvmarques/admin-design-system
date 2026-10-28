import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
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
	it('keeps the same DOM node when rerendered with the same message', () => {
		const { rerender } = render(<AdsAlert variant="error">Erro ao salvar</AdsAlert>);
		const node = screen.getByRole('alert');
		rerender(<AdsAlert variant="error">Erro ao salvar</AdsAlert>);
		expect(screen.getByRole('alert')).toBe(node);
	});
	it('lets consumers override the role and passes through HTML attributes', () => {
		render(
			<AdsAlert variant="error" role="status" data-testid="custom" id="feedback">
				Aviso não urgente
			</AdsAlert>,
		);
		expect(screen.getByRole('status')).toHaveAttribute('id', 'feedback');
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});
	it('renders a keyboard-operable close button that does not submit forms', () => {
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const onClose = vi.fn();
		render(
			<form onSubmit={onSubmit}>
				<AdsAlert dismissible onClose={onClose} closeLabel="Dispensar">
					Mensagem
				</AdsAlert>
			</form>,
		);
		const close = screen.getByRole('button', { name: 'Dispensar' });
		expect(close).toHaveAttribute('type', 'button');
		close.focus();
		expect(close).toHaveFocus();
		fireEvent.click(close);
		expect(onSubmit).not.toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledOnce();
	});
	it('ships a forced-colors fallback that does not rely on color alone', async () => {
		const css = await readFile(resolve(import.meta.dirname, '../dist/styles.css'), 'utf8');
		const start = css.indexOf('.ads-alert{border-color:canvastext');
		expect(start, 'regra forced-colors do AdsAlert ausente no CSS distribuído').toBeGreaterThan(-1);
		const block = css
			.slice(start, start + 400)
			.replaceAll('"', '')
			.replaceAll("'", '');
		expect(block).toContain('[data-variant=warning]{border-style:dashed');
		expect(block).toContain('[data-variant=error]{border-style:double');
	});
	it('starts hidden with defaultOpen=false and never shows without a controlled reopen', () => {
		render(<AdsAlert defaultOpen={false}>Mensagem</AdsAlert>);
		expect(screen.queryByText('Mensagem')).not.toBeInTheDocument();
	});
	it('reopens when the controlled open prop goes back to true', () => {
		const { rerender } = render(<AdsAlert open={false}>Mensagem</AdsAlert>);
		expect(screen.queryByText('Mensagem')).not.toBeInTheDocument();
		rerender(<AdsAlert open>Mensagem</AdsAlert>);
		expect(screen.getByRole('status')).toHaveTextContent('Mensagem');
	});
	it('does not render a close button unless dismissible', () => {
		render(<AdsAlert>Mensagem</AdsAlert>);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
	it('never adds aria-live to status variants', () => {
		render(<AdsAlert variant="success">Salvo</AdsAlert>);
		expect(screen.getByRole('status')).not.toHaveAttribute('aria-live');
	});
	it('keeps the DOM node and updates the role when the variant changes', () => {
		const { rerender } = render(<AdsAlert variant="info">Mensagem</AdsAlert>);
		const node = screen.getByRole('status');
		rerender(<AdsAlert variant="error">Mensagem</AdsAlert>);
		expect(screen.getByRole('alert')).toBe(node);
	});
});
