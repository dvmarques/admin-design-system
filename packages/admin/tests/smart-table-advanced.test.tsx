import { act, fireEvent, render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
	AdsListFlow,
	AdsSmartTable,
	getAdsSmartTableCsv,
	type AdsSmartTableColumn,
	type AdsSmartTableExport,
	type AdsSmartTableProps,
} from '../src/index.js';
import { getVirtualSlices } from '../src/smart-table-virtual.js';

interface Item {
	id: string;
	name: string;
	note: string;
}

const items: Item[] = Array.from({ length: 1000 }, (_, i) => ({
	id: `i${i + 1}`,
	name: `Item ${i + 1}`,
	note: i === 1 ? '=SUM(A1)' : `Nota "${i + 1}", ok`,
}));

const columns: AdsSmartTableColumn<Item>[] = [
	{ id: 'name', label: 'Nome', cell: (i) => i.name },
	{ id: 'note', label: 'Nota', cell: (i) => i.note },
	{ id: 'actions', label: 'Ações', exportable: false, cell: () => <button>Abrir</button> },
];

type Props = Partial<AdsSmartTableProps<Item>>;

function Table(props: Props) {
	return (
		<AdsSmartTable<Item>
			caption="Itens"
			columns={columns}
			getRowId={(i) => i.id}
			getRowLabel={(i) => i.name}
			rows={items}
			{...props}
		/>
	);
}

async function violations(container: HTMLElement) {
	const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
	return result.violations.map((v) => v.id);
}

const virtualization = { rowHeight: 40, height: 200, overscan: 2 };

function dataRows() {
	return screen.getAllByRole('row').filter((row) => Number(row.getAttribute('aria-rowindex')) > 1);
}

describe('getVirtualSlices', () => {
	it('windows rows and keeps the total height with spacers', () => {
		const slices = getVirtualSlices({
			count: 100,
			focusedIndex: null,
			height: 200,
			overscan: 2,
			rowHeight: 40,
			scrollTop: 400,
		});
		const rows = slices.filter((s) => s.type === 'row');
		expect(rows[0]).toEqual({ type: 'row', index: 8 });
		expect(rows.at(-1)).toEqual({ type: 'row', index: 16 });
		const total = slices.reduce((sum, s) => sum + (s.type === 'spacer' ? s.height : 40), 0);
		expect(total).toBe(4000);
	});

	it('keeps the focused row mounted outside the window', () => {
		const slices = getVirtualSlices({
			count: 100,
			focusedIndex: 2,
			height: 200,
			overscan: 0,
			rowHeight: 40,
			scrollTop: 2000,
		});
		expect(slices.some((s) => s.type === 'row' && s.index === 2)).toBe(true);
		expect(slices.some((s) => s.type === 'row' && s.index === 3)).toBe(true);
		const total = slices.reduce((sum, s) => sum + (s.type === 'spacer' ? s.height : 40), 0);
		expect(total).toBe(4000);
	});

	it('handles empty and short lists', () => {
		const base = { focusedIndex: null, height: 200, overscan: 2, rowHeight: 40, scrollTop: 0 };
		expect(getVirtualSlices({ ...base, count: 0 })).toEqual([]);
		expect(getVirtualSlices({ ...base, count: 3 }).every((s) => s.type === 'row')).toBe(true);
	});
});

