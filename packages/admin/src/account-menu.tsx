'use client';

import {
	AdsAvatar,
	AdsIcon,
	AdsLoadingIndicator,
	AdsPopover,
	type AdsAvatarTone,
	type AdsIconName,
	type AdsOverlayPlacement,
} from '@dvmarques/admin-ds-components';
import { useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from './class-names.js';
import {
	PanelContent,
	getInitials,
	handlePanelKeyDown,
	useGuardedAction,
	useOpenState,
} from './panel-utils.js';

export interface AdsAccountMenuUser {
	name?: string;
	email?: string;
	/** Photo; the initials are shown when it is missing or fails to load. */
	avatarSrc?: string;
	/** Background from the theme tokens when there is no photo. Defaults to `primary`. */
	avatarTone?: AdsAvatarTone;
	/** Any CSS color for the avatar background; takes precedence over `avatarTone`. */
	avatarBackgroundColor?: string;
	/** Any CSS color for the initials; pair it with `avatarBackgroundColor` for contrast. */
	avatarForegroundColor?: string;
	avatarAlt?: string;
	/** Initials shown without a photo. Derived from `name` when omitted. */
	initials?: string;
}

export interface AdsAccountMenuAction {
	id: string;
	label: ReactNode;
	description?: ReactNode;
	icon?: AdsIconName;
	/** Renders a native link; routing belongs to the browser or to the consumer. */
	href?: string;
	/** May return a `Promise`: the action stays busy and the panel open until it settles (buttons only; with `href` the result is ignored). */
	onSelect?: () => void | Promise<void>;
	disabled?: boolean;
	tone?: 'default' | 'danger';
}

export interface AdsAccountMenuGroup {
	id: string;
	label?: string;
	actions: AdsAccountMenuAction[];
}

export interface AdsAccountMenuLabels {
	/** Prefix of the accessible name; visible avatar initials and user name are appended. */
	trigger: string;
	/** Accessible name of the panel. */
	panel: string;
	switchAccount: string;
	actionError: string;
	pending: string;
}

const defaultLabels: AdsAccountMenuLabels = {
	trigger: 'Menu da conta',
	panel: 'Conta',
	switchAccount: 'Trocar conta',
	actionError: 'Não foi possível concluir a ação. Tente novamente.',
	pending: 'Em andamento',
};

export interface AdsAccountMenuProps extends Omit<
	HTMLAttributes<HTMLSpanElement>,
	'children' | 'onSelect'
> {
	user: AdsAccountMenuUser;
	groups: AdsAccountMenuGroup[];
	/** Optional identity switch (authentication); not an organization switch. */
	switchAccount?: Omit<AdsAccountMenuAction, 'id'> | undefined;
	open?: boolean | undefined;
	defaultOpen?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
	labels?: Partial<AdsAccountMenuLabels> | undefined;
	placement?: AdsOverlayPlacement | undefined;
}

function ActionContent({
	action,
	pending,
	pendingLabel,
}: {
	action: AdsAccountMenuAction;
	pending: boolean;
	pendingLabel: string;
}) {
	return (
		<>
			{action.icon ? (
				<span aria-hidden="true" className="ads-account-menu-action-icon">
					<AdsIcon name={action.icon} size="sm" />
				</span>
			) : null}
			<span className="ads-account-menu-action-text">
				<span className="ads-account-menu-action-label">{action.label}</span>
				{action.description ? (
					<span className="ads-account-menu-action-description">{action.description}</span>
				) : null}
			</span>
			{pending ? <AdsLoadingIndicator aria-hidden="true" label={pendingLabel} size="sm" /> : null}
		</>
	);
}

/**
 * Compact account menu opened by the avatar button. A non modal panel (not `role="menu"`): it
 * mixes identity and actions. Authentication, session and sign out belong to the application.
 */
export function AdsAccountMenu({
	className,
	defaultOpen = false,
	groups,
	labels: labelsProp,
	onOpenChange,
	open: openProp,
	placement = 'bottom',
	switchAccount,
	user,
	...props
}: AdsAccountMenuProps) {
	const labels = { ...defaultLabels, ...labelsProp };
	const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const errorId = useId();
	const { failedId, pendingId, reset, run } = useGuardedAction();
	const initials = getInitials(user.name, user.initials);
	const allGroups: AdsAccountMenuGroup[] = [
		...(switchAccount
			? [
					{
						id: 'ads-account-switch',
						label: labels.switchAccount,
						actions: [{ ...switchAccount, id: 'ads-account-switch' }],
					},
				]
			: []),
		...groups,
	];

	const openRef = useRef(open);
	openRef.current = open;
	const close = () => {
		reset();
		setOpen(false);
		triggerRef.current?.focus();
	};

	return (
		<span {...props} className={classNames('ads-account-menu', className)}>
			<AdsPopover
				aria-label={labels.panel}
				className="ads-account-menu-popover"
				content={
					<PanelContent className="ads-account-menu-panel">
						<div
							className="ads-account-menu-panel-inner"
							onKeyDown={(event) => handlePanelKeyDown(event, { close })}
						>
							<div className="ads-account-menu-identity">
								<AdsAvatar
									alt={user.avatarAlt ?? ''}
									backgroundColor={user.avatarBackgroundColor}
									fallback={initials}
									foregroundColor={user.avatarForegroundColor}
									size="lg"
									src={user.avatarSrc}
									tone={user.avatarTone ?? 'primary'}
								/>
								<span className="ads-account-menu-identity-text">
									{user.name ? (
										<strong className="ads-account-menu-name" title={user.name}>
											{user.name}
										</strong>
									) : null}
									{user.email ? (
										<span className="ads-account-menu-email" title={user.email}>
											{user.email}
										</span>
									) : null}
								</span>
							</div>
							<span className="ads-account-menu-visually-hidden" role="status">
								{pendingId ? labels.pending : ''}
							</span>
							{failedId ? (
								<p className="ads-account-menu-error" id={errorId} role="alert">
									{labels.actionError}
								</p>
							) : null}
							{allGroups.map((group) => (
								<div className="ads-account-menu-group" key={group.id}>
									{group.label ? (
										<p className="ads-account-menu-group-label" id={`${errorId}-${group.id}`}>
											{group.label}
										</p>
									) : null}
									<ul
										aria-labelledby={group.label ? `${errorId}-${group.id}` : undefined}
										className="ads-account-menu-actions"
									>
										{group.actions.map((action) => {
											const pending = pendingId === action.id;
											const blocked = Boolean(pendingId) && !pending;
											const common = {
												'aria-busy': pending || undefined,
												className: classNames(
													'ads-account-menu-action',
													action.tone === 'danger' && 'ads-account-menu-action-danger',
												),
												'data-ads-panel-item': '',
											};
											const content = (
												<ActionContent
													action={action}
													pending={pending}
													pendingLabel={labels.pending}
												/>
											);
											return (
												<li key={action.id}>
													{action.href && !action.disabled && !blocked ? (
														<a
															{...common}
															href={action.href}
															onClick={() => {
																// Link: o navegador segue; o retorno de `onSelect` é ignorado, sem rejeição solta.
																Promise.resolve(action.onSelect?.()).catch(() => undefined);
																close();
															}}
														>
															{content}
														</a>
													) : (
														<button
															{...common}
															aria-disabled={blocked || undefined}
															disabled={action.disabled}
															onClick={() => {
																if (blocked) return;
																run(
																	action.id,
																	() => action.onSelect?.(),
																	() => {
																		// Só fecha se o painel não foi dispensado durante a ação pendente.
																		if (openRef.current) close();
																	},
																);
															}}
															type="button"
														>
															{content}
														</button>
													)}
												</li>
											);
										})}
									</ul>
								</div>
							))}
						</div>
					</PanelContent>
				}
				onOpenChange={(next) => {
					reset();
					if (!next) {
						// Escape com o painel aberto sem interação prévia: a primitiva não tem o gatilho como origem.
						const active = document.activeElement;
						if (active === document.body || active?.closest('.ads-account-menu-popover'))
							triggerRef.current?.focus();
					}
					setOpen(next);
				}}
				open={open}
				placement={placement}
			>
				<button
					aria-haspopup="dialog"
					aria-label={`${labels.trigger}${initials ? `: ${initials}` : ''}${user.name ? ` ${user.name}` : ''}`}
					className="ads-account-menu-trigger"
					ref={triggerRef}
					type="button"
				>
					<AdsAvatar
						alt=""
						backgroundColor={user.avatarBackgroundColor}
						fallback={initials}
						foregroundColor={user.avatarForegroundColor}
						size="sm"
						src={user.avatarSrc}
						tone={user.avatarTone ?? 'primary'}
					/>
				</button>
			</AdsPopover>
		</span>
	);
}
