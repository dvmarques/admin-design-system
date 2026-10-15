import { fireEvent, render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
	AdsFilterBar,
	type AdsFilterBarProps,
	type AdsFilterDefinition,
	type AdsFilterValues,
} from '../src/index.js';

const filters: AdsFilterDefinition[] = [
	{ id: 'q', type: 'text', label: 'Busca', placeholder: 'Nome' },
	{
		id: 'status',
		type: 'select',
		label: 'Status',
		options: [
			{ value: 'ativo', label: 'Ativo' },
			{ value: 'inativo', label: 'Inativo' },
		],
	},
	{
		id: 'perfis',
		type: 'multiselect',
		label: 'Perfis',
		options: [
			{ value: 'admin', label: 'Administrador' },
			{ value: 'editor', label: 'Editor' },
			{ value: 'leitor', label: 'Leitor' },
		],
	},
	{ id: 'criado', type: 'date', label: 'Criado em' },
	{ id: 'periodo', type: 'date-range', label: 'Período' },
];

function Harness({
	initial = {},
	onChange,
	...props
}: { initial?: AdsFilterValues; onChange?: (value: AdsFilterValues) => void } & Partial<
	Omit<AdsFilterBarProps, 'onChange' | 'value'>
>) {
	const [value, setValue] = useState<AdsFilterValues>(initial);
	return (
		<AdsFilterBar
			filters={filters}
			onChange={(next) => {
				onChange?.(next);
				setValue(next);
			}}
			value={value}
			{...props}
		/>
	);
}

