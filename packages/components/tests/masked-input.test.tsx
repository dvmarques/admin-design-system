import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { createRef, StrictMode, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsField } from '../src/index.js';
import {
	AdsMaskedInput,
	type AdsMaskedInputProps,
	type AdsMaskedInputValues,
} from '../src/masked-input.js';

/** Simulates the browser inserting `text` over the selection and firing `input`. */
function typeText(input: HTMLInputElement, text: string, start?: number, end?: number) {
	const from = start ?? input.selectionStart ?? input.value.length;
	const to = end ?? input.selectionEnd ?? from;
	// Browsers fire `keydown` (and `selectionchange`) before editing; the engine saves the selection there.
	input.setSelectionRange(from, to);
	fireEvent.keyDown(input, { key: text === '' ? 'Backspace' : text });
	input.value = input.value.slice(0, from) + text + input.value.slice(to);
	input.setSelectionRange(from + text.length, from + text.length);
	fireEvent.input(input);
}

/** Simulates Backspace with a collapsed caret or a selection. */
function backspace(input: HTMLInputElement) {
	const start = input.selectionStart ?? 0;
	const end = input.selectionEnd ?? start;
	if (start === end && start > 0) typeText(input, '', start - 1, end);
	else typeText(input, '', start, end);
}

function lastValues(spy: ReturnType<typeof vi.fn>): AdsMaskedInputValues {
	return spy.mock.calls.at(-1)![0] as AdsMaskedInputValues;
}

function field(label = 'Campo') {
	const input = screen.getByLabelText(label) as HTMLInputElement;
	input.focus();
	return input;
}

describe('AdsMaskedInput with a static mask', () => {
	it('formats typing and reports masked, unmasked and completeness', () => {
		const onValueChange = vi.fn();
		render(<AdsMaskedInput aria-label="Campo" mask="000-000" onValueChange={onValueChange} />);
		const input = field();
		for (const digit of '1234') typeText(input, digit);
		expect(input.value).toBe('123-4');
		expect(lastValues(onValueChange)).toEqual({
			maskedValue: '123-4',
			unmaskedValue: '1234',
			typedValue: '1234',
			complete: false,
		});
		typeText(input, '56');
		expect(lastValues(onValueChange)).toMatchObject({
			maskedValue: '123-456',
			unmaskedValue: '123456',
			complete: true,
		});
		expect(onValueChange).toHaveBeenCalledTimes(5);
	});

	it('keeps leading zeros in the unmasked string', () => {
		const onValueChange = vi.fn();
		render(<AdsMaskedInput aria-label="Campo" mask="000000" onValueChange={onValueChange} />);
		typeText(field(), '000123');
		expect(lastValues(onValueChange)).toMatchObject({
			maskedValue: '000123',
			unmaskedValue: '000123',
			complete: true,
		});
		expect(typeof lastValues(onValueChange).unmaskedValue).toBe('string');
	});

	it('discards ineligible characters on typing and pasting', () => {
		const onValueChange = vi.fn();
		render(<AdsMaskedInput aria-label="Campo" mask="000.000" onValueChange={onValueChange} />);
		const input = field();
		typeText(input, 'a');
		expect(input.value).toBe('');
		expect(onValueChange).not.toHaveBeenCalled();
		typeText(input, 'x12y3-4 5!6789');
		expect(input.value).toBe('123.456');
		expect(lastValues(onValueChange).unmaskedValue).toBe('123456');
	});

	it('accepts a formatted paste and a paste replacing the selection', () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				defaultValue="111.222"
				mask="000.000"
				onValueChange={onValueChange}
			/>,
		);
		const input = field();
		typeText(input, '987.654', 0, input.value.length);
		expect(input.value).toBe('987.654');
		typeText(input, '00', 4, 7);
		expect(input.value).toBe('987.00');
		expect(lastValues(onValueChange)).toMatchObject({ unmaskedValue: '98700', complete: false });
	});

	it('inserts and deletes in the middle keeping the caret next to the edit', () => {
		render(<AdsMaskedInput aria-label="Campo" defaultValue="123.45" mask="000.000" />);
		const input = field();
		input.setSelectionRange(2, 2);
		typeText(input, '9');
		expect(input.value).toBe('129.345');
		expect(input.selectionStart).toBe(3);
		backspace(input);
		expect(input.value).toBe('123.45');
		expect(input.selectionStart).toBe(2);
	});

	it('rejects insertion into a complete mask instead of shifting digits out', () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				defaultValue="123.456"
				mask="000.000"
				onValueChange={onValueChange}
			/>,
		);
		const input = field();
		typeText(input, '9', 2, 2);
		expect(input.value).toBe('123.456');
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('removes a selection and aligns the caret before literal characters', () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				defaultValue="123.456"
				mask="000.000"
				onValueChange={onValueChange}
			/>,
		);
		const input = field();
		input.setSelectionRange(1, 6);
		backspace(input);
		expect(input.value).toBe('16');
		expect(lastValues(onValueChange)).toMatchObject({ maskedValue: '16', complete: false });
		expect(input.selectionStart).toBe(1);
	});

	it('does not notify on mount, StrictMode double effects or hydration of defaultValue', () => {
		const onValueChange = vi.fn();
		render(
			<StrictMode>
				<AdsMaskedInput
					aria-label="Campo"
					defaultValue="12345"
					mask="000-000"
					onValueChange={onValueChange}
				/>
			</StrictMode>,
		);
		expect(screen.getByLabelText('Campo')).toHaveValue('123-45');
		expect(onValueChange).not.toHaveBeenCalled();
	});
});

