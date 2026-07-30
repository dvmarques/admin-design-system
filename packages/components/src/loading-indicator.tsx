import type { HTMLAttributes } from 'react';
import { classNames } from './class-names.js';

const loadingIndicatorSizes = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
} as const;

export type AdsLoadingIndicatorSize = keyof typeof loadingIndicatorSizes;

export interface AdsLoadingIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'role'> {
	label?: string;
	size?: AdsLoadingIndicatorSize;
}

/** Communicates indeterminate progress without requiring a client-side boundary. */
export function AdsLoadingIndicator({
	className,
	label = 'Carregando',
	size = 'md',
	...props
}: AdsLoadingIndicatorProps) {
	return (
		<span
			{...props}
			aria-label={label}
			className={classNames('ads-loading-indicator inline-flex text-current', className)}
			role="status"
		>
			<svg
				aria-hidden="true"
				className={classNames(
					'animate-spin motion-reduce:animate-none',
					loadingIndicatorSizes[size],
				)}
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-75"
					d="M4 12a8 8 0 0 1 8-8"
					stroke="currentColor"
					strokeLinecap="round"
					strokeWidth="4"
				/>
			</svg>
		</span>
	);
}
