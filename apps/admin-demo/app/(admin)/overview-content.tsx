import { AdsDashboardGrid, AdsDashboardPanel, AdsMetricCard } from '@admin-ds/admin';
import { AdsList, AdsListItem, AdsProgress, AdsTypography } from '@admin-ds/components';
import type {
	OverviewActivity,
	OverviewIndicator,
	OverviewProgress,
} from '../../lib/data/overview';

interface OverviewContentProps {
	indicators: readonly OverviewIndicator[];
	progress: readonly OverviewProgress[];
	activity: readonly OverviewActivity[];
}

/** Presentational overview: receives its data as props so it renders the same anywhere. */
export function OverviewContent({ indicators, progress, activity }: OverviewContentProps) {
	return (
		<div className="demo-page">
			<div className="demo-shell">
				<header className="demo-section">
					<p className="demo-kicker">Admin Design System</p>
					<AdsTypography as="h1" variant="heading1">
						Visão geral
					</AdsTypography>
					<AdsTypography variant="muted">
						Indicadores, progresso e atividade recente da operação.
					</AdsTypography>
				</header>

				<section aria-labelledby="overview-indicators" className="demo-section">
					<AdsTypography as="h2" id="overview-indicators" variant="heading2">
						Indicadores
					</AdsTypography>
					<div className="demo-metrics-grid">
						{indicators.map((indicator) => (
							<AdsMetricCard
								aria-label={indicator.label}
								change={indicator.change}
								description={indicator.note}
								key={indicator.id}
								role="group"
								{...(indicator.sentiment ? { sentiment: indicator.sentiment } : {})}
								sparkline={{
									label: `Evolução de ${indicator.label}, últimos 12 meses`,
									values: indicator.series,
								}}
								title={indicator.label}
								trend={indicator.trend}
								value={indicator.value}
							/>
						))}
					</div>
				</section>

				<AdsDashboardGrid className="demo-section">
					<AdsDashboardPanel
						description="Andamento das metas e importações."
						span={2}
						title="Progresso"
					>
						<div className="demo-progress-list">
							{progress.map((item) => (
								<div className="demo-progress-item" key={item.id}>
									<AdsTypography>
										{item.label}: {item.value}%
									</AdsTypography>
									<AdsProgress label={item.label} value={item.value} />
								</div>
							))}
						</div>
					</AdsDashboardPanel>
					<AdsDashboardPanel span={2} title="Atividade recente">
						<AdsList aria-label="Atividade recente">
							{activity.map((item) => (
								<AdsListItem key={item.id}>{item.text}</AdsListItem>
							))}
						</AdsList>
					</AdsDashboardPanel>
				</AdsDashboardGrid>
			</div>
		</div>
	);
}
