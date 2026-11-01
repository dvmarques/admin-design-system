import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { classNames } from './class-names.js';
import { AdsLoadingIndicator } from './loading-indicator.js';

const buttonVariants = {
	primary:
		'border-transparent bg-primary text-[var(--ads-color-on-primary)] hover:bg-primary-hover',
	secondary: 'border-border bg-surface text-text hover:border-border-strong hover:bg-surface-hover',
	danger: 'border-transparent bg-danger text-[var(--ads-color-on-primary)] hover:bg-danger-hover',
	ghost: 'border-transparent bg-transparent text-text hover:bg-surface-hover',
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

// Native buttons do not inherit the page font (the library ships without Tailwind's preflight).
const buttonBase =
	'ads-button inline-flex items-center justify-center gap-2 rounded-md border [font-family:inherit] font-medium transition-[background-color,color,border-color,box-shadow,filter,transform] duration-[var(--ads-motion-normal)] ease-[var(--ads-motion-easing)] hover:-translate-y-px active:translate-y-px active:scale-[0.99] active:brightness-95 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring-offset disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

/** Internal: the button look for non-button elements (consumer links); not part of the public API. */
export function adsButtonClassName(variant: AdsButtonVariant, size: AdsButtonSize) {
	return classNames(buttonBase, buttonVariants[variant], buttonSizes[size]);
}

/** A native button with design-system variants, sizes, and loading state. */
export const AdsButton = forwardRef<HTMLButtonElement, AdsButtonProps>(function AdsButton(
	{
		children,
		className,
		disabled = false,
		isLoading = false,
		loadingLabel = 'Carregando',
		size = 'md',
		type = 'button',
		variant = 'primary',
		...props
	}: AdsButtonProps,
	ref,
) {
	return (
		<button
			{...props}
			aria-busy={isLoading || undefined}
			className={classNames(adsButtonClassName(variant, size), className)}
			disabled={disabled || isLoading}
			ref={ref}
			type={type}
		>
			<span className="grid">
				<span
					className={classNames(
						'inline-flex items-center gap-2 [grid-area:1/1]',
						isLoading && 'opacity-0',
					)}
				>
					{children}
				</span>
				{isLoading ? (
					<AdsLoadingIndicator
						aria-hidden="true"
						className="m-auto [grid-area:1/1]"
						label={loadingLabel}
						size="sm"
					/>
				) : null}
			</span>
		</button>
	);
});
