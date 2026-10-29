import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { renderToString } from 'react-dom/server';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdsAutocomplete, AdsCombobox, AdsDialog, AdsField } from '../src/index.js';

const states = [
	{ value: 'SP', label: 'São Paulo' },
	{ value: 'RJ', label: 'Rio de Janeiro' },
	{ value: 'PR', label: 'Paraná', disabled: true },
];

describe('AdsCombobox', () => {
	it('navigates by keyboard and submits the selected value rather than its label', () => {
		const onValueChange = vi.fn();
		const { container } = render(
			<form>
				<AdsField label="Estado" description="Digite o nome">
					<AdsCombobox options={states} name="uf" onValueChange={onValueChange} />
				</AdsField>
			</form>,
		);
		const input = screen.getByRole('combobox', { name: 'Estado' });
		fireEvent.focus(input);
		expect(input).toHaveAttribute('aria-expanded', 'true');
		expect(input).toHaveAccessibleDescription('Digite o nome');
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-0'));
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onValueChange).toHaveBeenCalledWith(
			'RJ',
			expect.objectContaining({ label: 'Rio de Janeiro' }),
		);
		expect(input).toHaveValue('Rio de Janeiro');
		expect(input).toHaveFocus();
		expect(input).toHaveAttribute('aria-expanded', 'false');
		expect(container.querySelector('input[name="uf"]')).toHaveValue('RJ');
		fireEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }));
		expect(onValueChange).toHaveBeenLastCalledWith(null, null);
		expect(input).toHaveValue('');
		expect(container.querySelector('input[name="uf"]')).toHaveValue('');
		expect(input).toHaveFocus();
	});

	it('keeps controlled state in the consumer and supports distinct label/value', () => {
		const changed = vi.fn();
		const { rerender } = render(
			<AdsCombobox aria-label="Estado" options={states} value="SP" onValueChange={changed} />,
		);
		const input = screen.getByRole('combobox', { name: 'Estado' });
		expect(input).toHaveValue('São Paulo');
		fireEvent.focus(input);
		fireEvent.click(screen.getByRole('option', { name: 'Rio de Janeiro' }));
		expect(changed).toHaveBeenCalledWith('RJ', expect.any(Object));
		expect(input).toHaveValue('São Paulo');
		rerender(
			<AdsCombobox aria-label="Estado" options={states} value="RJ" onValueChange={changed} />,
		);
		expect(input).toHaveValue('Rio de Janeiro');
	});

	it('filters and skips disabled options while clearing a stale selection', () => {
		const select = vi.fn();
		render(
			<AdsCombobox
				aria-label="UF"
				defaultValue="SP"
				options={states}
				onValueChange={select}
				renderOption={(item) => (
					<span>
						{item.label} [{item.value}]
					</span>
				)}
			/>,
		);
		const input = screen.getByRole('combobox', { name: 'UF' });
		fireEvent.change(input, { target: { value: 'par' } });
		expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true');
		expect(screen.getByRole('option')).toHaveTextContent('Paraná [PR]');
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(select).toHaveBeenCalledWith(null, null);
		expect(select).not.toHaveBeenCalledWith('PR', expect.anything());
		fireEvent.keyDown(input, { key: 'Escape' });
		expect(input).toHaveAttribute('aria-expanded', 'false');
	});

	it('clears the old value when editing a selected label, without submitting a stale value', () => {
		const onValueChange = vi.fn();
		const { container } = render(
			<form>
				<AdsField label="Estado">
					<AdsCombobox name="uf" defaultValue="SP" options={states} onValueChange={onValueChange} />
				</AdsField>
			</form>,
		);
		const input = screen.getByRole('combobox', { name: 'Estado' });
		expect(container.querySelector('input[name="uf"]')).toHaveValue('SP');
		fireEvent.change(input, { target: { value: 'Rio' } });
		expect(input).toHaveValue('Rio');
		expect(onValueChange).toHaveBeenLastCalledWith(null, null);
		expect(container.querySelector('input[name="uf"]')).toHaveValue('');
	});

	it('does not submit a stale controlled value during unsaved editing', () => {
		const { container } = render(
			<form>
				<AdsCombobox
					aria-label="UF"
					name="uf"
					value="SP"
					options={states}
					onValueChange={() => undefined}
				/>
			</form>,
		);
		const input = screen.getByRole('combobox', { name: 'UF' });
		fireEvent.change(input, { target: { value: 'Rio' } });
		expect(input).toHaveValue('Rio');
		expect(new FormData(container.querySelector('form')!).get('uf')).toBe('');
	});

	it('keeps a typed query when the parent clears a controlled selection', () => {
		const View = () => {
			const [value, setValue] = useState<string | null>('SP');
			return (
				<AdsCombobox aria-label="UF" options={states} value={value} onValueChange={setValue} />
			);
		};
		render(<View />);
		const input = screen.getByRole('combobox', { name: 'UF' });
		fireEvent.change(input, { target: { value: 'Rio' } });
		expect(input).toHaveValue('Rio');
	});

	it('supports error, disabled, and stable SSR ids', () => {
		render(
			<>
				<AdsField label="Inválido" error="Selecione uma opção" validationState="error">
					<AdsCombobox options={states} />
				</AdsField>
				<AdsField label="Desabilitado">
					<AdsCombobox disabled options={states} />
				</AdsField>
			</>,
		);
		const invalid = screen.getByRole('combobox', { name: 'Inválido' });
		expect(invalid).toHaveAttribute('aria-invalid', 'true');
		expect(invalid).toHaveAccessibleDescription('Selecione uma opção');
		expect(screen.getByRole('combobox', { name: 'Desabilitado' })).toBeDisabled();
		const html = renderToString(
			<div>
				<AdsCombobox aria-label="A" options={states} />
				<AdsCombobox aria-label="B" options={states} />
			</div>,
		);
		const ids = Array.from(html.matchAll(/id="(ads-combobox-input-[^"]+)"/g)).map(
			(match) => match[1],
		);
		expect(ids).toHaveLength(2);
		expect(new Set(ids).size).toBe(2);
	});

	it('ArrowUp from no highlight selects the last enabled option', () => {
		const onValueChange = vi.fn();
		render(<AdsCombobox aria-label="Estado" options={states} onValueChange={onValueChange} />);
		const input = screen.getByRole('combobox', { name: 'Estado' });
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'ArrowUp' });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onValueChange).toHaveBeenCalledWith('RJ', expect.objectContaining({ value: 'RJ' }));
	});

	it('requires a real selection for native form validation and excludes disabled fields', () => {
		const { container } = render(
			<form>
				<AdsField label="UF obrigatória">
					<AdsCombobox name="uf" options={states} required />
				</AdsField>
				<AdsCombobox
					aria-label="Desativado"
					name="disabledUf"
					options={states}
					defaultValue="SP"
					disabled
				/>
			</form>,
		);
		const input = screen.getByRole('combobox', { name: 'UF obrigatória' }) as HTMLInputElement;
		expect(input.checkValidity()).toBe(false);
		expect(new FormData(container.querySelector('form')!).has('disabledUf')).toBe(false);
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(input.checkValidity()).toBe(true);
		expect(new FormData(container.querySelector('form')!).get('uf')).toBe('SP');
	});

	it('allows keyboard users to reach retry after remote error', () => {
		const onRetry = vi.fn();
		render(
			<AdsField label="Busca">
				<AdsCombobox options={[]} error="Falha na consulta" onRetry={onRetry} />
			</AdsField>,
		);
		const input = screen.getByRole('combobox', { name: 'Busca' });
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'Tab' });
		const retry = screen.getByRole('button', { name: 'Tentar novamente' });
		expect(retry).toHaveFocus();
		fireEvent.keyDown(retry, { key: 'Tab', shiftKey: true });
		expect(input).toHaveFocus();
		fireEvent.keyDown(input, { key: 'Tab' });
		fireEvent.click(retry);
		expect(onRetry).toHaveBeenCalledTimes(1);
		expect(input).toHaveFocus();
	});

	it('has no detectable axe violations when its list is open', async () => {
		render(
			<AdsField label="Estado">
				<AdsCombobox options={states} />
			</AdsField>,
		);
		fireEvent.focus(screen.getByRole('combobox'));
		const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
		expect(result.violations).toEqual([]);
	});
});

