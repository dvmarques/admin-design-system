'use client';

import {
	AdsAvatar,
	AdsButton,
	AdsIcon,
	AdsInput,
	AdsLoadingIndicator,
	AdsPopover,
	AdsTooltip,
	type AdsOverlayPlacement,
} from '@admin-ds/components';
import {
	forwardRef,
	useId,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
} from 'react';
import { useOptionalAdminShellContext } from './admin-shell-state.js';
import { classNames } from './class-names.js';
import {
	PanelContent,
	getInitials,
	handlePanelKeyDown,
	useGuardedAction,
	useOpenState,
} from './panel-utils.js';

export interface AdsOrganization {
	id: string;
	name: string;
	description?: string;
	logoSrc?: string;
	/** Shown without a logo or when it fails to load. Derived from `name` when omitted. */
	initials?: string;
	disabled?: boolean;
}

export type AdsOrganizationSwitcherStatus = 'ready' | 'loading' | 'error';

export interface AdsOrganizationSwitcherManage {
	label?: string;
	href?: string;
	onSelect?: () => void;
}

export interface AdsOrganizationSwitcherLabels {
	/** Prefix of the accessible name of the trigger: "<trigger>: <organization>". */
	trigger: string;
	panel: string;
	search: string;
	searchPlaceholder: string;
	list: string;
	current: string;
	none: string;
	noResults: string;
	loading: string;
	error: string;
	retry: string;
	switching: string;
	switchError: string;
	manage: string;
}

const defaultLabels: AdsOrganizationSwitcherLabels = {
	trigger: 'Organização atual',
	panel: 'Trocar de organização',
	search: 'Buscar organização',
	searchPlaceholder: 'Buscar organização',
	list: 'Organizações',
	current: 'organização atual',
	none: 'Sem organizações',
	noResults: 'Nenhuma organização encontrada.',
	loading: 'Carregando organizações',
	error: 'Não foi possível carregar as organizações.',
	retry: 'Tentar novamente',
	switching: 'Trocando de organização',
	switchError: 'Não foi possível trocar de organização. Tente novamente.',
	manage: 'Gerenciar organizações',
};

/** Searching starts when the list has at least this many organizations (`searchable="auto"`). */
const autoSearchThreshold = 7;

export interface AdsOrganizationSwitcherProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'defaultValue' | 'onSelect'
> {
	organizations: AdsOrganization[];
	/** Id of the current organization (controlled). */
	value?: string | undefined;
	/** Id of the initial organization (uncontrolled). */
	defaultValue?: string | undefined;
	/**
	 * Called with the chosen id. May return a `Promise`: the choice stays pending, and the current
	 * organization does not change here until `value` does (controlled) or the promise resolves.
	 */
	onValueChange?: ((id: string) => void | Promise<void>) | undefined;
	status?: AdsOrganizationSwitcherStatus | undefined;
	onRetry?: (() => void) | undefined;
	manage?: AdsOrganizationSwitcherManage | undefined;
	searchable?: boolean | 'auto' | undefined;
	open?: boolean | undefined;
	defaultOpen?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
	labels?: Partial<AdsOrganizationSwitcherLabels> | undefined;
	/** Forces the compact trigger. Inside `AdsAdminShell` it follows the collapsed desktop sidebar. */
	collapsed?: boolean | undefined;
	placement?: AdsOverlayPlacement | undefined;
}

function normalize(text: string) {
	return text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase();
}

interface TriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	tooltip?: string | undefined;
}

/** Receives the ARIA props that `AdsPopover` injects, optionally behind a tooltip. */
const TriggerButton = forwardRef<HTMLButtonElement, TriggerProps>(function TriggerButton(
	{ tooltip, ...props },
	ref,
) {
	const button = <button {...props} ref={ref} type="button" />;
	return tooltip ? (
		<AdsTooltip content={tooltip} describeTrigger={false} placement="right">
			{button}
		</AdsTooltip>
	) : (
		button
	);
});

