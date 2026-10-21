import type { SVGAttributes } from 'react';
import { classNames } from './class-names.js';

export type AdsSparklineTone = 'default' | 'positive' | 'negative';

export interface AdsSparklineProps extends Omit<
	SVGAttributes<SVGSVGElement>,
	'children' | 'max' | 'min' | 'values'
> {
	/** Série em ordem. Valores não finitos são ignorados, mantendo a posição dos demais. */
	values: readonly (number | null | undefined)[];
	/** Limites da escala vertical. Sem eles, valem o mínimo e o máximo da série. */
	min?: number;
	max?: number;
	/** Um texto por posição de `values`; o primeiro e o último ponto válidos entram no resumo. */
	labels?: readonly string[];
	/** Cor do traço: `chart1`, `success` ou `danger`. A cor nunca é a única informação. */
	tone?: AdsSparklineTone;
	/** Nome da série no texto acessível. Padrão: "Tendência". */
	label?: string;
	/** Substitui o texto acessível inteiro. */
	summary?: string;
	/** Formata os valores do texto acessível. Padrão: `Intl.NumberFormat('pt-BR')`. */
	formatValue?: (value: number) => string;
}

const width = 100;
const height = 32;
const padding = 4;
const defaultFormat = new Intl.NumberFormat('pt-BR');

interface Point {
	index: number;
	value: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

function describe(
	points: readonly Point[],
	labels: readonly string[] | undefined,
	name: string,
	format: (value: number) => string,
) {
	const first = points[0] as Point;
	const last = points[points.length - 1] as Point;
	if (points.length === 1) return `${name}: 1 ponto, valor ${format(first.value)}.`;
	const at = (point: Point) => {
		const text = labels?.[point.index];
		return text ? `${format(point.value)} (${text})` : format(point.value);
	};
	const numbers = points.map((point) => point.value);
	return `${name}: ${points.length} pontos, de ${at(first)} a ${at(last)}, mínimo ${format(
		Math.min(...numbers),
	)}, máximo ${format(Math.max(...numbers))}.`;
}

/** Gráfico de linha minúsculo em SVG, sem eixos e sem animação, renderizável no servidor. */
export function AdsSparkline({
	className,
	formatValue = defaultFormat.format,
	label = 'Tendência',
	labels,
	max,
	min,
	summary,
	tone = 'default',
	values,
	...props
}: AdsSparklineProps) {
	const points: Point[] = [];
	values.forEach((value, index) => {
		if (typeof value === 'number' && Number.isFinite(value)) points.push({ index, value });
	});
	if (points.length === 0) return null;

	const numbers = points.map((point) => point.value);
	const lower = min !== undefined && Number.isFinite(min) ? min : Math.min(...numbers);
	const upper = max !== undefined && Number.isFinite(max) ? max : Math.max(...numbers);
	const span = upper - lower;
	const lastIndex = Math.max(values.length - 1, 1);
	const coordinates = points.map(({ index, value }) => {
		const ratio = span > 0 ? Math.min(1, Math.max(0, (value - lower) / span)) : 0.5;
		return {
			x: round(values.length === 1 ? width / 2 : (index / lastIndex) * width),
			y: round(padding + (1 - ratio) * (height - padding * 2)),
		};
	});
	const end = coordinates[coordinates.length - 1] as { x: number; y: number };

	return (
		<svg
			{...props}
			aria-label={summary ?? describe(points, labels, label, formatValue)}
			className={classNames('ads-sparkline', className)}
			data-tone={tone}
			focusable="false"
			preserveAspectRatio="none"
			role="img"
			viewBox={`0 0 ${width} ${height}`}
		>
			{coordinates.length > 1 ? (
				<path
					className="ads-sparkline-line"
					d={`M${coordinates.map(({ x, y }) => `${x} ${y}`).join('L')}`}
				/>
			) : null}
			<path className="ads-sparkline-dot" d={`M${end.x} ${end.y}h0`} />
		</svg>
	);
}