describe('AdsAutocomplete', () => {
	it('filters local values synchronously', () => {
		render(
			<AdsField label="Estado">
				<AdsAutocomplete options={states} />
			</AdsField>,
		);
		const input = screen.getByRole('combobox');
		fireEvent.change(input, { target: { value: 'Rio' } });
		expect(screen.getAllByRole('option')).toHaveLength(1);
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(input).toHaveValue('Rio de Janeiro');
	});

	it('discards stale async responses even when the provider ignores abort', async () => {
		const pending = new Map<string, (options: typeof states) => void>();
		const loadOptions = vi.fn(
			(query: string) => new Promise<typeof states>((resolve) => pending.set(query, resolve)),
		);
		render(
			<AdsField label="Busca">
				<AdsAutocomplete debounceMs={0} loadOptions={loadOptions} />
			</AdsField>,
		);
		const input = screen.getByRole('combobox');
		fireEvent.change(input, { target: { value: 's' } });
		await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1));
		expect(screen.getByRole('status')).toHaveTextContent('Buscando opções');
		fireEvent.change(input, { target: { value: 'sao' } });
		await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(2));
		await act(async () => pending.get('sao')?.([{ value: 'SP', label: 'São Paulo' }]));
		expect(screen.getByRole('option')).toHaveTextContent('São Paulo');
		await act(async () => pending.get('s')?.([{ value: 'RJ', label: 'Rio de Janeiro' }]));
		expect(screen.getByRole('option')).toHaveTextContent('São Paulo');
		expect(screen.queryByRole('option', { name: 'Rio de Janeiro' })).not.toBeInTheDocument();
	});

	it('does not call the async provider for a disabled input', async () => {
		const loadOptions = vi.fn(async () => states);
		render(
			<AdsAutocomplete
				aria-label="Busca desabilitada"
				defaultInputValue="Rio"
				disabled
				loadOptions={loadOptions}
				debounceMs={0}
			/>,
		);
		await act(async () => Promise.resolve());
		expect(loadOptions).not.toHaveBeenCalled();
	});

	it('keeps the latest results for an externally controlled query', async () => {
		const pending = new Map<string, (options: typeof states) => void>();
		const loadOptions = vi.fn(
			(query: string) => new Promise<typeof states>((resolve) => pending.set(query, resolve)),
		);
		const { rerender } = render(
			<AdsAutocomplete
				aria-label="Busca controlada"
				defaultOpen
				debounceMs={0}
				inputValue="s"
				loadOptions={loadOptions}
			/>,
		);
		await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1));
		rerender(
			<AdsAutocomplete
				aria-label="Busca controlada"
				defaultOpen
				debounceMs={0}
				inputValue="rio"
				loadOptions={loadOptions}
			/>,
		);
		await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(2));
		await act(async () => pending.get('s')?.(states));
		expect(screen.queryByRole('option', { name: 'São Paulo' })).not.toBeInTheDocument();
		await act(async () => pending.get('rio')?.([{ value: 'RJ', label: 'Rio de Janeiro' }]));
		expect(screen.getByRole('option', { name: 'Rio de Janeiro' })).toBeInTheDocument();
	});

	it('exposes error and empty states', async () => {
		const loadOptions = vi.fn(async (query: string) => {
			if (query === 'erro') throw new Error('Falha simulada');
			return [];
		});
		render(
			<AdsField label="Busca">
				<AdsAutocomplete debounceMs={0} loadOptions={loadOptions} />
			</AdsField>,
		);
		const input = screen.getByRole('combobox');
		fireEvent.change(input, { target: { value: 'erro' } });
		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Falha simulada'));
		fireEvent.change(input, { target: { value: 'vazio' } });
		await waitFor(() =>
			expect(screen.getByRole('status')).toHaveTextContent('Nenhuma opção encontrada'),
		);
	});
});

