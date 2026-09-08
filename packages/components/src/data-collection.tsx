import type { HTMLAttributes } from 'react';
import { classNames } from './class-names.js';
import { AdsSurface, type AdsSurfaceProps } from './surface.js';

export type AdsListProps = HTMLAttributes<HTMLUListElement>;
export function AdsList({ className, ...props }: AdsListProps) {
	return (
		<ul
			{...props}
			className={classNames(
				'ads-list m-0 list-none divide-y divide-border rounded-lg border border-border bg-surface p-0 text-text',
				className,
			)}
		/>
	);
}

export type AdsListItemProps = HTMLAttributes<HTMLLIElement>;
export function AdsListItem({ className, ...props }: AdsListItemProps) {
	return (
		<li
			{...props}
			className={classNames('ads-list-item min-w-0 px-4 py-3 transition-colors hover:bg-surface-hover', className)}
		/>
	);
}

export interface AdsCardProps extends AdsSurfaceProps {}
export function AdsCard({ className, ...props }: AdsCardProps) {
	return <AdsSurface {...props} className={classNames('ads-card flex flex-col gap-4', className)} />;
}

export type AdsCardHeaderProps = HTMLAttributes<HTMLDivElement>;
export function AdsCardHeader({ className, ...props }: AdsCardHeaderProps) {
	return <div {...props} className={classNames('ads-card-header min-w-0', className)} />;
}

export type AdsCardContentProps = HTMLAttributes<HTMLDivElement>;
export function AdsCardContent({ className, ...props }: AdsCardContentProps) {
	return <div {...props} className={classNames('ads-card-content min-w-0 flex-1', className)} />;
}

export type AdsCardActionsProps = HTMLAttributes<HTMLDivElement>;
export function AdsCardActions({ className, ...props }: AdsCardActionsProps) {
	return (
		<div
			{...props}
			className={classNames('ads-card-actions flex flex-wrap items-center gap-2', className)}
		/>
	);
}
