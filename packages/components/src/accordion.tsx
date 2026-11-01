'use client';

import {
	createContext,
	useContext,
	useEffect,
	useId,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
} from 'react';
import { classNames } from './class-names.js';
import { encodeIdKey, sanitizeId } from './component-ids.js';

interface AccordionContextValue {
	baseId: string;
	open: readonly string[];
	toggle: (value: string) => void;
	unmountOnCollapse: boolean;
	/** The open item of a single accordion that cannot be collapsed. */
	lockOpen: boolean;
}
const AccordionContext = createContext<AccordionContextValue | null>(null);
function useAccordion() {
	const context = useContext(AccordionContext);
	if (!context) throw new Error('AdsAccordion components must be used inside AdsAccordion');
	return context;
}

interface ItemContextValue {
	value: string;
	open: boolean;
	disabled: boolean;
	triggerId: string;
	panelId: string;
	unmountOnCollapse: boolean;
	/** Whether the panel is in the document, so the trigger never references a missing one. */
	panelMounted: boolean;
	setPanelMounted: (mounted: boolean) => void;
}
const ItemContext = createContext<ItemContextValue | null>(null);
function useItem() {
	const context = useContext(ItemContext);
	if (!context) throw new Error('AdsAccordion parts must be used inside AdsAccordion.Item');
	return context;
}

interface AdsAccordionBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
	/** Removes the content of collapsed panels from the document. Each item can override it. */
	unmountOnCollapse?: boolean;
}
export interface AdsAccordionSingleProps extends AdsAccordionBaseProps {
	type: 'single';
	value?: string;
	defaultValue?: string;
	/** Receives an empty string when the open item is collapsed. */
	onValueChange?: (value: string) => void;
	/** Lets the user collapse the open item. */
	collapsible?: boolean;
}
export interface AdsAccordionMultipleProps extends AdsAccordionBaseProps {
	type: 'multiple';
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
}
export type AdsAccordionProps = AdsAccordionSingleProps | AdsAccordionMultipleProps;

interface AccordionInternalProps extends AdsAccordionBaseProps {
	type: 'single' | 'multiple';
	value?: string | string[];
	defaultValue?: string | string[];
	onValueChange?: (value: string | string[]) => void;
	collapsible?: boolean;
}

function toList(value: string | string[] | undefined) {
	if (value === undefined) return undefined;
	if (Array.isArray(value)) return value;
	return value === '' ? [] : [value];
}

function AdsAccordionRoot(props: AdsAccordionProps) {
	const {
		type,
		value: controlledValue,
		defaultValue,
		onValueChange,
		collapsible = false,
		unmountOnCollapse = false,
		className,
		children,
		...rest
	} = props as AccordionInternalProps;
	const baseId = sanitizeId(useId());
	const [uncontrolled, setUncontrolled] = useState<string[]>(toList(defaultValue) ?? []);
	const controlled = toList(controlledValue);
	const stored = controlled ?? uncontrolled;
	// A single accordion shows at most one item, even if the mode changes while several are open.
	const open = type === 'single' ? stored.slice(0, 1) : stored;
	const toggle = (itemValue: string) => {
		const isOpen = open.includes(itemValue);
		let next: string[];
		if (type === 'multiple') {
			next = isOpen ? open.filter((value) => value !== itemValue) : [...open, itemValue];
		} else if (isOpen) {
			if (!collapsible) return;
			next = [];
		} else {
			next = [itemValue];
		}
		if (controlled === undefined) setUncontrolled(next);
		onValueChange?.(type === 'multiple' ? next : (next[0] ?? ''));
	};
	return (
		<AccordionContext.Provider
			value={{
				baseId,
				open,
				toggle,
				unmountOnCollapse,
				lockOpen: type === 'single' && !collapsible,
			}}
		>
			<div
				{...rest}
				className={classNames(
					'ads-accordion rounded-md border border-border bg-surface',
					className,
				)}
				data-ads-accordion-root=""
			>
				{children}
			</div>
		</AccordionContext.Provider>
	);
}

export interface AdsAccordionItemProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
	disabled?: boolean;
	/** Overrides `unmountOnCollapse` of the root for this item. */
	unmountOnCollapse?: boolean;
}
function AdsAccordionItem({
	value,
	disabled = false,
	unmountOnCollapse,
	className,
	children,
	...props
}: AdsAccordionItemProps) {
	const accordion = useAccordion();
	const open = accordion.open.includes(value);
	const key = encodeIdKey(value);
	const [panelMounted, setPanelMounted] = useState(false);
	return (
		<ItemContext.Provider
			value={{
				value,
				open,
				disabled,
				triggerId: `${accordion.baseId}-trigger-${key}`,
				panelId: `${accordion.baseId}-panel-${key}`,
				unmountOnCollapse: unmountOnCollapse ?? accordion.unmountOnCollapse,
				panelMounted,
				setPanelMounted,
			}}
		>
			<div
				{...props}
				className={classNames(
					'ads-accordion-item border-b border-border last:border-b-0',
					className,
				)}
				data-disabled={disabled ? '' : undefined}
				data-state={open ? 'open' : 'closed'}
			>
				{children}
			</div>
		</ItemContext.Provider>
	);
}