it('shows optional decorative visuals, preserves selection and allows hiding them', () => {
	const options = [
		{ value: 'a', label: 'Ana', avatar: { src: '/missing.png', fallback: 'AN' } },
		{ value: 'b', label: 'Bruno' },
	];
	const { container, rerender } = render(
		<form>
			<AdsCombobox
				aria-label="Pessoa"
				name="person"
				options={options}
				defaultValue="a"
				renderOption={(option) => <span>{option.label}</span>}
			/>
		</form>,
	);
	const input = screen.getByRole('combobox', { name: 'Pessoa' });
	expect(container.querySelector('.ads-combobox__selected-visual')).toHaveAttribute(
		'aria-hidden',
		'true',
	);
	fireEvent.error(container.querySelector('img')!);
	expect(container.querySelector('.ads-combobox__selected-visual')).toHaveTextContent('AN');
	fireEvent.focus(input);
	expect(screen.getByRole('option', { name: 'Ana' })).toBeInTheDocument();
	expect(
		screen.getByRole('option', { name: 'Bruno' }).querySelector('.ads-combobox__visual'),
	).toBeNull();
	fireEvent.keyDown(input, { key: 'ArrowDown' });
	fireEvent.keyDown(input, { key: 'Enter' });
	expect(container.querySelector('input[name="person"]')).toHaveValue('a');
	rerender(
		<form>
			<AdsCombobox
				aria-label="Pessoa"
				name="person"
				options={options}
				defaultValue="a"
				showOptionVisuals={false}
			/>
		</form>,
	);
	expect(container.querySelector('.ads-combobox__selected-visual')).toBeNull();
	fireEvent.focus(input);
	expect(
		screen.getByRole('option', { name: 'Ana' }).querySelector('.ads-combobox__visual'),
	).toBeNull();
	expect(container.querySelector('input[name="person"]')).toHaveValue('a');
});