describe('AdsSmartTable virtualization', () => {
	it('renders all rows when the prop is omitted', () => {
		render(<Table rows={items.slice(0, 60)} />);
		expect(screen.getAllByRole('row')).toHaveLength(61);
	});

	it('renders only the visible window and exposes the real row count', () => {
		render(<Table virtualization={virtualization} />);
		const rendered = dataRows();
		expect(rendered.length).toBeLessThan(15);
		expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '1001');
		expect(screen.getAllByRole('row')[0]).toHaveAttribute('aria-rowindex', '1');
		expect(rendered[0]).toHaveAttribute('aria-rowindex', '2');
		expect(screen.getByRole('cell', { name: 'Item 1' })).toBeInTheDocument();
		expect(screen.queryByRole('cell', { name: 'Item 500' })).not.toBeInTheDocument();
	});

	it('moves the window on scroll', () => {
		render(<Table virtualization={virtualization} />);
		const region = screen.getByRole('region', { name: 'Itens' });
		fireEvent.scroll(region, { target: { scrollTop: 20000 } });
		expect(screen.getByRole('cell', { name: 'Item 501' })).toBeInTheDocument();
		expect(screen.queryByRole('cell', { name: 'Item 1' })).not.toBeInTheDocument();
		expect(dataRows()[0]).toHaveAttribute('aria-rowindex', String(500 - 2 + 2));
	});

	it('counts selected rows outside the window and selects all received rows', () => {
		const onSelectionChange = vi.fn();
		render(
			<Table
				onSelectionChange={onSelectionChange}
				selectedIds={['i900']}
				virtualization={virtualization}
			/>,
		);
		expect(screen.getByText('1 linha selecionada')).toBeInTheDocument();
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' }));
		const ids = onSelectionChange.mock.calls[0]![0] as string[];
		expect(ids).toHaveLength(1000);
		expect(ids).toContain('i900');
	});

	it('keeps the focused row mounted after scrolling away', () => {
		render(<Table onSelectionChange={() => {}} virtualization={virtualization} />);
		const checkbox = screen.getByRole('checkbox', { name: 'Selecionar Item 2' });
		act(() => checkbox.focus());
		fireEvent.scroll(screen.getByRole('region', { name: 'Itens' }), {
			target: { scrollTop: 20000 },
		});
		expect(screen.getByRole('checkbox', { name: 'Selecionar Item 2' })).toBe(checkbox);
		expect(checkbox).toHaveFocus();
		act(() => checkbox.blur());
		expect(screen.queryByRole('checkbox', { name: 'Selecionar Item 2' })).not.toBeInTheDocument();
	});

	it('ignores an invalid configuration', () => {
		render(<Table rows={items.slice(0, 30)} virtualization={{ rowHeight: 0, height: 200 }} />);
		expect(screen.getAllByRole('row')).toHaveLength(31);
		expect(screen.getByRole('table')).not.toHaveAttribute('aria-rowcount');
	});

	it('keeps loading, empty and error states', () => {
		const { rerender } = render(<Table loading virtualization={virtualization} />);
		expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
		rerender(<Table rows={[]} virtualization={virtualization} />);
		expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
		expect(screen.getByRole('table')).not.toHaveAttribute('aria-rowcount');
		rerender(<Table error="Falha" virtualization={virtualization} />);
		expect(screen.getByRole('alert')).toHaveTextContent('Falha');
	});

	it('has no axe violations', async () => {
		const { container } = render(
			<Table onSelectionChange={() => {}} virtualization={virtualization} />,
		);
		expect(await violations(container)).toEqual([]);
	});
});

function Resizable({ initial = {}, ...props }: Props & { initial?: Record<string, number> }) {
	const [widths, setWidths] = useState<Record<string, number>>(initial);
	return (
		<AdsSmartTable<Item>
			caption="Itens"
			columns={[
				{ id: 'name', label: 'Nome', minWidth: 100, maxWidth: 300, cell: (i) => i.name },
				{ id: 'note', label: 'Nota', resizable: false, cell: (i) => i.note },
			]}
			columnWidths={widths}
			getRowId={(i) => i.id}
			onColumnWidthsChange={setWidths}
			rows={items.slice(0, 3)}
			{...props}
		/>
	);
}