describe('AdsMaskedInput with CPF and CNPJ formats (fictitious values, format only)', () => {
	const cpf = '000.000.000-00';
	const cnpj = '00.000.000/0000-00';

	it('formats CPF typing and pastes with and without formatting', () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				inputMode="numeric"
				mask={cpf}
				onValueChange={onValueChange}
			/>,
		);
		const input = field();
		expect(input).toHaveAttribute('inputmode', 'numeric');
		typeText(input, '1112223334');
		expect(input).toHaveValue('111.222.333-4');
		expect(lastValues(onValueChange)).toMatchObject({
			unmaskedValue: '1112223334',
			complete: false,
		});
		typeText(input, '4');
		expect(lastValues(onValueChange)).toMatchObject({
			maskedValue: '111.222.333-44',
			unmaskedValue: '11122233344',
			complete: true,
		});
		typeText(input, '99.888.777-66 extra', 0, input.value.length);
		expect(input).toHaveValue('998.887.776-6');
		typeText(input, '99988877766', 0, input.value.length);
		expect(input).toHaveValue('999.888.777-66');
		typeText(input, '999.888.777-66', 0, input.value.length);
		expect(lastValues(onValueChange)).toMatchObject({
			unmaskedValue: '99988877766',
			complete: true,
		});
	});

	it('formats CNPJ typing and pastes', () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				inputMode="numeric"
				mask={cnpj}
				onValueChange={onValueChange}
			/>,
		);
		const input = field();
		typeText(input, '11222333000144');
		expect(input).toHaveValue('11.222.333/0001-44');
		expect(lastValues(onValueChange)).toMatchObject({
			unmaskedValue: '11222333000144',
			complete: true,
		});
		typeText(input, '11.222.333/0001', 0, input.value.length);
		expect(lastValues(onValueChange)).toMatchObject({
			maskedValue: '11.222.333/0001',
			complete: false,
		});
	});

	it('switches a CPF-or-CNPJ field from 11 to 14 digits and back', () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				inputMode="numeric"
				mask={[cpf, cnpj]}
				onValueChange={onValueChange}
			/>,
		);
		const input = field();
		typeText(input, '11122233344');
		expect(input).toHaveValue('111.222.333-44');
		expect(lastValues(onValueChange).complete).toBe(true);
		typeText(input, '5');
		expect(input).toHaveValue('11.122.233/3445');
		expect(lastValues(onValueChange)).toMatchObject({
			unmaskedValue: '111222333445',
			complete: false,
		});
		typeText(input, '66');
		expect(input).toHaveValue('11.122.233/3445-66');
		expect(lastValues(onValueChange)).toMatchObject({
			unmaskedValue: '11122233344566',
			complete: true,
		});
		while (input.value.replace(/\D/g, '').length > 11) backspace(input);
		expect(input).toHaveValue('111.222.333-44');
		expect(lastValues(onValueChange).complete).toBe(true);
	});

	it('submits the formatted text by name; digits only come from unmaskedValue', () => {
		const submitted: Record<string, FormDataEntryValue> = {};
		let digits = '';
		render(
			<form
				onSubmit={(event) => {
					event.preventDefault();
					Object.assign(submitted, Object.fromEntries(new FormData(event.currentTarget)));
				}}
			>
				<AdsMaskedInput
					aria-label="Campo"
					mask={cpf}
					name="cpf"
					onValueChange={(values) => {
						digits = values.unmaskedValue;
					}}
				/>
			</form>,
		);
		const input = field();
		typeText(input, '11122233344');
		fireEvent.submit(input.form!);
		expect(submitted).toEqual({ cpf: '111.222.333-44' });
		expect(digits).toBe('11122233344');
	});
});