it('keeps the menu closed when clearing from outside the input and preserves text-editing keys', () => {
	const options = [{ value: 'a', label: 'Ana' }];
	render(<AdsCombobox aria-label="Pessoa" options={options} defaultValue="a" />);
	const input = screen.getByRole('combobox', { name: 'Pessoa' });
	fireEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }));
	expect(input).toHaveFocus();
	expect(input).toHaveAttribute('aria-expanded', 'false');
	fireEvent.focus(input);
	expect(fireEvent.keyDown(input, { key: 'Home' })).toBe(true);
	expect(fireEvent.keyDown(input, { key: 'End' })).toBe(true);
});

it('explains the minimum query and avoids a new request for the controlled selected label', async () => {
	const loadOptions = vi.fn(async () => [{ value: 'a', label: 'Ana' }]);
	function Example() {
		const [text, setText] = useState('');
		return (
			<AdsAutocomplete
				aria-label="Busca"
				inputValue={text}
				onInputValueChange={setText}
				loadOptions={loadOptions}
				debounceMs={0}
			/>
		);
	}
	render(<Example />);
	const input = screen.getByRole('combobox', { name: 'Busca' });
	fireEvent.focus(input);
	expect(screen.getByRole('status')).toHaveTextContent('Digite para buscar');
	fireEvent.change(input, { target: { value: 'An' } });
	const option = await screen.findByRole('option', { name: 'Ana' });
	fireEvent.click(option);
	expect(input).toHaveValue('Ana');
	await act(async () => new Promise((resolve) => setTimeout(resolve, 30)));
	expect(loadOptions).toHaveBeenCalledTimes(1);
});

it.each(['loading', 'error'] as const)('cannot select hidden options while %s', (state) => {
	const onValueChange = vi.fn();
	render(
		<AdsCombobox
			aria-label="Busca"
			options={states}
			onValueChange={onValueChange}
			{...(state === 'loading' ? { loading: true } : { error: 'Erro' })}
		/>,
	);
	const input = screen.getByRole('combobox', { name: 'Busca' });
	fireEvent.focus(input);
	fireEvent.keyDown(input, { key: 'ArrowDown' });
	fireEvent.keyDown(input, { key: 'Enter' });
	expect(onValueChange).not.toHaveBeenCalled();
});

it('associates a default selection and text with an external form', () => {
	const { container } = render(
		<>
			<form id="external-form" />
			<AdsCombobox
				form="external-form"
				name="person"
				aria-label="Pessoa"
				options={[{ value: 'a', label: 'Ana' }]}
				defaultValue="a"
				defaultInputValue="Ana"
				required
			/>
		</>,
	);
	const input = screen.getByRole('combobox', { name: 'Pessoa' });
	expect(input).toHaveValue('Ana');
	expect(input).toBeValid();
	const form = container.querySelector('form')!;
	expect(new FormData(form).get('person')).toBe('a');
});

it('retains the initial text when the selected option has not loaded', async () => {
	const loadOptions = vi.fn(async () => []);
	render(
		<AdsAutocomplete
			aria-label="Pessoa"
			defaultValue="a"
			defaultInputValue="Ana"
			loadOptions={loadOptions}
			debounceMs={0}
		/>,
	);
	const input = screen.getByRole('combobox', { name: 'Pessoa' });
	expect(input).toHaveValue('Ana');
	await act(async () => new Promise((resolve) => setTimeout(resolve, 30)));
	expect(loadOptions).not.toHaveBeenCalled();
});

