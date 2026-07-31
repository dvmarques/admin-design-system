'use client';

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from './class-names.js';
import { OverlayPortal, useEscapeKey, useOverlayFocus, useStableId } from './overlay-utils.js';
import { AdsTypography } from './typography.js';

interface AdsOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'title'> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: ReactNode;
	description?: ReactNode;
	closeLabel?: string;
	closeOnEscape?: boolean;
	closeOnBackdrop?: boolean;
	showCloseButton?: boolean;
}

export type AdsDialogProps = AdsOverlayProps;
export interface AdsDrawerProps extends AdsOverlayProps {
	placement?: 'left' | 'right';
}

function OverlayPanel({
	children,
	className,
	description,
	title,
	closeLabel = 'Fechar',
	closeOnBackdrop = true,
	closeOnEscape = true,
	onOpenChange,
	open,
	placement,
	role = 'dialog',
	showCloseButton = true,
	...props
}: AdsOverlayProps & { placement?: 'left' | 'right'; role?: 'dialog' | 'alertdialog' }) {
	const panelRef = useRef<HTMLDivElement>(null);
	const restoreFocusRef = useRef<HTMLElement | null>(null);
	const titleId = useStableId('ads-overlay-title');
	const descriptionId = useStableId('ads-overlay-description');
	const previousOpen = useRef(false);

	useEffect(() => {
		if (open && !previousOpen.current)
			restoreFocusRef.current = document.activeElement as HTMLElement;
		previousOpen.current = open;
	}, [open]);

	useOverlayFocus(open, panelRef, restoreFocusRef);
	useEscapeKey(open && closeOnEscape, () => onOpenChange(false));

	if (!open) return null;
	const isDrawer = Boolean(placement);
	return (
		<OverlayPortal>
			<div
				className="ads-overlay-backdrop fixed inset-0 z-40 flex bg-black/60"
				data-overlay="backdrop"
				style={{ backgroundColor: 'var(--ads-color-overlay-backdrop)' }}
				onMouseDown={(event) => {
					if (closeOnBackdrop && event.target === event.currentTarget) onOpenChange(false);
				}}
			>
				<div
					{...props}
					aria-describedby={description ? descriptionId : props['aria-describedby']}
					aria-labelledby={title ? titleId : props['aria-labelledby']}
					aria-modal="true"
					className={classNames(
						'ads-overlay-panel relative max-h-[calc(100vh-2rem)] overflow-auto border border-border bg-surface-raised p-6 font-sans text-text shadow-md outline-none',
						isDrawer
							? placement === 'left'
								? 'mr-auto h-full max-h-none w-[min(24rem,100vw)] rounded-r-lg'
								: 'ml-auto h-full max-h-none w-[min(24rem,100vw)] rounded-l-lg'
							: 'm-auto w-[min(32rem,calc(100vw-2rem))] rounded-lg',
						className,
					)}
					ref={panelRef}
					role={role}
					tabIndex={-1}
				>
					{showCloseButton ? (
						<button
							aria-label={closeLabel}
							className="absolute right-4 top-4 rounded-md p-1 text-text-muted hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
							onClick={() => onOpenChange(false)}
							type="button"
						>
							<span aria-hidden="true">×</span>
						</button>
					) : null}
					{title ? (
						<AdsTypography as="h2" className="pr-8" id={titleId} variant="heading4">
							{title}
						</AdsTypography>
					) : null}
					{description ? (
						<AdsTypography className="mt-2" id={descriptionId} variant="muted">
							{description}
						</AdsTypography>
					) : null}
					<div
						className={classNames(
							'text-sm leading-normal',
							title || description ? 'mt-5' : undefined,
						)}
					>
						{children}
					</div>
				</div>
			</div>
		</OverlayPortal>
	);
}

export function AdsDialog(props: AdsDialogProps) {
	return <OverlayPanel {...props} />;
}

export function AdsDrawer({ placement = 'right', ...props }: AdsDrawerProps) {
	return <OverlayPanel {...props} placement={placement} />;
}
