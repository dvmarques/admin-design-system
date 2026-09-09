import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsBadge,
	AdsButton,
	AdsCard,
	AdsCardActions,
	AdsCardContent,
	AdsCardHeader,
	AdsEmptyState,
	AdsList,
	AdsListItem,
	AdsProgress,
	AdsTable,
	AdsTableBody,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
} from '@admin-ds/components';

const meta = { title: 'Data display/Components', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Table: Story = {
	render: () => (
		<AdsTable aria-label="Clientes">
			<AdsTableHead>
				<AdsTableRow>
					<AdsTableHeader>Cliente</AdsTableHeader>
					<AdsTableHeader>Status</AdsTableHeader>
					<AdsTableHeader align="end">Pedidos</AdsTableHeader>
				</AdsTableRow>
			</AdsTableHead>
			<AdsTableBody>
				<AdsTableRow>
					<AdsTableCell>Mariana Costa</AdsTableCell>
					<AdsTableCell>
						<AdsBadge variant="success">Ativo</AdsBadge>
					</AdsTableCell>
					<AdsTableCell align="end">18</AdsTableCell>
				</AdsTableRow>
				<AdsTableRow>
					<AdsTableCell>Rafael Lima</AdsTableCell>
					<AdsTableCell>
						<AdsBadge variant="warning">Pendente</AdsBadge>
					</AdsTableCell>
					<AdsTableCell align="end">7</AdsTableCell>
				</AdsTableRow>
			</AdsTableBody>
		</AdsTable>
	),
};

export const Collections: Story = {
	render: () => (
		<div className="grid gap-4 md:grid-cols-2">
			<AdsList aria-label="Atividades recentes">
				<AdsListItem>Cadastro atualizado</AdsListItem>
				<AdsListItem>Pagamento confirmado</AdsListItem>
				<AdsListItem>Documento anexado</AdsListItem>
			</AdsList>
			<AdsCard>
				<AdsCardHeader>
					<strong>Conta empresarial</strong>
				</AdsCardHeader>
				<AdsCardContent>Plano ativo com 12 usuários.</AdsCardContent>
				<AdsCardActions>
					<AdsButton size="sm">Gerenciar</AdsButton>
				</AdsCardActions>
			</AdsCard>
		</div>
	),
};

export const Feedback: Story = {
	render: () => (
		<div className="grid max-w-xl gap-6">
			<div className="grid gap-2">
				<span>Importação 65%</span>
				<AdsProgress label="Importação" value={65} />
			</div>
			<div className="grid gap-2">
				<span>Processando</span>
				<AdsProgress label="Processando" />
			</div>
			<AdsEmptyState
				title="Nenhum resultado"
				description="Ajuste os filtros ou limpe a busca para visualizar registros."
				actions={<AdsButton variant="secondary">Limpar filtros</AdsButton>}
			/>
		</div>
	),
};
