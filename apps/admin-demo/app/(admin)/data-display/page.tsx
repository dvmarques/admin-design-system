'use client';

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
	AdsSparkline,
	AdsTable,
	AdsTableBody,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
	AdsTypography,
} from '@dvmarques/admin-ds-components';

export default function DataDisplayPage() {
	return (
		<div className="demo-page">
			<div className="demo-shell">
				<header className="demo-section">
					<p className="demo-kicker">Data display</p>
					<AdsTypography as="h1" variant="heading1">
						Apresentação de dados administrativos
					</AdsTypography>
					<AdsTypography variant="muted">
						Exemplo consumindo somente APIs públicas de @dvmarques/admin-ds-components.
					</AdsTypography>
				</header>

				<section aria-labelledby="data-table" className="demo-section">
					<AdsTypography as="h2" id="data-table" variant="heading2">
						Clientes
					</AdsTypography>
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
					<AdsPagination page={1} pageCount={4} />
				</section>

				<section aria-labelledby="data-table-compact" className="demo-section">
					<AdsTypography as="h2" id="data-table-compact" variant="heading2">
						Densidade compacta
					</AdsTypography>
					<AdsTable aria-label="Clientes recentes (compacta)" density="compact">
						<AdsTableHead>
							<AdsTableRow>
								<AdsTableHeader>Conta</AdsTableHeader>
								<AdsTableHeader align="end">Pedidos</AdsTableHeader>
							</AdsTableRow>
						</AdsTableHead>
						<AdsTableBody>
							<AdsTableRow>
								<AdsTableCell>Helena Prado</AdsTableCell>
								<AdsTableCell align="end">18</AdsTableCell>
							</AdsTableRow>
							<AdsTableRow>
								<AdsTableCell>Otávio Reis</AdsTableCell>
								<AdsTableCell align="end">7</AdsTableCell>
							</AdsTableRow>
						</AdsTableBody>
					</AdsTable>
				</section>

				<section aria-labelledby="collections" className="demo-section">
					<AdsTypography as="h2" id="collections" variant="heading2">
						Coleções
					</AdsTypography>
					<div className="demo-foundations-grid">
						<AdsList aria-label="Atividade recente">
							<AdsListItem>Cadastro atualizado</AdsListItem>
							<AdsListItem>Pagamento confirmado</AdsListItem>
							<AdsListItem>Documento anexado</AdsListItem>
						</AdsList>
						<AdsCard>
							<AdsCardHeader>
								<AdsTypography variant="heading3">Conta empresarial</AdsTypography>
							</AdsCardHeader>
							<AdsCardContent>
								<AdsTypography variant="muted">Plano ativo com 12 usuários.</AdsTypography>
							</AdsCardContent>
							<AdsCardActions>
								<AdsButton size="sm">Gerenciar</AdsButton>
							</AdsCardActions>
						</AdsCard>
					</div>
				</section>

				<section aria-labelledby="feedback" className="demo-section">
					<AdsTypography as="h2" id="feedback" variant="heading2">
						Feedback
					</AdsTypography>
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

				<section aria-labelledby="sparkline" className="demo-section">
					<AdsTypography as="h2" id="sparkline" variant="heading2">
						Sparkline
					</AdsTypography>
					<div className="demo-foundations-grid">
						{(
							[
								['default', 'Visitas por dia', [12, 14, 13, 18, 17, 22, 25]],
								['positive', 'Pedidos por dia', [31, 34, 33, 38, 41, 40, 45]],
								['negative', 'Erros por dia', [4, 6, 5, 9, 8, 12, 14]],
							] as const
						).map(([tone, label, values]) => (
							<div key={tone}>
								<AdsTypography>{label}</AdsTypography>
								<AdsSparkline label={label} tone={tone} values={values} />
							</div>
						))}
						<div>
							<AdsTypography>Com lacunas e rótulos</AdsTypography>
							<AdsSparkline
								label="Receita semanal"
								labels={['S1', 'S2', 'S3', 'S4', 'S5', 'S6']}
								values={[8, null, 12, 11, null, 15]}
							/>
						</div>
						<div>
							<AdsTypography>Um único ponto</AdsTypography>
							<AdsSparkline label="Novo indicador" values={[7]} />
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
