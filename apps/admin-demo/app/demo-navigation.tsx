'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdsAdminShell } from '@admin-ds/admin';
import { AdsIcon, type AdsIconName } from '@admin-ds/components';
import { catalogEntries } from './catalogo/catalog-data';

type NavigationItem = { href: string; label: string; icon?: AdsIconName };
type NavigationGroup = { label: string; icon: AdsIconName; items: NavigationItem[] };
const overview: NavigationItem[] = [
	{ href: '/', icon: 'info', label: 'Visão geral' },
	{ href: '/catalogo', icon: 'search', label: 'Catálogo' },
];
const applications: NavigationItem[] = [
	{ href: '/clientes', icon: 'check', label: 'Clientes' },
	{ href: '/clientes/novo', icon: 'plus', label: 'Novo cliente' },
	{ href: '/preferencias', icon: 'info', label: 'Preferências' },
	{ href: '/componentes', icon: 'plus', label: 'Componentes' },
	{ href: '/data-display', icon: 'search', label: 'Exibição de dados' },
];
function catalogItems(entries: (typeof catalogEntries)[number][]): NavigationItem[] {
	return entries.map((entry) => ({ href: entry.href, label: entry.name.replace(/^Ads/, '') }));
}
const categoryIcons: Record<string, AdsIconName> = {
	Básicos: 'plus',
	Formulários: 'calendar',
	Navegação: 'chevronRight',
	Feedback: 'info',
	Dados: 'search',
};
const componentGroups: NavigationGroup[] = Object.entries(categoryIcons).map(([label, icon]) => ({
	label,
	icon,
	items: catalogItems(catalogEntries.filter((entry) => entry.group === label)),
}));
const adminCategories = [
	{ label: 'Layout e dashboard', icon: 'plus', demos: ['AdminShell', 'Dashboard'] },
	{
		label: 'Tabelas e filtros',
		icon: 'search',
		demos: ['FilterBar', 'SmartTable', 'BulkActionBar'],
	},
	{ label: 'Fluxos', icon: 'check', demos: ['ListFlow', 'StepForm', 'ConfirmDialog'] },
] satisfies { label: string; icon: AdsIconName; demos: string[] }[];
const adminGroups: NavigationGroup[] = adminCategories.map(({ label, icon, demos }) => ({
	label,
	icon,
	items: catalogItems(
		catalogEntries.filter((entry) => entry.group === 'Admin' && demos.includes(entry.demo)),
	),
}));
export const demoNavigationGroups = [...componentGroups, ...adminGroups];
export const demoNavigationItems = [
	...overview,
	...demoNavigationGroups.flatMap((g) => g.items),
	...applications,
];

function NavigationLink({ item, pathname }: { item: NavigationItem; pathname: string }) {
	return (
		<AdsAdminShell.NavigationItem>
			<Link
				href={item.href}
				aria-current={pathname === item.href ? 'page' : undefined}
				title={item.label}
			>
				{item.icon && (
					<span aria-hidden="true" className="ads-sidebar-icon">
						<AdsIcon name={item.icon} />
					</span>
				)}
				<span className={item.icon ? 'ads-admin-shell-sidebar-label' : undefined}>
					{item.label}
				</span>
			</Link>
		</AdsAdminShell.NavigationItem>
	);
}
function DemoNavigationGroup({ group, pathname }: { group: NavigationGroup; pathname: string }) {
	const active = group.items.some((item) => item.href === pathname);
	const [expanded, setExpanded] = useState(active);
	useEffect(() => {
		if (active) setExpanded(true);
	}, [active, pathname]);
	return (
		<AdsAdminShell.NavigationGroup
			label={group.label}
			icon={<AdsIcon name={group.icon} />}
			open={expanded}
			onToggle={(event) => setExpanded(event.currentTarget.open)}
		>
			{group.items.map((item) => (
				<NavigationLink key={item.href} item={item} pathname={pathname} />
			))}
		</AdsAdminShell.NavigationGroup>
	);
}
export function DemoNavigation() {
	const pathname = usePathname();
	return (
		<AdsAdminShell.Navigation>
			<ul className="demo-shell-nav-list">
				{overview.map((item) => (
					<NavigationLink key={item.href} item={item} pathname={pathname} />
				))}
			</ul>
			<AdsAdminShell.NavigationSection label="Componentes">
				{componentGroups.map((group) => (
					<DemoNavigationGroup key={group.label} group={group} pathname={pathname} />
				))}
			</AdsAdminShell.NavigationSection>
			<AdsAdminShell.NavigationSection label="Composições administrativas">
				{adminGroups.map((group) => (
					<DemoNavigationGroup key={group.label} group={group} pathname={pathname} />
				))}
			</AdsAdminShell.NavigationSection>
			<AdsAdminShell.NavigationSection label="Exemplos de aplicação">
				<ul className="demo-shell-nav-list">
					{applications.map((item) => (
						<NavigationLink key={item.href} item={item} pathname={pathname} />
					))}
				</ul>
			</AdsAdminShell.NavigationSection>
		</AdsAdminShell.Navigation>
	);
}
