'use client';

import { AdsDrawer } from '@admin-ds/components';
import {
	useEffect,
	useRef,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
} from 'react';
import { useAdminShellContext } from './admin-shell-state.js';
import { classNames } from './class-names.js';

export interface AdsAdminShellNavigationTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
}

export function AdsAdminShellNavigationTrigger({
	className,
	label = 'Abrir navegação',
	onClick,
	...props
}: AdsAdminShellNavigationTriggerProps) {
	const { mobileOpen, setMobileOpen, mobileNavigationId } = useAdminShellContext();
	return (
		<button
			{...props}
			aria-controls={mobileNavigationId}
			aria-expanded={mobileOpen}
			aria-label={label}
			className={classNames('ads-admin-shell-navigation-trigger', className)}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) setMobileOpen(true);
			}}
			type={props.type ?? 'button'}
		>
			<span aria-hidden="true" className="ads-admin-shell-navigation-icon">
				<span className="ads-admin-shell-navigation-icon-bar" />
				<span className="ads-admin-shell-navigation-icon-bar" />
				<span className="ads-admin-shell-navigation-icon-bar" />
			</span>
		</button>
	);
}

export interface AdsAdminShellSidebarToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	collapseLabel?: string;
	expandLabel?: string;
}

/** Collapses or expands the desktop sidebar. Hidden in the mobile layout. */
export function AdsAdminShellSidebarToggle({
	className,
	collapseLabel = 'Recolher barra lateral',
	expandLabel = 'Expandir barra lateral',
	onClick,
	...props
}: AdsAdminShellSidebarToggleProps) {
	const { collapsed, setCollapsed, desktopSidebarId } = useAdminShellContext();
	return (
		<button
			{...props}
			aria-controls={desktopSidebarId}
			aria-expanded={!collapsed}
			aria-label={collapsed ? expandLabel : collapseLabel}
			className={classNames('ads-admin-shell-sidebar-toggle', className)}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) setCollapsed(!collapsed);
			}}
			type={props.type ?? 'button'}
		>
			<span aria-hidden="true" className="ads-admin-shell-sidebar-toggle-icon" />
		</button>
	);
}

export interface AdsAdminShellSidebarProps extends HTMLAttributes<HTMLElement> {
	label?: string;
	mobileTitle?: ReactNode;
}

/**
 * Keeps a single logical instance of the navigation content: the persistent sidebar on desktop
 * and the drawer on mobile are never mounted at the same time.
 */
export function AdsAdminShellSidebar({
	children,
	className,
	label = 'Navegação principal',
	mobileTitle,
	...props
}: AdsAdminShellSidebarProps) {
	const { collapsed, desktopSidebarId, isDesktop, mobileNavigationId, mobileOpen, setMobileOpen } =
		useAdminShellContext();
	const desktopNavigationRef = useRef<HTMLElement>(null);
	const wasMobileOpenRef = useRef(mobileOpen);

	useEffect(() => {
		// The drawer is unmounted when the desktop layout takes over, so its own focus restoration
		// cannot run and the trigger is hidden. Move focus to a valid mounted element instead.
		if (isDesktop && wasMobileOpenRef.current) {
			const active = document.activeElement;
			const lost = !active || active === document.body || !active.isConnected;
			// The shell hides its own mobile trigger on desktop, so it cannot keep focus either.
			const hiddenTrigger = active?.matches('.ads-admin-shell-navigation-trigger') ?? false;
			if (lost || hiddenTrigger) desktopNavigationRef.current?.focus();
		}
		wasMobileOpenRef.current = mobileOpen;
	}, [isDesktop, mobileOpen]);

	const navigationClassName = classNames('ads-admin-shell-sidebar', className);

	if (isDesktop) {
		return (
			<aside
				className="ads-admin-shell-sidebar-desktop"
				data-collapsed={collapsed ? 'true' : 'false'}
				id={desktopSidebarId}
			>
				<nav
					{...props}
					aria-label={label}
					className={navigationClassName}
					ref={desktopNavigationRef}
					tabIndex={-1}
				>
					{children}
				</nav>
			</aside>
		);
	}

	return (
		<AdsDrawer
			aria-label={label}
			className="ads-admin-shell-mobile-drawer"
			closeLabel="Fechar navegação"
			id={mobileNavigationId}
			onOpenChange={setMobileOpen}
			open={mobileOpen}
			placement="left"
			title={mobileTitle}
		>
			<nav {...props} aria-label={label} className={navigationClassName}>
				{children}
			</nav>
		</AdsDrawer>
	);
}
