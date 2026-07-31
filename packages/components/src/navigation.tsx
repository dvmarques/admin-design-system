import {
	createContext,
	useContext,
	useId,
	useState,
	type HTMLAttributes,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';

export interface AdsBreadcrumbItem {
	label: ReactNode;
	href?: string;
	current?: boolean;
}

export interface AdsBreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	items: AdsBreadcrumbItem[];
	'aria-label'?: string;
}

export function AdsBreadcrumb({
	items,
	className,
	'aria-label': ariaLabel = 'Breadcrumb',
	...props
}: AdsBreadcrumbProps) {
	return (
		<nav
			{...props}
			aria-label={ariaLabel}
			className={classNames('ads-breadcrumb overflow-x-auto', className)}
		>
			<ol className="m-0 flex min-w-max list-none items-center gap-2 p-0 text-sm text-text-muted">
				{items.map((item, index) => {
					const current = item.current ?? index === items.length - 1;
					return (
						<li className="flex items-center gap-2" key={`${index}-${String(item.label)}`}>
							{index > 0 ? (
								<span aria-hidden="true" className="text-text-muted">
									/
								</span>
							) : null}
							{current || !item.href ? (
								<span
									aria-current={current ? 'page' : undefined}
									className={current ? 'font-medium text-text' : undefined}
								>
									{item.label}
								</span>
							) : (
								<a
									className="rounded-sm underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
									href={item.href}
								>
									{item.label}
								</a>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

export interface AdsNavItem {
	label: ReactNode;
	href?: string;
	current?: boolean;
	disabled?: boolean;
	onClick?: () => void;
}

export interface AdsNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	items: AdsNavItem[];
	'aria-label'?: string;
}

export function AdsNav({
	items,
	className,
	'aria-label': ariaLabel = 'Navegação',
	...props
}: AdsNavProps) {
	return (
		<nav
			{...props}
			aria-label={ariaLabel}
			className={classNames('ads-nav overflow-x-auto', className)}
		>
			<ul className="m-0 flex min-w-max list-none flex-wrap items-center gap-1 p-0">
				{items.map((item, index) => (
					<li key={`${index}-${String(item.label)}`}>
						{item.href && !item.disabled ? (
							<a
								aria-current={item.current ? 'page' : undefined}
								className={classNames(
									'ads-nav-item inline-flex min-h-[var(--ads-dimension-control-md)] items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-[background-color,color,border-color,box-shadow,filter,transform] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
									item.current
										? 'border-transparent bg-primary text-[var(--ads-color-on-primary)] hover:bg-primary-hover'
										: 'border-border bg-surface text-text hover:bg-surface-raised',
								)}
								href={item.href}
							>
								{item.label}
							</a>
						) : (
							<button
								aria-current={item.current ? 'page' : undefined}
								disabled={item.disabled}
								onClick={item.onClick}
								type="button"
								className={classNames(
									'ads-nav-item inline-flex min-h-[var(--ads-dimension-control-md)] items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-[background-color,color,border-color,box-shadow,filter,transform] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
									item.current
										? 'border-transparent bg-primary text-[var(--ads-color-on-primary)] hover:bg-primary-hover'
										: 'border-border bg-surface text-text hover:bg-surface-raised',
								)}
							>
								{item.label}
							</button>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

interface TabsContextValue {
	value: string;
	setValue: (value: string) => void;
	baseId: string;
}
const TabsContext = createContext<TabsContextValue | null>(null);
function useTabs() {
	const context = useContext(TabsContext);
	if (!context) throw new Error('AdsTabs components must be used inside AdsTabs');
	return context;
}

export interface AdsTabsProps extends HTMLAttributes<HTMLDivElement> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
}

function AdsTabsRoot({
	children,
	className,
	defaultValue = '',
	onValueChange,
	value: controlledValue,
	...props
}: AdsTabsProps) {
	const baseId = useId();
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const value = controlledValue ?? uncontrolledValue;
	const setValue = (next: string) => {
		if (controlledValue === undefined) setUncontrolledValue(next);
		onValueChange?.(next);
	};
	return (
		<TabsContext.Provider value={{ value, setValue, baseId }}>
			<div {...props} className={classNames('ads-tabs', className)}>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

export type AdsTabsListProps = HTMLAttributes<HTMLDivElement>;
function AdsTabsList({ className, ...props }: AdsTabsListProps) {
	return (
		<div
			{...props}
			aria-orientation="horizontal"
			className={classNames(
				'ads-tabs-list flex max-w-full flex-wrap border-b border-border',
				className,
			)}
			role="tablist"
		/>
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
	onKeyDown,
	...props
}: AdsTabsTriggerProps) {
	const { value, setValue, baseId } = useTabs();
	const id = `${baseId}-tab-${tabValue}`;
	const panelId = `${baseId}-panel-${tabValue}`;
	const active = value === tabValue;
	return (
		<button
			{...props}
			aria-controls={panelId}
			aria-selected={active}
			className={classNames(
				'ads-tabs-trigger -mb-px min-h-10 shrink-0 rounded-t-md border border-transparent border-b-border bg-transparent px-4 py-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-text-muted disabled:opacity-100',
				active && 'border-primary border-b-primary bg-primary text-[var(--ads-color-on-primary)]',
				className,
			)}
			data-state={active ? 'active' : 'inactive'}
			disabled={disabled}
			id={id}
			onClick={() => setValue(tabValue)}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				const list = event.currentTarget.closest('[role="tablist"]');
				const tabs = list
					? Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'))
					: [];
				const index = tabs.indexOf(event.currentTarget);
				let next = index;
				if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
				if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
				if (event.key === 'Home') next = 0;
				if (event.key === 'End') next = tabs.length - 1;
				if (next !== index && tabs.length) {
					event.preventDefault();
					tabs[next]?.focus();
				}
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					setValue(tabValue);
				}
			}}
			role="tab"
			tabIndex={active ? 0 : -1}
		>
			{children}
		</button>
	);
}

export interface AdsTabsPanelProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
}
function AdsTabsPanel({ value: panelValue, children, className, ...props }: AdsTabsPanelProps) {
	const { value, baseId } = useTabs();
	const active = value === panelValue;
	return active ? (
		<div
			{...props}
			aria-labelledby={`${baseId}-tab-${panelValue}`}
			className={classNames(
				'ads-tabs-panel py-4 focus-visible:outline-2 focus-visible:outline-focus',
				className,
			)}
			id={`${baseId}-panel-${panelValue}`}
			role="tabpanel"
			tabIndex={0}
		>
			{children}
		</div>
	) : null;
}

export const AdsTabs = Object.assign(AdsTabsRoot, {
	Root: AdsTabsRoot,
	List: AdsTabsList,
	Trigger: AdsTabsTrigger,
	Panel: AdsTabsPanel,
});
