import {
	AdsCard,
	AdsCardContent,
	AdsCardHeader,
	AdsList,
	AdsListItem,
	AdsProgress,
	AdsTypography,
} from '@admin-ds/components';
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
							<AdsCard
								aria-labelledby={`indicator-${indicator.id}`}
								key={indicator.id}
								role="group"
							>
								<AdsCardHeader>
									<AdsTypography as="h3" id={`indicator-${indicator.id}`} variant="heading4">
										{indicator.label}
									</AdsTypography>
								</AdsCardHeader>
								<AdsCardContent>
									<p className="demo-metric-value">{indicator.value}</p>
									<AdsTypography variant="muted">{indicator.note}</AdsTypography>
								</AdsCardContent>
							</AdsCard>
						))}
					</div>
				</section>

				<section aria-labelledby="overview-progress" className="demo-section">
					<AdsTypography as="h2" id="overview-progress" variant="heading2">
						Progresso
					</AdsTypography>
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
				</section>

				<section aria-labelledby="overview-activity" className="demo-section">
					<AdsTypography as="h2" id="overview-activity" variant="heading2">
						Atividade recente
					</AdsTypography>
					<AdsList aria-label="Atividade recente">
						{activity.map((item) => (
							<AdsListItem key={item.id}>{item.text}</AdsListItem>
						))}
					</AdsList>
				</section>
			</div>
		</div>
	);
}
