export interface OverviewIndicator {
	id: string;
	label: string;
	value: string;
	note: string;
	change: string;
	trend: 'up' | 'down' | 'neutral';
}

export interface OverviewProgress {
	id: string;
	label: string;
	value: number;
}

export interface OverviewActivity {
	id: string;
	text: string;
}

export const overviewIndicators: readonly OverviewIndicator[] = [
	{
		id: 'active-customers',
		label: 'Clientes ativos',
		value: '1.248',
		note: '32 novos neste mês',
		change: '+2,6%',
		trend: 'up',
	},
	{
		id: 'monthly-orders',
		label: 'Pedidos no mês',
		value: '3.906',
		note: 'Em relação ao mês anterior',
		change: '+8%',
		trend: 'up',
	},
	{
		id: 'recurring-revenue',
		label: 'Receita recorrente',
		value: 'R$ 184 mil',
		note: 'Meta: R$ 200 mil',
		change: '-1,2%',
		trend: 'down',
	},
];

export const overviewProgress: readonly OverviewProgress[] = [
	{ id: 'customer-import', label: 'Importação de clientes', value: 65 },
	{ id: 'revenue-goal', label: 'Meta mensal de receita', value: 92 },
];

export const overviewActivity: readonly OverviewActivity[] = [
	{ id: 'registration-updated', text: 'Cadastro de Mariana Costa atualizado' },
	{ id: 'payment-confirmed', text: 'Pagamento do pedido 3.874 confirmado' },
	{ id: 'document-attached', text: 'Documento anexado ao cliente Rafael Lima' },
	{ id: 'plan-changed', text: 'Plano da conta empresarial alterado' },
];
