import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { createRef, StrictMode, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsField, AdsOTPInput } from '../src/index.js';

describe('AdsOTPInput', () => {
	it('renders a single accessible input and preserves leading zeros', () => {
		render(
			<AdsField description="Código fictício" label="Código">
				<AdsOTPInput defaultValue="0012" length={4} name="otp" required />
			</AdsField>,
		);
		const input = screen.getByRole('textbox', { name: 'Código' }) as HTMLInputElement;
		expect(input.value).toBe('0012');
		expect(input).toHaveAttribute('autocomplete', 'one-time-code');
		expect(input).toHaveAttribute('inputmode', 'numeric');
		expect(input).toHaveAttribute('maxlength', '4');
		expect(input).toHaveAccessibleDescription(/Código fictício.*4 dígitos/);
		expect(input).toHaveAttribute('name', 'otp');
		expect(document.querySelectorAll('.ads-otp-input__slot')).toHaveLength(4);
		expect(document.querySelectorAll('input')).toHaveLength(1);
	});

	it('normalizes typing, complete paste, leading zeros, and does not double-complete', () => {
		const onChange = vi.fn();
		const onComplete = vi.fn();
		render(<AdsOTPInput aria-label="OTP" onChange={onChange} onComplete={onComplete} />);
		const input = screen.getByRole('textbox', { name: 'OTP' }) as HTMLInputElement;
		fireEvent.change(input, { target: { value: '00a12' } });
		expect(input.value).toBe('0012');
		expect(onChange).toHaveBeenLastCalledWith('0012');
		fireEvent.change(input, { target: { value: '001234' } });
		expect(input.value).toBe('001234');
		expect(onComplete).toHaveBeenCalledExactlyOnceWith('001234');
		fireEvent.change(input, { target: { value: '001234x' } });
		expect(onComplete).toHaveBeenCalledTimes(1);
		fireEvent.change(input, { target: { value: '00123' } });
		fireEvent.change(input, { target: { value: '001234' } });
		expect(onComplete).toHaveBeenCalledTimes(2);
	});

	it('allows a controlled consumer to update and clear the value without callback echoes', () => {
		const onComplete = vi.fn();
		function Demo() {
			const [code, setCode] = useState('12');
			return (
				<>
					<AdsOTPInput aria-label="OTP" length={4} onChange={setCode} onComplete={onComplete} value={code} />
					<button onClick={() => setCode('0099')} type="button">Definir</button>
					<button onClick={() => setCode('')} type="button">Limpar</button>
				</>
			);
		}
		render(<Demo />);
		const input = screen.getByRole('textbox', { name: 'OTP' }) as HTMLInputElement;
		fireEvent.change(input, { target: { value: '1234' } });
		expect(input.value).toBe('1234');
		expect(onComplete).toHaveBeenCalledTimes(1);
		fireEvent.click(screen.getByRole('button', { name: 'Definir' }));
		expect(input.value).toBe('0099');
		expect(onComplete).toHaveBeenCalledTimes(1);
		fireEvent.click(screen.getByRole('button', { name: 'Limpar' }));
		expect(input.value).toBe('');
	});

	it('keeps native keyboard, selection, ref and form submission', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<form>
				<AdsField label="Código">
					<AdsOTPInput defaultValue="1234" length={6} name="code" ref={ref} />
				</AdsField>
			</form>,
		);
		const input = screen.getByRole('textbox', { name: 'Código' }) as HTMLInputElement;
		input.focus();
		input.setSelectionRange(2, 2);
		fireEvent.select(input);
		expect(input.selectionStart).toBe(2);
		fireEvent.change(input, { target: { value: '124' } });
		expect(input.value).toBe('124');
		expect(ref.current).toBe(input);
		expect(new FormData(input.form!).get('code')).toBe('124');
	});

	it('supports disabled, readOnly, error and different sizes', () => {
		render(
			<>
				<AdsField label="Erro" error="Código inválido" validationState="error">
					<AdsOTPInput length={4} size="sm" />
				</AdsField>
				<AdsOTPInput aria-label="Desabilitado" disabled />
				<AdsOTPInput aria-label="Leitura" defaultValue="123456" readOnly size="lg" />
			</>,
		);
		expect(screen.getByRole('textbox', { name: 'Erro' })).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByRole('textbox', { name: 'Erro' })).toHaveAccessibleDescription(/inválido/);
		expect(screen.getByRole('textbox', { name: 'Desabilitado' })).toBeDisabled();
		expect(screen.getByRole('textbox', { name: 'Leitura' })).toHaveAttribute('readonly');
		expect(screen.getByRole('textbox', { name: 'Leitura' })).toHaveValue('123456');
	});

	it('does not notify during initial render, StrictMode or SSR', () => {
		const onChange = vi.fn();
		const onComplete = vi.fn();
		render(
			<StrictMode>
				<AdsOTPInput aria-label="OTP" defaultValue="123456" onChange={onChange} onComplete={onComplete} />
			</StrictMode>,
		);
		expect(onChange).not.toHaveBeenCalled();
		expect(onComplete).not.toHaveBeenCalled();
		expect(renderToString(<AdsOTPInput aria-label="OTP" defaultValue="1234" />)).toContain(
			'autocomplete="one-time-code"',
		);
	});

	it('has no automatic accessibility violations when labeled and invalid', async () => {
		const { container } = render(
			<AdsField error="Código incorreto" label="Código de acesso" validationState="error">
				<AdsOTPInput length={6} />
			</AdsField>,
		);
		const result = await axe.run(container);
		expect(result.violations).toEqual([]);
	});
});
