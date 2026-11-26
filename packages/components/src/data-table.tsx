import type {
	HTMLAttributes,
	TableHTMLAttributes,
	TdHTMLAttributes,
	ThHTMLAttributes,
} from 'react';
import { classNames } from './class-names.js';

export type AdsTableDensity = 'comfortable' | 'compact';

export interface AdsTableProps extends TableHTMLAttributes<HTMLTableElement> {
	/**
	 * Densidade das células. Só define `data-density`; sem a prop, vale a densidade herdada de um
	 * ancestral ou a confortável (padrão).
	 */
	density?: AdsTableDensity;
	/** Alterna a cor de fundo das linhas do corpo. */
	striped?: boolean;
	/** Permite quebrar texto longo nas células e reduzir a largura intrínseca. */
	wrap?: boolean;
	containerClassName?: string;
	/** HTML attributes for the scroll container, for example to make it a labelled, focusable region. */
	containerProps?: Omit<
		HTMLAttributes<HTMLDivElement>,
		'className' | 'children' | 'dangerouslySetInnerHTML'
	>;
}

export function AdsTable({
	className,
	containerClassName,
	containerProps,
	density,
	striped,
	wrap,
	...props
}: AdsTableProps) {
	return (
		<div
			{...containerProps}
			className={classNames('ads-table-container w-full overflow-x-auto', containerClassName)}
		>
			<table
				{...props}
				data-density={density}
				data-striped={striped ? '' : undefined}
				data-wrap={wrap ? '' : undefined}
				className={classNames(
					wrap
						? 'ads-table w-full border-collapse text-left text-sm text-text'
						: 'ads-table w-full min-w-max border-collapse text-left text-sm text-text',
					className,
				)}
			/>
		</div>
	);
}

export type AdsTableHeadProps = HTMLAttributes<HTMLTableSectionElement>;
export function AdsTableHead({ className, ...props }: AdsTableHeadProps) {
	return <thead {...props} className={classNames('ads-table-head bg-surface-muted', className)} />;
}

export type AdsTableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export function AdsTableBody({ className, ...props }: AdsTableBodyProps) {
	return (
		<tbody {...props} className={classNames('ads-table-body divide-y divide-border', className)} />
	);
}

export interface AdsTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
	/** Quando `false`, omite o realce de hover (cabeçalho e linhas não interativas). Padrão: `true`. */
	interactive?: boolean;
}

export function AdsTableRow({ className, interactive = true, ...props }: AdsTableRowProps) {
	return (
		<tr
			{...props}
			className={classNames(
				'ads-table-row transition-colors',
				interactive && 'hover:bg-surface-hover',
				className,
			)}
		/>
	);
}

export type AdsTableAlignment = 'start' | 'center' | 'end';

export interface AdsTableHeaderProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
	align?: AdsTableAlignment;
}

const alignment = {
	start: 'text-left',
	center: 'text-center',
	end: 'text-right',
} as const;

export function AdsTableHeader({
	align = 'start',
	className,
	scope = 'col',
	...props
}: AdsTableHeaderProps) {
	return (
		<th
			{...props}
			scope={scope}
			className={classNames(
				'ads-table-header border-b border-border px-[var(--ads-density-cell-padding-x)] py-[var(--ads-density-cell-padding-y)] font-semibold text-text-primary',
				alignment[align],
				className,
			)}
		/>
	);
}

export interface AdsTableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
	align?: AdsTableAlignment;
}

export function AdsTableCell({ align = 'start', className, ...props }: AdsTableCellProps) {
	return (
		<td
			{...props}
			className={classNames(
				'ads-table-cell px-[var(--ads-density-cell-padding-x)] py-[var(--ads-density-cell-padding-y)] align-middle',
				alignment[align],
				className,
			)}
		/>
	);
}

export type AdsTableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
export function AdsTableCaption({ className, ...props }: AdsTableCaptionProps) {
	return (
		<caption
			{...props}
			className={classNames('ads-table-caption mb-3 text-left text-sm text-text-muted', className)}
		/>
	);
}
