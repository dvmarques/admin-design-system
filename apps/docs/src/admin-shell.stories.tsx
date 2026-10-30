import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsAdminShell,
	AdsOrganizationSwitcher,
	useAdsAdminShell,
} from '@dvmarques/admin-ds-admin';
import {
	AdsBadge,
	AdsButton,
	AdsCard,
	AdsIcon,
	AdsTypography,
	ThemeToggle,
} from '@dvmarques/admin-ds-components';
import { useState, type CSSProperties } from 'react';

const meta: Meta<typeof AdsAdminShell> = {
	title: 'Layout/Admin Shell',
	component: AdsAdminShell,
	tags: ['autodocs'],
	argTypes: {
		layout: {
			description:
				'standard preserva o layout normal; sidebar-header alinha o topo da Sidebar ao Header.',
			options: ['standard', 'sidebar-header'],
			control: 'select',
			table: {
				type: { summary: "'standard' | 'sidebar-header'" },
				defaultValue: { summary: 'standard' },
			},
		},
		collapsed: {
			description:
				'Estado controlado de recolhimento da navegação desktop; não abre nem fecha o drawer móvel.',
			table: { type: { summary: 'boolean' }, defaultValue: { summary: 'uncontrolled' } },
		},
		defaultCollapsed: {
			description: 'Valor inicial de recolhimento desktop na variante não controlada.',
			table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
		},
		mobileOpen: {
			description: 'Estado controlado de abertura do drawer no mobile, independente de collapsed.',
			table: { type: { summary: 'boolean' }, defaultValue: { summary: 'uncontrolled' } },
		},
		defaultMobileOpen: {
			description: 'Valor inicial da abertura do drawer móvel na variante não controlada.',
			table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Estrutura administrativa com header, sidebar e conteúdo principal. A sidebar persistente (desktop) e o drawer (mobile) nunca são montados ao mesmo tempo. `collapsed` afeta somente a sidebar desktop; `mobileOpen` é um estado separado. Ambos aceitam modo controlado e não controlado. A persistência de preferências pertence à aplicação consumidora. **Composição pública:** AdsAdminShell.Header e .Body definem a estrutura; .Sidebar e .Main definem as regiões; .NavigationTrigger controla o drawer mobile; .SidebarToggle alterna a largura desktop. .Navigation, .NavigationSection, .NavigationGroup e .NavigationItem compõem o menu acessível com contexto do shell. A propriedade opcional Sidebar.header permite o branding alinhado em layout=sidebar-header. O hook useAdsAdminShell lê o contexto, e não deve ser usado fora de AdsAdminShell. As partes aninhadas não são inferidas individualmente pelo docgen: consulte as stories de navegação hierárquica, menu móvel e rolagem independente e os contratos de types em packages/admin/src/admin-shell.tsx e sidebar-navigation.tsx. As ações por teclado mantêm foco e rótulos ARIA.',
			},
		},
	},
};
export default meta;
type Story = StoryObj<typeof meta>;

const items = ['Visão geral', 'Clientes', 'Assinaturas', 'Relatórios', 'Configurações'];

/** Conteúdo completo, igual no desktop expandido e no drawer mobile. */
function Navigation() {
	return (
		<ul className="m-0 grid list-none gap-1 p-0">
			{items.map((item, index) => (
				<li key={item}>
					<a
						aria-current={index === 0 ? 'page' : undefined}
						className="block rounded-md px-3 py-2 text-sm text-text hover:bg-surface-hover aria-[current=page]:bg-surface-selected aria-[current=page]:font-medium"
						href={`#${index}`}
					>
						{item}
					</a>
				</li>
			))}
		</ul>
	);
}

/**
 * Adaptação explícita do consumidor ao estado recolhido do desktop. O shell expõe o estado, mas
 * não converte o conteúdo automaticamente; no drawer mobile a navegação segue completa por padrão.
 */
function AdaptiveNavigation() {
	const { collapsed, isDesktop } = useAdsAdminShell();
	const compact = collapsed && isDesktop;
	return (
		<ul className="m-0 grid list-none gap-1 p-0">
			{items.map((item, index) => (
				<li key={item}>
					<a
						aria-current={index === 0 ? 'page' : undefined}
						aria-label={compact ? item : undefined}
						className="block rounded-md px-3 py-2 text-sm text-text hover:bg-surface-hover aria-[current=page]:bg-surface-selected aria-[current=page]:font-medium"
						href={`#${index}`}
						title={compact ? item : undefined}
					>
						{compact ? item.charAt(0) : item}
					</a>
				</li>
			))}
		</ul>
	);
}

