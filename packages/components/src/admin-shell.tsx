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
		<div
			{...props}
			className={classNames(
				'ads-admin-shell min-h-screen bg-background font-sans text-text',
				className,
			)}
		>
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
	return (
		<header
			{...props}
			className={classNames(
				'ads-admin-shell-header sticky top-0 z-30 flex min-h-16 items-center gap-4 border-b border-border bg-surface px-4 shadow-sm md:px-6',
				className,
			)}
		/>
	);
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
	const navigationClassName = classNames(
		'ads-admin-shell-sidebar h-full overflow-y-auto bg-surface-raised p-4 text-text',
		className,
	);

	return (
		<>
			<aside className="ads-admin-shell-sidebar-desktop hidden w-64 shrink-0 border-r border-border md:block">
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
	return (
		<div
			{...props}
			className={classNames('ads-admin-shell-body flex min-h-[calc(100vh-4rem)]', className)}
		/>
	);
}

export type AdsAdminShellMainProps = HTMLAttributes<HTMLElement>;
function AdsAdminShellMain({ className, ...props }: AdsAdminShellMainProps) {
	return (
		<main
			{...props}
			className={classNames(
				'ads-admin-shell-main min-w-0 flex-1 bg-background p-4 md:p-6',
				className,
			)}
		/>
	);
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
