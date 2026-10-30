import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsFilterBar,
	AdsSmartTable,
	getAdsSmartTableCsv,
	type AdsSmartTableColumn,
	type AdsSmartTableProps,
	type AdsSmartTableSort,
} from '@admin-ds/admin';
import { AdsBadge } from '@admin-ds/components';

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	status: string;
}

const data: User[] = [
	{ id: '1', name: 'Ana Souza', email: 'ana@exemplo.com', role: 'Administrador', status: 'Ativo' },
	{ id: '2', name: 'Bruno Lima', email: 'bruno@exemplo.com', role: 'Editor', status: 'Ativo' },
	{ id: '3', name: 'Carla Dias', email: 'carla@exemplo.com', role: 'Leitor', status: 'Inativo' },
	{ id: '4', name: 'Diego Alves', email: 'diego@exemplo.com', role: 'Editor', status: 'Pendente' },
];

const columns: AdsSmartTableColumn<User>[] = [
	{ id: 'name', label: 'Nome', sortable: true, hideable: false, cell: (u) => u.name },
	{ id: 'email', label: 'E-mail', sortable: true, cell: (u) => u.email },
	{ id: 'role', label: 'Perfil', sortable: true, cell: (u) => u.role },
	{
		id: 'status',
		label: 'Status',
		align: 'end',
		cell: (u) => (
			<AdsBadge variant={u.status === 'Ativo' ? 'success' : 'neutral'}>{u.status}</AdsBadge>
		),
	},
];

const meta = {
	title: 'Layout/SmartTable',
	component: AdsSmartTable<User>,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Tabela administrativa controlada pelo consumidor, composta sobre `AdsTable` e `AdsPagination`. Ordenação (`sort`), seleção (`selectedIds`) e colunas (`hiddenColumnIds`) são estado do consumidor; a biblioteca não busca, ordena nem pagina dados. O consumidor fornece as linhas já processadas. **API genérica:** AdsSmartTable<Row> recebe rows: Row[], columns: AdsSmartTableColumn<Row>[] e getRowId: (row: Row) => string. O tipo Row precisa ser consistente entre rows, columns e funções renderizadoras; a story usa User como exemplo. A extração automática de props não substitui os contratos AdsSmartTableProps<Row>, AdsSmartTableColumn<Row> e AdsSmartTableVirtualization; consulte os tipos públicos no entrypoint @admin-ds/admin. Estados loading, empty e error podem ser observados nas stories específicas. Interações de seleção, redimensionamento e ordenação exigem controle do consumidor, com foco, rótulos de linha e operação por teclado.',
			},
		},
	},
} satisfies Meta<typeof AdsSmartTable<User>>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo(props: Partial<AdsSmartTableProps<User>>) {
	const [sort, setSort] = useState<AdsSmartTableSort | null>({
		columnId: 'name',
		direction: 'asc',
	});
	const [selected, setSelected] = useState<string[]>([]);
	const [hidden, setHidden] = useState<string[]>([]);
	const rows = [...data].sort((a, b) => {
		if (!sort) return 0;
		const key = sort.columnId as keyof User;
		return (sort.direction === 'asc' ? 1 : -1) * a[key].localeCompare(b[key]);
	});
	return (
		<AdsSmartTable<User>
			caption="Usuários"
			columns={columns}
			getRowId={(u) => u.id}
			getRowLabel={(u) => u.name}
			hiddenColumnIds={hidden}
			onHiddenColumnsChange={setHidden}
			onSelectionChange={setSelected}
			onSortChange={setSort}
			rows={rows}
			selectedIds={selected}
			sort={sort}
			{...props}
		/>
	);
}

const args = {
	caption: 'Usuários',
	columns,
	getRowId: (u: User) => u.id,
	rows: data,
};

export const Default: Story = { args, render: () => <Demo /> };

export const SingleSelection: Story = {
	args,
	render: () => <Demo selectionMode="single" />,
};

export const Compact: Story = {
	args,
	parameters: {
		docs: {
			description: {
				story:
					'`density="compact"` reduz o espaçamento das células pelos tokens `--ads-density-*`. O atributo `data-density` em um ancestral tem o mesmo efeito.',
			},
		},
	},
	render: () => <Demo density="compact" />,
};

export const Loading: Story = { args, render: () => <Demo loading /> };

export const Empty: Story = { args, render: () => <Demo rows={[]} /> };

export const ErrorState: Story = {
	args,
	render: () => <Demo error="Verifique a conexão e tente de novo." onRetry={() => {}} />,
};

export const NarrowScroll: Story = {
	args,
	parameters: {
		docs: {
			description: {
				story:
					'Em telas estreitas a tabela rola horizontalmente em uma região focável por teclado, sem ocultar colunas.',
			},
		},
	},
	render: () => (
		<div style={{ maxWidth: '22rem' }}>
			<Demo />
		</div>
	),
};