function PageContent() {
	return (
		<div className="mx-auto grid max-w-5xl gap-6">
			<div>
				<AdsTypography as="h1" variant="heading2">
					Visão geral
				</AdsTypography>
				<AdsTypography variant="muted">
					Estrutura administrativa reutilizável do Admin Design System.
				</AdsTypography>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				{['Clientes', 'Assinaturas', 'Receita'].map((label) => (
					<AdsCard key={label}>
						<AdsTypography variant="muted">{label}</AdsTypography>
						<AdsTypography as="p" variant="heading3">
							—
						</AdsTypography>
					</AdsCard>
				))}
			</div>
		</div>
	);
}

/** Branding, ações e controle de tema compostos pela aplicação, sem props de domínio no shell. */
function HeaderContent() {
	return (
		<>
			<AdsAdminShell.NavigationTrigger />
			<AdsAdminShell.SidebarToggle />
			<AdsTypography as="strong" variant="heading4">
				Admin Demo
			</AdsTypography>
			<div className="ml-auto flex flex-wrap items-center gap-2">
				<AdsBadge>Produção</AdsBadge>
				<ThemeToggle />
				<AdsButton size="sm" variant="secondary">
					Conta
				</AdsButton>
			</div>
		</>
	);
}

function ShellExample(props: Omit<React.ComponentProps<typeof AdsAdminShell>, 'children'>) {
	return (
		<AdsAdminShell {...props}>
			<AdsAdminShell.Header>
				<HeaderContent />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar mobileTitle="Menu">
					<Navigation />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<PageContent />
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}

export const Default: Story = {
	render: () => <ShellExample />,
};

export const HierarchicalNavigation: Story = {
	name: 'Navegação com seções, grupos e itens',
	render: () => (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<HeaderContent />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar mobileTitle="Menu">
					<AdsAdminShell.Navigation>
						<AdsAdminShell.NavigationSection label="Componentes">
							<AdsAdminShell.NavigationGroup label="Básicos" icon={<AdsIcon name="plus" />} open>
								<AdsAdminShell.NavigationItem>
									<a href="#button" aria-current="page">
										Button
									</a>
								</AdsAdminShell.NavigationItem>
								<AdsAdminShell.NavigationItem>
									<a href="#badge">Badge</a>
								</AdsAdminShell.NavigationItem>
							</AdsAdminShell.NavigationGroup>
							<AdsAdminShell.NavigationGroup label="Formulários" icon={<AdsIcon name="calendar" />}>
								<AdsAdminShell.NavigationItem>
									<a href="#input">Input</a>
								</AdsAdminShell.NavigationItem>
							</AdsAdminShell.NavigationGroup>
						</AdsAdminShell.NavigationSection>
					</AdsAdminShell.Navigation>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<PageContent />
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	),
};

/** Desktop: header e sidebar ficam fixos; sidebar e conteúdo rolam de forma independente. */
export const LongPageIndependentScroll: Story = {
	name: 'Página longa com rolagem independente',
	render: () => (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<HeaderContent />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar mobileTitle="Menu">
					<AdsAdminShell.Navigation>
						<AdsAdminShell.NavigationSection label="Páginas">
							{Array.from({ length: 40 }, (_, index) => (
								<AdsAdminShell.NavigationItem key={index}>
									<a href={`#pagina-${index + 1}`}>Página {index + 1}</a>
								</AdsAdminShell.NavigationItem>
							))}
						</AdsAdminShell.NavigationSection>
					</AdsAdminShell.Navigation>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					{Array.from({ length: 12 }, (_, index) => (
						<PageContent key={index} />
					))}
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	),
	parameters: { layout: 'fullscreen' },
};

export const DesktopCollapsed: Story = {
	name: 'Desktop recolhido (não controlado)',
	render: () => (
		<AdsAdminShell defaultCollapsed>
			<AdsAdminShell.Header>
				<HeaderContent />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar mobileTitle="Menu">
					<AdaptiveNavigation />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<PageContent />
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	),
};

/** Estado controlado e persistência externa: o shell nunca persiste a preferência. */
function ControlledShell() {
	const [collapsed, setCollapsed] = useState(() => {
		try {
			return window.localStorage.getItem('ads-demo-sidebar-collapsed') === 'true';
		} catch {
			return false;
		}
	});
	const [mobileOpen, setMobileOpen] = useState(false);
	return (
		<AdsAdminShell
			collapsed={collapsed}
			mobileOpen={mobileOpen}
			onCollapsedChange={(next) => {
				setCollapsed(next);
				try {
					window.localStorage.setItem('ads-demo-sidebar-collapsed', String(next));
				} catch {
					// A persistência é responsabilidade da aplicação e pode estar indisponível.
				}
			}}
			onMobileOpenChange={setMobileOpen}
		>
			<AdsAdminShell.Header>
				<HeaderContent />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar mobileTitle="Menu">
					<AdaptiveNavigation />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<PageContent />
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}

export const Controlled: Story = {
	name: 'Estado controlado com persistência externa',
	render: () => <ControlledShell />,
};

export const MobileClosed: Story = {
	name: 'Mobile fechado',
	render: () => <ShellExample />,
	parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const MobileOpen: Story = {
	name: 'Mobile aberto',
	render: () => <ShellExample defaultMobileOpen />,
	parameters: { viewport: { defaultViewport: 'mobile1' } },
};

/** O consumidor posiciona e customiza o trigger; o shell coordena estado e ARIA. */
export const CustomTrigger: Story = {
	name: 'Trigger móvel customizado',
	render: () => (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<AdsTypography as="strong" variant="heading4">
					Admin Demo
				</AdsTypography>
				<AdsAdminShell.NavigationTrigger className="ml-auto" label="Abrir menu principal" />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar mobileTitle="Menu">
					<Navigation />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<PageContent />
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	),
	parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const TokenCustomization: Story = {
	name: 'Customização por tokens',
	render: () => (
		<div
			style={
				{
					'--ads-color-background': 'var(--ads-color-surface)',
					'--ads-admin-shell-sidebar-width': '20rem',
				} as CSSProperties
			}
		>
			<ShellExample />
		</div>
	),
};

function SidebarBrand() {
	const { collapsed, isDesktop } = useAdsAdminShell();
	return (
		<>
			<div
				style={{
					display: 'flex',
					gap: 'var(--ads-spacing-2)',
					alignItems: 'center',
					minWidth: 0,
					flex: 1,
					marginInlineStart:
						isDesktop && !collapsed
							? 'calc((var(--ads-admin-shell-sidebar-width-collapsed) - 1px - 30px) / 2 - var(--ads-spacing-4))'
							: 0,
				}}
			>
				<img src="./admin-ds-favicon.svg" width={30} height={30} alt="" />
				<strong className="ads-admin-shell-sidebar-label" style={{ overflowWrap: 'anywhere' }}>
					Admin DS
				</strong>
			</div>
			<AdsAdminShell.SidebarToggle
				title={collapsed && isDesktop ? 'Expandir barra lateral' : 'Recolher barra lateral'}
			/>
		</>
	);
}
function SidebarBrandShell({
	organization = false,
	collapsed = false,
}: {
	organization?: boolean;
	collapsed?: boolean;
}) {
	return (
		<AdsAdminShell layout="sidebar-header" defaultCollapsed={collapsed}>
			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<div className="ml-auto">
					<ThemeToggle />
				</div>
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar header={<SidebarBrand />}>
					{organization && (
						<AdsOrganizationSwitcher
							organizations={[
								{
									id: 'demo',
									name: 'Organização de demonstração',
									initials: 'OD',
									avatarTone: 'primary',
								},
							]}
							value="demo"
						/>
					)}
					<AdsAdminShell.Navigation>
						<AdsAdminShell.NavigationItem>
							<a href="#overview" aria-current="page">
								<span aria-hidden="true" className="ads-sidebar-icon">
									Vg
								</span>
								<span className="ads-admin-shell-sidebar-label">Visão geral</span>
							</a>
						</AdsAdminShell.NavigationItem>
						<AdsAdminShell.NavigationItem>
							<a href="#catalog">
								<span aria-hidden="true" className="ads-sidebar-icon">
									<AdsIcon name="search" />
								</span>
								<span className="ads-admin-shell-sidebar-label">Catálogo</span>
							</a>
						</AdsAdminShell.NavigationItem>
					</AdsAdminShell.Navigation>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<PageContent />
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}
export const SidebarBranding: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'No desktop, a coluna de ícones mantém sua posição horizontal ao recolher ou expandir, centralizada no destaque selecionado da barra compacta mesmo com scrollbar nativa. O avatar da organização compartilha essa coluna.',
			},
		},
	},
	name: 'Marca na sidebar, sem organização',
	render: () => <SidebarBrandShell />,
};
export const SidebarBrandingWithOrganization: Story = {
	name: 'Marca na sidebar, com organização',
	render: () => <SidebarBrandShell organization />,
};
export const SidebarBrandingCollapsed: Story = {
	name: 'Marca na sidebar recolhida',
	render: () => <SidebarBrandShell organization collapsed />,
};
