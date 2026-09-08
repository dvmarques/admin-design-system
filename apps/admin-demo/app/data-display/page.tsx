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
	AdsPagination,
	AdsProgress,
	AdsTable,
	AdsTableBody,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
	AdsTypography,
} from '@admin-ds/components';

export default function DataDisplayPage() {
	return (
		<main className="demo-page">
			<div className="demo-shell">
				<header className="demo-section">
					<p className="demo-kicker">Data display</p>
					<AdsTypography as="h1" variant="heading1">Apresentação de dados administrativos</AdsTypography>
					<AdsTypography variant="muted">Exemplo consumindo somente APIs públicas de @admin-ds/components.</AdsTypography>
				</header>

				<section aria-labelledby="data-table" className="demo-section">
					<AdsTypography as="h2" id="data-table" variant="heading2">Clientes</AdsTypography>
					<AdsTable aria-label="Clientes recentes">
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
								<AdsTableCell><AdsBadge variant="success">Ativo</AdsBadge></AdsTableCell>
								<AdsTableCell align="end">18</AdsTableCell>
							</AdsTableRow>
							<AdsTableRow>
								<AdsTableCell>Rafael Lima</AdsTableCell>
								<AdsTableCell><AdsBadge variant="warning">Pendente</AdsBadge></AdsTableCell>
								<AdsTableCell align="end">7</AdsTableCell>
							</AdsTableRow>
						</AdsTableBody>
					</AdsTable>
					<AdsPagination page={1} pageCount={4} />
				</section>

				<section aria-labelledby="collections" className="demo-section">
					<AdsTypography as="h2" id="collections" variant="heading2">Coleções</AdsTypography>
					<div className="demo-foundations-grid">
						<AdsList aria-label="Atividade recente">
							<AdsListItem>Cadastro atualizado</AdsListItem>
							<AdsListItem>Pagamento confirmado</AdsListItem>
							<AdsListItem>Documento anexado</AdsListItem>
						</AdsList>
						<AdsCard>
							<AdsCardHeader><AdsTypography variant="heading3">Conta empresarial</AdsTypography></AdsCardHeader>
							<AdsCardContent><AdsTypography variant="muted">Plano ativo com 12 usuários.</AdsTypography></AdsCardContent>
							<AdsCardActions><AdsButton size="sm">Gerenciar</AdsButton></AdsCardActions>
						</AdsCard>
					</div>
				</section>

				<section aria-labelledby="feedback" className="demo-section">
					<AdsTypography as="h2" id="feedback" variant="heading2">Feedback</AdsTypography>
					<div className="demo-form">
						<div>
							<AdsTypography>Importação 65%</AdsTypography>
							<AdsProgress label="Importação" value={65} />
						</div>
						<div>
							<AdsTypography>Processando</AdsTypography>
							<AdsProgress label="Processando" />
						</div>
					</div>
					<AdsEmptyState
						title="Nenhum resultado"
						description="Ajuste os filtros para tentar novamente."
						actions={<AdsButton variant="secondary">Limpar filtros</AdsButton>}
					/>
				</section>
			</div>
		</main>
	);
}
