import type {
	HTMLAttributes,
	TableHTMLAttributes,
	TdHTMLAttributes,
	ThHTMLAttributes,
} from 'react';
import { classNames } from './class-names.js';

export interface AdsTableProps extends TableHTMLAttributes<HTMLTableElement> {
	containerClassName?: string;
}

export function AdsTable({ className, containerClassName, ...props }: AdsTableProps) {
	return (
		<div className={classNames('ads-table-container w-full overflow-x-auto', containerClassName)}>
			<table
				{...props}
				className={classNames(
					'ads-table w-full min-w-max border-collapse text-left text-sm text-text',
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
	return <tbody {...props} className={classNames('ads-table-body divide-y divide-border', className)} />;
}

export type AdsTableRowProps = HTMLAttributes<HTMLTableRowElement>;
export function AdsTableRow({ className, ...props }: AdsTableRowProps) {
	return (
		<tr
			{...props}
			className={classNames('ads-table-row transition-colors hover:bg-surface-hover', className)}
		/>
	);
}

export type AdsTableAlignment = 'start' | 'center' | 'end';

export interface AdsTableHeaderProps
	extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
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
				'ads-table-header border-b border-border px-4 py-3 font-semibold text-text-primary',
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
				'ads-table-cell px-4 py-3 align-middle',
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