describe('AdsSmartTable column resizing', () => {
	it('is off by default', () => {
		render(<Table />);
		expect(screen.queryByRole('separator')).not.toBeInTheDocument();
	});

	it('exposes a keyboard-operable separator only for resizable columns', () => {
		render(<Resizable />);
		const separators = screen.getAllByRole('separator');
		expect(separators).toHaveLength(1);
		expect(separators[0]).toHaveAccessibleName('Redimensionar coluna Nome');
		expect(separators[0]).toHaveAttribute('tabindex', '0');
		expect(separators[0]).toHaveAttribute('aria-orientation', 'vertical');
		expect(separators[0]).toHaveAttribute('aria-valuemin', '100');
		expect(separators[0]).toHaveAttribute('aria-valuemax', '300');
		expect(separators[0]).toHaveAttribute('aria-valuenow', '160');
	});

	it('resizes with arrows, Shift, Home, End and resets with Enter', () => {
		render(<Resizable initial={{ name: 200 }} />);
		const separator = screen.getByRole('separator');
		const header = screen.getByRole('columnheader', { name: /Nome/ });
		expect(header).toHaveStyle({ width: '200px' });
		fireEvent.keyDown(separator, { key: 'ArrowRight' });
		expect(separator).toHaveAttribute('aria-valuenow', '210');
		fireEvent.keyDown(separator, { key: 'ArrowLeft', shiftKey: true });
		expect(separator).toHaveAttribute('aria-valuenow', '160');
		fireEvent.keyDown(separator, { key: 'End' });
		expect(separator).toHaveAttribute('aria-valuenow', '300');
		fireEvent.keyDown(separator, { key: 'ArrowRight' });
		expect(separator).toHaveAttribute('aria-valuenow', '300');
		fireEvent.keyDown(separator, { key: 'Home' });
		expect(separator).toHaveAttribute('aria-valuenow', '100');
		fireEvent.keyDown(separator, { key: 'Enter' });
		expect(header).not.toHaveStyle({ width: '100px' });
		expect(separator).toHaveAttribute('aria-valuenow', '160');
	});

	it('resizes by dragging and applies the width to the cells', () => {
		const onChange = vi.fn();
		render(<Resizable initial={{ name: 200 }} onColumnWidthsChange={onChange} />);
		const separator = screen.getByRole('separator');
		fireEvent.pointerDown(separator, { button: 0, clientX: 100, pointerId: 1 });
		fireEvent.pointerMove(separator, { clientX: 150, pointerId: 1 });
		expect(onChange).toHaveBeenLastCalledWith({ name: 250 });
		fireEvent.pointerMove(separator, { clientX: 900, pointerId: 1 });
		expect(onChange).toHaveBeenLastCalledWith({ name: 300 });
		fireEvent.pointerUp(separator, { pointerId: 1 });
		fireEvent.pointerMove(separator, { clientX: 120, pointerId: 1 });
		expect(onChange).toHaveBeenCalledTimes(2);
	});

	it('does not change widths on its own', () => {
		const onChange = vi.fn();
		render(<Table columnWidths={{ name: 200 }} onColumnWidthsChange={onChange} />);
		fireEvent.keyDown(screen.getAllByRole('separator')[0]!, { key: 'ArrowRight' });
		expect(onChange).toHaveBeenCalledWith({ name: 210 });
		expect(screen.getByRole('columnheader', { name: /Nome/ })).toHaveStyle({ width: '200px' });
		expect(screen.getByRole('cell', { name: 'Item 1' })).toHaveStyle({ width: '200px' });
	});

	it('has no axe violations', async () => {
		const { container } = render(<Resizable initial={{ name: 200 }} />);
		expect(await violations(container)).toEqual([]);
	});
});

