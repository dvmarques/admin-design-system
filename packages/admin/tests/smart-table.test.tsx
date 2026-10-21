import { fireEvent, render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdsDialog, AdsDrawer } from '@admin-ds/components';
import {
	AdsSmartTable,
	type AdsSmartTableColumn,
	type AdsSmartTableProps,
	type AdsSmartTableSort,
} from '../src/index.js';

interface User {
	id: string;
	name: string;
	role: string;
}

const users: User[] = [
	{ id: 'u1', name: 'Ana', role: 'Admin' },
	{ id: 'u2', name: 'Bruno', role: 'Editor' },
	{ id: 'u3', name: 'Carla', role: 'Leitor' },
];

const columns: AdsSmartTableColumn<User>[] = [
	{ id: 'name', label: 'Nome', sortable: true, cell: (u) => u.name },
	{ id: 'role', label: 'Perfil', sortable: true, cell: (u) => u.role },
];

type Props = Partial<AdsSmartTableProps<User>>;

function Harness(props: Props) {
	return (
		<AdsSmartTable<User>
			caption="Usuários"
			columns={columns}
			getRowId={(u) => u.id}
			getRowLabel={(u) => u.name}
			rows={users}
			{...props}
		/>
	);
}

function Controlled(props: Props & { initialSelected?: string[]; spy?: (ids: string[]) => void }) {
	const { initialSelected = [], spy, ...rest } = props;
	const [selected, setSelected] = useState<string[]>(initialSelected);
	const [hidden, setHidden] = useState<string[]>([]);
	const [sort, setSort] = useState<AdsSmartTableSort | null>(null);
	return (
		<Harness
			hiddenColumnIds={hidden}
			onHiddenColumnsChange={setHidden}
			onSelectionChange={(ids) => {
				spy?.(ids);
				setSelected(ids);
			}}
			onSortChange={setSort}
			selectedIds={selected}
			sort={sort}
			{...rest}
		/>
	);
}

async function violations(container: HTMLElement) {
	const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
	return result.violations.map((v) => v.id);
}