it.each(['loading', 'error', 'empty'] as const)(
	'has no axe violations in %s state',
	async (state) => {
		render(
			<main>
				<AdsCombobox
					aria-label="Busca"
					options={[]}
					{...(state === 'loading'
						? { loading: true }
						: state === 'error'
							? { error: 'Erro' }
							: {})}
				/>
			</main>,
		);
		fireEvent.focus(screen.getByRole('combobox', { name: 'Busca' }));
		const result = await axe.run(document.body);
		expect(result.violations).toEqual([]);
	},
);

it('keeps retry Tab navigation inside a dialog', async () => {
	render(
		<AdsDialog open onOpenChange={() => {}} showCloseButton={false} title="Diálogo">
			<AdsCombobox aria-label="Busca" options={[]} error="Falha" onRetry={() => {}} />
			<button type="button">Salvar</button>
		</AdsDialog>,
	);
	const input = await screen.findByRole('combobox', { name: 'Busca' });
	const save = screen.getByRole('button', { name: 'Salvar' });
	vi.spyOn(save, 'getClientRects').mockReturnValue([
		{ width: 1, height: 1 },
	] as unknown as DOMRectList);
	input.focus();
	fireEvent.focus(input);
	const retry = await screen.findByRole('button', { name: 'Tentar novamente' });
	fireEvent.keyDown(input, { key: 'Tab' });
	expect(retry).toHaveFocus();
	fireEvent.keyDown(retry, { key: 'Tab', shiftKey: true });
	expect(input).toHaveFocus();
	fireEvent.keyDown(input, { key: 'Tab' });
	expect(retry).toHaveFocus();
	fireEvent.keyDown(retry, { key: 'Tab' });
	expect(save).toHaveFocus();
});

describe('revisão da #142: origens e texto controlado externos', () => {
	it('não envia o value antigo quando inputValue controlado diverge externamente', () => {
		const field = (inputValue: string) => (
			<form>
				<AdsCombobox
					aria-label="Estado"
					inputValue={inputValue}
					name="uf"
					options={states}
					value="SP"
				/>
			</form>
		);
		const { container, rerender } = render(field('São Paulo'));
		const form = () => container.querySelector('form')!;
		expect(new FormData(form()).get('uf')).toBe('SP');
		rerender(field('Rio'));
		expect(screen.getByRole('combobox', { name: 'Estado' })).toHaveValue('Rio');
		expect(new FormData(form()).get('uf')).toBe('');
		rerender(field('São Paulo'));
		expect(new FormData(form()).get('uf')).toBe('SP');
	});

	it('refaz a busca e descarta resultados da origem anterior quando requestKey muda', async () => {
		const origin = (name: string) =>
			vi.fn(async () => [{ value: name, label: `Opção ${name}` }] as const);
		const first = origin('A');
		const second = origin('B');
		const { rerender } = render(
			<AdsAutocomplete
				aria-label="Busca"
				debounceMs={0}
				inputValue="op"
				loadOptions={first}
				requestKey="a"
			/>,
		);
		const input = screen.getByRole('combobox', { name: 'Busca' });
		fireEvent.focus(input);
		expect(await screen.findByRole('option', { name: 'Opção A' })).toBeInTheDocument();
		rerender(
			<AdsAutocomplete
				aria-label="Busca"
				debounceMs={0}
				inputValue="op"
				loadOptions={second}
				requestKey="b"
			/>,
		);
		expect(await screen.findByRole('option', { name: 'Opção B' })).toBeInTheDocument();
		expect(screen.queryByRole('option', { name: 'Opção A' })).toBeNull();
		expect(second).toHaveBeenCalledTimes(1);
	});

	it('não refaz a busca ao trocar apenas a identidade de loadOptions', async () => {
		const loader = vi.fn(async () => states);
		const { rerender } = render(
			<AdsAutocomplete aria-label="Busca" debounceMs={0} inputValue="op" loadOptions={loader} />,
		);
		fireEvent.focus(screen.getByRole('combobox', { name: 'Busca' }));
		await waitFor(() => expect(loader).toHaveBeenCalledTimes(1));
		rerender(
			<AdsAutocomplete
				aria-label="Busca"
				debounceMs={0}
				inputValue="op"
				loadOptions={async () => states}
			/>,
		);
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 20));
		});
		expect(loader).toHaveBeenCalledTimes(1);
	});
});
