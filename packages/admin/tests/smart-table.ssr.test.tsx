import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsSmartTable } from '../src/index.js';

function Table() {
	return (
		<AdsSmartTable
			caption="Usuários"
			columns={[{ id: 'name', label: 'Nome', sortable: true, cell: (r: { id: string }) => r.id }]}
			getRowId={(r) => r.id}
			onHiddenColumnsChange={() => {}}
			onSelectionChange={() => {}}
			onSortChange={() => {}}
			rows={[{ id: 'a' }, { id: 'b' }]}
			selectedIds={['a']}
			sort={{ columnId: 'name', direction: 'asc' }}
		/>
	);
}

describe('AdsSmartTable SSR and hydration', () => {
	it('hydrates the server markup without errors', async () => {
		const html = renderToString(<Table />);
		expect(html).toContain('aria-sort="ascending"');
		expect(html).toContain('data-selected');
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.append(container);
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		await act(async () => {
			hydrateRoot(container, <Table />);
		});
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
		container.remove();
	});
});

describe('AdsSmartTable advanced options SSR', () => {
	it('renders the same first window on server and client', async () => {
		const rows = Array.from({ length: 500 }, (_, i) => ({ id: `r${i}` }));
		const element = (
			<AdsSmartTable
				caption="Muitas linhas"
				columns={[{ id: 'id', label: 'Id', cell: (r: { id: string }) => r.id }]}
				columnWidths={{ id: 200 }}
				getRowId={(r) => r.id}
				onColumnWidthsChange={() => {}}
				onExport={() => {}}
				rows={rows}
				virtualization={{ rowHeight: 40, height: 200 }}
			/>
		);
		const html = renderToString(element);
		expect(html).toContain('aria-rowcount="501"');
		expect(html).not.toContain('>r400<');
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.append(container);
		const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
		await act(async () => {
			hydrateRoot(container, element);
		});
		expect(errors).not.toHaveBeenCalled();
		errors.mockRestore();
		container.remove();
	});
});