describe('AdsSmartTable', () => {
	it('renders caption, headers and rows in the received order', () => {
		render(<Harness />);
		const table = screen.getByRole('table', { name: 'Usuários' });
		expect(
			within(table)
				.getAllByRole('columnheader')
				.map((h) => h.textContent),
		).toEqual(['Nome', 'Perfil']);
		expect(
			within(table)
				.getAllByRole('row')
				.slice(1)
				.map((r) => within(r).getAllByRole('cell')[0]?.textContent),
		).toEqual(['Ana', 'Bruno', 'Carla']);
	});

	it('makes the scroll container a labelled, focusable region', () => {
		render(<Harness />);
		const region = screen.getByRole('region', { name: 'Usuários' });
		expect(region).toHaveAttribute('tabindex', '0');
		expect(region).toContainElement(screen.getByRole('table'));
	});

	it('cycles sorting asc, desc, none and exposes aria-sort', () => {
		const onSortChange = vi.fn();
		const { rerender } = render(<Harness onSortChange={onSortChange} sort={null} />);
		const header = () => screen.getByRole('columnheader', { name: 'Nome' });
		expect(header()).toHaveAttribute('aria-sort', 'none');
		fireEvent.click(screen.getByRole('button', { name: 'Nome' }));
		expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'asc' });
		rerender(<Harness onSortChange={onSortChange} sort={{ columnId: 'name', direction: 'asc' }} />);
		expect(header()).toHaveAttribute('aria-sort', 'ascending');
		fireEvent.click(screen.getByRole('button', { name: 'Nome' }));
		expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'desc' });
		rerender(
			<Harness onSortChange={onSortChange} sort={{ columnId: 'name', direction: 'desc' }} />,
		);
		expect(header()).toHaveAttribute('aria-sort', 'descending');
		expect(screen.getByRole('columnheader', { name: 'Perfil' })).toHaveAttribute(
			'aria-sort',
			'none',
		);
		fireEvent.click(screen.getByRole('button', { name: 'Nome' }));
		expect(onSortChange).toHaveBeenLastCalledWith(null);
		fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));
		expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'role', direction: 'asc' });
	});

	it('announces sort changes and skips sort controls on non-sortable columns', () => {
		render(
			<Harness
				columns={[...columns, { id: 'x', label: 'Ações', cell: () => '-' }]}
				onSortChange={() => {}}
			/>,
		);
		expect(screen.queryByRole('button', { name: 'Ações' })).toBeNull();
		expect(screen.getByRole('columnheader', { name: 'Ações' })).not.toHaveAttribute('aria-sort');
		fireEvent.click(screen.getByRole('button', { name: 'Nome' }));
		expect(
			screen.getAllByRole('status').some((s) => s.textContent === 'Ordenado por Nome, ascendente'),
		).toBe(true);
	});

	it('has no sort controls without onSortChange and keeps the received order', () => {
		render(<Harness />);
		expect(screen.queryByRole('button', { name: 'Nome' })).toBeNull();
	});

	it('selects rows, all rows on the page and keeps ids from other pages', () => {
		const spy = vi.fn();
		render(<Controlled initialSelected={['outra-pagina']} spy={spy} />);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }));
		expect(spy).toHaveBeenLastCalledWith(['outra-pagina', 'u1']);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' }));
		expect(spy).toHaveBeenLastCalledWith(['outra-pagina', 'u1', 'u2', 'u3']);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' }));
		expect(spy).toHaveBeenLastCalledWith(['outra-pagina']);
	});

	it('uses the indeterminate state when the page selection is partial', () => {
		render(<Controlled initialSelected={['u1']} />);
		const all = screen.getByRole('checkbox', {
			name: 'Selecionar todas as linhas da página',
		}) as HTMLInputElement;
		expect(all.indeterminate).toBe(true);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Bruno' }));
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Carla' }));
		expect(all.indeterminate).toBe(false);
		expect(all.checked).toBe(true);
		expect(screen.getByRole('row', { name: /Ana/ })).toHaveAttribute('data-selected');
		expect(
			screen.getAllByRole('status').some((s) => s.textContent === '3 linhas selecionadas'),
		).toBe(true);
	});

	it('does not select disabled rows and ignores them in select all', () => {
		const spy = vi.fn();
		render(<Controlled isRowSelectable={(u) => u.id !== 'u2'} spy={spy} />);
		expect(screen.getByRole('checkbox', { name: 'Selecionar Bruno' })).toBeDisabled();
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' }));
		expect(spy).toHaveBeenLastCalledWith(['u1', 'u3']);
	});

	it('supports single selection with radios and no header checkbox', () => {
		const spy = vi.fn();
		render(<Controlled selectionMode="single" spy={spy} />);
		expect(screen.queryByRole('checkbox')).toBeNull();
		fireEvent.click(screen.getByRole('radio', { name: 'Selecionar Ana' }));
		expect(spy).toHaveBeenLastCalledWith(['u1']);
		fireEvent.click(screen.getByRole('radio', { name: 'Selecionar Carla' }));
		expect(spy).toHaveBeenLastCalledWith(['u3']);
		expect(screen.getByRole('radio', { name: 'Selecionar Ana' })).not.toBeChecked();
		expect(screen.getByRole('columnheader', { name: 'Seleção' })).toBeInTheDocument();
	});

	it('does not render a selection column without onSelectionChange', () => {
		render(<Harness selectedIds={['u1']} />);
		expect(screen.queryByRole('checkbox')).toBeNull();
	});

	it('keeps the controlled state when the consumer does not apply changes', () => {
		render(<Harness onSelectionChange={() => {}} selectedIds={[]} />);
		const box = screen.getByRole('checkbox', { name: 'Selecionar Ana' });
		fireEvent.click(box);
		expect(box).not.toBeChecked();
	});

	it('toggles column visibility and protects the last visible and fixed columns', () => {
		render(<Controlled columns={[{ ...columns[0]!, hideable: false }, columns[1]!]} />);
		const button = screen.getByRole('button', { name: 'Colunas' });
		expect(button).toHaveAttribute('aria-expanded', 'false');
		fireEvent.click(button);
		expect(button).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByRole('checkbox', { name: 'Nome' })).toBeDisabled();
		const role = screen.getByRole('checkbox', { name: 'Perfil' });
		fireEvent.click(role);
		expect(screen.queryByRole('columnheader', { name: 'Perfil' })).toBeNull();
		expect(screen.queryByRole('cell', { name: 'Admin' })).toBeNull();
		fireEvent.click(role);
		expect(screen.getByRole('columnheader', { name: 'Perfil' })).toBeInTheDocument();
	});

	it('disables the last visible column checkbox', () => {
		render(<Controlled />);
		fireEvent.click(screen.getByRole('button', { name: 'Colunas' }));
		fireEvent.click(screen.getByRole('checkbox', { name: 'Perfil' }));
		expect(screen.getByRole('checkbox', { name: 'Nome' })).toBeDisabled();
	});

	it('closes the column panel with Escape and returns focus to the button', () => {
		render(<Controlled />);
		const button = screen.getByRole('button', { name: 'Colunas' });
		fireEvent.click(button);
		fireEvent.keyDown(screen.getByRole('checkbox', { name: 'Nome' }), { key: 'Escape' });
		expect(button).toHaveAttribute('aria-expanded', 'false');
		expect(button).toHaveFocus();
	});

	it.each([
		['AdsDialog', AdsDialog],
		['AdsDrawer', AdsDrawer],
	] as const)(
		'closes only the column panel on the first Escape inside an %s and the overlay on the second',
		(_name, Overlay) => {
			const onOpenChange = vi.fn();
			render(
				<Overlay onOpenChange={onOpenChange} open title="Usuários">
					<Controlled />
				</Overlay>,
			);
			const button = screen.getByRole('button', { name: 'Colunas' });
			fireEvent.click(button);
			const checkbox = screen.getByRole('checkbox', { name: 'Nome' });
			checkbox.focus();
			fireEvent.keyDown(checkbox, { key: 'Escape' });
			expect(button).toHaveAttribute('aria-expanded', 'false');
			expect(button).toHaveFocus();
			expect(onOpenChange).not.toHaveBeenCalled();
			fireEvent.keyDown(button, { key: 'Escape' });
			expect(onOpenChange).toHaveBeenCalledWith(false);
		},
	);

	it('passes the density to the table and keeps the default markup without it', () => {
		const { rerender } = render(<Controlled density="compact" />);
		expect(screen.getByRole('table')).toHaveAttribute('data-density', 'compact');
		rerender(<Controlled />);
		expect(screen.getByRole('table')).not.toHaveAttribute('data-density');
	});

	it('shows loading skeletons, aria-busy and a disabled select all', () => {
		render(<Controlled loading loadingRows={2} />);
		expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
		expect(document.querySelectorAll('.ads-skeleton')).toHaveLength(6);
		expect(document.querySelector('.ads-skeleton')).toHaveAttribute('data-variant', 'text');
		expect(
			screen.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' }),
		).toBeDisabled();
		expect(screen.getAllByRole('status').some((s) => s.textContent === 'Carregando dados')).toBe(
			true,
		);
		expect(screen.getByRole('columnheader', { name: 'Nome' })).toBeInTheDocument();
	});

	it('shows the error state with retry, taking precedence over loading', () => {
		const onRetry = vi.fn();
		render(<Harness error="Falha de rede" loading onRetry={onRetry} />);
		const alert = screen.getByRole('alert');
		expect(alert).toHaveTextContent('Não foi possível carregar os dados');
		expect(alert).toHaveTextContent('Falha de rede');
		fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
		expect(onRetry).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('cell', { name: 'Ana' })).toBeNull();
	});

	it('shows the default and the custom empty states across all columns', () => {
		const { rerender } = render(<Controlled rows={[]} />);
		expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
		expect(screen.getByRole('cell')).toHaveAttribute('colspan', '3');
		rerender(<Controlled emptyState={<p>Sem usuários</p>} rows={[]} />);
		expect(screen.getByText('Sem usuários')).toBeInTheDocument();
	});

	it('renders filters and pagination only when provided, with page links', () => {
		const { rerender } = render(<Harness />);
		expect(screen.queryByRole('navigation')).toBeNull();
		rerender(
			<Harness
				filters={<div>Filtros aqui</div>}
				pagination={{
					page: 1,
					pageCount: 3,
					renderPageLink: (page, { children, ...linkProps }) => (
						<a href={`?page=${page}`} {...linkProps}>
							{children}
						</a>
					),
				}}
			/>,
		);
		expect(screen.getByText('Filtros aqui')).toBeInTheDocument();
		const nav = screen.getByRole('navigation', { name: 'Paginação' });
		expect(within(nav).getByRole('link', { name: 'Página 2' })).toHaveAttribute('href', '?page=2');
		expect(screen.getByRole('region', { name: 'Usuários' })).not.toContainElement(nav);
	});

	it('accepts custom labels and hides the caption visually without removing it', () => {
		render(
			<Controlled
				hideCaption
				initialSelected={['u1']}
				labels={{ selectedCount: (n) => `${n} marcada(s)` }}
			/>,
		);
		expect(screen.getByRole('table', { name: 'Usuários' })).toBeInTheDocument();
		expect(screen.getAllByRole('status').some((s) => s.textContent === '1 marcada(s)')).toBe(true);
	});

	it.each([
		['default', {}],
		['loading', { loading: true }],
		['empty', { rows: [] }],
		['error', { error: 'Falha' }],
		['selection', { initialSelected: ['u1'] }],
		['single selection', { selectionMode: 'single' as const }],
	])('has no axe violations (%s)', async (_name, props) => {
		const { container } = render(<Controlled {...(props as Props)} />);
		expect(await violations(container)).toEqual([]);
	});

	it('has no axe violations with hidden columns and the panel open', async () => {
		const { container } = render(<Controlled />);
		fireEvent.click(screen.getByRole('button', { name: 'Colunas' }));
		fireEvent.click(screen.getByRole('checkbox', { name: 'Perfil' }));
		expect(await violations(container)).toEqual([]);
	});

	it('does not repeat the sort announcement when a later load finishes', () => {
		const { rerender } = render(<Harness onSortChange={() => {}} />);
		fireEvent.click(screen.getByRole('button', { name: 'Nome' }));
		const sortRegion = screen
			.getAllByRole('status')
			.find((s) => s.textContent === 'Ordenado por Nome, ascendente');
		expect(sortRegion).toBeDefined();
		const mutations: MutationRecord[] = [];
		const observer = new MutationObserver((records) => mutations.push(...records));
		observer.observe(sortRegion!, { characterData: true, childList: true, subtree: true });
		rerender(<Harness loading onSortChange={() => {}} />);
		expect(screen.getAllByRole('status').some((s) => s.textContent === 'Carregando dados')).toBe(
			true,
		);
		rerender(<Harness onSortChange={() => {}} />);
		mutations.push(...observer.takeRecords());
		observer.disconnect();
		expect(mutations).toHaveLength(0);
		expect(sortRegion).toHaveTextContent('Ordenado por Nome, ascendente');
		expect(screen.getAllByRole('status').some((s) => s.textContent === 'Carregando dados')).toBe(
			false,
		);
	});

	it('tells selections on other pages apart from the current page in the counter', () => {
		const { rerender } = render(<Controlled initialSelected={['u1', 'u2']} />);
		expect(
			screen.getAllByRole('status').some((s) => s.textContent === '2 linhas selecionadas'),
		).toBe(true);
		rerender(<Controlled initialSelected={['x1', 'x2', 'x3', 'u1']} key="other" />);
		expect(
			screen
				.getAllByRole('status')
				.some((s) => s.textContent === '4 linhas selecionadas, 1 nesta página'),
		).toBe(true);
	});

	it('keeps the hover highlight only on data rows', () => {
		const { rerender } = render(<Controlled />);
		const [header, ...dataRows] = screen.getAllByRole('row');
		expect(header).toHaveClass('ads-table-row');
		expect(header!.className).not.toMatch(/hover:/);
		for (const row of dataRows) expect(row.className).toMatch(/hover:bg-surface-hover/);
		for (const props of [{ loading: true }, { rows: [] }, { error: 'Falha' }] as Props[]) {
			rerender(<Controlled {...props} />);
			for (const row of screen.getAllByRole('row')) {
				expect(row).toHaveClass('ads-table-row');
				expect(row.className).not.toMatch(/hover:/);
			}
		}
	});

	it('renders the column panel inline, after the button and before the table', () => {
		render(<Controlled />);
		const button = screen.getByRole('button', { name: 'Colunas' });
		fireEvent.click(button);
		const panel = document.getElementById(button.getAttribute('aria-controls')!)!;
		expect(panel).toBeVisible();
		expect(panel.parentElement).toHaveClass('ads-smart-table-toolbar');
		expect(button.closest('.ads-smart-table-columns')).not.toContainElement(panel);
		expect(
			panel.compareDocumentPosition(screen.getByRole('table')) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it('does not depend on the Next.js router or URL', () => {
		const source = readFileSync(join(process.cwd(), 'packages/admin/src/smart-table.tsx'), 'utf8');
		expect(source).not.toMatch(/from 'next\//);
		expect(source).not.toMatch(/window\.location/);
		expect(source.startsWith("'use client'")).toBe(true);
	});
});
