'use client';

import {
	createContext,
	createElement,
	useContext,
	useCallback,
	useEffect,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
} from 'react';
import { classNames } from './class-names.js';
import {
	OverlayPortal,
	focusAdjacentTo,
	useAnchoredPosition,
	useClickOutside,
	useEscapeKey,
	useStableId,
} from './overlay-utils.js';
import { AdsButton, type AdsButtonSize, type AdsButtonVariant } from './button.js';

interface DropdownContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	closeAfterTab: () => void;
	triggerRef: React.MutableRefObject<HTMLElement | null>;
	menuId: string;
	initialFocusRef: React.MutableRefObject<boolean>;
}
const DropdownContext = createContext<DropdownContextValue | null>(null);
function useDropdown() {
	const context = useContext(DropdownContext);
	if (!context) throw new Error('AdsDropdown components must be used inside AdsDropdown');
	return context;
}

export interface AdsDropdownProps extends HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}
function AdsDropdownRoot({
	children,
	className,
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	...props
}: AdsDropdownProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const closeFrame = useRef<number | undefined>(undefined);
	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = (next: boolean) => {
		window.cancelAnimationFrame(closeFrame.current ?? 0);
		if (controlledOpen === undefined) setUncontrolledOpen(next);
		onOpenChange?.(next);
	};
	const triggerRef = useRef<HTMLElement | null>(null);
	useEffect(() => () => window.cancelAnimationFrame(closeFrame.current ?? 0), []);
	const closeAfterTab = () => {
		window.cancelAnimationFrame(closeFrame.current ?? 0);
		closeFrame.current = window.requestAnimationFrame(() => setOpen(false));
	};
	const menuId = useStableId('ads-dropdown-menu');
	const initialFocusRef = useRef(false);
	return (
		<DropdownContext.Provider
			value={{ open, setOpen, closeAfterTab, triggerRef, menuId, initialFocusRef }}
		>
			<div {...props} className={classNames('ads-dropdown relative inline-flex', className)}>
				{children}
			</div>
		</DropdownContext.Provider>
	);
}

