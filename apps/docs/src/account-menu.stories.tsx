import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsAccountMenu, AdsAdminShell, type AdsAccountMenuGroup } from '@admin-ds/admin';
import { AdsAvatar, AdsThemeControl } from '@admin-ds/components';

// Imagem corrompida embutida: falha ao decodificar sem requisição de rede (sem erro 404 no console).
const brokenImage = 'data:image/png;base64,AAAA';

const meta = {
	title: 'Layout/Account Menu',
	component: AdsAccountMenu,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Menu de conta compacto aberto pelo avatar. É um painel não modal (não `role="menu"`): identidade e ações, com foco no primeiro controle, Escape, clique externo e retorno do foco ao gatilho. Autenticação, sessão e Sair pertencem à aplicação; Trocar conta é opcional e distinta da troca de organização.',
			},
		},
	},
} satisfies Meta<typeof AdsAccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const photo = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#4f46e5"/><circle cx="20" cy="16" r="7" fill="#fff"/><path d="M6 40a14 14 0 0 1 28 0Z" fill="#fff"/></svg>',
)}`;

const groups: AdsAccountMenuGroup[] = [
	{
		id: 'conta',
		actions: [
			{ id: 'minha-conta', icon: 'user', label: 'Minha conta', href: '#minha-conta' },
			{ id: 'preferencias', icon: 'settings', label: 'Preferências', href: '#preferencias' },
		],
	},
	{
		id: 'sessao',
		actions: [{ id: 'sair', icon: 'logOut', label: 'Sair', tone: 'danger', onSelect: () => {} }],
	},
];

const user = { name: 'Ana Souza', email: 'ana.souza@exemplo.com.br' };

export const Default: Story = {
	args: { groups, user },
};

/** Foto quando disponível; as iniciais substituem a foto ausente ou que falha. */
export const PhotoInitialsAndImageFailure: Story = {
	args: { groups, user },
	render: () => (
		<div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
			<AdsAccountMenu groups={groups} user={{ ...user, avatarSrc: photo }} />
			<AdsAccountMenu
				groups={groups}
				user={{ name: 'Bruno Lima', email: 'bruno@exemplo.com.br' }}
			/>
			<AdsAccountMenu
				groups={groups}
				user={{ name: 'Carla Dias', email: 'carla@exemplo.com.br', avatarSrc: brokenImage }}
			/>
			<AdsAccountMenu groups={groups} user={{ name: 'Maria', initials: 'MA' }} />
			<AdsAccountMenu groups={groups} user={{}} />
		</div>
	),
};

/** `AdsAvatar` continua útil sozinho, sem nenhum comportamento de menu. */
export const AvatarAlone: Story = {
	args: { groups, user },
	render: () => <AdsAvatar alt="Ana Souza" fallback="AS" />,
};

/** Trocar conta só aparece quando o consumidor a fornece. */
export const WithSwitchAccount: Story = {
	args: {
		groups,
		user,
		defaultOpen: true,
		switchAccount: { icon: 'user', label: 'Usar outra conta', onSelect: () => {} },
	},
};

export const OpenWithDisabledAction: Story = {
	args: {
		defaultOpen: true,
		groups: [
			{
				id: 'conta',
				actions: [
					{ id: 'a', label: 'Minha conta', icon: 'user' },
					{
						id: 'b',
						label: 'Faturamento',
						description: 'Indisponível no seu plano',
						disabled: true,
					},
				],
			},
		],
		user,
	},
};

/** A ação retorna uma `Promise`: fica ocupada e o painel permanece aberto até concluir. */
export const PendingAction: Story = {
	args: {
		defaultOpen: true,
		groups: [
			{
				id: 'sessao',
				actions: [
					{
						id: 'sair',
						icon: 'logOut',
						label: 'Sair',
						onSelect: () => new Promise<void>((resolve) => setTimeout(resolve, 2000)),
					},
				],
			},
		],
		user,
	},
};

export const LongNameAndEmail: Story = {
	args: {
		defaultOpen: true,
		groups,
		user: {
			name: 'Maria Aparecida de Albuquerque Montenegro Vasconcelos Figueiredo Neto',
			email: 'maria.aparecida.albuquerque.montenegro@empresa-com-nome-muito-longo.example.com',
		},
	},
};

export const Controlled: Story = {
	args: { groups, user },
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
				<AdsAccountMenu groups={groups} onOpenChange={setOpen} open={open} user={user} />
				<p role="status">{open ? 'Aberto' : 'Fechado'}</p>
			</div>
		);
	},
};

/** No cabeçalho do shell, ao lado do controle de tema. */
export const InShellHeader: Story = {
	args: { groups, user },
	parameters: { layout: 'fullscreen' },
	render: () => (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<strong>Admin Design System</strong>
				<div style={{ marginInlineStart: 'auto', display: 'flex', gap: '0.25rem' }}>
					<AdsThemeControl />
					<AdsAccountMenu groups={groups} user={{ ...user, avatarSrc: photo }} />
				</div>
			</AdsAdminShell.Header>
		</AdsAdminShell>
	),
};
