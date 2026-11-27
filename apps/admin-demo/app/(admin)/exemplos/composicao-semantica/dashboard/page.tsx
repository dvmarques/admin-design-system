import Link from 'next/link';
import { AdsMetricCard } from '@dvmarques/admin-ds-admin';
import {
	AdsCard,
	AdsCardContent,
	AdsCardHeader,
	AdsPageHeader,
	AdsTypography,
} from '@dvmarques/admin-ds-components';

export default function SemanticDashboardPage() {
	return (
		<div className="demo-page">
			<div className="ads-layout-container ads-layout-page demo-semantic-page">
				<AdsPageHeader
					title="Dashboard administrativo"
					description="A estrutura da página é semântica; cards aparecem somente em indicadores e resumos autocontidos."
					actions={
						<Link className="demo-action-link" href="/exemplos/composicao-semantica/consulta">
							Consultar registros
						</Link>
					}
				/>
				<section
					aria-labelledby="dashboard-indicadores"
					className="ads-layout-stack demo-semantic-section"
				>
					<AdsTypography as="h2" id="dashboard-indicadores" variant="heading2">
						Indicadores
					</AdsTypography>
					<div className="ads-layout-grid demo-semantic-metrics">
						<AdsMetricCard title="Cadastros ativos" value="1.284" change="+8%" trend="up" />
						<AdsMetricCard title="Novos registros" value="72" change="+3%" trend="up" />
					</div>
				</section>
				<section
					aria-labelledby="dashboard-resumos"
					className="ads-layout-stack demo-semantic-section"
				>
					<AdsTypography as="h2" id="dashboard-resumos" variant="heading2">
						Resumos
					</AdsTypography>
					<AdsCard>
						<AdsCardHeader>
							<AdsTypography as="h3" variant="heading3">
								Leitura operacional
							</AdsTypography>
						</AdsCardHeader>
						<AdsCardContent>
							<AdsTypography>Os valores são fictícios e não dependem de backend.</AdsTypography>
							<div className="ads-layout-grid demo-semantic-nested">
								<div className="ads-layout-stack">
									<AdsTypography as="h4" variant="heading4">
										Atendimento
									</AdsTypography>
									<AdsTypography variant="muted">
										Consultas e solicitações são organizadas sem outro card.
									</AdsTypography>
								</div>
								<div className="ads-layout-stack">
									<AdsTypography as="h4" variant="heading4">
										Operações
									</AdsTypography>
									<AdsTypography variant="muted">
										Colunas aninhadas acompanham o espaço disponível.
									</AdsTypography>
								</div>
							</div>
						</AdsCardContent>
					</AdsCard>
				</section>
			</div>
		</div>
	);
}
