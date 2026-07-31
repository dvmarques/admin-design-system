'use client';

import {
	cloneElement,
	useEffect,
	useRef,
	useState,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';
import {
	OverlayPortal,
	useAnchoredPosition,
	useClickOutside,
	useEscapeKey,
	useStableId,
} from './overlay-utils.js';
import { AdsTypography } from './typography.js';

const tooltipArrowPlacements = {
	top: '-bottom-1 left-1/2 -translate-x-1/2',
	right: '-left-1 top-1/2 -translate-y-1/2',
	bottom: '-top-1 left-1/2 -translate-x-1/2',
	left: '-right-1 top-1/2 -translate-y-1/2',
} as const;

export type AdsOverlayPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface AdsTooltipProps {
	children: ReactElement;
	content: ReactNode;
	placement?: AdsOverlayPlacement;
	className?: string;
}

export interface AdsPopoverProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'content'
> {
	children: ReactElement;
	content: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	placement?: AdsOverlayPlacement;
}

export function AdsTooltip({ children, className, content, placement = 'top' }: AdsTooltipProps) {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLSpanElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const tooltipId = useStableId('ads-tooltip');
	const position = useAnchoredPosition(open, anchorRef, contentRef, placement);
	const trigger = cloneElement(children, (open ? { 'aria-describedby': tooltipId } : {}) as never);

	return (
		<span
			className="ads-tooltip-anchor inline-flex"
			onBlur={() => setOpen(false)}
			onFocus={() => setOpen(true)}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			ref={anchorRef}
		>
			{trigger}
			{open ? (
				<OverlayPortal>
					<div
						className={classNames(
							'ads-tooltip fixed z-50 max-w-[min(20rem,calc(100vw-1rem))] rounded-md bg-surface-raised px-3 py-2 font-sans text-text shadow-md',
							className,
						)}
						data-placement={placement}
						id={tooltipId}
						ref={contentRef}
						role="tooltip"
						style={position}
					>
						<span
							aria-hidden="true"
							className={classNames(
								'absolute h-2 w-2 rotate-45 bg-surface-raised',
								tooltipArrowPlacements[placement],
							)}
						/>
						<AdsTypography as="div" variant="bodySmall">
							{content}
						</AdsTypography>
					</div>
				</OverlayPortal>
			) : null}
		</span>
	);
}

export function AdsPopover({
	children,
	className,
	content,
	onOpenChange,
	open,
	placement = 'bottom',
	...props
}: AdsPopoverProps) {
	const anchorRef = useRef<HTMLSpanElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const restoreFocusRef = useRef<HTMLElement | null>(null);
	const previousOpen = useRef(false);
	const popoverId = useStableId('ads-popover');
	const position = useAnchoredPosition(open, anchorRef, contentRef, placement);

	useEffect(() => {
		if (open && !previousOpen.current)
			restoreFocusRef.current = document.activeElement as HTMLElement;
		if (!open && previousOpen.current) restoreFocusRef.current?.focus();
		previousOpen.current = open;
	}, [open]);

	useEscapeKey(open, () => onOpenChange(false));
	useClickOutside(open, contentRef, (event) => {
		if (!(event.target instanceof Node) || !anchorRef.current?.contains(event.target)) {
			onOpenChange(false);
		}
	});

	const trigger = cloneElement(children, {
		'aria-controls': open ? popoverId : undefined,
		'aria-expanded': open,
	} as never);

	return (
		<span
			className="ads-popover-anchor inline-flex"
			onClick={() => onOpenChange(!open)}
			ref={anchorRef}
		>
			{trigger}
			{open ? (
				<OverlayPortal>
					<div
						{...props}
						className={classNames(
							'ads-popover fixed z-50 max-w-[min(24rem,calc(100vw-1rem))] rounded-lg border border-border bg-surface-raised p-4 text-text shadow-md',
							className,
						)}
						id={popoverId}
						ref={contentRef}
						role="dialog"
						style={position}
					>
						{content}
					</div>
				</OverlayPortal>
			) : null}
		</span>
	);
}
