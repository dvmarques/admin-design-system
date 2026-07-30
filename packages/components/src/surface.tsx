import type { HTMLAttributes } from 'react';
import { classNames } from './class-names.js';

const surfaceVariants = {
	neutral: 'border-border bg-surface text-text',
	raised: 'border-transparent bg-surface-raised text-text shadow-sm',
	outlined: 'border-border bg-transparent text-text',
} as const;

export type AdsSurfaceVariant = keyof typeof surfaceVariants;

export interface AdsSurfaceProps extends HTMLAttributes<HTMLDivElement> {
	variant?: AdsSurfaceVariant;
}

/** A compositional surface with no fixed width or business behavior. */
export function AdsSurface({ className, variant = 'neutral', ...props }: AdsSurfaceProps) {
	return (
		<div
			{...props}
			className={classNames(
				'ads-surface min-w-0 rounded-md border p-4',
				surfaceVariants[variant],
				className,
			)}
		/>
	);
}