describe('AdsMaskedInput option filtering', () => {
	it('drops engine options outside the public contract, such as unmask and blocks', () => {
		const onValueChange = vi.fn();
		const hostile = {
			mask: '000-000',
			unmask: true,
			value: 'zzz',
			onAccept: vi.fn(),
		} as never;
		render(<AdsMaskedInput aria-label="Campo" mask={hostile} onValueChange={onValueChange} />);
		const input = field();
		typeText(input, '123456');
		expect(input).toHaveValue('123-456');
		expect(lastValues(onValueChange)).toMatchObject({ maskedValue: '123-456' });
	});
});

describe('AdsMaskedInput with dynamic and typed masks', () => {
	const phone = ['(00) 0000-0000', '(00) 00000-0000'] as const;

	it('switches between the masks of a list as the text grows', () => {
		const onValueChange = vi.fn();
		render(<AdsMaskedInput aria-label="Campo" mask={phone} onValueChange={onValueChange} />);
		const input = field();
		typeText(input, '1133334444');
		expect(input.value).toBe('(11) 3333-4444');
		expect(lastValues(onValueChange).complete).toBe(true);
		typeText(input, '5');
		expect(input.value).toBe('(11) 33334-4445');
		expect(lastValues(onValueChange)).toMatchObject({
			unmaskedValue: '11333344445',
			complete: true,
		});
	});

	it('supports structured options with definitions and a custom dispatch', () => {
		const definitions = { A: /[A-Z]/ };
		render(
			<AdsMaskedInput
				aria-label="Campo"
				mask={{
					mask: [
						{ mask: 'AA-00', definitions },
						{ mask: 'AAA-000', definitions },
					],
					dispatch: (appended, masked) => {
						const compiled = masked.compiledMasks as { mask: string }[];
						const letters = (masked.unmaskedValue + appended).replace(/\d/g, '').length;
						return compiled[letters > 2 ? 1 : 0];
					},
				}}
			/>,
		);
		const input = field();
		typeText(input, 'ab12');
		expect(input.value).toBe('');
		typeText(input, 'AB12');
		expect(input.value).toBe('AB-12');
	});

	it('reports a number for Number masks', () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				mask={{ mask: Number, scale: 2, radix: ',', thousandsSeparator: '.', mapToRadix: ['.'] }}
				onValueChange={onValueChange}
			/>,
		);
		typeText(field(), '1234,5');
		expect(lastValues(onValueChange)).toMatchObject({
			maskedValue: '1.234,5',
			typedValue: 1234.5,
		});
	});

	it('reports a Date for Date masks', () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				mask={{
					mask: Date,
					pattern: 'd{/}`m{/}`Y',
					format: (date) =>
						[
							String(date.getDate()).padStart(2, '0'),
							String(date.getMonth() + 1).padStart(2, '0'),
							date.getFullYear(),
						].join('/'),
					parse: (text) => {
						const [day, month, year] = text.split('/').map(Number);
						return new Date(year!, month! - 1, day);
					},
				}}
				onValueChange={onValueChange}
			/>,
		);
		typeText(field(), '15032024');
		const values = lastValues(onValueChange);
		expect(values.maskedValue).toBe('15/03/2024');
		// Date masks keep the separators in the unmasked text (engine behaviour, documented).
		expect(values.unmaskedValue).toBe('15/03/2024');
		expect(values.typedValue).toBeInstanceOf(Date);
		expect((values.typedValue as Date).getFullYear()).toBe(2024);
	});

	it('reformats and notifies when the mask changes at runtime', () => {
		const onValueChange = vi.fn();
		const { rerender } = render(
			<AdsMaskedInput
				aria-label="Campo"
				defaultValue="1234"
				mask="00-00"
				onValueChange={onValueChange}
			/>,
		);
		const input = screen.getByLabelText('Campo') as HTMLInputElement;
		expect(input.value).toBe('12-34');
		rerender(
			<AdsMaskedInput
				aria-label="Campo"
				defaultValue="1234"
				mask="0.0.0.0"
				onValueChange={onValueChange}
			/>,
		);
		expect(input.value).toBe('1.2.3.4');
		expect(lastValues(onValueChange).maskedValue).toBe('1.2.3.4');
	});
});

