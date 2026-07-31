'use client';

import {
	createContext,
	createElement,
	useContext,
	useEffect,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
} from 'react';
import { classNames } from './class-names.js';
import {
	OverlayPortal,
	useAnchoredPosition,
	useClickOutside,
	useEscapeKey,
	useStableId,
} from './overlay-utils.js';
import { AdsButton } from './button.js';

interface DropdownContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerRef: React.MutableRefObject<HTMLElement | null>;
	menuId: string;
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
	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = (next: boolean) => {
		if (controlledOpen === undefined) setUncontrolledOpen(next);
		onOpenChange?.(next);
	};
	const triggerRef = useRef<HTMLElement | null>(null);
	const menuId = useStableId('ads-dropdown-menu');
	return (
		<DropdownContext.Provider value={{ open, setOpen, triggerRef, menuId }}>
			<div {...props} className={classNames('ads-dropdown relative inline-flex', className)}>
				{children}
			</div>
		</DropdownContext.Provider>
	);
}

export type AdsDropdownTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;
function AdsDropdownTrigger({ children, className, onKeyDown, ...props }: AdsDropdownTriggerProps) {
	const { open, setOpen, triggerRef, menuId } = useDropdown();
	return (
		<AdsButton
			{...props}
			aria-controls={open ? menuId : undefined}
			aria-expanded={open}
			className={classNames('ads-dropdown-trigger', className)}
			onClick={() => setOpen(!open)}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if ((event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') && !open) {
					event.preventDefault();
					setOpen(true);
				}
			}}
			ref={(node: HTMLButtonElement | null) => {
				triggerRef.current = node;
			}}
			variant="secondary"
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
	placement = 'bottom',
	...props
}: AdsDropdownContentProps) {
	const { open, setOpen, triggerRef, menuId } = useDropdown();
	const contentRef = useRef<HTMLDivElement>(null);
	const position = useAnchoredPosition(open, triggerRef, contentRef, placement, 'start');
	const openedByKeyboard = useRef(false);
	useEffect(() => {
		if (open) {
			const active = document.activeElement;
			openedByKeyboard.current =
				active === triggerRef.current && (active?.matches(':focus-visible') ?? false);
		}
	}, [open, triggerRef]);
	useEscapeKey(open, () => {
		setOpen(false);
		triggerRef.current?.focus();
	});
	useClickOutside(open, contentRef, (event) => {
		if (!(event.target instanceof Node) || !triggerRef.current?.contains(event.target))
			setOpen(false);
	});
	useEffect(() => {
		if (!open || !openedByKeyboard.current) return;
		const first = contentRef.current?.querySelector<HTMLElement>(
			'[role="menuitem"]:not([aria-disabled="true"])',
		);
		first?.focus();
	}, [open]);
	return open ? (
		<OverlayPortal>
			<div
				{...props}
				className={classNames(
					'ads-dropdown-content fixed z-50 min-w-48 rounded-md border border-border bg-surface-raised p-1 font-sans text-text shadow-md',
					className,
				)}
				id={menuId}
				onKeyDown={(event) => {
					const items = Array.from(
						event.currentTarget.querySelectorAll<HTMLElement>(
							'[role="menuitem"]:not([aria-disabled="true"])',
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
				ref={contentRef}
				role="menu"
				style={position}
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
	...props
}: AdsDropdownItemProps) {
	const { setOpen } = useDropdown();
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
						'ads-dropdown-item box-border flex w-full max-w-full appearance-none items-center rounded-sm border-0 bg-transparent px-3 py-2 text-left text-sm font-sans font-medium no-underline outline-none',
						disabled
							? 'cursor-default text-text-muted opacity-50'
							: 'text-text hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-none',
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
					},
					role: 'menuitem',
					tabIndex: disabled ? -1 : -1,
				},
				children,
			)}
		</>
	);
}

export const AdsDropdown = Object.assign(AdsDropdownRoot, {
	Root: AdsDropdownRoot,
	Trigger: AdsDropdownTrigger,
	Content: AdsDropdownContent,
	Item: AdsDropdownItem,
});
