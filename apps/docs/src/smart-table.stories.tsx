import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsFilterBar,
	AdsSmartTable,
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
					'Tabela administrativa controlada pelo consumidor, composta sobre `AdsTable` e `AdsPagination`. Ordenação (`sort`), seleção (`selectedIds`) e colunas (`hiddenColumnIds`) são estado do consumidor; a biblioteca não busca, ordena nem pagina dados. O consumidor fornece as linhas já processadas.',
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