describe('AdsMaskedInput without a mask', () => {
	it('behaves as a text input and reports values from the native change', () => {
		const onValueChange = vi.fn();
		const onChange = vi.fn();
		render(<AdsMaskedInput aria-label="Campo" onChange={onChange} onValueChange={onValueChange} />);
		const input = field();
		fireEvent.change(input, { target: { value: 'Olá' } });
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(lastValues(onValueChange)).toEqual({
			maskedValue: 'Olá',
			unmaskedValue: 'Olá',
			typedValue: 'Olá',
			complete: true,
		});
	});

	it('supports controlled and initial values without a mask', () => {
		function Harness() {
			const [value, setValue] = useState('abc');
			return (
				<>
					<AdsMaskedInput
						aria-label="Campo"
						onValueChange={(values) => setValue(values.maskedValue.toUpperCase())}
						value={value}
					/>
					<button onClick={() => setValue('externo')} type="button">
						Externo
					</button>
				</>
			);
		}
		render(<Harness />);
		const input = field();
		expect(input).toHaveValue('abc');
		fireEvent.change(input, { target: { value: 'abcd' } });
		expect(input).toHaveValue('ABCD');
		fireEvent.click(screen.getByRole('button', { name: 'Externo' }));
		expect(input).toHaveValue('externo');
	});
});

