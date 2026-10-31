'use client';

import {
	AdsAvatar,
	AdsButton,
	AdsDrawer,
	AdsIcon,
	AdsLoadingIndicator,
	AdsSkeleton,
	type AdsIconName,
} from '@dvmarques/admin-ds-components';
import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from './class-names.js';
import { useGuardedAction, useOpenState } from './panel-utils.js';

export type AdsNotificationFilter = 'all' | 'unread';
export type AdsNotificationStatus = 'ready' | 'loading' | 'error';

export interface AdsNotification {
	id: string;
	title: string;
	description?: ReactNode;
	/** Formatted with `formatTime` or the default `Intl` format; `timeLabel` takes precedence. */
	timestamp?: Date | string | number;
	timeLabel?: ReactNode;
	icon?: AdsIconName;
	avatar?: { alt?: string; fallback: string; src?: string };
	read: boolean;
	/** Renders the item as a native link. */
	href?: string;
}

export interface AdsNotificationCenterLabels {
	/** Accessible name of the bell without a count. */
	trigger: string;
	/** Accessible name of the bell with unread notifications. */
	triggerWithCount: (count: number) => string;
	title: string;
	close: string;
	filters: string;
	all: string;
	unread: string;
	markAllRead: string;
	markRead: string;
	unreadItem: string;
	list: string;
	empty: string;
	emptyUnread: string;
	loading: string;
	error: string;
	retry: string;
	actionError: string;
	loadMore: string;
	loadingMore: string;
	history: string;
	pending: string;
}

const defaultLabels: AdsNotificationCenterLabels = {
	trigger: 'Notificações',
	triggerWithCount: (count) => `Notificações, ${count} ${count === 1 ? 'não lida' : 'não lidas'}`,
	title: 'Notificações',
	close: 'Fechar notificações',
	filters: 'Filtrar notificações',
	all: 'Todas',
	unread: 'Não lidas',
	markAllRead: 'Marcar todas como lidas',
	markRead: 'Marcar como lida',
	unreadItem: 'Não lida',
	list: 'Lista de notificações',
	empty: 'Nenhuma notificação por aqui.',
	emptyUnread: 'Nenhuma notificação não lida.',
	loading: 'Carregando notificações',
	error: 'Não foi possível carregar as notificações.',
	retry: 'Tentar novamente',
	actionError: 'Não foi possível atualizar. Tente novamente.',
	loadMore: 'Carregar mais',
	loadingMore: 'Carregando',
	history: 'Ver todas as notificações',
	pending: 'Atualizando',
};

export interface AdsNotificationCenterProps extends Omit<
	HTMLAttributes<HTMLSpanElement>,
	'children'
> {
	notifications: AdsNotification[];
	/** Unread total owned by the application; defaults to the unread items loaded. */
	unreadCount?: number | undefined;
	open?: boolean | undefined;
	defaultOpen?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
	filter?: AdsNotificationFilter | undefined;
	defaultFilter?: AdsNotificationFilter | undefined;
	onFilterChange?: ((filter: AdsNotificationFilter) => void) | undefined;
	/** May return a `Promise`; the notification only becomes read when `read` changes in the data. */
	onMarkRead?: ((id: string) => void | Promise<void>) | undefined;
	onMarkAllRead?: (() => void | Promise<void>) | undefined;
	/** Called when an item is activated, before any read request. */
	onItemSelect?: ((notification: AdsNotification) => void) | undefined;
	/** Activating an unread item also calls `onMarkRead`. Opening the panel never marks anything. */
	markReadOnSelect?: boolean | undefined;
	status?: AdsNotificationStatus | undefined;
	onRetry?: (() => void) | undefined;
	hasMore?: boolean | undefined;
	onLoadMore?: (() => void) | undefined;
	loadingMore?: boolean | undefined;
	/** Footer link to the full history, when the application has one. */
	historyHref?: string | undefined;
	labels?: Partial<AdsNotificationCenterLabels> | undefined;
	/** Locale of the default date format; `formatTime` replaces the format entirely. */
	locale?: string | undefined;
	formatTime?: ((notification: AdsNotification) => ReactNode) | undefined;
}

