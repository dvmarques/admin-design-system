'use client';

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from './class-names.js';
import { AdsIcon } from './icon.js';

const variants = {
	info: { box: 'bg-info-background border-info-border', foreground: 'text-info', icon: 'info' },
	success: {
		box: 'bg-success-background border-success-border',
		foreground: 'text-success',
		icon: 'check',
	},
	warning: {
		box: 'bg-warning-background border-warning-border',
		foreground: 'text-warning',
		icon: 'info',
	},
	error: {
		box: 'bg-danger-background border-danger-border',
		foreground: 'text-danger',
		icon: 'info',
	},
} as const;

export type AdsAlertVariant = keyof typeof variants;
export type AdsAlertAppearance = 'compact' | 'callout';

export interface AdsAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onClose'> {
	title?: ReactNode;
	children?: ReactNode;
	actions?: ReactNode;
	icon?: ReactNode | null;
	variant?: AdsAlertVariant;
	appearance?: AdsAlertAppearance;
	dismissible?: boolean;
	closeLabel?: string;
	open?: boolean;
	defaultOpen?: boolean;
	onClose?: () => void;
}

/** Persistent inline feedback. Unlike AdsToast, this never uses a portal or a timeout. */
export function AdsAlert({
	title,
	children,
	actions,
	icon,
	variant = 'info',
	appearance = 'compact',
	dismissible = false,
	closeLabel = 'Fechar mensagem',
	open,
	defaultOpen = true,
	onClose,
	className,
	role,
	...props
}: AdsAlertProps) {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const isControlled = open !== undefined;
	const visible = isControlled ? open : internalOpen;
	if (!visible) return null;
	const variantStyle = variants[variant];
	const iconSize = appearance === 'callout' && title != null ? 'lg' : 'md';
	const visual = icon === undefined ? <AdsIcon name={variantStyle.icon} size={iconSize} /> : icon;

	function handleClose() {
		if (!isControlled) setInternalOpen(false);
		onClose?.();
	}

	return (
		<div
			{...props}
			className={classNames(
				'ads-alert flex min-w-0 items-start gap-3 rounded-lg border font-sans text-text',
				appearance === 'callout' ? 'p-5 max-sm:p-4' : 'p-3',
				variantStyle.box,
				className,
			)}
			data-appearance={appearance}
			data-variant={variant}
			role={role ?? (variant === 'error' ? 'alert' : 'status')}
		>
			{visual == null ? null : (
				<span
					className={classNames('ads-alert-icon mt-0.5 shrink-0', variantStyle.foreground)}
					aria-hidden="true"
				>
					{visual}
				</span>
			)}
			<div className="ads-alert-body min-w-0 flex-1">
				{title == null ? null : (
					<div className="ads-alert-title font-semibold text-text-primary">{title}</div>
				)}
				{children == null ? null : (
					<div className="ads-alert-description text-sm text-text">{children}</div>
				)}
				{actions == null ? null : (
					<div className="ads-alert-actions mt-3 flex flex-wrap items-center gap-2">{actions}</div>
				)}
			</div>
			{dismissible ? (
				<button
					aria-label={closeLabel}
					className="ads-alert-close -mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent bg-transparent text-text-muted hover:bg-overlay-close-background-hover hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
					onClick={handleClose}
					type="button"
				>
					<AdsIcon name="close" size="sm" />
				</button>
			) : null}
		</div>
	);
}