describe('AdsMaskedInput controlled and uncontrolled', () => {
	it('follows the controlled value and reverts edits the consumer ignores', async () => {
		const onValueChange = vi.fn();
		render(
			<AdsMaskedInput
				aria-label="Campo"
				mask="000-000"
				onValueChange={onValueChange}
				value="123"
			/>,
		);
		const input = field();
		expect(input).toHaveValue('123');
		await act(async () => {
			typeText(input, '4');
		});
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(lastValues(onValueChange).maskedValue).toBe('123-4');
		expect(input).toHaveValue('123');
	});

	it('applies external changes without notifications, loops or onChange', async () => {
		const onValueChange = vi.fn();
		const onChange = vi.fn();
		function Harness() {
			const [value, setValue] = useState('');
			return (
				<>
					<AdsMaskedInput
						aria-label="Campo"
						mask="000-000"
						onChange={onChange}
						onValueChange={(values) => {
							onValueChange(values);
							setValue(values.maskedValue);
						}}
						value={value}
					/>
					<button onClick={() => setValue('987654')} type="button">
						Definir
					</button>
					<button onClick={() => setValue('')} type="button">
						Limpar
					</button>
				</>
			);
		}
		render(<Harness />);
		const input = field();
		fireEvent.click(screen.getByRole('button', { name: 'Definir' }));
		expect(input).toHaveValue('987-654');
		fireEvent.click(screen.getByRole('button', { name: 'Limpar' }));
		expect(input).toHaveValue('');
		expect(onValueChange).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
		await act(async () => {
			typeText(input, '12');
		});
		expect(input).toHaveValue('12');
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	it('keeps the caret when the consumer echoes the edited value in the middle', async () => {
		function Harness() {
			const [value, setValue] = useState('123-45');
			return (
				<AdsMaskedInput
					aria-label="Campo"
					mask="000-000"
					onValueChange={(values) => setValue(values.maskedValue)}
					value={value}
				/>
			);
		}
		render(<Harness />);
		const input = field();
		input.setSelectionRange(1, 1);
		await act(async () => {
			typeText(input, '9');
		});
		expect(input).toHaveValue('192-345');
		expect(input.selectionStart).toBe(2);
	});

	it('restores form-controlled defaults on reset and notifies uncontrolled consumers', async () => {
		vi.useFakeTimers();
		try {
			const onValueChange = vi.fn();
			render(
				<form>
					<AdsMaskedInput
						aria-label="Campo"
						defaultValue="123456"
						mask="000-000"
						onValueChange={onValueChange}
					/>
					<button type="reset">Redefinir</button>
				</form>,
			);
			const input = field();
			typeText(input, '', 0, input.value.length);
			expect(input).toHaveValue('');
			onValueChange.mockClear();
			fireEvent.click(screen.getByRole('button', { name: 'Redefinir' }));
			await act(async () => {
				vi.runAllTimers();
			});
			expect(input).toHaveValue('123-456');
			expect(lastValues(onValueChange)).toMatchObject({
				maskedValue: '123-456',
				unmaskedValue: '123456',
				complete: true,
			});
			expect(onValueChange).toHaveBeenCalledTimes(1);
		} finally {
			vi.useRealTimers();
		}
	});

	it('restores the controlled value on reset without notifying', async () => {
		vi.useFakeTimers();
		try {
			const onValueChange = vi.fn();
			render(
				<form>
					<AdsMaskedInput
						aria-label="Campo"
						mask="000-000"
						onValueChange={onValueChange}
						value="111"
					/>
					<button type="reset">Redefinir</button>
				</form>,
			);
			const input = field();
			fireEvent.click(screen.getByRole('button', { name: 'Redefinir' }));
			await act(async () => {
				vi.runAllTimers();
			});
			expect(input).toHaveValue('111');
			expect(onValueChange).not.toHaveBeenCalled();
		} finally {
			vi.useRealTimers();
		}
	});
});

describe('AdsMaskedInput refs and DOM contract', () => {
	it('points ref and inputRef at the same HTML input and clears them on unmount', () => {
		const ref = createRef<HTMLInputElement>();
		const inputRef = createRef<HTMLInputElement>();
		const callback = vi.fn();
		const { unmount } = render(
			<AdsMaskedInput aria-label="Campo" inputRef={inputRef} mask="00" ref={ref} />,
		);
		const input = screen.getByLabelText('Campo');
		expect(ref.current).toBe(input);
		expect(inputRef.current).toBe(input);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		unmount();
		expect(ref.current).toBeNull();
		expect(inputRef.current).toBeNull();
		const view = render(<AdsMaskedInput aria-label="Campo" inputRef={callback} ref={callback} />);
		expect(callback).toHaveBeenCalledWith(screen.getByLabelText('Campo'));
		view.unmount();
		expect(callback).toHaveBeenLastCalledWith(null);
	});

	it('keeps focus while typing and forwards native attributes and inputMode', () => {
		render(
			<AdsMaskedInput
				aria-label="Campo"
				autoComplete="off"
				inputMode="numeric"
				mask="000"
				name="codigo"
				placeholder="000"
			/>,
		);
		const input = field();
		typeText(input, '12');
		expect(input).toHaveFocus();
		expect(input).toHaveAttribute('inputmode', 'numeric');
		expect(input).toHaveAttribute('name', 'codigo');
		expect(input).toHaveAttribute('placeholder', '000');
		expect(input).toHaveClass('ads-form-control', 'ads-masked-input');
	});

	it('forwards onChange only as the DOM handler and never synthesizes it for external updates', () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<AdsMaskedInput aria-label="Campo" mask="000" onChange={onChange} value="1" />,
		);
		rerender(<AdsMaskedInput aria-label="Campo" mask="000" onChange={onChange} value="123" />);
		expect(onChange).not.toHaveBeenCalled();
		typeText(field(), '4');
		for (const [event] of onChange.mock.calls) {
			expect((event as { target: unknown }).target).toBe(screen.getByLabelText('Campo'));
		}
	});

	it('submits the formatted text and honours disabled and required', () => {
		const submitted: Record<string, FormDataEntryValue> = {};
		render(
			<form
				onSubmit={(event) => {
					event.preventDefault();
					Object.assign(submitted, Object.fromEntries(new FormData(event.currentTarget)));
				}}
			>
				<AdsMaskedInput aria-label="Campo" mask="000.000" name="doc" required />
				<AdsMaskedInput aria-label="Off" defaultValue="1" disabled mask="000" name="off" />
				<button type="submit">Enviar</button>
			</form>,
		);
		const input = field();
		expect(input).toBeRequired();
		typeText(input, '123456');
		fireEvent.submit(input.form!);
		expect(submitted).toEqual({ doc: '123.456' });
		expect(screen.getByLabelText('Off')).toBeDisabled();
	});

	it('supports readOnly without editing but keeps the formatted text', () => {
		render(<AdsMaskedInput aria-label="Campo" defaultValue="123456" mask="000.000" readOnly />);
		const input = screen.getByLabelText('Campo');
		expect(input).toHaveAttribute('readonly');
		expect(input).toHaveValue('123.456');
	});
});

