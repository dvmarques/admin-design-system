import {
	AdsCard,
	AdsEmptyState,
	AdsProgress,
	AdsSkeleton,
	type AdsProgressProps,
} from '@admin-ds/components';
import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from './class-names.js';

export type AdsMetricTrend = 'up' | 'down' | 'neutral';
export type AdsMetricSentiment = 'positive' | 'negative' | 'neutral';

const defaultTrendLabels: Record<AdsMetricTrend, string> = {
	up: 'Em alta',
	down: 'Em queda',
	neutral: 'Estável',
};

const defaultSentiments: Record<AdsMetricTrend, AdsMetricSentiment> = {
	up: 'positive',
	down: 'negative',
	neutral: 'neutral',
};

const trendPaths: Record<AdsMetricTrend, string> = {
	up: 'm5 15 7-7 7 7',
	down: 'm5 9 7 7 7-7',
	neutral: 'M5 12h14',
};

function TrendIcon({ trend }: { trend: AdsMetricTrend }) {
	return (
		<svg
			aria-hidden="true"
			className="ads-metric-card-trend-icon"
			fill="none"
			focusable="false"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
		>
			<path d={trendPaths[trend]} />
		</svg>
	);
}

export interface AdsDashboardEmpty {
	title: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
}

export interface AdsMetricCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	title: ReactNode;
	value?: ReactNode;
	/** Texto da variação, por exemplo "+12,4%". */
	change?: ReactNode;
	trend?: AdsMetricTrend;
	/** Texto acessível da tendência. O padrão é "Em alta", "Em queda" ou "Estável". */
	trendLabel?: string;
	/** Define a cor da variação. Por padrão, alta é positiva e queda é negativa. */
	sentiment?: AdsMetricSentiment;
	description?: ReactNode;
	progress?: AdsProgressProps;
	loading?: boolean;
	loadingLabel?: string;
	error?: ReactNode;
	empty?: ReactNode;
}

/** Card de métrica (KPI) sem regras de negócio. A tendência usa ícone e texto, nunca só cor. */
export function AdsMetricCard({
	change,
	className,
	description,
	empty,
	error,
	loading = false,
	loadingLabel = 'Carregando métrica',
	progress,
	sentiment,
	title,
	trend,
	trendLabel,
	value,
	...props
}: AdsMetricCardProps) {
	let body: ReactNode;
	if (loading) {
		body = (
			<div className="ads-metric-card-loading">
				<AdsSkeleton className="ads-metric-card-skeleton-value" label={loadingLabel} />
				<AdsSkeleton className="ads-metric-card-skeleton-change" />
			</div>
		);
	} else if (error) {
		body = (
			<p className="ads-metric-card-message" data-state="error" role="alert">
				{error}
			</p>
		);
	} else if (empty) {
		body = <p className="ads-metric-card-message">{empty}</p>;
	} else {
		body = (
			<>
				<p className="ads-metric-card-value">{value}</p>
				{trend || change ? (
					<p
						className="ads-metric-card-change"
						data-sentiment={sentiment ?? defaultSentiments[trend ?? 'neutral']}
						data-trend={trend}
					>
						{trend ? <TrendIcon trend={trend} /> : null}
						{trend ? (
							<span className="ads-dashboard-visually-hidden">
								{trendLabel ?? defaultTrendLabels[trend]}:{' '}
							</span>
						) : null}
						{change}
					</p>
				) : null}
				{description ? <p className="ads-metric-card-description">{description}</p> : null}
				{progress ? <AdsProgress {...progress} /> : null}
			</>
		);
	}

	return (
		<AdsCard
			{...props}
			aria-busy={loading || undefined}
			className={classNames('ads-metric-card', className)}
		>
			<p className="ads-metric-card-title">{title}</p>
			{body}
		</AdsCard>
	);
}

export type AdsDashboardGridProps = HTMLAttributes<HTMLDivElement>;

/** Grid responsivo de painéis. Não reordena itens: a ordem do DOM é a ordem visual. */
export function AdsDashboardGrid({ className, ...props }: AdsDashboardGridProps) {
	return <div {...props} className={classNames('ads-dashboard-grid', className)} />;
}

export type AdsDashboardPanelSpan = 1 | 2 | 3 | 4;
export type AdsDashboardPanelHeadingLevel = 2 | 3 | 4 | 5 | 6;

const headings = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;

export interface AdsDashboardPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
	title: ReactNode;
	headingLevel?: AdsDashboardPanelHeadingLevel;
	description?: ReactNode;
	actions?: ReactNode;
	/** Número de colunas ocupadas quando o grid tiver colunas suficientes. */
	span?: AdsDashboardPanelSpan;
	loading?: boolean;
	loadingLabel?: string;
	/** Mensagem de erro. O consumidor decide quando exibi-la e pode oferecer `errorActions`. */
	error?: ReactNode;
	errorActions?: ReactNode;
	empty?: AdsDashboardEmpty;
}

/** Painel de dashboard com título, ações e estados de carregamento, erro e vazio. */
export function AdsDashboardPanel({
	actions,
	children,
	className,
	description,
	empty,
	error,
	errorActions,
	headingLevel = 2,
	loading = false,
	loadingLabel = 'Carregando painel',
	span = 1,
	title,
	...props
}: AdsDashboardPanelProps) {
	const titleId = useId();
	const Heading = headings[headingLevel];
	let body: ReactNode;
	if (loading) {
		body = (
			<div className="ads-dashboard-panel-loading">
				<AdsSkeleton className="ads-dashboard-panel-skeleton" label={loadingLabel} />
				<AdsSkeleton className="ads-dashboard-panel-skeleton" />
				<AdsSkeleton className="ads-dashboard-panel-skeleton" />
			</div>
		);
	} else if (error) {
		body = (
			<div className="ads-dashboard-panel-error" role="alert">
				<p className="ads-dashboard-panel-error-message">{error}</p>
				{errorActions ? <div className="ads-dashboard-panel-actions">{errorActions}</div> : null}
			</div>
		);
	} else if (empty) {
		body = <AdsEmptyState {...empty} />;
	} else {
		body = children;
	}

	return (
		<section
			{...props}
			aria-busy={loading || undefined}
			aria-labelledby={titleId}
			className={classNames('ads-dashboard-panel', className)}
			data-span={span}
		>
			<AdsCard className="ads-dashboard-panel-card">
				<header className="ads-dashboard-panel-header">
					<div className="ads-dashboard-panel-heading">
						<Heading className="ads-dashboard-panel-title" id={titleId}>
							{title}
						</Heading>
						{description ? <p className="ads-dashboard-panel-description">{description}</p> : null}
					</div>
					{actions ? <div className="ads-dashboard-panel-actions">{actions}</div> : null}
				</header>
				<div className="ads-dashboard-panel-body">{body}</div>
			</AdsCard>
		</section>
	);
}
