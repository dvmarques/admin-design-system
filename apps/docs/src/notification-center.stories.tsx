import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsNotificationCenter, type AdsNotification } from '@admin-ds/admin';

const meta = {
	title: 'Layout/Notification Center',
	component: AdsNotificationCenter,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Sino com contador e painel lateral direito (modal, sobre `AdsDrawer`). Dados, contagem e leitura são controlados pela aplicação; abrir o painel nunca marca nada como lido e a leitura vai por callbacks. Não há API, WebSocket, push nem armazenamento na biblioteca.',
			},
		},
	},
} satisfies Meta<typeof AdsNotificationCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: AdsNotification[] = [
	{
		id: 'pedido',
		title: 'Pedido aprovado',
		description: 'O pedido 1024 foi aprovado.',
		icon: 'check',
		timeLabel: 'há 5 min',
		read: false,
	},
	{
		id: 'comentario',
		title: 'Novo comentário',
		description: 'João Mendes comentou no cadastro.',
		avatar: { fallback: 'JM', alt: 'João Mendes' },
		timeLabel: 'há 32 min',
		read: false,
		href: '#detalhe',
	},
	{ id: 'exportacao', title: 'Exportação concluída', icon: 'info', timeLabel: 'ontem', read: true },
];

export const Default: Story = {
	args: { notifications: items, defaultOpen: true, historyHref: '#historico' },
};

/** Controlado: a aplicação guarda a leitura; marcar individual e todas chamam callbacks. */
export const ReadingControlledByTheApplication: Story = {
	args: { notifications: items },
	render: () => {
		const [read, setRead] = useState<string[]>([]);
		const notifications = items.map((item) => ({
			...item,
			read: item.read || read.includes(item.id),
		}));
		return (
			<AdsNotificationCenter
				defaultOpen
				notifications={notifications}
				onMarkAllRead={() => setRead(items.map((item) => item.id))}
				onMarkRead={(id) => setRead((current) => [...current, id])}
			/>
		);
	},
};

/** A contagem é da aplicação: 120 não lidas, só 3 carregadas; o contador mostra 99+. */
export const CountGreaterThanLoaded: Story = {
	args: { notifications: items, unreadCount: 120 },
};

export const NoUnread: Story = {
	args: { notifications: [items[2]!], unreadCount: 0, defaultOpen: true, defaultFilter: 'unread' },
};

export const Loading: Story = {
	args: { notifications: [], status: 'loading', defaultOpen: true },
};

export const Empty: Story = {
	args: { notifications: [], defaultOpen: true },
};

export const ErrorWithRetry: Story = {
	args: { notifications: [], status: 'error', onRetry: () => {}, defaultOpen: true },
};

/** A leitura retorna uma `Promise`: o item fica ocupado e uma falha é recuperável. */
export const PendingAndFailingReadRequest: Story = {
	args: { notifications: items },
	render: () => (
		<AdsNotificationCenter
			defaultOpen
			notifications={items}
			onMarkRead={() =>
				new Promise<void>((_resolve, reject) => setTimeout(() => reject(new Error('falha')), 1200))
			}
		/>
	),
};

export const LongListWithLoadMore: Story = {
	args: { notifications: [] },
	render: () => {
		const [count, setCount] = useState(40);
		const [loading, setLoading] = useState(false);
		const notifications = Array.from({ length: count }, (_, index) => ({
			id: `n${index}`,
			title: `Notificação ${index + 1}`,
			description: 'Descrição curta da notificação.',
			timeLabel: `${index + 1} h atrás`,
			read: index > 10,
		}));
		return (
			<AdsNotificationCenter
				defaultOpen
				hasMore={count < 80}
				loadingMore={loading}
				notifications={notifications}
				onLoadMore={() => {
					setLoading(true);
					setTimeout(() => {
						setCount((current) => current + 20);
						setLoading(false);
					}, 800);
				}}
				unreadCount={11}
			/>
		);
	},
};

/** Rótulos e datas são da aplicação: sem acoplamento a idioma ou biblioteca de datas. */
export const CustomLabelsAndTimeFormat: Story = {
	args: {
		notifications: items.map((item) => ({ ...item, timestamp: '2026-10-25T12:00:00Z' })),
		defaultOpen: true,
		formatTime: (notification) => `Sent: ${notification.timestamp}`,
		labels: {
			title: 'Alerts',
			all: 'All',
			unread: 'Unread',
			markAllRead: 'Mark all as read',
			markRead: 'Mark as read',
			close: 'Close alerts',
		},
	},
};
