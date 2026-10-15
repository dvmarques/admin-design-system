import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NewCustomerForm } from '../app/(admin)/clientes/novo/new-customer-form';

const push = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push }),
}));

function goNext() {
	fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
}

function submitFinal() {
	fireEvent.click(screen.getByRole('button', { name: 'Cadastrar cliente' }));
}

function fillIdentity(nome = '', email = '') {
	if (nome) fireEvent.change(screen.getByLabelText('Nome'), { target: { value: nome } });
	if (email) fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: email } });
}

afterEach(() => {
	vi.clearAllMocks();
});

describe('NewCustomerForm', () => {
	it('moves focus to the first invalid field when advancing from the identity step', () => {
		render(<NewCustomerForm />);

		goNext();

		expect(screen.getByLabelText('Nome')).toHaveFocus();
	});

	it('blocks advancing with empty required fields and shows accessible errors', () => {
		render(<NewCustomerForm />);

		goNext();

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

	it('flags only the empty required field on the identity step', () => {
		render(<NewCustomerForm />);
		fillIdentity('Ana Souza');

		goNext();

		expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByLabelText('E-mail')).toHaveFocus();
	});

	it('rejects an e-mail without a valid format with an accessible message', () => {
		render(<NewCustomerForm />);
		fillIdentity('Ana Souza', 'abc');

		goNext();

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
			fillIdentity('Ana Souza', value);

			goNext();

			expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
		},
	);

	it('clears a field error when the person edits that field', () => {
		render(<NewCustomerForm />);
		goNext();

		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });

		expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-invalid', 'true');
		expect(screen.queryByText('Informe o nome do cliente.')).not.toBeInTheDocument();
		expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
	});

	it('shows the step indicator and advances through plan and review', () => {
		render(<NewCustomerForm />);
		fillIdentity('Ana Souza', 'ana@exemplo.com.br');

		goNext();
		expect(screen.getByRole('heading', { name: 'Plano e status' })).toBeVisible();

		goNext();
		expect(screen.getByRole('heading', { name: 'Revisão' })).toBeVisible();
		expect(screen.getByText('ana@exemplo.com.br')).toBeInTheDocument();
	});

	it('shows a confirmation, no errors and sends nothing on a valid submit', () => {
		const fetchSpy = vi.spyOn(globalThis, 'fetch');
		render(<NewCustomerForm />);
		fillIdentity('Ana Souza', 'ana@exemplo.com.br');
		goNext();
		goNext();

		submitFinal();

		expect(screen.getByText('Cliente cadastrado com sucesso.')).toBeInTheDocument();
		expect(document.querySelector('[aria-invalid="true"]')).toBeNull();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('navigates back to the listing when cancel is chosen', () => {
		render(<NewCustomerForm />);

		fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

		expect(push).toHaveBeenCalledWith('/clientes');
	});

	it('uses noValidate on the form so the browser does not block step validation', () => {
		render(<NewCustomerForm />);

		expect(screen.getByRole('button', { name: 'Próxima' }).closest('form')).toHaveAttribute(
			'novalidate',
		);
	});
});
