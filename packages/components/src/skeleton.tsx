import type { HTMLAttributes } from 'react';
import { classNames } from './class-names.js';

export interface AdsSkeletonProps extends HTMLAttributes<HTMLSpanElement> {
	/** Announces a loading region when the placeholder represents more than decorative structure. */
	label?: string;
}

/** A compositional placeholder for content with a known final shape. */
export function AdsSkeleton({ className, label, ...props }: AdsSkeletonProps) {
	return (
		<span
			{...props}
			aria-hidden={label ? undefined : true}
			aria-label={label}
			className={classNames(
				'ads-skeleton inline-block animate-pulse rounded-md bg-surface-muted motion-reduce:animate-none',
				className,
			)}
			role={label ? 'status' : undefined}
		/>
	);
}
