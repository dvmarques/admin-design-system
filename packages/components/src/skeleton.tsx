import type { HTMLAttributes } from 'react';
import { classNames } from './class-names.js';

export interface AdsSkeletonProps extends HTMLAttributes<HTMLSpanElement> {
	/** Announces a loading region when the placeholder represents more than decorative structure. */
	label?: string;
	/** Altura pelos tokens `--ads-skeleton-height-*`. Sem a prop, as dimensões vêm de `className`. */
	variant?: 'text' | 'value' | 'block';
}

/** A compositional placeholder for content with a known final shape. */
export function AdsSkeleton({ className, label, variant, ...props }: AdsSkeletonProps) {
	return (
		<span
			{...props}
			aria-hidden={label ? undefined : true}
			aria-label={label}
			data-variant={variant}
			className={classNames(
				'ads-skeleton inline-block animate-pulse rounded-md bg-surface-muted motion-reduce:animate-none',
				className,
			)}
			role={label ? 'status' : undefined}
		/>
	);
}
