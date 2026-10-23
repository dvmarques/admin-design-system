'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { catalogEntries } from './catalogo/catalog-data';

type NavigationItem = { href: string; initials: string; label: string };
type NavigationGroup = { label: string; items: NavigationItem[] };
export const demoNavigationGroups: NavigationGroup[] = [
	{
		label: 'Visão geral e catálogo',
		items: [
			{ href: '/', initials: 'Vg', label: 'Visão geral' },
			{ href: '/catalogo', initials: 'Ca', label: 'Catálogo' },
		],
	},
	...['Básicos', 'Formulários', 'Navegação', 'Feedback', 'Dados', 'Admin'].map((group) => ({
		label: group,
		items: catalogEntries
			.filter((entry) => entry.group === group)
			.map((entry) => ({
				href: entry.href,
				initials: entry.name.replace('Ads', '').slice(0, 2),
				label: entry.name,
			})),
	})),
	{
		label: 'Exemplos de aplicação',
		items: [
			{ href: '/clientes', initials: 'Cl', label: 'Clientes' },
			{ href: '/clientes/novo', initials: 'Nc', label: 'Novo cliente' },
			{ href: '/preferencias', initials: 'Pr', label: 'Preferências' },
			{ href: '/componentes', initials: 'Co', label: 'Componentes' },
			{ href: '/data-display', initials: 'Ex', label: 'Exibição de dados' },
		],
	},
];
export const demoNavigationItems = demoNavigationGroups.flatMap((group) => group.items);

export function DemoNavigation() {
	const pathname = usePathname();
	return (
		<div>
			{demoNavigationGroups.map((group) => (
				<details
					className="demo-nav-group"
					key={`${group.label}-${pathname}`}
					open={
						group.items.some((item) => item.href === pathname) ||
						group.label === 'Visão geral e catálogo' ||
						group.label === 'Exemplos de aplicação'
					}
				>
					<summary className="demo-nav-group-title">
						<span className="ads-admin-shell-sidebar-label">{group.label}</span>
					</summary>
					<ul className="demo-shell-nav-list">
						{group.items.map((item) => (
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
				</details>
			))}
		</div>
	);
}
