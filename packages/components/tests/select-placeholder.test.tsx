import { act, fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsField, AdsSelect } from '../src';

const options = (
	<>
		<option value="a">Alfa</option>
		<option value="">Vazio legítimo</option>
		<optgroup label="Grupo">
			<option value="b">Beta</option>
		</optgroup>
	</>
);

function selectOf(container: HTMLElement) {
	return container.querySelector('select') as HTMLSelectElement;
}

function submitted(select: HTMLSelectElement) {
	return [...new FormData(select.form as HTMLFormElement).entries()];
}

describe('AdsSelect placeholder (opt-in)', () => {
	it('não altera o select nativo quando placeholder é omitido', () => {
		const { container } = render(
			<form>
				<AdsSelect aria-label="Status" defaultValue="b" name="s">
					{options}
				</AdsSelect>
			</form>,
		);
		const select = selectOf(container);
		expect(select.options).toHaveLength(3);
		expect(select.value).toBe('b');
		expect(container.querySelector('[data-ads-select-placeholder]')).toBeNull();
		expect(submitted(select)).toEqual([['s', 'b']]);
	});

	it('normaliza null sem placeholder para a opção de valor vazio', () => {
		const { container } = render(
			<AdsSelect aria-label="Status" onChange={() => {}} value={null}>
				{options}
			</AdsSelect>,
		);
		expect(selectOf(container).selectedIndex).toBe(1);
	});

	it.each([
		['sem defaultValue', undefined, 0],
		['defaultValue null', null, 0],
		['defaultValue ""', '', 2],
		['defaultValue "a"', 'a', 1],
		['defaultValue "b"', 'b', 3],
	] as const)('seleciona corretamente %s (não controlado)', (_name, defaultValue, index) => {
		const { container } = render(
			<form>
				<AdsSelect
					aria-label="Status"
					defaultValue={defaultValue}
					name="s"
					placeholder="Selecione…"
					required
				>
					{options}
				</AdsSelect>
			</form>,
		);
		const select = selectOf(container);
		expect(select.selectedIndex).toBe(index);
		expect(select.options[0]).toHaveTextContent('Selecione…');
		expect(select.options[0]).toBeDisabled();
		// A serialização da ausência (opção desabilitada) é verificada no navegador: o jsdom não
		// exclui opções desabilitadas do FormData.
		if (index !== 0) expect(submitted(select)).toEqual([['s', defaultValue ?? '']]);
	});

	it('não expõe sentinela: a opção de ausência tem value vazio', () => {
		const { container } = render(
			<AdsSelect aria-label="Status" placeholder="Selecione…">
				{options}
			</AdsSelect>,
		);
		const values = [...selectOf(container).options].map((option) => option.value);
		expect(values).toEqual(['', 'a', '', 'b']);
	});

	it('restaura a seleção por identidade no reset nativo', () => {
		const { container } = render(
			<form>
				<AdsSelect aria-label="Status" defaultValue="" name="s" placeholder="Selecione…">
					{options}
				</AdsSelect>
			</form>,
		);
		const select = selectOf(container);
		fireEvent.change(select, { target: { value: 'b' } });
		expect(select.selectedIndex).toBe(3);
		(select.form as HTMLFormElement).reset();
		expect(select.selectedIndex).toBe(2);
	});

	it('reset volta à ausência e não emite onChange', () => {
		const onChange = vi.fn();
		const { container } = render(
			<form>
				<AdsSelect aria-label="Status" name="s" onChange={onChange} placeholder="Selecione…">
					{options}
				</AdsSelect>
			</form>,
		);
		const select = selectOf(container);
		fireEvent.change(select, { target: { value: 'a' } });
		expect(onChange).toHaveBeenCalledTimes(1);
		(select.form as HTMLFormElement).reset();
		expect(select.selectedIndex).toBe(0);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	function Controlled({ onChange }: { onChange?: (value: string) => void }) {
		const [value, setValue] = useState<string | null>(null);
		return (
			<form>
				<button onClick={() => setValue(null)} type="button">
					limpar
				</button>
				<button onClick={() => setValue('')} type="button">
					vazio
				</button>
				<button onClick={() => setValue('b')} type="button">
					beta
				</button>
				<AdsSelect
					aria-label="Status"
					name="s"
					onChange={(event) => {
						onChange?.(event.target.value);
						setValue(event.target.value);
					}}
					placeholder="Selecione…"
					value={value}
				>
					{options}
				</AdsSelect>
			</form>
		);
	}

	it('distingue null, "" e valores reais quando controlado, sem onChange sintético', () => {
		const onChange = vi.fn();
		const { container } = render(<Controlled onChange={onChange} />);
		const select = selectOf(container);
		expect(select.selectedIndex).toBe(0);
		fireEvent.click(screen.getByText('vazio'));
		expect(select.selectedIndex).toBe(2);
		fireEvent.click(screen.getByText('beta'));
		expect(select.selectedIndex).toBe(3);
		fireEvent.click(screen.getByText('limpar'));
		expect(select.selectedIndex).toBe(0);
		expect(onChange).not.toHaveBeenCalled();
		fireEvent.change(select, { target: { value: 'a' } });
		expect(onChange).toHaveBeenCalledWith('a');
		expect(select.selectedIndex).toBe(1);
	});

	it('reverte a escolha do usuário quando o valor controlado não é atualizado', () => {
		const { container } = render(
			<AdsSelect aria-label="Status" onChange={() => {}} placeholder="Selecione…" value="">
				{options}
			</AdsSelect>,
		);
		const select = selectOf(container);
		fireEvent.change(select, { target: { value: 'b' } });
		expect(select.selectedIndex).toBe(2);
	});

	it('mantém disabled, name, form e ARIA nativos', () => {
		const { container } = render(
			<form>
				<AdsSelect
					aria-label="Status"
					disabled
					name="s"
					placeholder="Selecione…"
					required
					validationState="error"
				>
					{options}
				</AdsSelect>
			</form>,
		);
		const select = selectOf(container);
		expect(select).toBeDisabled();
		expect(select).toHaveAttribute('aria-invalid', 'true');
		expect(select).toHaveClass('ads-select', 'ads-form-control');
	});

	it('ignora placeholder em seleção múltipla', () => {
		const { container } = render(
			<AdsSelect aria-label="Status" defaultValue={['a', 'b']} multiple placeholder="Selecione…">
				{options}
			</AdsSelect>,
		);
		const select = selectOf(container);
		expect(select.options).toHaveLength(3);
		expect([...select.selectedOptions].map((option) => option.value)).toEqual(['a', 'b']);
	});

	it('compõe com AdsField sem duplicar descrição ou erro', async () => {
		const { container } = render(
			<AdsField description="Escolha um status" error="Obrigatório" label="Status">
				<AdsSelect placeholder="Selecione…" required>
					{options}
				</AdsSelect>
			</AdsField>,
		);
		const select = screen.getByRole('combobox', { name: 'Status' });
		expect(select).toHaveAccessibleDescription('Escolha um status Obrigatório');
		expect(container.querySelectorAll('[role="alert"]')).toHaveLength(1);
		expect((await axe.run(container)).violations).toEqual([]);
	});

	it('renderiza no servidor sem selecionar duas opções vazias', () => {
		const html = renderToString(
			<AdsSelect aria-label="Status" placeholder="Selecione…" defaultValue={null}>
				{options}
			</AdsSelect>,
		);
		expect(html).not.toContain('selected');
		const legit = renderToString(
			<AdsSelect aria-label="Status" placeholder="Selecione…" defaultValue="a">
				{options}
			</AdsSelect>,
		);
		expect(legit.match(/selected=""/g)).toHaveLength(1);
	});

	it('mantém a seleção após nova renderização com filhos alterados', () => {
		const { container, rerender } = render(
			<AdsSelect aria-label="Status" onChange={() => {}} placeholder="Selecione…" value="b">
				{options}
			</AdsSelect>,
		);
		act(() => {
			rerender(
				<AdsSelect aria-label="Status" onChange={() => {}} placeholder="Selecione…" value="b">
					<option value="b">Beta</option>
					<option value="c">Gama</option>
				</AdsSelect>,
			);
		});
		expect(selectOf(container).value).toBe('b');
	});
});