describe('AdsFilterBar', () => {
	it('renders a labelled region with labelled fields and a grouped multiselect', () => {
		render(<Harness />);
		const region = screen.getByRole('region', { name: 'Filtros' });
		expect(within(region).getByLabelText('Busca')).toBeTruthy();
		expect(within(region).getByLabelText('Status')).toBeTruthy();
		expect(within(region).getByRole('group', { name: 'Perfis' })).toBeTruthy();
		expect(within(region).getByText('Nenhum filtro ativo')).toBeTruthy();
		expect(screen.queryByRole('button', { name: 'Limpar filtros' })).toBeNull();
	});

	it('emits complete values for text, select and multiselect, dropping empty keys', () => {
		const onChange = vi.fn();
		render(<Harness onChange={onChange} />);
		fireEvent.change(screen.getByLabelText('Busca'), { target: { value: 'ana' } });
		expect(onChange).toHaveBeenLastCalledWith({ q: 'ana' });
		fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'ativo' } });
		expect(onChange).toHaveBeenLastCalledWith({ q: 'ana', status: 'ativo' });
		fireEvent.click(screen.getByLabelText('Leitor'));
		fireEvent.click(screen.getByLabelText('Administrador'));
		expect(onChange).toHaveBeenLastCalledWith({
			q: 'ana',
			status: 'ativo',
			perfis: ['admin', 'leitor'],
		});
		fireEvent.change(screen.getByLabelText('Status'), { target: { value: '' } });
		expect(onChange).toHaveBeenLastCalledWith({ q: 'ana', perfis: ['admin', 'leitor'] });
		fireEvent.click(screen.getByLabelText('Leitor'));
		fireEvent.click(screen.getByLabelText('Administrador'));
		fireEvent.change(screen.getByLabelText('Busca'), { target: { value: '' } });
		expect(onChange).toHaveBeenLastCalledWith({});
	});

	it('emits ISO dates and ranges from the date pickers', () => {
		const onChange = vi.fn();
		render(<Harness onChange={onChange} />);
		const input = screen.getByLabelText('Criado em');
		fireEvent.change(input, { target: { value: '15/03/2026' } });
		fireEvent.blur(input);
		expect(onChange).toHaveBeenLastCalledWith({ criado: '2026-03-15' });
	});

	it('shows active filters as removable chips with accessible names', () => {
		render(
			<Harness
				initial={{
					status: 'ativo',
					perfis: ['admin', 'editor'],
					criado: '2026-03-15',
					periodo: { start: '2026-01-01', end: null },
				}}
			/>,
		);
		const list = screen.getByRole('list', { name: 'Filtros ativos' });
		const items = within(list).getAllByRole('listitem');
		expect(items.map((item) => item.textContent)).toEqual([
			'Status: Ativo',
			'Perfis: Administrador',
			'Perfis: Editor',
			'Criado em: 15/03/2026',
			'Período: 01/01/2026 – …',
		]);
		expect(screen.getByRole('button', { name: 'Remover filtro Status: Ativo' })).toBeTruthy();
		expect(screen.getByRole('status').textContent).toBe('5 filtros ativos');
	});

	it('removes one chip or one multiselect option, and moves focus to a neighbouring chip', () => {
		const onChange = vi.fn();
		render(
			<Harness initial={{ status: 'ativo', perfis: ['admin', 'editor'] }} onChange={onChange} />,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Remover filtro Perfis: Administrador' }));
		expect(onChange).toHaveBeenLastCalledWith({ status: 'ativo', perfis: ['editor'] });
		expect(document.activeElement).toBe(
			screen.getByRole('button', { name: 'Remover filtro Perfis: Editor' }),
		);
		fireEvent.click(screen.getByRole('button', { name: 'Remover filtro Status: Ativo' }));
		expect(onChange).toHaveBeenLastCalledWith({ perfis: ['editor'] });
	});

	it('clears everything and returns focus to the first control', () => {
		const onChange = vi.fn();
		render(<Harness initial={{ status: 'ativo', q: 'ana' }} onChange={onChange} />);
		fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
		expect(onChange).toHaveBeenLastCalledWith({});
		expect(screen.getByText('Nenhum filtro ativo')).toBeTruthy();
		expect(document.activeElement).toBe(screen.getByLabelText('Busca'));
	});

	it('is strictly controlled', () => {
		render(<AdsFilterBar filters={filters} onChange={() => {}} value={{ q: 'fixo' }} />);
		const input = screen.getByLabelText('Busca') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'outro' } });
		expect(input.value).toBe('fixo');
	});

	it('toggles the fields with aria-expanded and supports controlled expansion', () => {
		const onExpandedChange = vi.fn();
		const { rerender } = render(<Harness onExpandedChange={onExpandedChange} />);
		const toggle = screen.getByRole('button', { name: /^Filtros/ });
		const body = document.getElementById(toggle.getAttribute('aria-controls') as string);
		expect(toggle.getAttribute('aria-expanded')).toBe('false');
		expect(body?.getAttribute('data-expanded')).toBe('false');
		fireEvent.click(toggle);
		expect(toggle.getAttribute('aria-expanded')).toBe('true');
		expect(onExpandedChange).toHaveBeenLastCalledWith(true);
		rerender(<Harness expanded={false} />);
		fireEvent.click(screen.getByRole('button', { name: /^Filtros/ }));
		expect(screen.getByRole('button', { name: /^Filtros/ }).getAttribute('aria-expanded')).toBe(
			'false',
		);
	});

	it('shows the active count on the toggle', () => {
		render(<Harness initial={{ status: 'ativo', q: 'a' }} />);
		expect(screen.getByRole('button', { name: 'Filtros 2' })).toBeTruthy();
	});

	it('disables fields and chip actions but keeps chips readable', () => {
		render(<Harness disabled initial={{ status: 'ativo' }} />);
		expect((screen.getByLabelText('Busca') as HTMLInputElement).disabled).toBe(true);
		expect((screen.getByLabelText('Leitor') as HTMLInputElement).disabled).toBe(true);
		expect(screen.getByText('Status: Ativo')).toBeTruthy();
		expect(
			(screen.getByRole('button', { name: 'Remover filtro Status: Ativo' }) as HTMLButtonElement)
				.disabled,
		).toBe(true);
		expect(
			(screen.getByRole('button', { name: 'Limpar filtros' }) as HTMLButtonElement).disabled,
		).toBe(true);
	});

	it('announces loading with aria-busy and stays usable', () => {
		const onChange = vi.fn();
		render(<Harness loading onChange={onChange} />);
		expect(screen.getByRole('region', { name: 'Filtros' }).getAttribute('aria-busy')).toBe('true');
		expect(screen.getByRole('status').textContent).toBe('Aplicando filtros');
		fireEvent.change(screen.getByLabelText('Busca'), { target: { value: 'x' } });
		expect(onChange).toHaveBeenCalledWith({ q: 'x' });
	});

	it('associates field errors and descriptions and accepts custom labels', () => {
		render(
			<Harness
				aria-label="Filtros de pedidos"
				filters={[
					{ id: 'q', type: 'text', label: 'Busca', error: 'Muito curta', description: 'Dica' },
					{
						id: 'perfis',
						type: 'multiselect',
						label: 'Perfis',
						error: 'Escolha um',
						options: [{ value: 'a', label: 'A' }],
					},
				]}
				initial={{ q: 'a' }}
				labels={{ removeFilter: 'Tirar {label} = {value}', noActiveFilters: 'Vazio' }}
			/>,
		);
		const input = screen.getByLabelText('Busca');
		expect(input.getAttribute('aria-invalid')).toBe('true');
		expect(input.getAttribute('aria-describedby')).toContain('-error');
		expect(screen.getAllByRole('alert').map((node) => node.textContent)).toEqual([
			'Muito curta',
			'Escolha um',
		]);
		expect(screen.getByRole('region', { name: 'Filtros de pedidos' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Tirar Busca = a' })).toBeTruthy();
	});

	it('has no axe violations in any state', async () => {
		for (const props of [
			{},
			{
				initial: {
					status: 'ativo',
					perfis: ['admin'],
					periodo: { start: '2026-01-01', end: '2026-01-31' },
				},
			},
			{ disabled: true, initial: { status: 'ativo' } },
			{ loading: true },
		]) {
			const { container, unmount } = render(<Harness {...props} />);
			const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
			expect(result.violations.map((violation) => violation.id)).toEqual([]);
			unmount();
		}
	});

	it('does not depend on Next.js routing or the URL', () => {
		const source = readFileSync(join(process.cwd(), 'packages/admin/src/filter-bar.tsx'), 'utf8');
		expect(source).not.toMatch(/next\//);
		expect(source).not.toMatch(/window\.|location|matchMedia|document\./);
	});
});
