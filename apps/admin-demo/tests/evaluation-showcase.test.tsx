import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EvaluationShowcase } from '../app/evaluation-showcase';

describe('admin demo evaluation scenarios', () => {
	it('exposes loading and form states with accessible descriptions', () => {
		render(<EvaluationShowcase />);

		expect(screen.getByLabelText('Sincronizando dados')).toBeInTheDocument();
		expect(screen.getByLabelText('Normal')).toHaveValue('contato@empresa.com');
		expect(screen.getByLabelText('Erro')).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByLabelText('Somente leitura')).toHaveAttribute('readonly');
		expect(screen.getByLabelText('Desabilitado')).toBeDisabled();
		expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument();
	});

	it('confirms a destructive action and returns feedback', () => {
		render(<EvaluationShowcase />);

		const trigger = screen.getByRole('button', { name: 'Excluir registro' });
		fireEvent.click(trigger);
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(screen.getByText('Registro removido com sucesso.')).toBeInTheDocument();
		expect(document.activeElement).toBe(trigger);
	});
});