function defaultTime(notification: AdsNotification, locale?: string): ReactNode {
	if (notification.timeLabel !== undefined) return notification.timeLabel;
	if (notification.timestamp === undefined) return null;
	const date = new Date(notification.timestamp);
	if (Number.isNaN(date.getTime())) return null;
	return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function NotificationItem({
	blocked,
	failed,
	formatTime,
	labels,
	locale,
	notification,
	onActivate,
	onMarkRead,
	pending,
}: {
	blocked: boolean;
	failed: boolean;
	formatTime?: ((notification: AdsNotification) => ReactNode) | undefined;
	labels: AdsNotificationCenterLabels;
	locale?: string | undefined;
	notification: AdsNotification;
	onActivate?: ((notification: AdsNotification) => void) | undefined;
	onMarkRead?: ((notification: AdsNotification) => void) | undefined;
	pending: boolean;
}) {
	const time = formatTime ? formatTime(notification) : defaultTime(notification, locale);
	const timestamp =
		notification.timestamp !== undefined ? new Date(notification.timestamp) : undefined;
	const interactive = Boolean(notification.href || onActivate);
	const body = (
		<>
			{!notification.read ? (
				<span className="ads-notification-center-visually-hidden">{labels.unreadItem}. </span>
			) : null}
			<span className="ads-notification-center-item-title">{notification.title}</span>
			{notification.description ? (
				<span className="ads-notification-center-item-description">{notification.description}</span>
			) : null}
			{time ? (
				<time
					className="ads-notification-center-item-time"
					dateTime={
						timestamp && !Number.isNaN(timestamp.getTime()) ? timestamp.toISOString() : undefined
					}
				>
					{time}
				</time>
			) : null}
		</>
	);
	return (
		<li
			aria-busy={pending || undefined}
			className="ads-notification-center-item"
			data-read={notification.read ? 'true' : 'false'}
		>
			<span aria-hidden="true" className="ads-notification-center-item-media">
				{notification.avatar ? (
					<AdsAvatar
						alt=""
						fallback={notification.avatar.fallback}
						size="sm"
						src={notification.avatar.src}
					/>
				) : notification.icon ? (
					<span className="ads-notification-center-item-icon">
						<AdsIcon name={notification.icon} size="sm" />
					</span>
				) : null}
				{!notification.read ? <span className="ads-notification-center-item-dot" /> : null}
			</span>
			<div className="ads-notification-center-item-content">
				{notification.href ? (
					<a
						className="ads-notification-center-item-main"
						data-ads-panel-item=""
						href={notification.href}
						onClick={() => onActivate?.(notification)}
					>
						{body}
					</a>
				) : interactive ? (
					<button
						className="ads-notification-center-item-main"
						data-ads-panel-item=""
						onClick={() => onActivate?.(notification)}
						type="button"
					>
						{body}
					</button>
				) : (
					<div className="ads-notification-center-item-main">{body}</div>
				)}
				{!notification.read && onMarkRead ? (
					<div className="ads-notification-center-item-actions">
						<button
							aria-busy={pending || undefined}
							aria-disabled={pending || blocked || undefined}
							aria-label={`${labels.markRead}: ${notification.title}`}
							className="ads-notification-center-link-button"
							onClick={() => {
								if (!pending && !blocked) onMarkRead(notification);
							}}
							type="button"
						>
							{pending ? (
								<AdsLoadingIndicator aria-hidden="true" label={labels.pending} size="sm" />
							) : null}
							{labels.markRead}
						</button>
						{failed ? (
							<span className="ads-notification-center-item-error" role="alert">
								{labels.actionError}
							</span>
						) : null}
					</div>
				) : null}
			</div>
		</li>
	);
}

/**
 * Notification bell with a side panel. Data, counts and read state are owned by the application:
 * the library has no transport, storage or push. Opening the panel never marks anything as read.
 */
export function AdsNotificationCenter({
	className,
	defaultFilter = 'all',
	defaultOpen = false,
	filter: filterProp,
	formatTime,
	hasMore = false,
	historyHref,
	labels: labelsProp,
	loadingMore = false,
	locale,
	markReadOnSelect = true,
	notifications,
	onFilterChange,
	onItemSelect,
	onLoadMore,
	onMarkAllRead,
	onMarkRead,
	onOpenChange,
	onRetry,
	open: openProp,
	status = 'ready',
	unreadCount,
	...props
}: AdsNotificationCenterProps) {
	const labels = { ...defaultLabels, ...labelsProp };
	const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
	const [uncontrolledFilter, setUncontrolledFilter] =
		useState<AdsNotificationFilter>(defaultFilter);
	const filter = filterProp ?? uncontrolledFilter;
	const triggerRef = useRef<HTMLButtonElement>(null);
	const titleId = useId();
	const panelId = useId();
	const item = useGuardedAction();
	const all = useGuardedAction();

	const count = Math.max(
		0,
		unreadCount ?? notifications.filter((notification) => !notification.read).length,
	);
	const visible =
		filter === 'unread'
			? notifications.filter((notification) => !notification.read)
			: notifications;
	const triggerName = count > 0 ? labels.triggerWithCount(count) : labels.trigger;

	const bodyRef = useRef<HTMLDivElement>(null);
	// Um controle que sai da lista (lida, recarregada) não pode deixar o foco no <body>.
	useEffect(() => {
		if (open && (!document.activeElement || document.activeElement === document.body)) {
			bodyRef.current?.focus({ preventScroll: true });
		}
	}, [notifications, open, status]);

	const statusText = loadingMore
		? labels.loadingMore
		: item.pendingId || all.pendingId
			? labels.pending
			: status === 'loading'
				? labels.loading
				: status === 'ready' && visible.length === 0
					? filter === 'unread'
						? labels.emptyUnread
						: labels.empty
					: '';

	const changeFilter = (next: AdsNotificationFilter) => {
		if (filterProp === undefined) setUncontrolledFilter(next);
		onFilterChange?.(next);
	};
	// Leitura individual e global não se sobrepõem: uma operação pendente bloqueia a outra, para
	// não haver mutações simultâneas e fora de ordem.
	const markRead = (notification: AdsNotification) =>
		!all.pendingId && item.run(notification.id, () => onMarkRead?.(notification.id));
	const activate = (notification: AdsNotification) => {
		onItemSelect?.(notification);
		if (markReadOnSelect && !notification.read && onMarkRead) markRead(notification);
		if (notification.href) setOpen(false);
	};

	return (
		<span {...props} className={classNames('ads-notification-center', className)}>
			<button
				aria-controls={open ? panelId : undefined}
				aria-expanded={open}
				aria-haspopup="dialog"
				aria-label={triggerName}
				className="ads-notification-center-trigger"
				onClick={() => setOpen(!open)}
				ref={triggerRef}
				type="button"
			>
				<AdsIcon name="bell" />
				{count > 0 ? (
					<span aria-hidden="true" className="ads-notification-center-badge">
						{count > 99 ? '99+' : count}
					</span>
				) : null}
			</button>
			<AdsDrawer
				aria-labelledby={titleId}
				closeLabel={labels.close}
				id={panelId}
				onOpenChange={setOpen}
				open={open}
				placement="right"
				style={{ overflow: 'hidden', padding: 0, width: 'min(26rem, 100vw)' }}
			>
				<div className="ads-notification-center-panel">
					<header className="ads-notification-center-header">
						<h2 className="ads-notification-center-title" id={titleId}>
							{labels.title}
						</h2>
					</header>
					<div className="ads-notification-center-toolbar">
						<div
							aria-label={labels.filters}
							className="ads-notification-center-filters"
							role="group"
						>
							{(['all', 'unread'] as const).map((option) => (
								<button
									aria-pressed={filter === option}
									className="ads-notification-center-filter"
									key={option}
									onClick={() => changeFilter(option)}
									type="button"
								>
									{option === 'all' ? labels.all : labels.unread}
								</button>
							))}
						</div>
						{onMarkAllRead ? (
							<button
								aria-busy={all.pendingId ? true : undefined}
								className="ads-notification-center-link-button"
								aria-disabled={count === 0 || Boolean(all.pendingId || item.pendingId) || undefined}
								onClick={() => {
									if (count > 0 && !all.pendingId && !item.pendingId)
										all.run('all', () => onMarkAllRead());
								}}
								type="button"
							>
								{all.pendingId ? (
									<AdsLoadingIndicator aria-hidden="true" label={labels.pending} size="sm" />
								) : null}
								{labels.markAllRead}
							</button>
						) : null}
					</div>
					{/* Região viva única e persistente: só o texto muda, e as mensagens visíveis não têm role. */}
					<span className="ads-notification-center-visually-hidden" role="status">
						{statusText}
					</span>
					{all.failedId ? (
						<p className="ads-notification-center-error" role="alert">
							{labels.actionError}
						</p>
					) : null}
					<div
						aria-label={labels.list}
						className="ads-notification-center-body"
						ref={bodyRef}
						role="region"
						tabIndex={0}
					>
						{status === 'loading' ? (
							<div className="ads-notification-center-state">
								<AdsSkeleton aria-hidden="true" className="ads-notification-center-skeleton" />
								<AdsSkeleton aria-hidden="true" className="ads-notification-center-skeleton" />
								<AdsSkeleton aria-hidden="true" className="ads-notification-center-skeleton" />
							</div>
						) : status === 'error' ? (
							<div className="ads-notification-center-state" role="alert">
								<p>{labels.error}</p>
								{onRetry ? (
									<AdsButton onClick={onRetry} size="sm" variant="secondary">
										{labels.retry}
									</AdsButton>
								) : null}
							</div>
						) : (
							<>
								{visible.length === 0 ? (
									<p className="ads-notification-center-state">
										{filter === 'unread' ? labels.emptyUnread : labels.empty}
									</p>
								) : (
									<ul className="ads-notification-center-list">
										{visible.map((notification) => (
											<NotificationItem
												blocked={
													Boolean(all.pendingId) ||
													(Boolean(item.pendingId) && item.pendingId !== notification.id)
												}
												failed={item.failedId === notification.id}
												formatTime={formatTime}
												key={notification.id}
												labels={labels}
												locale={locale}
												notification={notification}
												onActivate={
													onItemSelect || notification.href || (markReadOnSelect && onMarkRead)
														? activate
														: undefined
												}
												onMarkRead={onMarkRead ? markRead : undefined}
												pending={item.pendingId === notification.id}
											/>
										))}
									</ul>
								)}
								{/* Sem `onLoadMore` não há o que acionar: o botão não é renderizado. */}
								{hasMore && onLoadMore ? (
									<div className="ads-notification-center-more">
										<AdsButton
											aria-disabled={loadingMore || undefined}
											onClick={loadingMore ? undefined : onLoadMore}
											size="sm"
											variant="secondary"
										>
											{labels.loadMore}
										</AdsButton>
									</div>
								) : null}
							</>
						)}
					</div>
					{historyHref ? (
						<footer className="ads-notification-center-footer">
							<a className="ads-notification-center-history" href={historyHref}>
								{labels.history}
							</a>
						</footer>
					) : null}
				</div>
			</AdsDrawer>
		</span>
	);
}
