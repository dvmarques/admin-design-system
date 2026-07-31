'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from './class-names.js';
import { OverlayPortal } from './overlay-utils.js';

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
					'ads-toast fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-lg border bg-surface-raised p-4 text-text shadow-md',
					toastVariants[variant],
					className,
				)}
				data-variant={variant}
				role={isError ? 'alert' : 'status'}
			>
				<div className="min-w-0 flex-1">{children}</div>
				{dismissible ? (
					<button
						aria-label={closeLabel}
						className="shrink-0 rounded-md p-1 text-text-muted hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
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