export interface AdsDropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	size?: AdsButtonSize;
	variant?: AdsButtonVariant;
}
function AdsDropdownTrigger({
	children,
	className,
	onKeyDown,
	onBlur,
	size = 'md',
	variant = 'secondary',
	...props
}: AdsDropdownTriggerProps) {
	const { open, setOpen, closeAfterTab, triggerRef, menuId, initialFocusRef } = useDropdown();
	return (
		<AdsButton
			{...props}
			aria-controls={open ? menuId : undefined}
			aria-expanded={open}
			className={classNames('ads-dropdown-trigger', className)}
			onBlur={(event) => {
				initialFocusRef.current = false;
				onBlur?.(event);
			}}
			onClick={() => {
				initialFocusRef.current = false;
				setOpen(!open);
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if (event.key === 'Tab' && open) {
					if (focusAdjacentTo(triggerRef.current, event.shiftKey)) {
						event.preventDefault();
						setOpen(false);
					} else closeAfterTab();
					return;
				}
				if ((event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') && !open) {
					event.preventDefault();
					initialFocusRef.current = true;
					setOpen(true);
				}
			}}
			ref={(node: HTMLButtonElement | null) => {
				triggerRef.current = node;
			}}
			size={size}
			variant={variant}
			type="button"
		>
			{children}
		</AdsButton>
	);
}

export interface AdsDropdownContentProps extends HTMLAttributes<HTMLDivElement> {
	placement?: 'top' | 'right' | 'bottom' | 'left';
}
function AdsDropdownContent({
	children,
	className,
	onKeyDown,
	placement = 'bottom',
	...props
}: AdsDropdownContentProps) {
	const { open, setOpen, closeAfterTab, triggerRef, menuId, initialFocusRef } = useDropdown();
	const contentRef = useRef<HTMLDivElement>(null);
	const position = useAnchoredPosition(open, triggerRef, contentRef, placement, 'start');
	const setContentRef = useCallback(
		(node: HTMLDivElement | null) => {
			position.attachContent(node);
			if (!node || !initialFocusRef.current) return;
			// The portal mounts its children after the open render. Focus at attachment.
			initialFocusRef.current = false;
			if (node.ownerDocument.activeElement !== triggerRef.current) return;
			(
				node.querySelector<HTMLElement>(
					'[role="menuitemradio"][aria-checked="true"]:not([aria-disabled="true"])',
				) ?? node.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')
			)?.focus({ preventScroll: true });
		},
		[initialFocusRef, triggerRef, position.attachContent],
	);
	useEscapeKey(open, () => {
		setOpen(false);
		triggerRef.current?.focus();
	});
	useClickOutside(open, contentRef, (event) => {
		if (!(event.target instanceof Node) || !triggerRef.current?.contains(event.target))
			setOpen(false);
	});
	return open ? (
		<OverlayPortal>
			<div
				{...props}
				className={classNames(
					'ads-dropdown-content fixed z-[var(--ads-layer-dropdown)] min-w-48 rounded-lg border border-border bg-surface-raised p-1.5 font-sans text-text shadow-md',
					className,
				)}
				data-placement={position.placement}
				id={menuId}
				onKeyDown={(event) => {
					onKeyDown?.(event);
					if (event.defaultPrevented) return;
					if (event.key === 'Tab') {
						// The panel lives at the end of body; keep tab order relative to the trigger.
						if (focusAdjacentTo(triggerRef.current, event.shiftKey)) {
							event.preventDefault();
							setOpen(false);
						} else {
							// Native Tab must run from the trigger before its original key target unmounts.
							closeAfterTab();
						}
						return;
					}
					const items = Array.from(
						event.currentTarget.querySelectorAll<HTMLElement>(
							'[role^="menuitem"]:not([aria-disabled="true"])',
						),
					);
					const index = items.indexOf(document.activeElement as HTMLElement);
					let next = index;
					if (event.key === 'ArrowDown') next = (index + 1) % items.length;
					if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
					if (event.key === 'Home') next = 0;
					if (event.key === 'End') next = items.length - 1;
					if (next !== index && items.length) {
						event.preventDefault();
						items[next]?.focus();
					}
				}}
				ref={setContentRef}
				role="menu"
				style={position.style}
			>
				{children}
			</div>
		</OverlayPortal>
	) : null;
}

export interface AdsDropdownItemProps extends HTMLAttributes<HTMLElement> {
	disabled?: boolean;
	href?: string;
	onSelect?: () => void;
}
function AdsDropdownItem({
	children,
	className,
	disabled,
	href,
	onClick,
	onSelect,
	role,
	...props
}: AdsDropdownItemProps) {
	// Só `menuitemradio` é novo; qualquer outro valor mantém o papel `menuitem` de sempre.
	const itemRole = role === 'menuitemradio' ? 'menuitemradio' : 'menuitem';
	const { setOpen, triggerRef } = useDropdown();
	const element = href ? 'a' : 'button';
	return (
		<>
			{createElement(
				element,
				{
					...props,
					...(href ? { href } : { type: 'button' }),
					'aria-disabled': disabled || undefined,
					className: classNames(
						'ads-dropdown-item box-border flex w-full max-w-full appearance-none items-center rounded-md border-0 bg-transparent px-3 py-2 text-left text-sm font-sans font-medium no-underline outline-none transition-[background-color,color] duration-[var(--ads-motion-fast)] ease-[var(--ads-motion-easing)]',
						disabled
							? 'cursor-default text-text-muted opacity-50'
							: 'text-text hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-1',
						className,
					),
					disabled: !href && disabled,
					onClick: (event: React.MouseEvent<HTMLElement>) => {
						if (disabled) {
							event.preventDefault();
							return;
						}
						onClick?.(event);
						onSelect?.();
						setOpen(false);
						// Escolher uma opção de seleção exclusiva devolve o foco ao gatilho, como Escape.
						if (itemRole === 'menuitemradio') triggerRef.current?.focus();
					},
					role: itemRole,
					tabIndex: disabled ? -1 : -1,
				},
				children,
			)}
		</>
	);
}

/** Non-interactive label; use id with a native role=group/aria-labelledby when needed. */
export type AdsDropdownHeaderProps = HTMLAttributes<HTMLDivElement>;
function AdsDropdownHeader({ className, ...props }: AdsDropdownHeaderProps) {
	return <div {...props} className={classNames('ads-dropdown-header', className)} />;
}

/** Semantic, non-focusable separator between menu groups. */
export type AdsDropdownDividerProps = HTMLAttributes<HTMLDivElement>;
function AdsDropdownDivider({ className, ...props }: AdsDropdownDividerProps) {
	return (
		<div
			{...props}
			aria-orientation="horizontal"
			className={classNames('ads-dropdown-divider', className)}
			role="separator"
		/>
	);
}

export const AdsDropdown = Object.assign(AdsDropdownRoot, {
	Root: AdsDropdownRoot,
	Trigger: AdsDropdownTrigger,
	Content: AdsDropdownContent,
	Item: AdsDropdownItem,
	Header: AdsDropdownHeader,
	Divider: AdsDropdownDivider,
});
