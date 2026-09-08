import type { HTMLAttributes } from 'react';
import { classNames } from './class-names.js';

const badgeVariants = {
	neutral: 'border-border bg-surface-muted text-text',
	primary: 'border-transparent bg-primary text-[var(--ads-color-on-primary)]',
	success: 'border-success-border bg-success-background text-success',
	warning: 'border-warning-border bg-warning-background text-warning',
	danger: 'border-danger-border bg-danger-background text-danger',
} as const;

const badgeSizes = {
	sm: 'px-1.5 py-0.5 text-xs',
	md: 'px-2 py-0.5 text-sm',
	lg: 'px-2.5 py-1 text-sm',
} as const;

export type AdsBadgeVariant = keyof typeof badgeVariants;
export type AdsBadgeSize = keyof typeof badgeSizes;

export interface AdsBadgeProps extends HTMLAttributes<HTMLSpanElement> {
	size?: AdsBadgeSize;
	variant?: AdsBadgeVariant;
}

/** A compact textual status label. */
export function AdsBadge({ className, size = 'md', variant = 'neutral', ...props }: AdsBadgeProps) {
	return (
		<span
			{...props}
			className={classNames(
				'ads-badge inline-flex max-w-full items-center rounded-md border font-medium leading-tight',
				badgeVariants[variant],
				badgeSizes[size],
				className,
			)}
		/>
	);
}
