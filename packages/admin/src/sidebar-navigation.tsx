'use client';

import type { DetailsHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { useAdminShellContext } from './admin-shell-state.js';
import { classNames } from './class-names.js';

export type AdsAdminShellNavigationProps = HTMLAttributes<HTMLDivElement>;
export function AdsAdminShellNavigation({ className, ...props }: AdsAdminShellNavigationProps) {
	return <div {...props} className={classNames('ads-sidebar-navigation', className)} />;
}

export interface AdsAdminShellNavigationSectionProps extends HTMLAttributes<HTMLDivElement> {
	label: string;
}
export function AdsAdminShellNavigationSection({
	label,
	children,
	className,
	...props
}: AdsAdminShellNavigationSectionProps) {
	return (
		<div {...props} className={classNames('ads-sidebar-section', className)}>
			<p className="ads-sidebar-section-title ads-admin-shell-sidebar-label">{label}</p>
			{children}
		</div>
	);
}

export interface AdsAdminShellNavigationGroupProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
	label: string;
	icon?: ReactNode;
}
/** Native disclosure; route matching and expansion preferences belong to the consumer. */
export function AdsAdminShellNavigationGroup({
	label,
	icon,
	children,
	className,
	...props
}: AdsAdminShellNavigationGroupProps) {
	const { collapsed, isDesktop, setCollapsed } = useAdminShellContext();
	return (
		<details {...props} className={classNames('ads-sidebar-group', className)}>
			<summary
				className="ads-sidebar-group-toggle"
				title={label}
				onClick={(event) => {
					if (collapsed && isDesktop) {
						event.preventDefault();
						setCollapsed(false);
						// Keep the native toggle event so controlled consumers receive the request.
						event.currentTarget.parentElement?.setAttribute('open', '');
					}
				}}
			>
				<span aria-hidden="true" className="ads-sidebar-icon">
					{icon ?? '◇'}
				</span>
				<span className="ads-admin-shell-sidebar-label">{label}</span>
				<span aria-hidden="true" className="ads-sidebar-group-chevron" />
			</summary>
			<ul className="ads-sidebar-group-items">{children}</ul>
		</details>
	);
}

export type AdsAdminShellNavigationItemProps = HTMLAttributes<HTMLLIElement>;
/** Compose a native anchor or a router link as the child; the package never owns routing. */
export function AdsAdminShellNavigationItem({
	className,
	...props
}: AdsAdminShellNavigationItemProps) {
	return <li {...props} className={classNames('ads-sidebar-item', className)} />;
}
