'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from './class-names.js';
import { OverlayPortal } from './overlay-utils.js';
import { AdsTypography } from './typography.js';

const toastVariants = {
	info: 'border-primary',
	success: 'border-success',
	warning: 'border-warning',
	error: 'border-danger',
} as const;

export type AdsToastVariant = keyof typeof toastVariants;

export interface AdsToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	children: ReactNode;
	variant?: AdsToastVariant;
	open?: boolean;
	onClose?: () => void;
	closeLabel?: string;
	dismissible?: boolean;
}

export function AdsToast({
	children,
	className,
	closeLabel = 'Fechar notificação',
	dismissible = true,
	onClose,
	open = true,
	variant = 'info',
	...props
}: AdsToastProps) {
	if (!open) return null;
	const isError = variant === 'error';
	return (
		<OverlayPortal>
			<div
				{...props}
				aria-atomic="true"
				aria-live={isError ? 'assertive' : 'polite'}
				className={classNames(
					'ads-toast fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-lg border bg-surface-raised p-4 font-sans text-text shadow-md',
					toastVariants[variant],
					className,
				)}
				data-variant={variant}
				role={isError ? 'alert' : 'status'}
			>
				<AdsTypography as="div" className="min-w-0 flex-1" variant="bodySmall">
					{children}
				</AdsTypography>
				{dismissible ? (
					<button
						aria-label={closeLabel}
						className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-lg leading-none text-text hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
						onClick={onClose}
						type="button"
					>
						<span aria-hidden="true">×</span>
					</button>
				) : null}
			</div>
		</OverlayPortal>
	);
}
