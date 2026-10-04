import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsAdminShell, AdsBadge, AdsButton, AdsCard, AdsTypography } from '@admin-ds/components';

const meta = {
	title: 'Layout/Admin Shell',
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Navigation() {
	return (
		<ul className="m-0 grid list-none gap-1 p-0">
			{['Visão geral', 'Clientes', 'Assinaturas', 'Relatórios', 'Configurações'].map((item, index) => (
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

export const Default: Story = {
	render: () => (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<AdsTypography as="strong" variant="heading4">Admin Abril</AdsTypography>
				<div className="ml-auto flex items-center gap-3">
					<AdsBadge>Produção</AdsBadge>
					<AdsButton size="sm" variant="secondary">Conta</AdsButton>
				</div>
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar><Navigation /></AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<div className="mx-auto grid max-w-5xl gap-6">
						<div>
							<AdsTypography as="h1" variant="heading2">Visão geral</AdsTypography>
							<AdsTypography variant="muted">Estrutura administrativa reutilizável do Admin Design System.</AdsTypography>
						</div>
						<div className="grid gap-4 md:grid-cols-3">
							{['Clientes', 'Assinaturas', 'Receita'].map((label) => (
								<AdsCard key={label}><AdsTypography variant="muted">{label}</AdsTypography><AdsTypography as="p" variant="heading3">—</AdsTypography></AdsCard>
							))}
						</div>
					</div>
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	),
};

export const TokenCustomization: Story = {
	render: () => (
		<div style={{ '--ads-color-background': 'var(--ads-color-surface)' } as React.CSSProperties}>
			<Default.render />
		</div>
	),
};
