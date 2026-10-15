import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NewCustomerForm } from '../app/(admin)/clientes/novo/new-customer-form';

function submit() {
	fireEvent.submit(screen.getByRole('button', { name: 'Cadastrar cliente' }).closest('form')!);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('NewCustomerForm', () => {
	it('moves focus to the first invalid field on the first invalid submit', () => {
		render(<NewCustomerForm />);

		submit();

		expect(screen.getByLabelText('Nome')).toHaveFocus();
	});

	it('moves focus back again on a second submit that leaves the errors unchanged', () => {
		render(<NewCustomerForm />);
		submit();
		expect(screen.getByLabelText('Nome')).toHaveFocus();

		// fireEvent does not move focus: put it elsewhere first, otherwise this would pass even
		// without the submission counter that re-runs the focus effect.
		const submitButton = screen.getByRole('button', { name: 'Cadastrar cliente' });
		submitButton.focus();
		expect(submitButton).toHaveFocus();

		submit();

		expect(screen.getByLabelText('Nome')).toHaveFocus();
	});

	it('associates each error message with its invalid field', () => {
		render(<NewCustomerForm />);

		submit();

		for (const [label, message] of [
			['Nome', 'Informe o nome do cliente.'],
			['E-mail', 'Informe o e-mail do cliente.'],
		] as const) {
			const field = screen.getByLabelText(label);
			expect(field).toHaveAttribute('aria-invalid', 'true');
			const describedBy = field.getAttribute('aria-describedby')?.split(' ') ?? [];
			const messageElement = screen.getByText(message);
			expect(describedBy).toContain(messageElement.id);
		}
	});

	it('flags only the empty required field and focuses it', () => {
		render(<NewCustomerForm />);
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana Souza' } });

		submit();

		expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByLabelText('E-mail')).toHaveFocus();
	});

	it('rejects an e-mail without a valid format with an accessible message', () => {
		render(<NewCustomerForm />);
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana Souza' } });
		fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'abc' } });

		submit();

		const field = screen.getByLabelText('E-mail');
		expect(field).toHaveAttribute('aria-invalid', 'true');
		expect(field).toHaveFocus();
		const message = screen.getByText('Informe um e-mail válido, como nome@exemplo.com.br.');
		expect(field.getAttribute('aria-describedby')?.split(' ')).toContain(message.id);
		expect(screen.queryByText('Cliente cadastrado com sucesso.')).not.toBeInTheDocument();
	});

	it.each(['ana@exemplo', 'ana exemplo@x.com', '@exemplo.com', 'ana@'])(
		'rejects the malformed e-mail %s',
		(value) => {
			render(<NewCustomerForm />);
			fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana Souza' } });
			fireEvent.change(screen.getByLabelText('E-mail'), { target: { value } });

			submit();

			expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
		},
	);

	it('keeps the required message, not the format one, for an empty e-mail', () => {
		render(<NewCustomerForm />);

		submit();

		expect(screen.getByText('Informe o e-mail do cliente.')).toBeInTheDocument();
		expect(screen.queryByText(/e-mail válido/)).not.toBeInTheDocument();
	});

	it('clears a field error when the person edits that field', () => {
		render(<NewCustomerForm />);
		submit();

		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });

		expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-invalid', 'true');
		expect(screen.queryByText('Informe o nome do cliente.')).not.toBeInTheDocument();
		expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
	});

	it('shows a confirmation, no errors and sends nothing on a valid submit', () => {
		const fetchSpy = vi.spyOn(globalThis, 'fetch');
		render(<NewCustomerForm />);
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana Souza' } });
		fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@exemplo.com.br' } });

		submit();

		expect(screen.getByText('Cliente cadastrado com sucesso.')).toBeInTheDocument();
		expect(document.querySelector('[aria-invalid="true"]')).toBeNull();
		expect(screen.queryByText(/Informe o/)).not.toBeInTheDocument();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('does not confirm an invalid submission', () => {
		render(<NewCustomerForm />);

		submit();

		expect(screen.queryByText('Cliente cadastrado com sucesso.')).not.toBeInTheDocument();
	});

	it('keeps the browser validation from blocking the submit event', () => {
		render(<NewCustomerForm />);

		expect(
			screen.getByRole('button', { name: 'Cadastrar cliente' }).closest('form'),
		).toHaveAttribute('novalidate');
	});
});
