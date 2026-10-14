'use client';

import {
	createContext,
	useContext,
	useId,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';
import { AdsDrawer } from '@admin-ds/components';

interface AdminShellContextValue {
	mobileNavigationOpen: boolean;
	setMobileNavigationOpen: (open: boolean) => void;
	mobileNavigationId: string;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

function useAdminShell() {
	const context = useContext(AdminShellContext);
	if (!context) throw new Error('AdsAdminShell components must be used inside AdsAdminShell');
	return context;
}

export interface AdsAdminShellNavigationProviderProps {
	children: ReactNode;
	defaultNavigationOpen?: boolean | undefined;
	navigationOpen?: boolean | undefined;
	onNavigationOpenChange?: ((open: boolean) => void) | undefined;
}

export function AdsAdminShellNavigationProvider({
	children,
	defaultNavigationOpen = false,
	navigationOpen,
	onNavigationOpenChange,
}: AdsAdminShellNavigationProviderProps) {
	const mobileNavigationId = useId();
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultNavigationOpen);
	const mobileNavigationOpen = navigationOpen ?? uncontrolledOpen;
	const setMobileNavigationOpen = (open: boolean) => {
		if (navigationOpen === undefined) setUncontrolledOpen(open);
		onNavigationOpenChange?.(open);
	};

	return (
		<AdminShellContext.Provider
			value={{ mobileNavigationOpen, setMobileNavigationOpen, mobileNavigationId }}
		>
			{children}
		</AdminShellContext.Provider>
	);
}

export interface AdsAdminShellNavigationTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
}

export function AdsAdminShellNavigationTrigger({
	className,
	label = 'Abrir navegação',
	onClick,
	...props
}: AdsAdminShellNavigationTriggerProps) {
	const { mobileNavigationOpen, setMobileNavigationOpen, mobileNavigationId } = useAdminShell();
	return (
		<button
			{...props}
			aria-controls={mobileNavigationId}
			aria-expanded={mobileNavigationOpen}
			aria-label={label}
			className={classNames('ads-admin-shell-navigation-trigger', className)}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) setMobileNavigationOpen(true);
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

export interface AdsAdminShellMobileSidebarProps extends HTMLAttributes<HTMLElement> {
	label: string;
	mobileTitle: ReactNode;
}

export function AdsAdminShellMobileSidebar({
	children,
	className,
	label,
	mobileTitle,
	...props
}: AdsAdminShellMobileSidebarProps) {
	const { mobileNavigationOpen, setMobileNavigationOpen, mobileNavigationId } = useAdminShell();
	return (
		<AdsDrawer
			aria-label={label}
			className="ads-admin-shell-mobile-drawer"
			closeLabel="Fechar navegação"
			id={mobileNavigationId}
			onOpenChange={setMobileNavigationOpen}
			open={mobileNavigationOpen}
			placement="left"
			title={mobileTitle}
		>
			<nav
				{...props}
				aria-label={label}
				className={classNames('ads-admin-shell-sidebar', className)}
			>
				{children}
			</nav>
		</AdsDrawer>
	);
}
