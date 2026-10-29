import { catalogEntries } from './catalog-data';

/** A página canônica representa a família; cada export ainda possui um índice de busca e URL legada. */
export const catalogFamilies = [
	{
		title: 'Tabs',
		root: 'AdsTabs',
		members: ['AdsTabs', 'AdsTabsList', 'AdsTabsTrigger', 'AdsTabsPanel'],
		aliases: ['AdsTabs.Root', 'AdsTabs.List', 'AdsTabs.Trigger', 'AdsTabs.Panel'],
	},
	{
		title: 'Accordion',
		root: 'AdsAccordion',
		members: [
			'AdsAccordion',
			'AdsAccordionHeader',
			'AdsAccordionItem',
			'AdsAccordionTrigger',
			'AdsAccordionPanel',
		],
		aliases: [
			'AdsAccordion.Root',
			'AdsAccordion.Header',
			'AdsAccordion.Item',
			'AdsAccordion.Trigger',
			'AdsAccordion.Panel',
		],
	},
	{
		title: 'Field',
		root: 'AdsField',
		members: ['AdsField', 'AdsFieldLabel', 'AdsFieldDescription', 'AdsFieldMessage'],
		aliases: [],
	},
	{
		title: 'Table',
		root: 'AdsTable',
		members: [
			'AdsTable',
			'AdsTableHead',
			'AdsTableBody',
			'AdsTableHeader',
			'AdsTableRow',
			'AdsTableCell',
			'AdsTableCaption',
		],
		aliases: [],
	},
	{
		title: 'Card',
		root: 'AdsCard',
		members: ['AdsCard', 'AdsCardHeader', 'AdsCardContent', 'AdsCardActions'],
		aliases: [],
	},
	{
		title: 'List',
		root: 'AdsList',
		members: ['AdsList', 'AdsListItem'],
		aliases: [],
	},
	{
		title: 'Dropdown',
		root: 'AdsDropdown',
		members: ['AdsDropdown', 'AdsDropdown.Trigger', 'AdsDropdown.Content', 'AdsDropdown.Item'],
		aliases: [],
	},
	{
		title: 'Dashboard',
		root: 'AdsDashboardGrid',
		members: ['AdsDashboardGrid', 'AdsDashboardPanel', 'AdsMetricCard'],
		aliases: [],
	},
	{
		title: 'AdminShell',
		root: 'AdsAdminShell',
		members: [
			'AdsAdminShell',
			'AdsAdminShell.Root',
			'AdsAdminShell.Header',
			'AdsAdminShell.Body',
			'AdsAdminShell.Main',
			'AdsAdminShell.Sidebar',
			'AdsAdminShell.SidebarToggle',
			'AdsAdminShell.NavigationTrigger',
			'AdsAdminShell.Navigation',
			'AdsAdminShell.NavigationSection',
			'AdsAdminShell.NavigationGroup',
			'AdsAdminShell.NavigationItem',
		],
		aliases: [],
	},
] as const;

type CatalogFamily = (typeof catalogFamilies)[number];

/** IDs não dependem de ordem: links compartilhados permanecem estáveis. */
export function catalogMemberAnchor(name: string) {
	return name
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[^a-zA-Z0-9]+/g, '-')
		.toLowerCase();
}

export function catalogFamilyForName(name: string): CatalogFamily | undefined {
	return catalogFamilies.find(
		(family) =>
			(family.members as readonly string[]).includes(name) ||
			(family.aliases as readonly string[]).includes(name),
	);
}

export function catalogFamilyRoot(name: string) {
	const rootName = catalogFamilyForName(name)?.root ?? name;
	return catalogEntries.find((entry) => entry.name === rootName);
}

export function canonicalCatalogPath(pathname: string) {
	const entry = catalogEntries.find((item) => item.href === pathname);
	return entry ? (catalogFamilyRoot(entry.name)?.href ?? pathname) : pathname;
}

export function catalogMemberHref(name: string) {
	const family = catalogFamilyForName(name);
	const root = catalogFamilyRoot(name);
	if (!root) return '/catalogo';
	if (!family || name === root.name) return root.href;
	// Propriedades compostas sem export nomeado (Dropdown.Trigger, AdminShell.Main)
	// usam o nome público exato como âncora; normalizar pontos e PascalCase resulta
	// no mesmo slug, sem pressupor um export inexistente.
	const isRootAlias =
		name.endsWith('.Root') && (family.aliases as readonly string[]).includes(name);
	const resolved = isRootAlias ? root.name : name;
	return resolved === root.name ? root.href : `${root.href}#${catalogMemberAnchor(resolved)}`;
}

export function catalogFamilyMembers(exportName: string) {
	const family = catalogFamilyForName(exportName);
	return family ? [...family.members] : [exportName];
}

// A busca mantém uma entrada por export e inclui aliases reais de APIs compostas.
export const catalogSearchEntries = [
	...catalogEntries.map((entry) => ({
		name: entry.name as string,
		group: entry.group as string,
		description: entry.description as string,
		href: catalogMemberHref(entry.name),
		family: catalogFamilyForName(entry.name)?.title ?? null,
	})),
	...catalogFamilies.flatMap((family) =>
		[...family.members, ...family.aliases]
			.filter((name) => !catalogEntries.some((entry) => entry.name === name))
			.map((name) => ({
				name: name as string,
				group: catalogFamilyRoot(family.root)?.group ?? 'Admin',
				description: `Parte pública da família ${family.title}; consulte sua documentação e a composição completa.`,
				href: catalogMemberHref(name),
				family: family.title as string,
			})),
	),
];
