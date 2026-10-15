import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsDashboardGrid, AdsDashboardPanel, AdsMetricCard } from '@admin-ds/admin';
import { AdsButton, AdsEmptyState } from '@admin-ds/components';

const meta = {
	title: 'Layout/Dashboard',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Padrões de dashboard sem regras de negócio: `AdsMetricCard` (valor, variação e tendência por ícone e texto), `AdsDashboardGrid` (colunas pela largura disponível do grid, via container query, preservando a ordem do DOM) e `AdsDashboardPanel` (largura variável e estados de carregamento, erro e vazio). Gráficos ficam fora do escopo; o consumidor decide quando cada estado é exibido.',
			},
		},
	},
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<AdsDashboardGrid>
			<AdsMetricCard
				change="+12,4%"
				description="vs. mês anterior"
				title="Receita"
				trend="up"
				value="R$ 48.200"
			/>
			<AdsMetricCard change="-3,1%" title="Clientes ativos" trend="down" value="1.284" />
			<AdsMetricCard
				change="+2,0%"
				sentiment="negative"
				title="Cancelamentos"
				trend="up"
				trendLabel="Em alta (piora)"
				value="38"
			/>
			<AdsMetricCard
				change="0%"
				progress={{ label: 'Meta mensal', value: 64 }}
				title="Meta mensal"
				trend="neutral"
				value="64%"
			/>
			<AdsDashboardPanel
				actions={
					<AdsButton size="sm" variant="secondary">
						Exportar
					</AdsButton>
				}
				description="Últimos 30 dias"
				span={3}
				title="Pedidos recentes"
			>
				<p>Conteúdo composto pela aplicação.</p>
			</AdsDashboardPanel>
			<AdsDashboardPanel span={1} title="Atividade">
				<p>Painel de uma coluna.</p>
			</AdsDashboardPanel>
		</AdsDashboardGrid>
	),
};

export const States: Story = {
	name: 'Carregamento, erro e vazio',
	render: () => (
		<AdsDashboardGrid>
			<AdsMetricCard loading title="Receita" />
			<AdsMetricCard error="Não foi possível carregar." title="Clientes" />
			<AdsMetricCard empty="Sem dados no período." title="Pedidos" />
			<AdsDashboardPanel loading span={2} title="Vendas" />
			<AdsDashboardPanel
				error="Não foi possível carregar o painel."
				errorActions={<AdsButton size="sm">Tentar novamente</AdsButton>}
				span={2}
				title="Faturas"
			/>
			<AdsDashboardPanel
				empty={
					<AdsEmptyState
						description="Nenhum registro no período selecionado."
						title="Nada por aqui"
					/>
				}
				span={4}
				title="Atividade recente"
			/>
		</AdsDashboardGrid>
	),
};
