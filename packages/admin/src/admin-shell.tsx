import type { HTMLAttributes } from 'react';
import {
	AdsAdminShellNavigationTrigger,
	AdsAdminShellSidebar,
	AdsAdminShellSidebarToggle,
	type AdsAdminShellNavigationTriggerProps,
	type AdsAdminShellSidebarProps,
	type AdsAdminShellSidebarToggleProps,
} from './admin-shell-navigation.js';
import { AdsAdminShellStateProvider, type AdsAdminShellStateProps } from './admin-shell-state.js';
import { classNames } from './class-names.js';
import {
	AdsAdminShellNavigation,
	AdsAdminShellNavigationSection,
	AdsAdminShellNavigationGroup,
	AdsAdminShellNavigationItem,
} from './sidebar-navigation.js';

export interface AdsAdminShellProps
	extends HTMLAttributes<HTMLDivElement>, Omit<AdsAdminShellStateProps, 'children'> {}

function AdsAdminShellRoot({
	children,
	className,
	collapsed,
	defaultCollapsed,
	onCollapsedChange,
	mobileOpen,
	defaultMobileOpen,
	onMobileOpenChange,
	...props
}: AdsAdminShellProps) {
	return (
		<div {...props} className={classNames('ads-admin-shell', className)}>
			<AdsAdminShellStateProvider
				collapsed={collapsed}
				defaultCollapsed={defaultCollapsed}
				defaultMobileOpen={defaultMobileOpen}
				mobileOpen={mobileOpen}
				onCollapsedChange={onCollapsedChange}
				onMobileOpenChange={onMobileOpenChange}
			>
				{children}
			</AdsAdminShellStateProvider>
		</div>
	);
}

export type AdsAdminShellHeaderProps = HTMLAttributes<HTMLElement>;
function AdsAdminShellHeader({ className, ...props }: AdsAdminShellHeaderProps) {
	return <header {...props} className={classNames('ads-admin-shell-header', className)} />;
}

export type AdsAdminShellBodyProps = HTMLAttributes<HTMLDivElement>;
function AdsAdminShellBody({ className, ...props }: AdsAdminShellBodyProps) {
	return <div {...props} className={classNames('ads-admin-shell-body', className)} />;
}

export type AdsAdminShellMainProps = HTMLAttributes<HTMLElement>;
function AdsAdminShellMain({ className, ...props }: AdsAdminShellMainProps) {
	// No desktop o main é a região rolável: precisa ser alcançável pelo teclado mesmo sem
	// conteúdo focável. O consumidor pode sobrescrever `tabIndex`.
	return <main tabIndex={0} {...props} className={classNames('ads-admin-shell-main', className)} />;
}

export const AdsAdminShell = Object.assign(AdsAdminShellRoot, {
	Root: AdsAdminShellRoot,
	Header: AdsAdminShellHeader,
	NavigationTrigger: AdsAdminShellNavigationTrigger,
	SidebarToggle: AdsAdminShellSidebarToggle,
	Body: AdsAdminShellBody,
	Sidebar: AdsAdminShellSidebar,
	Main: AdsAdminShellMain,
	Navigation: AdsAdminShellNavigation,
	NavigationSection: AdsAdminShellNavigationSection,
	NavigationGroup: AdsAdminShellNavigationGroup,
	NavigationItem: AdsAdminShellNavigationItem,
});

export type {
	AdsAdminShellNavigationTriggerProps,
	AdsAdminShellSidebarProps,
	AdsAdminShellSidebarToggleProps,
};
