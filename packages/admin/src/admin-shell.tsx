import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from './class-names.js';
import {
	AdsAdminShellMobileSidebar,
	AdsAdminShellNavigationProvider,
	AdsAdminShellNavigationTrigger,
	type AdsAdminShellNavigationTriggerProps,
} from './admin-shell-navigation.js';

export interface AdsAdminShellProps extends HTMLAttributes<HTMLDivElement> {
	defaultNavigationOpen?: boolean;
	navigationOpen?: boolean;
	onNavigationOpenChange?: (open: boolean) => void;
}

function AdsAdminShellRoot({
	children,
	className,
	defaultNavigationOpen,
	navigationOpen,
	onNavigationOpenChange,
	...props
}: AdsAdminShellProps) {
	return (
		<div {...props} className={classNames('ads-admin-shell', className)}>
			<AdsAdminShellNavigationProvider
				defaultNavigationOpen={defaultNavigationOpen}
				navigationOpen={navigationOpen}
				onNavigationOpenChange={onNavigationOpenChange}
			>
				{children}
			</AdsAdminShellNavigationProvider>
		</div>
	);
}

export type AdsAdminShellHeaderProps = HTMLAttributes<HTMLElement>;
function AdsAdminShellHeader({ className, ...props }: AdsAdminShellHeaderProps) {
	return <header {...props} className={classNames('ads-admin-shell-header', className)} />;
}

export interface AdsAdminShellSidebarProps extends HTMLAttributes<HTMLElement> {
	label?: string;
	mobileTitle?: ReactNode;
}
function AdsAdminShellSidebar({
	children,
	className,
	label = 'Navegação principal',
	mobileTitle,
	...props
}: AdsAdminShellSidebarProps) {
	const navigationClassName = classNames('ads-admin-shell-sidebar', className);

	return (
		<>
			<aside className="ads-admin-shell-sidebar-desktop">
				<nav {...props} aria-label={label} className={navigationClassName}>
					{children}
				</nav>
			</aside>
			<AdsAdminShellMobileSidebar
				{...props}
				className={className}
				label={label}
				mobileTitle={mobileTitle}
			>
				{children}
			</AdsAdminShellMobileSidebar>
		</>
	);
}

export type AdsAdminShellBodyProps = HTMLAttributes<HTMLDivElement>;
function AdsAdminShellBody({ className, ...props }: AdsAdminShellBodyProps) {
	return <div {...props} className={classNames('ads-admin-shell-body', className)} />;
}

export type AdsAdminShellMainProps = HTMLAttributes<HTMLElement>;
function AdsAdminShellMain({ className, ...props }: AdsAdminShellMainProps) {
	return <main {...props} className={classNames('ads-admin-shell-main', className)} />;
}

export const AdsAdminShell = Object.assign(AdsAdminShellRoot, {
	Root: AdsAdminShellRoot,
	Header: AdsAdminShellHeader,
	NavigationTrigger: AdsAdminShellNavigationTrigger,
	Body: AdsAdminShellBody,
	Sidebar: AdsAdminShellSidebar,
	Main: AdsAdminShellMain,
});

export type { AdsAdminShellNavigationTriggerProps };