describe('AdsSmartTable export', () => {
	function capture(props: Props = {}) {
		const onExport = vi.fn<(data: AdsSmartTableExport<Item>) => void>();
		render(
			<Table
				hiddenColumnIds={['note']}
				onExport={onExport}
				rows={items.slice(0, 3)}
				selectedIds={['i2', 'i999']}
				{...props}
			/>,
		);
		return onExport;
	}

	it('has no button without onExport', () => {
		render(<Table />);
		expect(screen.queryByRole('button', { name: 'Exportar' })).not.toBeInTheDocument();
	});

	it('emits the visible exportable columns and the received rows', () => {
		const onExport = capture();
		fireEvent.click(screen.getByRole('button', { name: 'Exportar' }));
		const data = onExport.mock.calls[0]![0];
		expect(data.columns).toEqual([{ id: 'name', label: 'Nome' }]);
		expect(data.rows).toHaveLength(3);
		expect(data.records[0]).toEqual({ name: 'Item 1' });
		expect(data.selectedIds).toEqual(['i2', 'i999']);
		expect(data.selectedRows.map((row) => row.id)).toEqual(['i2']);
	});

	it('uses exportValue and falls back to null for React content', () => {
		const onExport = vi.fn<(data: AdsSmartTableExport<Item>) => void>();
		render(
			<AdsSmartTable<Item>
				caption="Itens"
				columns={[
					{ id: 'name', label: 'Nome', cell: (i) => <b>{i.name}</b> },
					{ id: 'note', label: 'Nota', cell: (i) => <i>{i.note}</i>, exportValue: (i) => i.id },
				]}
				getRowId={(i) => i.id}
				onExport={onExport}
				rows={items.slice(0, 1)}
			/>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Exportar' }));
		expect(onExport.mock.calls[0]![0].records).toEqual([{ name: null, note: 'i1' }]);
	});

	it('disables the button while loading, on error and without rows', () => {
		const { rerender } = render(<Table onExport={() => {}} loading />);
		expect(screen.getByRole('button', { name: 'Exportar' })).toBeDisabled();
		rerender(<Table error="Falha" onExport={() => {}} />);
		expect(screen.getByRole('button', { name: 'Exportar' })).toBeDisabled();
		rerender(<Table onExport={() => {}} rows={[]} />);
		expect(screen.getByRole('button', { name: 'Exportar' })).toBeDisabled();
	});

	it('accepts a custom label', () => {
		render(<Table labels={{ export: 'Baixar' }} onExport={() => {}} />);
		expect(screen.getByRole('button', { name: 'Baixar' })).toBeInTheDocument();
	});

	it('produces safe CSV with the optional helper', () => {
		const onExport = vi.fn<(data: AdsSmartTableExport<Item>) => void>();
		render(
			<Table
				onExport={onExport}
				rows={items.slice(0, 3)}
				selectedIds={['i2']}
				columns={columns.slice(0, 2)}
			/>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Exportar' }));
		const data = onExport.mock.calls[0]![0];
		expect(getAdsSmartTableCsv(data)).toBe(
			'Nome,Nota\r\nItem 1,"Nota ""1"", ok"\r\nItem 2,\'=SUM(A1)\r\nItem 3,"Nota ""3"", ok"\r\n',
		);
		expect(getAdsSmartTableCsv(data, { onlySelected: true, separator: ';', bom: true })).toBe(
			"﻿Nome;Nota\r\nItem 2;'=SUM(A1)\r\n",
		);
		expect(getAdsSmartTableCsv(data, { onlySelected: true, neutralizeFormulas: false })).toContain(
			'Item 2,=SUM(A1)',
		);
		const toolbar = screen.getByRole('button', { name: 'Exportar' }).parentElement!;
		expect(within(toolbar).getByRole('button', { name: 'Exportar' })).toBeInTheDocument();
	});
});

describe('AdsListFlow with advanced options', () => {
	it('forwards virtualization, widths and export to the table', () => {
		const onExport = vi.fn<(data: AdsSmartTableExport<Item>) => void>();
		render(
			<AdsListFlow<Item>
				bulkActions={<button>Excluir</button>}
				caption="Itens"
				columnWidths={{ name: 200 }}
				columns={columns}
				getRowId={(i) => i.id}
				onColumnWidthsChange={() => {}}
				onExport={onExport}
				onSelectionChange={() => {}}
				rows={items}
				selectedIds={['i2']}
				virtualization={virtualization}
			/>,
		);
		expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '1001');
		expect(dataRows().length).toBeLessThan(15);
		expect(screen.getAllByRole('separator')).toHaveLength(3);
		fireEvent.click(screen.getByRole('button', { name: 'Exportar' }));
		expect(onExport.mock.calls[0]![0].selectedRows.map((row) => row.id)).toEqual(['i2']);
	});
});
