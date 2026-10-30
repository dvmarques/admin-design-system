import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsAdminShell, AdsOrganizationSwitcher, type AdsOrganization } from '@dvmarques/admin-ds-admin';

// Imagem corrompida embutida: falha ao decodificar sem requisição de rede (sem erro 404 no console).
const brokenImage = 'data:image/png;base64,AAAA';

const meta = {
	title: 'Layout/Organization Switcher',
	component: AdsOrganizationSwitcher,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Seletor opcional de organização para o topo da sidebar. É independente do `AdsAdminShell`: sem ele, a navegação ocupa o espaço normalmente. A aplicação fornece organizações, seleção atual, estados e a troca; permissões e a mudança efetiva de contexto não pertencem à biblioteca.',
			},
		},
	},
	decorators: [
		(Story, context) =>
			context.parameters.layout === 'fullscreen' ? (
				<Story />
			) : (
				<div style={{ width: '16rem' }}>
					<Story />
				</div>
			),
	],
} satisfies Meta<typeof AdsOrganizationSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

const organizations: AdsOrganization[] = [
	{ id: 'acme', name: 'Acme Brasil', description: 'Plano Enterprise' },
	{ id: 'globex', name: 'Globex Logística', description: 'Plano Business' },
	{ id: 'initech', name: 'Initech', description: 'Plano Starter' },
];

const many: AdsOrganization[] = [
	...organizations,
	{ id: 'umbrella', name: 'Umbrella Saúde', logoSrc: brokenImage },
	{ id: 'hooli', name: 'Hooli Tecnologia' },
	{ id: 'stark', name: 'Stark Indústrias' },
	{ id: 'wayne', name: 'Wayne Participações' },
	{ id: 'vandelay', name: 'Vandelay Importações', disabled: true },
];

export const Default: Story = {
	args: { organizations, defaultValue: 'acme', defaultOpen: true },
};

export const ManyOrganizationsWithSearchAndManage: Story = {
	args: {
		organizations: many,
		defaultValue: 'acme',
		defaultOpen: true,
		manage: { onSelect: () => {}, label: 'Gerenciar organizações' },
	},
};

export const SingleOrganization: Story = {
	args: { organizations: [organizations[0]!], defaultValue: 'acme' },
};

export const NoOrganizations: Story = {
	args: { organizations: [] },
};

export const Loading: Story = {
	args: { organizations, defaultValue: 'acme', status: 'loading', defaultOpen: true },
};

export const ErrorWithRetry: Story = {
	args: {
		organizations,
		defaultValue: 'acme',
		status: 'error',
		onRetry: () => {},
		defaultOpen: true,
	},
};

export const LongName: Story = {
	args: {
		organizations: [
			{
				id: 'longa',
				name: 'Organização com um nome extraordinariamente longo para a barra lateral',
				description: 'Descrição também muito longa para caber na largura do gatilho',
			},
		],
		defaultValue: 'longa',
	},
};

/** A troca é assíncrona: a nova organização só é confirmada depois do sucesso. */
export const AsynchronousSwitch: Story = {
	args: { organizations },
	render: () => {
		const [value, setValue] = useState('acme');
		return (
			<AdsOrganizationSwitcher
				defaultOpen
				onValueChange={async (id) => {
					await new Promise((resolve) => setTimeout(resolve, 1500));
					setValue(id);
				}}
				organizations={organizations}
				value={value}
			/>
		);
	},
};

export const FailingSwitch: Story = {
	args: { organizations },
	render: () => (
		<AdsOrganizationSwitcher
			defaultOpen
			onValueChange={() =>
				new Promise<void>((_resolve, reject) => setTimeout(() => reject(new Error('falha')), 1000))
			}
			organizations={organizations}
			value="acme"
		/>
	),
};

/** Recolhida: só logo ou iniciais, com tooltip e nome acessível; a seleção continua utilizável. */
export const Collapsed: Story = {
	args: { organizations, defaultValue: 'acme', collapsed: true },
	decorators: [
		(Story) => (
			<div style={{ width: '4.5rem' }}>
				<Story />
			</div>
		),
	],
};

function ShellExample({ withSwitcher }: { withSwitcher: boolean }) {
	return (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<AdsAdminShell.SidebarToggle />
				<strong>{withSwitcher ? 'Com seletor' : 'Sem seletor'}</strong>
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar label="Navegação">
					{withSwitcher ? (
						<AdsOrganizationSwitcher defaultValue="acme" organizations={organizations} />
					) : null}
					<AdsAdminShell.Navigation>
						<AdsAdminShell.NavigationItem>
							<a aria-current="page" href="#inicio">
								Início
							</a>
						</AdsAdminShell.NavigationItem>
					</AdsAdminShell.Navigation>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>Conteúdo</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}

/** No topo da sidebar, acima da navegação. */
export const InSidebar: Story = {
	args: { organizations },
	parameters: { layout: 'fullscreen' },
	render: () => <ShellExample withSwitcher />,
};

/** Sem o seletor, a composição segue completa e a navegação ocupa o topo, sem espaço residual. */
export const WithoutOrganizationSwitcher: Story = {
	args: { organizations },
	parameters: { layout: 'fullscreen' },
	render: () => <ShellExample withSwitcher={false} />,
};

export const ColoredAvatars: Story = {
	name: 'Avatares coloridos por organização',
	args: {
		organizations: organizations.map((organization) => ({
			...organization,
			avatarTone: 'primary' as const,
		})),
		defaultValue: 'acme',
		defaultOpen: true,
	},
};