/**
 * Optional organization switcher for the top of the sidebar. The application provides the
 * organizations, the selection and the switch callback; permissions and the effective change of
 * context are not handled here. Place it as the first child of `AdsAdminShell.Sidebar`; when it is
 * not rendered, the navigation keeps its place with no leftover space.
 */
export function AdsOrganizationSwitcher({
	className,
	collapsed: collapsedProp,
	defaultOpen = false,
	defaultValue,
	labels: labelsProp,
	manage,
	onOpenChange,
	onRetry,
	onValueChange,
	open: openProp,
	organizations,
	placement = 'bottom',
	searchable = 'auto',
	status = 'ready',
	value,
	...props
}: AdsOrganizationSwitcherProps) {
	const labels = { ...defaultLabels, ...labelsProp };
	const shell = useOptionalAdminShellContext();
	const collapsed = collapsedProp ?? Boolean(shell?.collapsed && shell.isDesktop);
	const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const [query, setQuery] = useState('');
	const triggerRef = useRef<HTMLButtonElement>(null);
	const listId = useId();
	const { failedId, pendingId, reset, run } = useGuardedAction();

	const currentId = value ?? uncontrolledValue;
	const current = organizations.find((organization) => organization.id === currentId);
	const empty = organizations.length === 0;
	const showSearch =
		searchable === true || (searchable === 'auto' && organizations.length >= autoSearchThreshold);
	const needle = normalize(query.trim());
	const filtered = needle
		? organizations.filter((organization) =>
				normalize(`${organization.name} ${organization.description ?? ''}`).includes(needle),
			)
		: organizations;

	const openRef = useRef(open);
	openRef.current = open;
	const finish = () => {
		reset();
		setQuery('');
		setOpen(false);
		triggerRef.current?.focus();
	};
	const choose = (organization: AdsOrganization) => {
		if (organization.id === currentId) {
			finish();
			return;
		}
		run(
			organization.id,
			() => onValueChange?.(organization.id),
			() => {
				if (value === undefined) setUncontrolledValue(organization.id);
				// Só devolve o foco se o painel não foi dispensado enquanto a troca estava pendente.
				if (openRef.current) finish();
			},
		);
	};

	const name = current?.name ?? labels.none;
	const triggerContent = (
		<>
			<span aria-hidden="true" className="ads-organization-switcher-logo">
				<AdsAvatar
					alt=""
					fallback={getInitials(current?.name, current?.initials)}
					size="sm"
					src={current?.logoSrc}
				/>
			</span>
			<span className="ads-organization-switcher-text">
				<span className="ads-organization-switcher-name" title={name}>
					{name}
				</span>
				{current?.description ? (
					<span className="ads-organization-switcher-description" title={current.description}>
						{current.description}
					</span>
				) : null}
			</span>
			<span aria-hidden="true" className="ads-organization-switcher-chevron">
				<AdsIcon name="chevronsUpDown" size="sm" />
			</span>
		</>
	);

	return (
		<div
			{...props}
			className={classNames('ads-organization-switcher', className)}
			data-collapsed={collapsed ? 'true' : 'false'}
		>
			<AdsPopover
				aria-label={labels.panel}
				className="ads-organization-switcher-popover"
				content={
					<PanelContent className="ads-organization-switcher-panel" focusKey={status}>
						<div
							className="ads-organization-switcher-panel-inner"
							onKeyDown={(event) => handlePanelKeyDown(event, { close: finish })}
						>
							{showSearch && status === 'ready' ? (
								<AdsInput
									aria-controls={listId}
									aria-label={labels.search}
									data-ads-initial-focus=""
									onChange={(event) => setQuery(event.target.value)}
									placeholder={labels.searchPlaceholder}
									size="sm"
									type="search"
									value={query}
								/>
							) : null}
							{status === 'loading' ? (
								<p className="ads-organization-switcher-state" role="status">
									<AdsLoadingIndicator aria-hidden="true" label={labels.loading} size="sm" />
									{labels.loading}
								</p>
							) : status === 'error' ? (
								<div className="ads-organization-switcher-state" role="alert">
									<p>{labels.error}</p>
									{onRetry ? (
										<AdsButton onClick={onRetry} size="sm" variant="secondary">
											{labels.retry}
										</AdsButton>
									) : null}
								</div>
							) : filtered.length === 0 ? (
								<p className="ads-organization-switcher-state" role="status">
									{labels.noResults}
								</p>
							) : (
								<ul aria-label={labels.list} className="ads-organization-switcher-list" id={listId}>
									{filtered.map((organization) => {
										const isCurrent = organization.id === currentId;
										const pending = pendingId === organization.id;
										return (
											<li key={organization.id}>
												<button
													aria-busy={pending || undefined}
													aria-current={isCurrent ? 'true' : undefined}
													className="ads-organization-switcher-option"
													data-ads-initial-focus={isCurrent && !showSearch ? '' : undefined}
													data-ads-panel-item=""
													disabled={organization.disabled || (Boolean(pendingId) && !pending)}
													onClick={() => choose(organization)}
													type="button"
												>
													<span aria-hidden="true" className="ads-organization-switcher-logo">
														<AdsAvatar
															alt=""
															fallback={getInitials(organization.name, organization.initials)}
															size="sm"
															src={organization.logoSrc}
														/>
													</span>
													<span className="ads-organization-switcher-option-text">
														<span
															className="ads-organization-switcher-option-name"
															title={organization.name}
														>
															{organization.name}
														</span>
														{organization.description ? (
															<span className="ads-organization-switcher-option-description">
																{organization.description}
															</span>
														) : null}
													</span>
													{pending ? (
														<AdsLoadingIndicator
															aria-hidden="true"
															label={labels.switching}
															size="sm"
														/>
													) : null}
													{isCurrent ? (
														<>
															<AdsIcon
																className="ads-organization-switcher-check"
																name="check"
																size="sm"
															/>
															<span className="ads-organization-switcher-visually-hidden">
																({labels.current})
															</span>
														</>
													) : null}
												</button>
											</li>
										);
									})}
								</ul>
							)}
							{failedId ? (
								<p className="ads-organization-switcher-error" role="alert">
									{labels.switchError}
								</p>
							) : null}
							{pendingId ? (
								<span className="ads-organization-switcher-visually-hidden" role="status">
									{labels.switching}
								</span>
							) : null}
							{manage ? (
								<div className="ads-organization-switcher-footer">
									{manage.href ? (
										<a
											className="ads-organization-switcher-manage"
											data-ads-panel-item=""
											href={manage.href}
											onClick={() => {
												manage.onSelect?.();
												finish();
											}}
										>
											{manage.label ?? labels.manage}
										</a>
									) : (
										<button
											className="ads-organization-switcher-manage"
											data-ads-panel-item=""
											onClick={() => {
												manage.onSelect?.();
												finish();
											}}
											type="button"
										>
											{manage.label ?? labels.manage}
										</button>
									)}
								</div>
							) : null}
						</div>
					</PanelContent>
				}
				onOpenChange={(next) => {
					reset();
					if (!next) {
						setQuery('');
						if (document.activeElement === document.body) triggerRef.current?.focus();
					}
					setOpen(next);
				}}
				open={open}
				placement={placement}
			>
				<TriggerButton
					aria-haspopup="dialog"
					aria-label={`${labels.trigger}: ${name}${current?.description ? `, ${current.description}` : ''}`}
					className="ads-organization-switcher-trigger"
					disabled={empty}
					ref={triggerRef}
					tooltip={collapsed && !empty ? name : undefined}
				>
					{triggerContent}
				</TriggerButton>
			</AdsPopover>
		</div>
	);
}
