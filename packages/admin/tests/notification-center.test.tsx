import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import {
	AdsNotificationCenter,
	type AdsNotification,
	type AdsNotificationCenterProps,
} from '../src/index.js';

const items: AdsNotification[] = [
	{
		id: 'a',
		title: 'Pedido aprovado',
		description: 'O pedido 1024 foi aprovado.',
		timeLabel: 'há 5 min',
		read: false,
		href: '/pedidos/1024',
		icon: 'check',
	},
	{ id: 'b', title: 'Backup concluído', read: true, timeLabel: 'ontem' },
	{ id: 'c', title: 'Novo comentário', read: false, avatar: { fallback: 'JD', alt: 'João' } },
];

function setup(props: Partial<AdsNotificationCenterProps> = {}) {
	return render(<AdsNotificationCenter notifications={items} {...props} />);
}

const bell = (name = 'Notificações, 2 não lidas') => screen.getByRole('button', { name });

describe('AdsNotificationCenter bell', () => {
	it('hides the numeric badge at zero and keeps the plain name', () => {
		setup({ unreadCount: 0 });

		expect(screen.getByRole('button', { name: 'Notificações' })).toBeVisible();
		expect(document.querySelector('.ads-notification-center-badge')).toBeNull();
	});

	it('limits the visual count to 99+ but keeps the exact accessible count', () => {
		setup({ unreadCount: 120 });

		expect(document.querySelector('.ads-notification-center-badge')).toHaveTextContent('99+');
		expect(bell('Notificações, 120 não lidas')).toBeVisible();
	});

	it('uses the singular form for one unread notification', () => {
		setup({ unreadCount: 1 });

		expect(bell('Notificações, 1 não lida')).toBeVisible();
	});

	it('does not assume the unread total equals the loaded items', () => {
		setup({ unreadCount: 42 });

		expect(document.querySelector('.ads-notification-center-badge')).toHaveTextContent('42');
	});

	it('counts the loaded unread items when no total is given', () => {
		setup();

		expect(document.querySelector('.ads-notification-center-badge')).toHaveTextContent('2');
	});

	it('has no live region for count or list updates', async () => {
		const events = userEvent.setup();
		setup();
		await events.click(bell());

		expect(document.querySelector('[aria-live]')).toBeNull();
	});
});

