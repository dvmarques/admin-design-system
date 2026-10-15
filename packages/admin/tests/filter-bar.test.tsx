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

	it('emits date ranges as start and end, keeping an open end', () => {
		const onChange = vi.fn();
		render(<Harness onChange={onChange} />);
		const field = screen.getByText('Período').closest('.ads-field') as HTMLElement;
		const [start, end] = Array.from(field.querySelectorAll('input'));
		fireEvent.change(start as HTMLInputElement, { target: { value: '01/03/2026' } });
		fireEvent.blur(start as HTMLInputElement);
		expect(onChange).toHaveBeenLastCalledWith({ periodo: { start: '2026-03-01', end: null } });
		fireEvent.change(end as HTMLInputElement, { target: { value: '31/03/2026' } });
		fireEvent.blur(end as HTMLInputElement);
		expect(onChange).toHaveBeenLastCalledWith({
			periodo: { start: '2026-03-01', end: '2026-03-31' },
		});
		expect(screen.getByText('Período: 01/03/2026 – 31/03/2026')).toBeTruthy();
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

	it('clears everything and returns focus to the first control when the fields are expanded', () => {
		const onChange = vi.fn();
		render(<Harness defaultExpanded initial={{ status: 'ativo', q: 'ana' }} onChange={onChange} />);
		fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
		expect(onChange).toHaveBeenLastCalledWith({});
		expect(screen.getByText('Nenhum filtro ativo')).toBeTruthy();
		expect(document.activeElement).toBe(screen.getByLabelText('Busca'));
	});

	it('returns focus to the toggle when the fields are collapsed', () => {
		render(<Harness initial={{ status: 'ativo', q: 'ana' }} />);
		const toggle = screen.getByRole('button', { name: /^Filtros/ });
		expect(toggle.getAttribute('aria-expanded')).toBe('false');
		fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
		expect(document.activeElement).toBe(toggle);
	});

	it('moves focus to the toggle after removing the last chip with collapsed fields', () => {
		const { unmount } = render(<Harness expanded={false} initial={{ status: 'ativo' }} />);
		fireEvent.click(screen.getByRole('button', { name: 'Remover filtro Status: Ativo' }));
		expect(document.activeElement).toBe(screen.getByRole('button', { name: /^Filtros/ }));
		unmount();
		render(<Harness expanded initial={{ status: 'ativo' }} />);
		fireEvent.click(screen.getByRole('button', { name: 'Remover filtro Status: Ativo' }));
		expect(document.activeElement).toBe(screen.getByLabelText('Busca'));
	});

	it('keeps the pending focus through an intermediate render until the removed chip is gone', () => {
		const onChange = vi.fn();
		const initial: AdsFilterValues = { status: 'ativo', perfis: ['admin', 'editor'] };
		const { rerender } = render(
			<AdsFilterBar defaultExpanded filters={filters} onChange={onChange} value={initial} />,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Remover filtro Perfis: Administrador' }));
		expect(onChange).toHaveBeenLastCalledWith({ status: 'ativo', perfis: ['editor'] });
		// Consumidor assíncrono (por exemplo, startTransition): renderiza antes do value novo.
		rerender(
			<AdsFilterBar
				defaultExpanded
				filters={filters}
				loading
				onChange={onChange}
				value={initial}
			/>,
		);
		rerender(
			<AdsFilterBar
				defaultExpanded
				filters={filters}
				onChange={onChange}
				value={{ status: 'ativo', perfis: ['editor'] }}
			/>,
		);
		expect(document.activeElement).toBe(
			screen.getByRole('button', { name: 'Remover filtro Perfis: Editor' }),
		);
	});

	it('keeps the pending focus of "Limpar filtros" through an intermediate render', () => {
		const onChange = vi.fn();
		const initial: AdsFilterValues = { status: 'ativo', q: 'ana' };
		const { rerender } = render(
			<AdsFilterBar filters={filters} onChange={onChange} value={initial} />,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
		expect(onChange).toHaveBeenLastCalledWith({});
		rerender(<AdsFilterBar filters={filters} loading onChange={onChange} value={initial} />);
		rerender(<AdsFilterBar filters={filters} onChange={onChange} value={{}} />);
		expect(document.activeElement).toBe(screen.getByRole('button', { name: /^Filtros/ }));
	});

	it('keeps the pending focus of "Limpar filtros" through a partial value and then the empty value', () => {
		for (const expanded of [false, true]) {
			const onChange = vi.fn();
			const bar = (value: AdsFilterValues) => (
				<AdsFilterBar expanded={expanded} filters={filters} onChange={onChange} value={value} />
			);
			const { rerender, unmount } = render(bar({ status: 'ativo', q: 'ana' }));
			fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
			expect(onChange).toHaveBeenLastCalledWith({});
			// O consumidor aplica o texto na hora e o restante depois (por exemplo, via URL).
			rerender(bar({ status: 'ativo' }));
			rerender(bar({}));
			expect(document.activeElement).toBe(
				expanded
					? screen.getByLabelText('Busca')
					: screen.getByRole('button', { name: /^Filtros/ }),
			);
			unmount();
		}
	});

	it('does not move focus when the value never arrives and the person moved away', async () => {
		const onChange = vi.fn();
		const bar = (value: AdsFilterValues) => (
			<AdsFilterBar defaultExpanded filters={filters} onChange={onChange} value={value} />
		);
		const { rerender } = render(bar({ status: 'ativo', perfis: ['admin'] }));
		const trigger = screen.getByRole('button', { name: 'Remover filtro Status: Ativo' });
		trigger.focus();
		fireEvent.click(trigger);
		// O consumidor rejeita a mudança e a pessoa clica em uma área vazia.
		trigger.blur();
		await Promise.resolve();
		expect(document.activeElement).toBe(document.body);
		rerender(bar({ perfis: ['admin'] }));
		expect(document.activeElement).toBe(document.body);
	});

	it('does not move focus when an external value changes the chips while the trigger remains', () => {
		const onChange = vi.fn();
		const bar = (value: AdsFilterValues) => (
			<AdsFilterBar defaultExpanded filters={filters} onChange={onChange} value={value} />
		);
		const { rerender } = render(bar({ status: 'ativo', perfis: ['admin'] }));
		fireEvent.click(screen.getByRole('button', { name: 'Remover filtro Status: Ativo' }));
		const other = screen.getByRole('button', { name: 'Remover filtro Perfis: Administrador' });
		other.focus();
		rerender(bar({ status: 'ativo', perfis: ['admin'], criado: '2026-03-15' }));
		expect(document.activeElement).toBe(other);
	});

	it('drops the pending focus when the person edits a field before the value arrives', () => {
		const onChange = vi.fn();
		const initial: AdsFilterValues = { status: 'ativo' };
		const { rerender } = render(
			<AdsFilterBar defaultExpanded filters={filters} onChange={onChange} value={initial} />,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Remover filtro Status: Ativo' }));
		const input = screen.getByLabelText('Busca');
		input.focus();
		fireEvent.change(input, { target: { value: 'x' } });
		rerender(
			<AdsFilterBar
				defaultExpanded
				filters={filters}
				onChange={onChange}
				value={{ status: 'ativo', q: 'x' }}
			/>,
		);
		expect(document.activeElement).toBe(input);
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

	it('counts chips, one per checked option, on the toggle and in the announcement', () => {
		render(<Harness initial={{ status: 'ativo', perfis: ['admin', 'editor'] }} />);
		expect(screen.getByRole('button', { name: 'Filtros 3' })).toBeTruthy();
		expect(screen.getByRole('status').textContent).toBe('3 filtros ativos');
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

	it('keeps the toggle operable when disabled, only to expand and collapse', () => {
		const onChange = vi.fn();
		render(<Harness disabled initial={{ status: 'ativo' }} onChange={onChange} />);
		const toggle = screen.getByRole('button', { name: /^Filtros/ }) as HTMLButtonElement;
		expect(toggle.disabled).toBe(false);
		fireEvent.click(toggle);
		expect(toggle.getAttribute('aria-expanded')).toBe('true');
		fireEvent.click(toggle);
		expect(toggle.getAttribute('aria-expanded')).toBe('false');
		expect(onChange).not.toHaveBeenCalled();
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

	it('links the multiselect description and error to the group and marks options invalid', () => {
		const { rerender } = render(
			<Harness
				filters={[
					{
						id: 'perfis',
						type: 'multiselect',
						label: 'Perfis',
						description: 'Escolha ao menos um',
						error: 'Obrigatório',
						options: [
							{ value: 'a', label: 'A' },
							{ value: 'b', label: 'B' },
						],
					},
				]}
			/>,
		);
		const group = screen.getByRole('group', { name: 'Perfis' });
		const ids = (group.getAttribute('aria-describedby') ?? '').split(' ');
		expect(ids).toHaveLength(2);
		expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual([
			'Escolha ao menos um',
			'Obrigatório',
		]);
		expect(document.getElementById(ids[1] as string)?.getAttribute('role')).toBe('alert');
		for (const name of ['A', 'B']) {
			expect(screen.getByLabelText(name).getAttribute('aria-invalid')).toBe('true');
		}
		rerender(
			<AdsFilterBar
				filters={[
					{
						id: 'perfis',
						type: 'multiselect',
						label: 'Perfis',
						options: [{ value: 'a', label: 'A' }],
					},
				]}
				onChange={() => {}}
				value={{}}
			/>,
		);
		expect(screen.getByRole('group', { name: 'Perfis' }).hasAttribute('aria-describedby')).toBe(
			false,
		);
		expect(screen.getByLabelText('A').hasAttribute('aria-invalid')).toBe(false);
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('builds valid describedby ids for multiselect filters whose id has spaces', () => {
		render(
			<Harness
				filters={[
					{
						id: 'perfis de acesso',
						type: 'multiselect',
						label: 'Perfis',
						description: 'Dica',
						error: 'Erro',
						options: [{ value: 'a', label: 'A' }],
					},
				]}
			/>,
		);
		const ids = (
			screen.getByRole('group', { name: 'Perfis' }).getAttribute('aria-describedby') ?? ''
		).split(' ');
		expect(ids).toHaveLength(2);
		for (const id of ids) {
			expect(id).toMatch(/^[\w-]+$/);
			expect(document.getElementById(id)).not.toBeNull();
		}
		expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual(['Dica', 'Erro']);
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
			{
				filters: [
					{
						id: 'perfis',
						type: 'multiselect' as const,
						label: 'Perfis',
						description: 'Dica',
						error: 'Erro',
						options: [{ value: 'a', label: 'A' }],
					},
				],
			},
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
