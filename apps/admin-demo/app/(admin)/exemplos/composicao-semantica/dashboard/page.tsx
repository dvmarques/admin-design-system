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
			<div className="demo-shell demo-semantic-stack">
				<AdsPageHeader
					title="Dashboard administrativo"
					description="A estrutura da página é semântica; cards aparecem somente em indicadores e resumos autocontidos."
					actions={
						<Link className="demo-action-link" href="/exemplos/composicao-semantica/consulta">
							Consultar registros
						</Link>
					}
				/>
				<section aria-labelledby="dashboard-indicadores" className="demo-semantic-section">
					<AdsTypography as="h2" id="dashboard-indicadores" variant="heading2">
						Indicadores
					</AdsTypography>
					<div className="demo-metrics-grid">
						<AdsMetricCard title="Cadastros ativos" value="1.284" change="+8%" trend="up" />
						<AdsMetricCard title="Novos registros" value="72" change="+3%" trend="up" />
					</div>
				</section>
				<section aria-labelledby="dashboard-resumos" className="demo-semantic-section">
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
						</AdsCardContent>
					</AdsCard>
				</section>
			</div>
		</div>
	);
}
