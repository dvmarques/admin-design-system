import type { ButtonHTMLAttributes } from 'react';
import { classNames } from './class-names.js';
import { AdsLoadingIndicator } from './loading-indicator.js';

const buttonVariants = {
	primary:
		'border-transparent bg-primary text-[var(--ads-color-on-primary)] hover:bg-primary-hover',
	secondary: 'border-border bg-surface text-text hover:bg-surface-raised',
	danger: 'border-transparent bg-danger text-[var(--ads-color-on-primary)] hover:brightness-90',
	ghost: 'border-transparent bg-transparent text-text hover:bg-surface-raised',
} as const;

const buttonSizes = {
	sm: 'min-h-[var(--ads-dimension-control-sm)] px-3 text-sm',
	md: 'min-h-[var(--ads-dimension-control-md)] px-4 text-sm',
	lg: 'min-h-[var(--ads-dimension-control-lg)] px-5 text-sm',
} as const;

export type AdsButtonVariant = keyof typeof buttonVariants;
export type AdsButtonSize = keyof typeof buttonSizes;

export interface AdsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
	loadingLabel?: string;
	size?: AdsButtonSize;
	variant?: AdsButtonVariant;
}

/** A native button with design-system variants, sizes, and loading state. */
export function AdsButton({
	children,
	className,
	disabled = false,
	isLoading = false,
	loadingLabel = 'Carregando',
	size = 'md',
	type = 'button',
	variant = 'primary',
	...props
}: AdsButtonProps) {
	return (
		<button
			{...props}
			aria-busy={isLoading || undefined}
			className={classNames(
				'ads-button inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-[background-color,color,border-color,box-shadow] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
				buttonVariants[variant],
				buttonSizes[size],
				className,
			)}
			disabled={disabled || isLoading}
			type={type}
		>
			{isLoading ? <AdsLoadingIndicator aria-hidden="true" label={loadingLabel} size="sm" /> : null}
			{children}
		</button>
	);
}
