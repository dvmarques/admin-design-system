'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
	type HTMLAttributes,
} from 'react';
import { classNames } from './class-names.js';
import { encodeIdKey, sanitizeId } from './component-ids.js';

export type AdsTabsOrientation = 'horizontal' | 'vertical';
export type AdsTabsActivationMode = 'manual' | 'automatic';

interface TabsContextValue {
	value: string;
	setValue: (value: string) => void;
	baseId: string;
	activationMode: AdsTabsActivationMode;
	orientation: AdsTabsOrientation;
	keepMounted: boolean;
	/** Id of the tab that takes the tab stop when the active tab is not an enabled one. */
	fallbackId: string | null;
	setFallbackId: (id: string | null) => void;
	/** Values whose panel is currently in the document, so a tab never references a missing one. */
	mountedPanels: ReadonlySet<string>;
	registerPanel: (value: string, mounted: boolean) => void;
}
const TabsContext = createContext<TabsContextValue | null>(null);
function useTabs() {
	const context = useContext(TabsContext);
	if (!context) throw new Error('AdsTabs components must be used inside AdsTabs');
	return context;
}

const tabId = (baseId: string, value: string) => `${baseId}-tab-${encodeIdKey(value)}`;
const panelId = (baseId: string, value: string) => `${baseId}-panel-${encodeIdKey(value)}`;

export interface AdsTabsProps extends HTMLAttributes<HTMLDivElement> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** `manual` activates the focused tab with Enter or Space; `automatic` activates it as the focus moves. */
	activationMode?: AdsTabsActivationMode;
	orientation?: AdsTabsOrientation;
	/** Keeps inactive panels in the document, hidden. Each panel can override it. */
	keepMounted?: boolean;
}

function AdsTabsRoot({
	activationMode = 'manual',
	children,
	className,
	defaultValue = '',
	keepMounted = false,
	onValueChange,
	orientation = 'horizontal',
	value: controlledValue,
	...props
}: AdsTabsProps) {
	const baseId = sanitizeId(useId());
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const [fallbackId, setFallbackId] = useState<string | null>(null);
	const [mountedPanels, setMountedPanels] = useState<ReadonlySet<string>>(new Set());
	const registerPanel = useCallback((panelValue: string, mounted: boolean) => {
		setMountedPanels((current) => {
			if (current.has(panelValue) === mounted) return current;
			const next = new Set(current);
			if (mounted) next.add(panelValue);
			else next.delete(panelValue);
			return next;
		});
	}, []);
	const value = controlledValue ?? uncontrolledValue;
	const setValue = (next: string) => {
		if (controlledValue === undefined) setUncontrolledValue(next);
		onValueChange?.(next);
	};
	return (
		<TabsContext.Provider
			value={{
				value,
				setValue,
				baseId,
				activationMode,
				orientation,
				keepMounted,
				fallbackId,
				setFallbackId,
				mountedPanels,
				registerPanel,
			}}
		>
			<div
				{...props}
				className={classNames(
					'ads-tabs',
					orientation === 'vertical' ? 'flex flex-col gap-4 sm:flex-row' : undefined,
					className,
				)}
			>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

export type AdsTabsListProps = HTMLAttributes<HTMLDivElement>;
function AdsTabsList({ children, className, ...props }: AdsTabsListProps) {
	const { orientation, setFallbackId, value } = useTabs();
	const ref = useRef<HTMLDivElement>(null);
	// The triggers are free-form children, so the enabled ones are only known from the DOM. When the
	// active tab is disabled or missing, the first enabled tab keeps the list reachable with Tab. The
	// observer also covers triggers that change their own `disabled` without re-rendering the list.
	useEffect(() => {
		const list = ref.current;
		if (!list) return;
		const sync = () => {
			const tabs = Array.from(
				list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
			);
			const hasActive = tabs.some((tab) => tab.getAttribute('aria-selected') === 'true');
			setFallbackId(hasActive ? null : (tabs[0]?.id ?? null));
		};
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(list, {
			attributes: true,
			attributeFilter: ['disabled', 'aria-selected'],
			childList: true,
			subtree: true,
		});
		return () => observer.disconnect();
	}, [setFallbackId, value, children]);
	return (
		<div
			{...props}
			aria-orientation={orientation}
			className={classNames(
				'ads-tabs-list flex max-w-full border-border',
				orientation === 'vertical'
					? 'shrink-0 flex-col border-r'
					: 'flex-nowrap overflow-x-auto border-b',
				className,
			)}
			ref={ref}
			role="tablist"
		>
			{children}
		</div>
	);
}

export interface AdsTabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
	value: string;
	disabled?: boolean;
}
function AdsTabsTrigger({
	value: tabValue,
	children,
	className,
	disabled,
	onClick,
	onKeyDown,
	...props
}: AdsTabsTriggerProps) {
	const { value, setValue, baseId, activationMode, orientation, fallbackId, mountedPanels } =
		useTabs();
	const id = tabId(baseId, tabValue);
	const active = value === tabValue;
	const vertical = orientation === 'vertical';
	const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
	const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
	return (
		<button
			{...props}
			// An unmounted panel cannot be referenced.
			aria-controls={active || mountedPanels.has(tabValue) ? panelId(baseId, tabValue) : undefined}
			aria-selected={active}
			className={classNames(
				'ads-tabs-trigger min-h-10 shrink-0 border border-transparent px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring-offset disabled:cursor-not-allowed disabled:text-text-muted disabled:opacity-100',
				// One explicit set per orientation and state: conflicting utilities would be resolved
				// by their order in the compiled CSS, and the active styles used to lose.
				vertical ? '-mr-px rounded-l-md text-left' : '-mb-px rounded-t-md',
				vertical
					? active
						? 'border-r-2 border-r-primary bg-surface-selected text-on-surface-selected'
						: 'border-r-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text'
					: active
						? 'border-b-2 border-b-primary bg-surface-selected text-on-surface-selected'
						: 'border-b-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text',
				className,
			)}
			data-state={active ? 'active' : 'inactive'}
			disabled={disabled}
			id={id}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) setValue(tabValue);
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				const list = event.currentTarget.closest('[role="tablist"]');
				const tabs = list
					? Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'))
					: [];
				const index = tabs.indexOf(event.currentTarget);
				let next = index;
				if (event.key === nextKey) next = (index + 1) % tabs.length;
				if (event.key === previousKey) next = (index - 1 + tabs.length) % tabs.length;
				if (event.key === 'Home') next = 0;
				if (event.key === 'End') next = tabs.length - 1;
				if (next !== index && tabs.length) {
					event.preventDefault();
					tabs[next]?.focus();
					if (activationMode === 'automatic') tabs[next]?.click();
				}
				// Enter and Space activate through the native button click, so `onClick` can still cancel it.
			}}
			role="tab"
			tabIndex={(active && !disabled) || id === fallbackId ? 0 : -1}
			type="button"
		>
			{children}
		</button>
	);
}

