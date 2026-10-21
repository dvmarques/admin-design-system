export interface OverviewIndicator {
	id: string;
	label: string;
	value: string;
	note: string;
	change: string;
	trend: 'up' | 'down' | 'neutral';
	/** Cor da variação quando difere da direção (queda de cancelamentos é positiva). */
	sentiment?: 'positive' | 'negative' | 'neutral';
	/** Evolução dos últimos 12 meses, em ordem. */
	series: readonly number[];
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
		series: [1120, 1135, 1150, 1148, 1170, 1182, 1195, 1203, 1210, 1226, 1235, 1248],
	},
	{
		id: 'monthly-orders',
		label: 'Pedidos no mês',
		value: '3.906',
		note: 'Em relação ao mês anterior',
		change: '+8%',
		trend: 'up',
		series: [3320, 3410, 3380, 3490, 3560, 3600, 3585, 3670, 3720, 3810, 3850, 3906],
	},
	{
		id: 'recurring-revenue',
		label: 'Receita recorrente',
		value: 'R$ 184 mil',
		note: 'Meta: R$ 200 mil',
		change: '-1,2%',
		trend: 'down',
		series: [176, 178, 181, 183, 185, 187, 189, 188, 190, 188, 186, 184],
	},
	{
		id: 'cancellations',
		label: 'Cancelamentos',
		value: '38',
		note: 'Menos que no mês anterior',
		change: '-8%',
		trend: 'down',
		sentiment: 'positive',
		series: [52, 49, 51, 47, 46, 48, 44, 43, 45, 41, 41, 38],
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
