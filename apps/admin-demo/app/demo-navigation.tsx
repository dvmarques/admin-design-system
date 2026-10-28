'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdsAdminShell } from '@admin-ds/admin';
import { AdsIcon, type AdsIconName } from '@admin-ds/components';
import { catalogEntries } from './catalogo/catalog-data';
import { StorybookLink } from './storybook-link';

type NavigationIcon = AdsIconName | { initials: string };
type NavigationItem = { href: string; label: string; icon?: NavigationIcon };
type NavigationGroup = { label: string; icon: NavigationIcon; items: NavigationItem[] };
const overview: NavigationItem[] = [
	{ href: '/', icon: { initials: 'Vg' }, label: 'Visão geral' },
	{ href: '/catalogo', icon: 'search', label: 'Catálogo' },
];
const applications: NavigationItem[] = [
	{ href: '/login', icon: 'user', label: 'Login (exemplo)' },
	{
		href: '/exemplos/codigo-destacado',
		icon: { initials: 'Cd' },
		label: 'Código destacado',
	},
	{ href: '/clientes', icon: { initials: 'Cl' }, label: 'Clientes' },
	{ href: '/clientes/novo', icon: 'plus', label: 'Novo cliente' },
	{ href: '/preferencias', icon: { initials: 'Pr' }, label: 'Preferências' },
	{ href: '/componentes', icon: { initials: 'Co' }, label: 'Componentes' },
	{ href: '/data-display', icon: { initials: 'Ex' }, label: 'Exibição de dados' },
];
function catalogItems(entries: (typeof catalogEntries)[number][]): NavigationItem[] {
	return entries
		.map((entry) => ({ href: entry.href, label: entry.name.replace(/^Ads/, '') }))
		.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
}
const categoryIcons: Record<string, NavigationIcon> = {
	Básicos: { initials: 'Bá' },
	Formulários: 'calendar',
	Navegação: { initials: 'Na' },
	Feedback: 'info',
	Dados: { initials: 'Da' },
};
const componentGroups: NavigationGroup[] = Object.entries(categoryIcons).map(([label, icon]) => ({
	label,
	icon,
	items: catalogItems(catalogEntries.filter((entry) => entry.group === label)),
}));
const adminCategories = [
	{ label: 'Layout e dashboard', icon: { initials: 'La' }, demos: ['AdminShell', 'Dashboard'] },
	{
		label: 'Tabelas e filtros',
		icon: { initials: 'Ta' },
		demos: ['FilterBar', 'SmartTable', 'BulkActionBar'],
	},
	{ label: 'Fluxos', icon: { initials: 'Fl' }, demos: ['ListFlow', 'StepForm', 'ConfirmDialog'] },
	{
		label: 'Conta e contexto',
		icon: { initials: 'Ct' },
		demos: ['AccountMenu', 'NotificationCenter', 'OrganizationSwitcher'],
	},
] satisfies { label: string; icon: NavigationIcon; demos: string[] }[];
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

function NavigationSymbol({ icon }: { icon: NavigationIcon }) {
	return typeof icon === 'string' ? (
		<AdsIcon name={icon} />
	) : (
		<span className="demo-nav-monogram">{icon.initials}</span>
	);
}

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
						<NavigationSymbol icon={item.icon} />
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
			icon={<NavigationSymbol icon={group.icon} />}
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
		<AdsAdminShell.Navigation className="demo-navigation">
			<ul className="demo-shell-nav-list">
				{overview.map((item) => (
					<NavigationLink key={item.href} item={item} pathname={pathname} />
				))}
				<StorybookLink />
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
