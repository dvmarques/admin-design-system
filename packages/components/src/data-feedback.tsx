import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from './class-names.js';

export interface AdsProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	value?: number;
	min?: number;
	max?: number;
	label?: string;
}

export function AdsProgress({
	'aria-label': ariaLabel,
	className,
	label,
	max = 100,
	min = 0,
	value,
	...props
}: AdsProgressProps) {
	if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
		throw new RangeError('AdsProgress requires finite values with max greater than min.');
	}
	if (value !== undefined && !Number.isFinite(value)) {
		throw new RangeError('AdsProgress requires a finite value when determinate.');
	}

	const effectiveValue = value === undefined ? undefined : Math.min(max, Math.max(min, value));
	const determinate = effectiveValue !== undefined;
	const percent = effectiveValue === undefined ? 50 : ((effectiveValue - min) / (max - min)) * 100;

	return (
		<div
			{...props}
			role="progressbar"
			aria-label={label ?? ariaLabel}
			aria-valuemin={determinate ? min : undefined}
			aria-valuemax={determinate ? max : undefined}
			aria-valuenow={effectiveValue}
			className={classNames(
				'ads-progress h-2 w-full overflow-hidden rounded-full bg-surface-muted',
				className,
			)}
		>
			<div
				className={classNames(
					'ads-progress-indicator h-full rounded-full bg-primary transition-[width]',
					!determinate && 'animate-pulse motion-reduce:animate-none',
				)}
				style={{ width: `${percent}%` }}
			/>
		</div>
	);
}

export interface AdsEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	title: ReactNode;
	description?: ReactNode;
	visual?: ReactNode;
	actions?: ReactNode;
}

export function AdsEmptyState({
	actions,
	className,
	description,
	title,
	visual,
	...props
}: AdsEmptyStateProps) {
	return (
		<div
			{...props}
			className={classNames(
				'ads-empty-state flex min-w-0 flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-10 text-center text-text',
				className,
			)}
		>
			{visual ? <div className="ads-empty-state-visual text-text-muted">{visual}</div> : null}
			<div className="ads-empty-state-title text-lg font-semibold text-text-primary">{title}</div>
			{description ? (
				<div className="ads-empty-state-description max-w-prose text-sm text-text-muted">
					{description}
				</div>
			) : null}
			{actions ? (
				<div className="ads-empty-state-actions mt-1 flex flex-wrap justify-center gap-2">
					{actions}
				</div>
			) : null}
		</div>
	);
}
