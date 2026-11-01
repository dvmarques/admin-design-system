'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdsBadge } from '@dvmarques/admin-ds-components';
import {
	AdsSmartTable,
	getAdsSmartTableCsv,
	type AdsSmartTableColumn,
	type AdsSmartTableExport,
	type AdsSmartTableSort,
} from '@dvmarques/admin-ds-admin';

interface Person {
	id: string;
	name: string;
	email: string;
	role: string;
	status: string;
}

const roles = ['Administrador', 'Editor', 'Leitor'];
const statuses = ['Ativo', 'Inativo', 'Pendente'];
const people: Person[] = Array.from({ length: 10000 }, (_, i) => ({
	id: String(i + 1),
	name: `Pessoa ${i + 1}`,
	email: `pessoa${i + 1}@exemplo.com`,
	role: roles[i % roles.length]!,
	status: statuses[i % statuses.length]!,
}));

const columns: AdsSmartTableColumn<Person>[] = [
	{ id: 'name', label: 'Nome', sortable: true, hideable: false, minWidth: 96, cell: (p) => p.name },
	{ id: 'email', label: 'E-mail', sortable: true, minWidth: 96, cell: (p) => p.email },
	{ id: 'role', label: 'Perfil', sortable: true, minWidth: 96, cell: (p) => p.role },
	{
		id: 'status',
		label: 'Status',
		minWidth: 96,
		cell: (p) => (
			<AdsBadge variant={p.status === 'Ativo' ? 'success' : 'neutral'}>{p.status}</AdsBadge>
		),
		exportValue: (p) => p.status,
	},
];

export default function AdvancedTablePage() {
	const [virtualized, setVirtualized] = useState(true);
	const [resizable, setResizable] = useState(true);
	const [exportable, setExportable] = useState(true);
	const [sort, setSort] = useState<AdsSmartTableSort | null>(null);
	const [selected, setSelected] = useState<string[]>([]);
	const [hidden, setHidden] = useState<string[]>([]);
	const [widths, setWidths] = useState<Record<string, number>>({});
	const [csv, setCsv] = useState('');

	const rows = useMemo(() => {
		if (!sort) return people;
		const key = sort.columnId as keyof Person;
		const factor = sort.direction === 'asc' ? 1 : -1;
		return [...people].sort(
			(a, b) => factor * a[key].localeCompare(b[key], 'pt-BR', { numeric: true }),
		);
	}, [sort]);

	return (
		<div className="demo-page">
			<h1>Tabela com virtualização, redimensionamento e exportação</h1>
			<p>
				Recursos opt-in do <code>AdsSmartTable</code>: 10 mil linhas, colunas redimensionáveis por
				ponteiro e teclado e gancho de exportação. Ordenação e seleção continuam sendo estado desta
				página.
			</p>
			<Link className="demo-action-link" href="/componentes">
				Voltar ao catálogo
			</Link>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBlock: 24 }}>
				<label>
					<input
						checked={virtualized}
						onChange={(event) => setVirtualized(event.target.checked)}
						type="checkbox"
					/>{' '}
					Virtualizar linhas
				</label>
				<label>
					<input
						checked={resizable}
						onChange={(event) => setResizable(event.target.checked)}
						type="checkbox"
					/>{' '}
					Redimensionar colunas
				</label>
				<label>
					<input
						checked={exportable}
						onChange={(event) => setExportable(event.target.checked)}
						type="checkbox"
					/>{' '}
					Exportar
				</label>
			</div>
			<AdsSmartTable<Person>
				caption="Pessoas"
				{...(resizable && { columnWidths: widths, onColumnWidthsChange: setWidths })}
				columns={columns}
				getRowId={(p) => p.id}
				getRowLabel={(p) => p.name}
				hiddenColumnIds={hidden}
				{...(exportable && {
					onExport: (data: AdsSmartTableExport<Person>) =>
						setCsv(getAdsSmartTableCsv(data, { onlySelected: data.selectedRows.length > 0 })),
				})}
				onHiddenColumnsChange={setHidden}
				onSelectionChange={setSelected}
				onSortChange={setSort}
				rows={virtualized ? rows : rows.slice(0, 50)}
				selectedIds={selected}
				sort={sort}
				{...(virtualized && { virtualization: { rowHeight: 44, height: 360 } })}
			/>
			<p>
				<output aria-label="Seleção atual">
					{selected.length === 0 ? 'Nenhuma seleção' : `${selected.length} selecionadas`}
				</output>
			</p>
			{csv ? (
				<pre aria-label="CSV gerado" style={{ maxHeight: 160, overflow: 'auto' }}>
					{csv}
				</pre>
			) : null}
		</div>
	);
}
