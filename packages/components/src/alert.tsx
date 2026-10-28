'use client';

import {
	useEffect,
	useRef,
	useState,
	type HTMLAttributes,
	type ReactNode,
	type RefObject,
} from 'react';
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
		icon: 'alertTriangle',
	},
	error: {
		box: 'bg-danger-background border-danger-border',
		foreground: 'text-danger',
		icon: 'alertCircle',
	},
} as const;

const tabbable =
	'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Next tabbable element after `root` in document order, or the last one before it. */
function neighborFocusTarget(root: HTMLElement): HTMLElement | null {
	const candidates = Array.from(root.ownerDocument.querySelectorAll<HTMLElement>(tabbable)).filter(
		(element) =>
			!root.contains(element) &&
			!element.closest('[hidden],[inert],fieldset[disabled]') &&
			element.checkVisibility?.() !== false,
	);
	const following = candidates.find(
		(element) => root.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING,
	);
	return following ?? candidates[candidates.length - 1] ?? null;
}

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
	/**
	 * Element that receives focus after the close button dismisses the alert. Without it, focus
	 * moves to the next focusable element after the alert (or the last one before it).
	 */
	returnFocusRef?: RefObject<HTMLElement | null>;
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
	returnFocusRef,
	className,
	role,
	...props
}: AdsAlertProps) {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const isControlled = open !== undefined;
	const visible = isControlled ? open : internalOpen;
	const rootRef = useRef<HTMLDivElement>(null);
	const pendingFocus = useRef<HTMLElement | null>(null);

	// Focus would fall back to <body> once the focused close button unmounts; move it to a
	// stable target, but only if nothing else claimed focus in the meantime.
	useEffect(() => {
		const restore = () => {
			const target = pendingFocus.current;
			pendingFocus.current = null;
			const doc = target?.ownerDocument;
			if (target?.isConnected && doc?.activeElement === doc?.body) target.focus();
		};
		if (!visible) restore();
		return restore;
	}, [visible]);

	if (!visible) return null;
	const variantStyle = variants[variant];
	const iconSize = appearance === 'callout' && title != null ? 'lg' : 'md';
	const visual = icon === undefined ? <AdsIcon name={variantStyle.icon} size={iconSize} /> : icon;

	function handleClose() {
		const root = rootRef.current;
		pendingFocus.current =
			root && root.contains(document.activeElement)
				? (returnFocusRef?.current ?? neighborFocusTarget(root))
				: null;
		if (!isControlled) setInternalOpen(false);
		onClose?.();
	}

	return (
		<div
			{...props}
			ref={rootRef}
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
					onBlur={(event) => {
						// A real blur (button still mounted) means the user moved on: drop the pending target.
						if (event.currentTarget.isConnected) pendingFocus.current = null;
					}}
					onClick={handleClose}
					type="button"
				>
					<AdsIcon name="close" size="sm" />
				</button>
			) : null}
		</div>
	);
}