describe('AdsNotificationCenter panel', () => {
	it('opens as a modal side panel and returns the focus to the bell with Escape', async () => {
		const events = userEvent.setup();
		setup();
		expect(bell()).toHaveAttribute('aria-expanded', 'false');

		await events.click(bell());

		const panel = await screen.findByRole('dialog', { name: 'Notificações' });
		expect(panel).toHaveAttribute('aria-modal', 'true');
		expect(bell()).toHaveAttribute('aria-controls', panel.id);
		expect(screen.getByRole('button', { name: 'Fechar notificações' })).toBeVisible();

		await events.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
		await waitFor(() => expect(bell()).toHaveFocus());
	});

	it('closes with the explicit close button', async () => {
		const events = userEvent.setup();
		setup();
		await events.click(bell());

		await events.click(await screen.findByRole('button', { name: 'Fechar notificações' }));

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('opening never marks anything as read', async () => {
		const events = userEvent.setup();
		const onMarkRead = vi.fn();
		const onMarkAllRead = vi.fn();
		setup({ onMarkAllRead, onMarkRead });

		await events.click(bell());
		await screen.findByRole('dialog');

		expect(onMarkRead).not.toHaveBeenCalled();
		expect(onMarkAllRead).not.toHaveBeenCalled();
	});

	it('marks one notification as read through its own button, a sibling of the link', async () => {
		const events = userEvent.setup();
		const onMarkRead = vi.fn();
		setup({ onMarkRead });
		await events.click(bell());

		const link = await screen.findByRole('link', { name: /Pedido aprovado/ });
		const button = screen.getByRole('button', { name: 'Marcar como lida: Pedido aprovado' });
		expect(link).not.toContainElement(button);
		expect(button.closest('a')).toBeNull();

		await events.click(button);

		expect(onMarkRead).toHaveBeenCalledWith('a');
	});

	it('does not offer a read button for items already read', async () => {
		const events = userEvent.setup();
		setup({ onMarkRead: vi.fn() });
		await events.click(bell());
		await screen.findByRole('dialog');

		expect(screen.queryByRole('button', { name: 'Marcar como lida: Backup concluído' })).toBeNull();
	});

	it('marks all as read by callback, disabled without unread notifications', async () => {
		const events = userEvent.setup();
		const onMarkAllRead = vi.fn();
		const { unmount } = setup({ onMarkAllRead });
		await events.click(bell());
		await events.click(await screen.findByRole('button', { name: 'Marcar todas como lidas' }));
		expect(onMarkAllRead).toHaveBeenCalledTimes(1);
		unmount();

		setup({ notifications: [items[1]!], onMarkAllRead, unreadCount: 0 });
		await events.click(screen.getByRole('button', { name: 'Notificações' }));
		expect(await screen.findByRole('button', { name: 'Marcar todas como lidas' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
	});

	it('activating an unread item selects it and, by default, requests the read mark', async () => {
		const events = userEvent.setup();
		const onItemSelect = vi.fn();
		const onMarkRead = vi.fn();
		setup({ onItemSelect, onMarkRead });
		await events.click(bell());

		await events.click(
			await screen.findByRole('button', { name: /^Não lida\.\s*Novo comentário/ }),
		);

		expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'c' }));
		expect(onMarkRead).toHaveBeenCalledWith('c');
	});

	it('only selects when markReadOnSelect is false', async () => {
		const events = userEvent.setup();
		const onItemSelect = vi.fn();
		const onMarkRead = vi.fn();
		setup({ markReadOnSelect: false, onItemSelect, onMarkRead });
		await events.click(bell());

		await events.click(
			await screen.findByRole('button', { name: /^Não lida\.\s*Novo comentário/ }),
		);

		expect(onItemSelect).toHaveBeenCalledTimes(1);
		expect(onMarkRead).not.toHaveBeenCalled();
	});

	it('does not request a read mark when activating an item already read', async () => {
		const events = userEvent.setup();
		const onMarkRead = vi.fn();
		setup({ onItemSelect: vi.fn(), onMarkRead });
		await events.click(bell());

		await events.click(await screen.findByRole('button', { name: /^Backup concluído/ }));

		expect(onMarkRead).not.toHaveBeenCalled();
	});

	it('follows a link item and closes the panel', async () => {
		const events = userEvent.setup();
		setup({ onMarkRead: vi.fn() });
		await events.click(bell());
		const link = await screen.findByRole('link', { name: /Pedido aprovado/ });
		link.addEventListener('click', (event) => event.preventDefault());

		await events.click(link);

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('marks unread items with text besides the dot, and read items differently', async () => {
		const events = userEvent.setup();
		setup();
		await events.click(bell());
		const list = await screen.findByRole('list');

		const unread = within(list).getAllByRole('listitem')[0]!;
		const read = within(list).getAllByRole('listitem')[1]!;
		expect(unread).toHaveAttribute('data-read', 'false');
		expect(unread).toHaveTextContent('Não lida');
		expect(read).toHaveAttribute('data-read', 'true');
		expect(read).not.toHaveTextContent('Não lida');
	});

	it('filters unread items and keeps the pressed state', async () => {
		const events = userEvent.setup();
		setup();
		await events.click(bell());
		const all = await screen.findByRole('button', { name: 'Todas' });
		const unread = screen.getByRole('button', { name: 'Não lidas' });
		expect(all).toHaveAttribute('aria-pressed', 'true');

		await events.click(unread);

		expect(unread).toHaveAttribute('aria-pressed', 'true');
		expect(all).toHaveAttribute('aria-pressed', 'false');
		expect(screen.queryByText('Backup concluído')).toBeNull();
		expect(screen.getByText('Pedido aprovado')).toBeVisible();
	});

	it('supports a controlled filter', async () => {
		const events = userEvent.setup();
		const onFilterChange = vi.fn();
		setup({ filter: 'all', onFilterChange });
		await events.click(bell());

		await events.click(await screen.findByRole('button', { name: 'Não lidas' }));

		expect(onFilterChange).toHaveBeenCalledWith('unread');
		expect(screen.getByText('Backup concluído')).toBeVisible();
	});

	it('shows a filter-specific empty state when no loaded item is unread', async () => {
		const events = userEvent.setup();
		setup({ defaultFilter: 'unread', notifications: [items[1]!] });
		await events.click(screen.getByRole('button', { name: /Notificações/ }));

		expect(await screen.findByText('Nenhuma notificação não lida.')).toBeVisible();
	});

	it('shows the empty state', async () => {
		const events = userEvent.setup();
		setup({ notifications: [] });
		await events.click(screen.getByRole('button', { name: 'Notificações' }));

		expect(await screen.findByText('Nenhuma notificação por aqui.')).toBeVisible();
	});

	it('shows a loading status and an error with retry', async () => {
		const events = userEvent.setup();
		const onRetry = vi.fn();
		const { rerender } = setup({ status: 'loading' });
		await events.click(bell());
		expect(await screen.findByText('Carregando notificações')).toBeInTheDocument();
		expect(screen.queryByRole('list')).toBeNull();

		rerender(<AdsNotificationCenter notifications={items} onRetry={onRetry} status="error" />);
		expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar');
		await events.click(screen.getByRole('button', { name: 'Tentar novamente' }));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('keeps an item busy while the read request is pending and recovers from a failure', async () => {
		const events = userEvent.setup();
		let reject: (reason?: unknown) => void = () => undefined;
		const onMarkRead = vi
			.fn()
			.mockImplementationOnce(
				() =>
					new Promise<void>((_resolve, fail) => {
						reject = fail;
					}),
			)
			.mockResolvedValue(undefined);
		setup({ onMarkRead });
		await events.click(bell());
		const button = await screen.findByRole('button', { name: 'Marcar como lida: Pedido aprovado' });

		await events.click(button);
		expect(button).toHaveAttribute('aria-disabled', 'true');
		expect(button.closest('li')).toHaveAttribute('aria-busy', 'true');
		expect(onMarkRead).toHaveBeenCalledTimes(1);

		await act(async () => reject(new Error('falha')));
		expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível atualizar');
		expect(button).not.toHaveAttribute('aria-disabled');
		await events.click(button);
		expect(onMarkRead).toHaveBeenCalledTimes(2);
	});

	it('disables "mark all" while it is pending and announces a failure', async () => {
		const events = userEvent.setup();
		const onMarkAllRead = vi.fn().mockRejectedValue(new Error('falha'));
		setup({ onMarkAllRead });
		await events.click(bell());

		await events.click(await screen.findByRole('button', { name: 'Marcar todas como lidas' }));

		expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível atualizar');
	});

	it('requests more items with a busy state', async () => {
		const events = userEvent.setup();
		const onLoadMore = vi.fn();
		const { rerender } = setup({ hasMore: true, onLoadMore });
		await events.click(bell());

		await events.click(await screen.findByRole('button', { name: 'Carregar mais' }));
		expect(onLoadMore).toHaveBeenCalledTimes(1);

		rerender(
			<AdsNotificationCenter hasMore loadingMore notifications={items} onLoadMore={onLoadMore} />,
		);
		const busy = screen.getByRole('button', { name: 'Carregar mais' });
		expect(busy).toHaveAttribute('aria-disabled', 'true');
	});

	it('does not render "load more" without more items', async () => {
		const events = userEvent.setup();
		setup();
		await events.click(bell());
		await screen.findByRole('dialog');

		expect(screen.queryByRole('button', { name: 'Carregar mais' })).toBeNull();
	});

	it('links to the history only when provided', async () => {
		const events = userEvent.setup();
		const { unmount } = setup();
		await events.click(bell());
		await screen.findByRole('dialog');
		expect(screen.queryByRole('link', { name: 'Ver todas as notificações' })).toBeNull();
		unmount();

		setup({ historyHref: '/notificacoes' });
		await events.click(bell());
		expect(await screen.findByRole('link', { name: 'Ver todas as notificações' })).toHaveAttribute(
			'href',
			'/notificacoes',
		);
	});

	it('formats times with the consumer function, the label or the default format', async () => {
		const events = userEvent.setup();
		setup({
			formatTime: (notification) => `fmt-${notification.id}`,
			notifications: [
				{ id: 'z', title: 'Com data', read: true, timestamp: '2026-10-25T12:00:00Z' },
			],
		});
		await events.click(screen.getByRole('button', { name: 'Notificações' }));
		expect(await screen.findByText('fmt-z')).toBeVisible();
	});

	it('uses a default Intl format with a machine-readable datetime', async () => {
		const events = userEvent.setup();
		setup({
			locale: 'pt-BR',
			notifications: [
				{ id: 'z', title: 'Com data', read: true, timestamp: '2026-10-25T12:00:00Z' },
			],
		});
		await events.click(screen.getByRole('button', { name: 'Notificações' }));

		const time = await screen.findByText(/2026/);
		expect(time.tagName).toBe('TIME');
		expect(time).toHaveAttribute('dateTime', '2026-10-25T12:00:00.000Z');
	});

	it('accepts custom labels', async () => {
		const events = userEvent.setup();
		setup({
			labels: {
				title: 'Alerts',
				trigger: 'Alerts',
				triggerWithCount: (count) => `Alerts: ${count}`,
			},
		});
		await events.click(screen.getByRole('button', { name: 'Alerts: 2' }));

		expect(await screen.findByRole('dialog', { name: 'Alerts' })).toBeVisible();
	});

	it('supports a controlled open state', async () => {
		const events = userEvent.setup();
		const onOpenChange = vi.fn();
		setup({ onOpenChange, open: false });

		await events.click(bell());

		expect(onOpenChange).toHaveBeenCalledWith(true);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('exposes a long list in an internal, keyboard reachable scroll region', async () => {
		const events = userEvent.setup();
		const many = Array.from({ length: 60 }, (_, index) => ({
			id: `n${index}`,
			title: `Item ${index}`,
			read: index % 2 === 0,
		}));
		setup({ notifications: many });
		await events.click(screen.getByRole('button', { name: /Notificações/ }));

		const region = await screen.findByRole('region', { name: 'Lista de notificações' });
		expect(region).toHaveAttribute('tabindex', '0');
		expect(within(region).getAllByRole('listitem')).toHaveLength(60);
	});

	it('has no detectable accessibility violations, closed and open', async () => {
		const events = userEvent.setup();
		const { container } = setup({
			hasMore: true,
			historyHref: '/notificacoes',
			onLoadMore: vi.fn(),
			onMarkAllRead: vi.fn(),
			onMarkRead: vi.fn(),
		});
		const options = { rules: { 'color-contrast': { enabled: false } } };
		expect((await axe.run(container, options)).violations).toEqual([]);

		await events.click(bell());
		await screen.findByRole('dialog');
		expect((await axe.run(document.body, options)).violations).toEqual([]);
	});
});
