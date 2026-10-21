import type { HTMLAttributes, ReactNode } from 'react';
import { AdsBreadcrumbCollapse } from './breadcrumb-collapse.js';
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
	/** Visual separator between items; ignored by assistive technology. */
	separator?: ReactNode;
	/** Collapses the middle items behind an expand button when there are more items than this. */
	maxItems?: number;
	/** Items kept before the expand button when collapsed (minimum 1). */
	itemsBeforeCollapse?: number;
	/** Items kept after the expand button when collapsed (minimum 1); the current page is never hidden. */
	itemsAfterCollapse?: number;
	/** Accessible name of the expand button. */
	expandLabel?: string;
}

const defaultBreadcrumbLabels = { navigation: 'Breadcrumb', expand: 'Show full path' } as const;

export function AdsBreadcrumb({
	items,
	className,
	'aria-label': ariaLabel = defaultBreadcrumbLabels.navigation,
	separator = '/',
	maxItems,
	itemsBeforeCollapse = 1,
	itemsAfterCollapse = 2,
	expandLabel = defaultBreadcrumbLabels.expand,
	...props
}: AdsBreadcrumbProps) {
	const before = Math.max(1, itemsBeforeCollapse);
	const after = Math.max(1, itemsAfterCollapse);
	// An item explicitly marked as current is never hidden: the tail starts at it when it falls in the middle.
	const explicitCurrent = items.findIndex(
		(item, index) => index >= before && item.current === true,
	);
	const tailStart = Math.min(
		items.length - after,
		explicitCurrent === -1 ? items.length : explicitCurrent,
	);
	const collapsed = maxItems !== undefined && items.length > maxItems && tailStart > before;

	const renderItem = (item: AdsBreadcrumbItem, index: number, hidden = false) => {
		const current = item.current ?? index === items.length - 1;
		return (
			<li
				className="flex items-center gap-2"
				data-collapsed={hidden ? '' : undefined}
				key={`${index}-${String(item.label)}`}
			>
				{index > 0 ? (
					<span aria-hidden="true" className="text-text-muted">
						{separator}
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
	};

	return (
		<nav
			{...props}
			aria-label={ariaLabel}
			className={classNames('ads-breadcrumb overflow-x-auto', className)}
		>
			<ol className="m-0 flex min-w-max list-none items-center gap-2 p-0 text-sm text-text-muted">
				{collapsed ? (
					<>
						{items.slice(0, before).map((item, index) => renderItem(item, index))}
						<AdsBreadcrumbCollapse expandLabel={expandLabel} separator={separator}>
							{items
								.slice(before, tailStart)
								.map((item, index) => renderItem(item, before + index, true))}
						</AdsBreadcrumbCollapse>
						{items.slice(tailStart).map((item, index) => renderItem(item, tailStart + index))}
					</>
				) : (
					items.map((item, index) => renderItem(item, index))
				)}
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