const headingTags = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;
export interface AdsAccordionHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
	/** Heading level, so the accordion fits the outline of the page. */
	level?: 2 | 3 | 4 | 5 | 6;
}
function AdsAccordionHeader({ level = 3, className, ...props }: AdsAccordionHeaderProps) {
	const Heading = headingTags[level];
	return <Heading {...props} className={classNames('ads-accordion-header m-0', className)} />;
}

export type AdsAccordionTriggerProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'type' | 'disabled'
>;
function AdsAccordionTrigger({
	children,
	className,
	onClick,
	onKeyDown,
	...props
}: AdsAccordionTriggerProps) {
	const { toggle, lockOpen } = useAccordion();
	const item = useItem();
	return (
		<button
			{...props}
			aria-disabled={lockOpen && item.open ? true : undefined}
			aria-controls={item.panelMounted ? item.panelId : undefined}
			aria-expanded={item.open}
			className={classNames(
				'ads-accordion-trigger flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-4 py-3 text-left text-sm font-medium text-text [font-family:inherit] hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-text-muted disabled:hover:bg-transparent',
				className,
			)}
			data-ads-accordion-trigger=""
			data-state={item.open ? 'open' : 'closed'}
			disabled={item.disabled}
			id={item.triggerId}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) toggle(item.value);
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				const root = event.currentTarget.closest('[data-ads-accordion-root]');
				// Skips the triggers of accordions nested in a panel.
				const triggers = root
					? Array.from(
							root.querySelectorAll<HTMLButtonElement>(
								'[data-ads-accordion-trigger]:not([disabled])',
							),
						).filter((trigger) => trigger.closest('[data-ads-accordion-root]') === root)
					: [];
				const index = triggers.indexOf(event.currentTarget);
				let next = index;
				if (event.key === 'ArrowDown') next = (index + 1) % triggers.length;
				if (event.key === 'ArrowUp') next = (index - 1 + triggers.length) % triggers.length;
				if (event.key === 'Home') next = 0;
				if (event.key === 'End') next = triggers.length - 1;
				if (next !== index && triggers.length) {
					event.preventDefault();
					triggers[next]?.focus();
				}
			}}
			type="button"
		>
			<span className="min-w-0 break-words">{children}</span>
			<svg
				aria-hidden="true"
				className={classNames(
					'ads-accordion-indicator h-4 w-4 shrink-0 transition-transform duration-[var(--ads-motion-normal)] ease-[var(--ads-motion-easing)] motion-reduce:transition-none',
					item.open ? 'rotate-180' : undefined,
				)}
				fill="none"
				focusable="false"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		</button>
	);
}

export type AdsAccordionPanelProps = HTMLAttributes<HTMLDivElement>;
function AdsAccordionPanel({ children, className, ...props }: AdsAccordionPanelProps) {
	const item = useItem();
	const rendered = item.open || !item.unmountOnCollapse;
	const { setPanelMounted } = item;
	useEffect(() => {
		if (!rendered) return;
		setPanelMounted(true);
		return () => setPanelMounted(false);
	}, [rendered, setPanelMounted]);
	if (!rendered) return null;
	return (
		<div
			role="region"
			{...props}
			aria-labelledby={item.triggerId}
			className={classNames('ads-accordion-panel px-4 pb-4 text-sm text-text-secondary', className)}
			data-state={item.open ? 'open' : 'closed'}
			hidden={!item.open}
			id={item.panelId}
		>
			{children}
		</div>
	);
}

/**
 * The parts are also exported by name: a Server Component cannot read `AdsAccordion.Item` from a
 * client module, so it composes `AdsAccordion`, `AdsAccordionItem` and the other parts instead.
 */
export { AdsAccordionHeader, AdsAccordionItem, AdsAccordionPanel, AdsAccordionTrigger };

export const AdsAccordion = Object.assign(AdsAccordionRoot, {
	Root: AdsAccordionRoot,
	Item: AdsAccordionItem,
	Header: AdsAccordionHeader,
	Trigger: AdsAccordionTrigger,
	Panel: AdsAccordionPanel,
});
