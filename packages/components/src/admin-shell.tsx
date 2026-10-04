'use client';

import {
	createContext,
	useContext,
	useId,
	useState,
	type HTMLAttributes,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';
import { AdsDrawer } from './overlay-dialog.js';

interface AdminShellContextValue {
	mobileNavigationOpen: boolean;
	setMobileNavigationOpen: (open: boolean) => void;
	navigationId: string;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

function useAdminShell() {
	const context = useContext(AdminShellContext);
	if (!context) throw new Error('AdsAdminShell components must be used inside AdsAdminShell');
	return context;
}

export interface AdsAdminShellProps extends HTMLAttributes<HTMLDivElement> {
	defaultNavigationOpen?: boolean;
	navigationOpen?: boolean;
	onNavigationOpenChange?: (open: boolean) => void;
}

function AdsAdminShellRoot({
	children,
	className,
	defaultNavigationOpen = false,
	navigationOpen,
	onNavigationOpenChange,
	...props
}: AdsAdminShellProps) {
	const navigationId = useId();
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultNavigationOpen);
	const mobileNavigationOpen = navigationOpen ?? uncontrolledOpen;
	const setMobileNavigationOpen = (open: boolean) => {
		if (navigationOpen === undefined) setUncontrolledOpen(open);
		onNavigationOpenChange?.(open);
	};

	return (
		<AdminShellContext.Provider
			value={{ mobileNavigationOpen, setMobileNavigationOpen, navigationId }}
		>
			<div
				{...props}
				className={classNames(
					'ads-admin-shell min-h-screen bg-background font-sans text-text',
					className,
				)}
			>
				{children}
			</div>
		</AdminShellContext.Provider>
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

export interface AdsAdminShellNavigationTriggerProps
	extends HTMLAttributes<HTMLButtonElement> {
	label?: string;
}
function AdsAdminShellNavigationTrigger({
	className,
	label = 'Abrir navegação',
	onClick,
	...props
}: AdsAdminShellNavigationTriggerProps) {
	const { mobileNavigationOpen, setMobileNavigationOpen, navigationId } = useAdminShell();
	return (
		<button
			{...props}
			aria-controls={navigationId}
			aria-expanded={mobileNavigationOpen}
			aria-label={label}
			className={classNames(
				'ads-admin-shell-navigation-trigger inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-text transition-colors hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring md:hidden',
				className,
			)}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) setMobileNavigationOpen(true);
			}}
			type="button"
		>
			<span aria-hidden="true" className="flex flex-col gap-1">
				<span className="block h-0.5 w-5 bg-current" />
				<span className="block h-0.5 w-5 bg-current" />
				<span className="block h-0.5 w-5 bg-current" />
			</span>
		</button>
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
	mobileTitle = 'Navegação',
	...props
}: AdsAdminShellSidebarProps) {
	const { mobileNavigationOpen, setMobileNavigationOpen, navigationId } = useAdminShell();
	const navigation = (
		<nav
			{...props}
			aria-label={label}
			className={classNames(
				'ads-admin-shell-sidebar h-full overflow-y-auto bg-surface-raised p-4 text-text',
				className,
			)}
			id={navigationId}
		>
			{children}
		</nav>
	);

	return (
		<>
			<aside className="ads-admin-shell-sidebar-desktop hidden w-64 shrink-0 border-r border-border md:block">
				{navigation}
			</aside>
			<div className="md:hidden">
				<AdsDrawer
					closeLabel="Fechar navegação"
					onOpenChange={setMobileNavigationOpen}
					open={mobileNavigationOpen}
					placement="left"
					title={mobileTitle}
				>
					{navigation}
				</AdsDrawer>
			</div>
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
