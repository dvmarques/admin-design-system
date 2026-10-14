'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
	type ReactNode,
} from 'react';

/** Viewport query shared with the stylesheet breakpoint (48rem). */
const desktopQuery = '(min-width: 48rem)';

function hasMatchMedia() {
	return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

function subscribeToViewport(onChange: () => void) {
	if (!hasMatchMedia()) return () => undefined;
	const query = window.matchMedia(desktopQuery);
	query.addEventListener('change', onChange);
	return () => query.removeEventListener('change', onChange);
}

function getViewportSnapshot() {
	return hasMatchMedia() ? window.matchMedia(desktopQuery).matches : true;
}

/** The server and the first hydration render always assume the desktop layout. */
function getServerViewportSnapshot() {
	return true;
}

export interface AdsAdminShellStateProps {
	children: ReactNode;
	collapsed?: boolean | undefined;
	defaultCollapsed?: boolean | undefined;
	onCollapsedChange?: ((collapsed: boolean) => void) | undefined;
	mobileOpen?: boolean | undefined;
	defaultMobileOpen?: boolean | undefined;
	onMobileOpenChange?: ((open: boolean) => void) | undefined;
}

export interface AdsAdminShellState {
	/** Structural preference of the desktop sidebar. Never affects the mobile drawer. */
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	/** Whether the mobile navigation overlay is effectively open and operable. */
	mobileOpen: boolean;
	setMobileOpen: (open: boolean) => void;
	/** Whether the desktop layout is active. */
	isDesktop: boolean;
}

interface AdminShellContextValue extends AdsAdminShellState {
	mobileNavigationId: string;
	desktopSidebarId: string;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export function useAdminShellContext() {
	const context = useContext(AdminShellContext);
	if (!context) throw new Error('AdsAdminShell components must be used inside AdsAdminShell');
	return context;
}

/** Reads the shell state so consumers can adapt their own content, for example when collapsed. */
export function useAdsAdminShell(): AdsAdminShellState {
	const { collapsed, setCollapsed, mobileOpen, setMobileOpen, isDesktop } = useAdminShellContext();
	return { collapsed, setCollapsed, mobileOpen, setMobileOpen, isDesktop };
}

export function AdsAdminShellStateProvider({
	children,
	collapsed: collapsedProp,
	defaultCollapsed = false,
	onCollapsedChange,
	mobileOpen: mobileOpenProp,
	defaultMobileOpen = false,
	onMobileOpenChange,
}: AdsAdminShellStateProps) {
	const mobileNavigationId = useId();
	const desktopSidebarId = useId();
	const isDesktop = useSyncExternalStore(
		subscribeToViewport,
		getViewportSnapshot,
		getServerViewportSnapshot,
	);

	const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed);
	const collapsed = collapsedProp ?? uncontrolledCollapsed;
	const setCollapsed = useCallback(
		(next: boolean) => {
			if (collapsedProp === undefined) setUncontrolledCollapsed(next);
			onCollapsedChange?.(next);
		},
		[collapsedProp, onCollapsedChange],
	);

	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultMobileOpen);
	const requestedOpen = mobileOpenProp ?? uncontrolledOpen;
	// Transient coordination only: marks that the current `true` already received a close request
	// caused by the breakpoint. It is not a public source of truth for `mobileOpen`.
	const [invalidated, setInvalidated] = useState(false);

	const onMobileOpenChangeRef = useRef(onMobileOpenChange);
	useEffect(() => {
		onMobileOpenChangeRef.current = onMobileOpenChange;
	});

	useEffect(() => {
		if (!requestedOpen) {
			if (invalidated) setInvalidated(false);
			return;
		}
		if (isDesktop && !invalidated) {
			setInvalidated(true);
			if (mobileOpenProp === undefined) setUncontrolledOpen(false);
			onMobileOpenChangeRef.current?.(false);
		}
	}, [invalidated, isDesktop, mobileOpenProp, requestedOpen]);

	const setMobileOpen = useCallback(
		(next: boolean) => {
			if (mobileOpenProp === undefined) setUncontrolledOpen(next);
			onMobileOpenChange?.(next);
		},
		[mobileOpenProp, onMobileOpenChange],
	);

	const mobileOpen = requestedOpen && !isDesktop && !invalidated;

	const value = useMemo<AdminShellContextValue>(
		() => ({
			collapsed,
			setCollapsed,
			mobileOpen,
			setMobileOpen,
			isDesktop,
			mobileNavigationId,
			desktopSidebarId,
		}),
		[
			collapsed,
			setCollapsed,
			mobileOpen,
			setMobileOpen,
			isDesktop,
			mobileNavigationId,
			desktopSidebarId,
		],
	);

	return <AdminShellContext.Provider value={value}>{children}</AdminShellContext.Provider>;
}