export const WithFiltersAndPageLinks: Story = {
	args,
	render: () => (
		<Demo
			filters={
				<AdsFilterBar
					filters={[{ id: 'q', type: 'text', label: 'Busca' }]}
					onChange={() => {}}
					value={{}}
				/>
			}
			pagination={{
				page: 1,
				pageCount: 5,
				renderPageLink: (page, { children, ...linkProps }) => (
					<a href={`?page=${page}`} {...linkProps}>
						{children}
					</a>
				),
			}}
		/>
	),
};

export const DarkTheme: Story = {
	args,
	render: () => (
		<div data-theme="dark" style={{ padding: '1rem', background: 'var(--ads-color-background)' }}>
			<Demo />
		</div>
	),
};

export const PaginationFooter: Story = {
	args,
	render: () => {
		const [page, setPage] = useState(1),
			[pageSize, setPageSize] = useState(2);
		return (
			<div
				style={{ width: 'min(100%, 400px)', resize: 'horizontal', overflow: 'auto', padding: 12 }}
			>
				<AdsSmartTable
					caption="Paginação com resumo"
					columns={columns}
					rows={data.slice((page - 1) * pageSize, page * pageSize)}
					getRowId={(row) => row.id}
					pageSize={pageSize}
					pageSizeOptions={[1, 2, 4]}
					onPageSizeChange={(size) => {
						setPageSize(size);
						setPage(1);
					}}
					totalItems={data.length}
					pagination={{
						page,
						pageCount: Math.ceil(data.length / pageSize),
						onPageChange: setPage,
						showPageJump: true,
						navigationMode: 'arrows',
					}}
				/>
			</div>
		);
	},
};

const manyUsers: User[] = Array.from({ length: 10000 }, (_, i) => ({
	id: String(i + 1),
	name: `Pessoa ${i + 1}`,
	email: `pessoa${i + 1}@exemplo.com`,
	role: ['Administrador', 'Editor', 'Leitor'][i % 3]!,
	status: ['Ativo', 'Inativo', 'Pendente'][i % 3]!,
}));

export const Virtualized: Story = {
	args,
	parameters: {
		docs: {
			description: {
				story:
					'`virtualization` renderiza só as linhas visíveis (10 mil linhas aqui). Cada linha tem altura fixa (`rowHeight`), o cabeçalho fica fixo e `aria-rowcount`/`aria-rowindex` informam o total à tecnologia assistiva. Seleção e foco seguem funcionando: a linha com foco não é desmontada ao rolar.',
			},
		},
	},
	render: () => {
		const [selected, setSelected] = useState<string[]>([]);
		return (
			<AdsSmartTable<User>
				caption="Pessoas (10 mil linhas)"
				columns={columns}
				getRowId={(u) => u.id}
				getRowLabel={(u) => u.name}
				onSelectionChange={setSelected}
				rows={manyUsers}
				selectedIds={selected}
				virtualization={{ rowHeight: 44, height: 360 }}
			/>
		);
	},
};

export const ResizableColumns: Story = {
	args,
	parameters: {
		docs: {
			description: {
				story:
					'`onColumnWidthsChange` habilita uma alça por coluna (`role="separator"`): arraste com o ponteiro ou foque e use ←/→ (Shift = 50 px), Home/End para o mínimo e o máximo e Enter para restaurar a largura automática. Larguras são estado do consumidor.',
			},
		},
	},
	render: () => {
		const [widths, setWidths] = useState<Record<string, number>>({});
		return (
			<AdsSmartTable<User>
				caption="Colunas redimensionáveis"
				columns={columns.map((column) => ({ ...column, minWidth: 96, maxWidth: 480 }))}
				columnWidths={widths}
				getRowId={(u) => u.id}
				onColumnWidthsChange={setWidths}
				rows={data}
			/>
		);
	},
};

export const ExportHook: Story = {
	args,
	parameters: {
		docs: {
			description: {
				story:
					'`onExport` mostra o botão "Exportar" e emite as colunas visíveis e os dados recebidos; o formato é do consumidor. `getAdsSmartTableCsv` é um helper opcional que gera CSV, neutralizando fórmulas.',
			},
		},
	},
	render: () => {
		const [csv, setCsv] = useState('');
		const [selected, setSelected] = useState<string[]>(['2']);
		return (
			<>
				<AdsSmartTable<User>
					caption="Exportação"
					columns={columns}
					getRowId={(u) => u.id}
					getRowLabel={(u) => u.name}
					onExport={(payload) => setCsv(getAdsSmartTableCsv(payload, { onlySelected: true }))}
					onSelectionChange={setSelected}
					rows={data}
					selectedIds={selected}
				/>
				<pre aria-label="CSV gerado">{csv}</pre>
			</>
		);
	},
};
