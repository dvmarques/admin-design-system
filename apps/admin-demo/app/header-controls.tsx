'use client';

import {
	AdsAccountMenu,
	AdsNotificationCenter,
	AdsOrganizationSwitcher,
	type AdsNotification,
} from '@admin-ds/admin';
import { AdsToast } from '@admin-ds/components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/** Assíncrono de mentira: dá tempo de ver o estado pendente sem tocar em backend algum. */
const simulate = (milliseconds = 350) =>
	new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

/** Feedback local das ações sem backend: nada aqui encerra uma sessão ou muda dados reais. */
function useDemoFeedback() {
	const [message, setMessage] = useState<string | null>(null);
	const toast = (
		<AdsToast onClose={() => setMessage(null)} open={message !== null} variant="info">
			{message}
		</AdsToast>
	);
	return { notify: setMessage, toast };
}

export const demoUser = {
	name: 'Ana Souza',
	email: 'ana.souza@exemplo.com.br',
} as const;

export function DemoAccountMenu() {
	const router = useRouter();
	const { notify, toast } = useDemoFeedback();

	return (
		<>
			<AdsAccountMenu
				className="demo-header-account"
				groups={[
					{
						id: 'conta',
						actions: [
							{
								icon: 'user',
								id: 'minha-conta',
								label: 'Minha conta',
								onSelect: () => notify('Minha conta: demonstração, sem página de destino.'),
							},
							{
								icon: 'settings',
								id: 'preferencias',
								label: 'Preferências',
								onSelect: () => router.push('/preferencias'),
							},
						],
					},
					{
						id: 'sessao',
						actions: [
							{
								icon: 'logOut',
								id: 'sair',
								label: 'Sair',
								onSelect: async () => {
									await simulate();
									notify('Saída simulada: nenhuma sessão real foi encerrada.');
								},
								tone: 'danger',
							},
						],
					},
				]}
				user={demoUser}
			/>
			{toast}
		</>
	);
}

const initialNotifications: AdsNotification[] = [
	{
		description: 'O pedido 1024 foi aprovado e segue para separação.',
		icon: 'check',
		id: 'pedido-1024',
		read: false,
		timeLabel: 'há 5 min',
		title: 'Pedido aprovado',
	},
	{
		avatar: { fallback: 'JM', alt: 'João Mendes' },
		description: 'João Mendes comentou no cadastro de Acme Brasil.',
		id: 'comentario-joao',
		read: false,
		timeLabel: 'há 32 min',
		title: 'Novo comentário',
	},
	{
		description: 'A exportação de clientes terminou.',
		icon: 'info',
		id: 'exportacao',
		read: false,
		timeLabel: 'há 2 h',
		title: 'Exportação concluída',
	},
	{
		description: 'Nenhuma ação necessária.',
		icon: 'calendar',
		id: 'agenda',
		read: true,
		timeLabel: 'ontem',
		title: 'Revisão agendada',
	},
];

const olderNotifications: AdsNotification[] = [
	{
		description: 'O cartão final 4242 vence no próximo mês.',
		icon: 'info',
		id: 'cartao',
		read: false,
		timeLabel: '2 dias atrás',
		title: 'Meio de pagamento a vencer',
	},
	{
		id: 'backup',
		read: true,
		timeLabel: '3 dias atrás',
		title: 'Backup semanal concluído',
	},
];

/** Notificações fictícias; leitura e contagem ficam no estado local, como numa aplicação real. */
export function DemoNotifications() {
	const { notify, toast } = useDemoFeedback();
	const [items, setItems] = useState(initialNotifications);
	const [loadedOlder, setLoadedOlder] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	// A contagem pertence à aplicação: inclui as não lidas que ainda não foram carregadas.
	const unreadCount =
		items.filter((item) => !item.read).length +
		(loadedOlder ? 0 : olderNotifications.filter((item) => !item.read).length);

	return (
		<>
			<AdsNotificationCenter
				hasMore={!loadedOlder}
				historyHref="#historico"
				loadingMore={loadingMore}
				notifications={items}
				onItemSelect={(notification) => notify(`Abrindo “${notification.title}” (demonstração).`)}
				onLoadMore={async () => {
					setLoadingMore(true);
					await simulate();
					setItems((current) => [...current, ...olderNotifications]);
					setLoadedOlder(true);
					setLoadingMore(false);
				}}
				onMarkAllRead={async () => {
					await simulate();
					setItems((current) => current.map((item) => ({ ...item, read: true })));
					setLoadedOlder(true);
				}}
				onMarkRead={async (id) => {
					await simulate(250);
					setItems((current) =>
						current.map((item) => (item.id === id ? { ...item, read: true } : item)),
					);
				}}
				unreadCount={unreadCount}
			/>
			{toast}
		</>
	);
}

const organizations = [
	{ description: 'Plano Enterprise', id: 'acme', name: 'Acme Brasil' },
	{ description: 'Plano Business', id: 'globex', name: 'Globex Logística' },
	{ description: 'Plano Starter', id: 'initech', name: 'Initech' },
	{ description: 'Plano Business', id: 'umbrella', name: 'Umbrella Saúde' },
	{ description: 'Plano Starter', id: 'hooli', name: 'Hooli Tecnologia' },
	{ description: 'Plano Enterprise', id: 'stark', name: 'Stark Indústrias' },
	{ description: 'Plano Business', id: 'wayne', name: 'Wayne Participações' },
	{ description: 'Suspensa', disabled: true, id: 'vandelay', name: 'Vandelay Importações' },
];

/** Opcional: o layout decide se inclui o seletor no topo da sidebar. */
export function DemoOrganizationSwitcher() {
	const { notify, toast } = useDemoFeedback();
	const [value, setValue] = useState('acme');

	return (
		<>
			<AdsOrganizationSwitcher
				manage={{
					onSelect: () => notify('Gerenciar organizações: demonstração, sem tela de destino.'),
				}}
				onValueChange={async (id) => {
					await simulate();
					setValue(id);
					notify(
						`Organização de demonstração: ${organizations.find((item) => item.id === id)?.name}.`,
					);
				}}
				organizations={organizations}
				value={value}
			/>
			{toast}
		</>
	);
}
