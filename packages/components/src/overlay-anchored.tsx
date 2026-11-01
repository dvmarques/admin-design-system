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
	isInsideTrigger,
	useStableId,
} from './overlay-utils.js';
import { AdsTypography } from './typography.js';

const tooltipArrowPlacements = {
	top: '-bottom-1 -translate-x-1/2',
	right: '-left-1 -translate-y-1/2',
	bottom: '-top-1 -translate-x-1/2',
	left: '-right-1 -translate-y-1/2',
} as const;

export type AdsOverlayPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface AdsTooltipProps {
	children: ReactElement;
	content: ReactNode;
	placement?: AdsOverlayPlacement;
	className?: string;
	/** Com `false`, só o apontamento abre o tooltip; o gatilho mantém seu nome acessível. */
	showOnFocus?: boolean;
	/** Com `false`, o gatilho não recebe `aria-describedby`: use quando o tooltip repete o nome acessível. */
	describeTrigger?: boolean;
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

export function AdsTooltip({
	children,
	className,
	content,
	describeTrigger = true,
	placement = 'top',
	showOnFocus = true,
}: AdsTooltipProps) {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLSpanElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const tooltipId = useStableId('ads-tooltip');
	const position = useAnchoredPosition(open, anchorRef, contentRef, placement);
	// Dispensa o tooltip sem mover o foco: o gatilho só o reabre com um novo foco ou apontamento.
	useEscapeKey(open, () => setOpen(false));
	const consumerIds = (children.props as { 'aria-describedby'?: string })['aria-describedby']
		?.split(/\s+/)
		.filter(Boolean);
	const describedBy = [...new Set([...(consumerIds ?? []), tooltipId])].join(' ');
	const trigger = cloneElement(
		children,
		(open && describeTrigger ? { 'aria-describedby': describedBy } : {}) as never,
	);

	return (
		<span
			className="ads-tooltip-anchor inline-flex"
			onBlur={() => setOpen(false)}
			onFocus={() => setOpen(showOnFocus)}
			onPointerEnter={() => setOpen(true)}
			onPointerLeave={() => setOpen(false)}
			ref={anchorRef}
		>
			{trigger}
			{open ? (
				<OverlayPortal>
					<div
						className={classNames(
							'ads-tooltip fixed z-[var(--ads-layer-overlay)] max-w-[min(20rem,calc(100vw-1rem))] rounded-lg border border-border bg-surface-raised px-3 py-2 font-sans text-text shadow-md',
							className,
						)}
						data-placement={position.placement}
						id={tooltipId}
						ref={position.attachContent}
						role="tooltip"
						style={position.style}
					>
						<span
							aria-hidden="true"
							className={classNames(
								'absolute h-2 w-2 rotate-45 bg-surface-raised',
								tooltipArrowPlacements[position.placement],
							)}
							style={
								position.placement === 'top' || position.placement === 'bottom'
									? { left: position.arrowOffset }
									: { top: position.arrowOffset }
							}
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
		if (!(event.target instanceof Node) || !isInsideTrigger(anchorRef.current, event.target)) {
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
			onClick={(event) => {
				// React events from the portalled panel also bubble through this anchor.
				if (event.target instanceof Node && isInsideTrigger(event.currentTarget, event.target)) {
					onOpenChange(!open);
				}
			}}
			ref={anchorRef}
		>
			{trigger}
			{open ? (
				<OverlayPortal>
					<div
						{...props}
						className={classNames(
							'ads-popover fixed z-[var(--ads-layer-overlay)] max-w-[min(24rem,calc(100vw-1rem))] rounded-lg border border-border bg-surface-raised p-4 font-sans text-text shadow-lg max-md:p-3',
							className,
						)}
						data-placement={position.placement}
						id={popoverId}
						ref={position.attachContent}
						role="dialog"
						style={position.style}
					>
						{content}
					</div>
				</OverlayPortal>
			) : null}
		</span>
	);
}
