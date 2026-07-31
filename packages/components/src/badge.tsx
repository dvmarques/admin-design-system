import type { HTMLAttributes } from 'react';
import { classNames } from './class-names.js';

const badgeVariants = {
	neutral: 'border-border bg-surface-muted text-text',
	primary: 'border-transparent bg-primary text-[var(--ads-color-on-primary)]',
	success: 'border-transparent bg-success text-[var(--ads-color-on-primary)]',
	warning: 'border-transparent bg-warning text-text',
	danger: 'border-transparent bg-danger text-[var(--ads-color-on-primary)]',
} as const;

const badgeSizes = {
	sm: 'min-h-6 px-2 py-0.5 text-xs',
	md: 'min-h-8 px-2.5 py-1 text-sm',
	lg: 'min-h-10 px-3 py-1.5 text-sm',
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
				'ads-badge inline-flex max-w-full items-center rounded-full border font-medium leading-tight',
				badgeVariants[variant],
				badgeSizes[size],
				className,
			)}
		/>
	);
}
