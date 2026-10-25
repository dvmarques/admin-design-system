import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsField, AdsPasswordInput } from '../src/index.js';

describe('AdsPasswordInput', () => {
	it('masks by default and toggles without submitting forms', () => {
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		render(
			<form onSubmit={onSubmit}>
				<AdsField label="Senha">
					<AdsPasswordInput defaultValue="secret" />
				</AdsField>
			</form>,
		);
		const input = screen.getByLabelText('Senha') as HTMLInputElement;
		expect(input.type).toBe('password');
		expect(input.value).toBe('secret');
		fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }), { detail: 1 });
		expect(input.type).toBe('text');
		expect(input.value).toBe('secret');
		expect(input).toHaveFocus();
		expect(onSubmit).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'Ocultar senha' })).not.toHaveAttribute(
			'aria-pressed',
		);
		fireEvent.click(screen.getByRole('button', { name: 'Ocultar senha' }));
		expect(input.type).toBe('password');
	});

	it('preserves the selection when toggling', () => {
		render(<AdsPasswordInput aria-label="Senha" defaultValue="abcdef" />);
		const input = screen.getByLabelText('Senha') as HTMLInputElement;
		input.setSelectionRange(1, 3);
		fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }), { detail: 1 });
		expect(input.selectionStart).toBe(1);
		expect(input.selectionEnd).toBe(3);
	});

	it('works as a controlled input without React warnings', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const onChange = vi.fn();
		render(
			<AdsPasswordInput aria-label="Senha" defaultValue="x" onChange={onChange} value="abc" />,
		);
		const input = screen.getByLabelText('Senha') as HTMLInputElement;
		expect(input.value).toBe('abc');
		fireEvent.change(input, { target: { value: 'abcd' } });
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});

	it('disables both controls and supports invalid state', () => {
		render(
			<AdsField label="Senha" error="Senha inválida" validationState="error">
				<AdsPasswordInput disabled />
			</AdsField>,
		);
		expect(screen.getByLabelText('Senha')).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeDisabled();
		expect(screen.getByLabelText('Senha')).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByRole('alert')).toHaveTextContent('Senha inválida');
		expect(screen.getByLabelText('Senha')).toHaveAccessibleDescription('Senha inválida');
	});

	it('supports hiding the toggle', () => {
		render(<AdsPasswordInput aria-label="Senha" showVisibilityToggle={false} />);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('shows advisory strength in text, associated to the field', () => {
		render(
			<AdsField description="Mínimo de 8 caracteres" label="Senha">
				<AdsPasswordInput showStrength />
			</AdsField>,
		);
		const input = screen.getByLabelText('Senha');
		expect(screen.getByRole('status')).toBeEmptyDOMElement();
		expect(screen.getByText('Força da senha: Não avaliada')).toBeInTheDocument();
		fireEvent.change(input, { target: { value: 'abc' } });
		expect(screen.getByRole('status')).toHaveTextContent('Força da senha: Fraca');
		fireEvent.change(input, { target: { value: 'Abcdefg1' } });
		expect(screen.getByRole('status')).toHaveTextContent('Forte');
		expect(input).toHaveAccessibleDescription(/Mínimo de 8 caracteres.*Força da senha: Forte/);
	});

	it('keeps focus on the button when activated by keyboard', () => {
		render(<AdsPasswordInput aria-label="Senha" />);
		const toggle = screen.getByRole('button', { name: 'Mostrar senha' });
		toggle.focus();
		fireEvent.click(toggle, { detail: 0 });
		expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text');
		expect(screen.getByRole('button', { name: 'Ocultar senha' })).toHaveFocus();
	});

	it('forwards the ref to the input and keeps the consumer description', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<>
				<p id="hint">Dica</p>
				<AdsPasswordInput aria-describedby="hint" aria-label="Senha" ref={ref} showStrength />
			</>,
		);
		expect(ref.current).toBe(screen.getByLabelText('Senha'));
		expect(ref.current).toHaveAccessibleDescription(/Dica.*Força da senha/);
	});

	it('supports custom visible text and rule list name', () => {
		render(
			<AdsPasswordInput
				aria-label="Password"
				hidePasswordLabel="Hide password"
				rules={[{ id: 'a', label: 'A', test: () => true }]}
				rulesLabel="Requirements"
				showPasswordLabel="Show password"
				showPasswordText="Show"
			/>,
		);
		expect(screen.getByRole('button', { name: 'Show password' })).toHaveTextContent('Show');
		expect(screen.getByRole('list', { name: 'Requirements' })).toBeInTheDocument();
	});

	it('supports custom strength labels', () => {
		render(
			<AdsPasswordInput
				aria-label="Password"
				defaultValue="abc"
				showStrength
				strengthLabels={{ weak: 'Weak' }}
				strengthPrefix="Strength:"
			/>,
		);
		expect(screen.getAllByText('Strength: Weak')).toHaveLength(2);
	});

	it('lists rules with a textual status, not only an icon', () => {
		render(
			<AdsPasswordInput
				aria-label="Senha"
				rules={[
					{ id: 'length', label: '8 caracteres', test: (value) => value.length >= 8 },
					{ id: 'digit', label: 'Um número', test: (value) => /\d/.test(value) },
				]}
			/>,
		);
		const input = screen.getByLabelText('Senha');
		expect(screen.getByText('8 caracteres').closest('li')).toHaveTextContent('Pendente');
		fireEvent.change(input, { target: { value: 'abcdefgh1' } });
		expect(screen.getByText('8 caracteres').closest('li')).toHaveTextContent('Atendida');
		expect(screen.getByText('Um número').closest('li')).toHaveAttribute('data-met', 'true');
		expect(input).toHaveAccessibleDescription(/8 caracteres.*Atendida/);
	});

	it('renders on the server without browser APIs', () => {
		const html = renderToString(<AdsPasswordInput aria-label="Senha" showStrength />);
		expect(html).toContain('type="password"');
		expect(html).toContain('ads-password-input__strength');
	});
});
