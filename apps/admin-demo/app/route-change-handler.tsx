'use client';

import { useAdsAdminShell } from '@dvmarques/admin-ds-admin';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Closes the mobile navigation when the route changes. The shell state survives client-side
 * navigation, so the drawer would otherwise stay open over the new page. It must be rendered
 * inside `AdsAdminShell` but outside `Sidebar`: the drawer does not mount its children while
 * closed, and an effect that closes it on mount would close it right after it opens.
 */
export function RouteChangeHandler() {
	const pathname = usePathname();
	const { setMobileOpen } = useAdsAdminShell();
	const previousPathname = useRef(pathname);

	useEffect(() => {
		if (previousPathname.current === pathname) return;
		previousPathname.current = pathname;
		setMobileOpen(false);
	}, [pathname, setMobileOpen]);

	return null;
}
