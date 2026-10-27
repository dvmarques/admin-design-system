import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ForgotPasswordForm } from '../app/auth/forgot-password-form';
import { LoginForm } from '../app/auth/login-form';
import { ResetPasswordForm } from '../app/auth/reset-password-form';
import {
	invalidEmailMessage,
	passwordMismatchMessage,
	passwordRulesMessage,
	requiredEmailMessage,
	requiredPasswordMessage,
	simulatedAuthDelayMs,
} from '../lib/auth-demo';

const push = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push }),
}));

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
	vi.clearAllMocks();
});

async function finishSimulatedDelay() {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(simulatedAuthDelayMs);
	});
}

function type(label: string, value: string) {
	fireEvent.change(screen.getByLabelText(label, { selector: 'input' }), { target: { value } });
}

describe('LoginForm', () => {
	it('focuses the e-mail and then the password field when they are invalid', () => {
		render(<LoginForm />);

		fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
		expect(screen.getByText(requiredEmailMessage)).toBeInTheDocument();
		expect(screen.getByLabelText('E-mail')).toHaveFocus();
		expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');

		type('E-mail', 'invalido');
		fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
		expect(screen.getByText(invalidEmailMessage)).toBeInTheDocument();

		type('E-mail', 'nome@exemplo.com.br');
		fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
		expect(screen.getByText(requiredPasswordMessage)).toBeInTheDocument();
		expect(screen.getByLabelText('Senha', { selector: 'input' })).toHaveFocus();
		expect(push).not.toHaveBeenCalled();
	});

	it('shows loading for the simulated delay and then navigates to the demo', async () => {
		render(<LoginForm />);
		type('E-mail', 'nome@exemplo.com.br');
		type('Senha', 'qualquer');

		fireEvent.click(screen.getByRole('button', { name: /Entrar/ }));
		expect(screen.getByRole('button', { name: /Entrar/ })).toHaveAttribute('aria-busy', 'true');
		expect(push).not.toHaveBeenCalled();

		await finishSimulatedDelay();
		expect(push).toHaveBeenCalledWith('/');
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});

	it('does not give the inputs a name, so a native submit cannot put values in the URL', () => {
		const { container } = render(<LoginForm />);
		for (const input of container.querySelectorAll('input')) {
			expect(input).not.toHaveAttribute('name');
		}
	});
});

describe('ForgotPasswordForm', () => {
	it('validates the e-mail and then confirms with focus on the message and link actions', async () => {
		render(<ForgotPasswordForm />);

		fireEvent.click(screen.getByRole('button', { name: 'Enviar instruções simuladas' }));
		expect(screen.getByText(requiredEmailMessage)).toBeInTheDocument();
		expect(screen.getByLabelText('E-mail')).toHaveFocus();

		type('E-mail', 'invalido');
		fireEvent.click(screen.getByRole('button', { name: 'Enviar instruções simuladas' }));
		expect(screen.getByText(invalidEmailMessage)).toBeInTheDocument();

		type('E-mail', 'nome@exemplo.com.br');
		fireEvent.click(screen.getByRole('button', { name: /Enviar instruções simuladas/ }));
		await finishSimulatedDelay();

		const status = screen.getByRole('status');
		expect(status).toHaveTextContent('Envio simulado');
		expect(status).toHaveTextContent('nome@exemplo.com.br');
		expect(status).toHaveFocus();
		expect(screen.getByRole('link', { name: 'Continuar para redefinição' })).toHaveAttribute(
			'href',
			'/redefinir-senha',
		);
		expect(screen.getByRole('link', { name: 'Voltar ao login' })).toHaveAttribute('href', '/login');
	});
});

describe('ResetPasswordForm', () => {
	it('reports unmet rules on the new password field and focuses it', () => {
		render(<ResetPasswordForm />);
		type('Nova senha', 'curta');
		type('Confirmar senha', 'curta');

		fireEvent.click(screen.getByRole('button', { name: 'Salvar senha simulada' }));

		expect(screen.getByText(passwordRulesMessage)).toBeInTheDocument();
		const password = screen.getByLabelText('Nova senha', { selector: 'input' });
		expect(password).toHaveAttribute('aria-invalid', 'true');
		expect(password).toHaveFocus();
	});

	it('reports a mismatched confirmation on the confirm field and focuses it', () => {
		render(<ResetPasswordForm />);
		type('Nova senha', 'SenhaForte1');
		type('Confirmar senha', 'SenhaForte2');

		fireEvent.click(screen.getByRole('button', { name: 'Salvar senha simulada' }));

		expect(screen.getByText(passwordMismatchMessage)).toBeInTheDocument();
		const confirm = screen.getByLabelText('Confirmar senha', { selector: 'input' });
		expect(confirm).toHaveAttribute('aria-invalid', 'true');
		expect(confirm).toHaveFocus();
		expect(screen.queryByText(/Senha redefinida/)).not.toBeInTheDocument();
	});

	it('confirms the simulated reset with focus on the message and a login link', async () => {
		render(<ResetPasswordForm />);
		type('Nova senha', 'SenhaForte1');
		type('Confirmar senha', 'SenhaForte1');

		fireEvent.click(screen.getByRole('button', { name: 'Salvar senha simulada' }));
		await finishSimulatedDelay();

		const status = screen.getByRole('status');
		expect(status).toHaveTextContent('simulação');
		expect(status).toHaveFocus();
		expect(screen.getByRole('link', { name: 'Voltar ao login' })).toHaveAttribute('href', '/login');
	});
});
