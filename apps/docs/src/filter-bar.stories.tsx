import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsFilterBar,
	type AdsFilterBarProps,
	type AdsFilterDefinition,
	type AdsFilterValues,
} from '@admin-ds/admin';

const filters: AdsFilterDefinition[] = [
	{ id: 'q', type: 'text', label: 'Busca', placeholder: 'Nome ou e-mail' },
	{
		id: 'status',
		type: 'select',
		label: 'Status',
		options: [
			{ value: 'ativo', label: 'Ativo' },
			{ value: 'inativo', label: 'Inativo' },
			{ value: 'pendente', label: 'Pendente' },
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
	{ id: 'periodo', type: 'date-range', label: 'Período de acesso' },
];

const meta = {
	title: 'Layout/FilterBar',
	component: AdsFilterBar,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Barra de filtros administrativos controlada pelo consumidor (`value` e `onChange`). Combina texto, seleção, seleção múltipla e data, mostra os filtros ativos como chips removíveis e recolhe os campos em telas estreitas. A biblioteca só emite o estado do filtro: não consulta dados, não acessa a URL nem o roteador.',
			},
		},
	},
} satisfies Meta<typeof AdsFilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({
	initial = {},
	...props
}: { initial?: AdsFilterValues } & Partial<Omit<AdsFilterBarProps, 'onChange' | 'value'>>) {
	const [value, setValue] = useState<AdsFilterValues>(initial);
	return (
		<div style={{ display: 'grid', gap: '1rem' }}>
			<AdsFilterBar filters={filters} onChange={setValue} value={value} {...props} />
			<pre aria-label="Estado emitido">{JSON.stringify(value, null, 2)}</pre>
		</div>
	);
}

const active: AdsFilterValues = {
	q: 'ana',
	status: 'ativo',
	perfis: ['admin', 'editor'],
	periodo: { start: '2026-03-01', end: '2026-03-31' },
};

export const Default: Story = {
	args: { filters, onChange: () => {}, value: {} },
	render: () => <Controlled />,
};

export const WithActiveFilters: Story = {
	args: { filters, onChange: () => {}, value: active },
	render: () => <Controlled initial={active} />,
};

export const NarrowCollapsed: Story = {
	args: { filters, onChange: () => {}, value: active },
	parameters: {
		docs: {
			description: {
				story:
					'Em telas estreitas os campos ficam atrás do botão "Filtros"; os filtros ativos continuam visíveis.',
			},
		},
	},
	render: () => (
		<div style={{ maxWidth: '22rem' }}>
			<Controlled initial={active} />
		</div>
	),
};

export const Disabled: Story = {
	args: { filters, onChange: () => {}, value: active },
	render: () => <Controlled disabled initial={active} />,
};

export const Loading: Story = {
	args: { filters, onChange: () => {}, value: active },
	render: () => <Controlled initial={active} loading />,
};

export const WithFieldError: Story = {
	args: { filters, onChange: () => {}, value: { q: 'a' } },
	render: () => (
		<AdsFilterBar
			filters={[
				{ id: 'q', type: 'text', label: 'Busca', error: 'Digite ao menos 3 caracteres.' },
				...filters.slice(1, 2),
			]}
			onChange={() => {}}
			value={{ q: 'a' }}
		/>
	),
};
