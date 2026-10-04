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
import { AdsDrawer } from './overlay-dialog.js';

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
			className={classNames(
				'ads-admin-shell-navigation-trigger inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-text transition-colors hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring md:hidden',
				className,
			)}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) setMobileNavigationOpen(true);
			}}
			type={props.type ?? 'button'}
		>
			<span aria-hidden="true" className="flex flex-col gap-1">
				<span className="block h-0.5 w-5 bg-current" />
				<span className="block h-0.5 w-5 bg-current" />
				<span className="block h-0.5 w-5 bg-current" />
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
			className="md:hidden"
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
				className={classNames(
					'ads-admin-shell-sidebar h-full overflow-y-auto bg-surface-raised p-4 text-text',
					className,
				)}
			>
				{children}
			</nav>
		</AdsDrawer>
	);
}
