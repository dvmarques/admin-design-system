import {
	createContext,
	useContext,
	useId,
	useState,
	type HTMLAttributes,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';

/** Props the consumer must spread on the link it renders for an item, so it keeps the library look and `aria-current`. */
export interface AdsLinkRenderProps {
	'aria-current'?: 'page' | undefined;
	children: ReactNode;
	className: string;
}

export interface AdsBreadcrumbItem {
	label: ReactNode;
	href?: string;
	current?: boolean;
	/** Renders the consumer's link (for example `next/link`) in place of the built-in `<a>`; takes precedence over `href`. */
	renderLink?: (props: AdsLinkRenderProps) => ReactNode;
}

const breadcrumbLinkClassName =
	'rounded-sm text-text-muted underline-offset-2 hover:text-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

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
							{current || !(item.href || item.renderLink) ? (
								<span
									aria-current={current ? 'page' : undefined}
									className={current ? 'font-medium text-text' : undefined}
								>
									{item.label}
								</span>
							) : item.renderLink ? (
								item.renderLink({ children: item.label, className: breadcrumbLinkClassName })
							) : (
								<a className={breadcrumbLinkClassName} href={item.href}>
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
	/** Renders the consumer's link (for example `next/link`) in place of the built-in `<a>`/`<button>`; takes precedence over `href` unless `disabled`. */
	renderLink?: (props: AdsLinkRenderProps) => ReactNode;
}

export interface AdsNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	items: AdsNavItem[];
	'aria-label'?: string;
}

const navItemBase =
	'ads-nav-item inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-[background-color,color,border-color,box-shadow,filter,transform] duration-[var(--ads-motion-normal)] ease-[var(--ads-motion-easing)] hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring-offset motion-reduce:transform-none';

function navItemState(current: boolean | undefined) {
	return current
		? 'border-primary bg-surface-selected text-on-surface-selected shadow-sm hover:bg-surface-hover'
		: 'border-border bg-surface text-text hover:border-border-strong hover:bg-surface-hover';
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
			<ul className="m-0 flex min-w-max list-none flex-nowrap items-center gap-1 p-0">
				{items.map((item, index) => (
					<li key={`${index}-${String(item.label)}`}>
						{item.renderLink && !item.disabled ? (
							item.renderLink({
								'aria-current': item.current ? 'page' : undefined,
								children: item.label,
								className: classNames(navItemBase, 'no-underline', navItemState(item.current)),
							})
						) : item.href && !item.disabled ? (
							<a
								aria-current={item.current ? 'page' : undefined}
								className={classNames(navItemBase, 'no-underline', navItemState(item.current))}
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
									navItemBase,
									'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
									navItemState(item.current),
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
				'ads-tabs-list flex max-w-full flex-nowrap overflow-x-auto border-b border-border',
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
				'ads-tabs-trigger -mb-px min-h-10 shrink-0 rounded-t-md border border-transparent px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring-offset disabled:cursor-not-allowed disabled:text-text-muted disabled:opacity-100',
				// One explicit set per state: conflicting utilities would be resolved by their order
				// in the compiled CSS, and the active styles used to lose.
				active
					? 'border-b-2 border-b-primary bg-surface-selected text-on-surface-selected'
					: 'border-b-border bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text',
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