export interface AdsTabsPanelProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
	/** Overrides `keepMounted` of the root for this panel. */
	keepMounted?: boolean;
}
function AdsTabsPanel({
	value: panelValue,
	children,
	className,
	keepMounted,
	...props
}: AdsTabsPanelProps) {
	const { value, baseId, keepMounted: rootKeepMounted, orientation, registerPanel } = useTabs();
	const active = value === panelValue;
	const rendered = active || (keepMounted ?? rootKeepMounted);
	useEffect(() => {
		if (!rendered) return;
		registerPanel(panelValue, true);
		return () => registerPanel(panelValue, false);
	}, [panelValue, registerPanel, rendered]);
	if (!rendered) return null;
	return (
		<div
			{...props}
			aria-labelledby={tabId(baseId, panelValue)}
			className={classNames(
				'ads-tabs-panel py-4 focus-visible:outline-2 focus-visible:outline-focus',
				orientation === 'vertical' ? 'min-w-0 flex-1' : undefined,
				className,
			)}
			hidden={!active}
			id={panelId(baseId, panelValue)}
			role="tabpanel"
			tabIndex={active ? 0 : undefined}
		>
			{children}
		</div>
	);
}

/**
 * The parts are also exported by name: a Server Component cannot read `AdsTabs.List` from a client
 * module, so it composes `AdsTabs`, `AdsTabsList`, `AdsTabsTrigger` and `AdsTabsPanel` instead.
 */
export { AdsTabsList, AdsTabsPanel, AdsTabsTrigger };

export const AdsTabs = Object.assign(AdsTabsRoot, {
	Root: AdsTabsRoot,
	List: AdsTabsList,
	Trigger: AdsTabsTrigger,
	Panel: AdsTabsPanel,
});
