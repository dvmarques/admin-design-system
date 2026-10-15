'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const demoNavigationItems = [
	{ href: '/', initials: 'Vg', label: 'Visão geral' },
	{ href: '/componentes', initials: 'Co', label: 'Componentes' },
	{ href: '/data-display', initials: 'Ex', label: 'Exibição de dados' },
] as const;

/** Main navigation content for `AdsAdminShell.Sidebar`; links come from the application. */
export function DemoNavigation() {
	const pathname = usePathname();

	return (
		<ul className="demo-shell-nav-list">
			{demoNavigationItems.map((item) => (
				<li key={item.href}>
					<Link
						aria-current={pathname === item.href ? 'page' : undefined}
						className="demo-shell-nav-link"
						href={item.href}
					>
						<span aria-hidden="true" className="demo-nav-initial">
							{item.initials}
						</span>
						<span className="ads-admin-shell-sidebar-label">{item.label}</span>
					</Link>
				</li>
			))}
		</ul>
	);
}
