import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsAdminShell, useAdsAdminShell } from '@admin-ds/admin';
import { AdsBadge, AdsButton, AdsCard, AdsTypography, ThemeToggle } from '@admin-ds/components';
import { useState, type CSSProperties } from 'react';

const meta = {
	title: 'Layout/Admin Shell',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Estrutura administrativa com header, sidebar e conteúdo principal. A sidebar persistente (desktop) e o drawer (mobile) nunca são montados ao mesmo tempo. `collapsed` afeta somente a sidebar desktop; `mobileOpen` é um estado separado. Ambos aceitam modo controlado e não controlado. A persistência de preferências pertence à aplicação consumidora.',
			},
		},
	},
} satisfies Meta;
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
				Admin Abril
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
					Admin Abril
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