describe('AdsMaskedInput accessibility and composition', () => {
	it('integrates with AdsField label, description and error', async () => {
		const { container } = render(
			<AdsField
				description="Somente dígitos"
				error="Valor incompleto"
				label="Código"
				validationState="error"
			>
				<AdsMaskedInput mask="000-000" />
			</AdsField>,
		);
		const input = screen.getByRole('textbox', { name: 'Código' });
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input.getAttribute('aria-describedby')).toContain('-error');
		expect(input.getAttribute('aria-describedby')).toContain('-description');
		expect((await axe.run(container)).violations).toEqual([]);
	});

	it('exposes name, aria-invalid and aria-describedby under light and dark themes (contrast is covered by E2E)', () => {
		for (const theme of ['light', 'dark']) {
			const { unmount } = render(
				<div data-theme={theme}>
					<AdsField label="Código" validationState="error" error="Valor incompleto">
						<AdsMaskedInput defaultValue="12" mask="000-000" />
					</AdsField>
				</div>,
			);
			const input = screen.getByRole('textbox', { name: 'Código' });
			expect(input).toHaveAttribute('aria-invalid', 'true');
			expect(input.getAttribute('aria-describedby')).toContain('-error');
			unmount();
		}
	});

	it('ignores intermediate composition input and applies the mask when it ends', () => {
		const onValueChange = vi.fn();
		render(<AdsMaskedInput aria-label="Campo" mask="000-000" onValueChange={onValueChange} />);
		const input = field();
		fireEvent.compositionStart(input);
		input.value = '１２';
		input.setSelectionRange(2, 2);
		fireEvent.input(input, { isComposing: true });
		expect(onValueChange).not.toHaveBeenCalled();
		input.value = '12';
		input.setSelectionRange(2, 2);
		fireEvent.compositionEnd(input);
		expect(input).toHaveValue('12');
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(lastValues(onValueChange).maskedValue).toBe('12');
	});

	it('renders on the server without DOM access and hydrates in StrictMode without mismatch', () => {
		const props: AdsMaskedInputProps = {
			'aria-label': 'Campo',
			defaultValue: '123-456',
			mask: '000-000',
		};
		const html = renderToString(<AdsMaskedInput {...props} />);
		expect(html).toContain('value="123-456"');
		expect(html).toContain('ads-masked-input');
		const container = document.createElement('div');
		container.innerHTML = renderToString(
			<StrictMode>
				<AdsMaskedInput {...props} />
			</StrictMode>,
		);
		document.body.append(container);
		const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		let root: ReturnType<typeof hydrateRoot>;
		act(() => {
			root = hydrateRoot(
				container,
				<StrictMode>
					<AdsMaskedInput {...props} />
				</StrictMode>,
			);
		});
		expect(errors).not.toHaveBeenCalled();
		expect(container.querySelector('input')).toHaveValue('123-456');
		act(() => root.unmount());
		errors.mockRestore();
		container.remove();
	});

	it('releases the mask when unmounted', () => {
		const onValueChange = vi.fn();
		const { unmount } = render(
			<AdsMaskedInput aria-label="Campo" mask="000" onValueChange={onValueChange} />,
		);
		const input = field();
		unmount();
		typeText(input, '1');
		expect(onValueChange).not.toHaveBeenCalled();
	});
});
