'use client';

import {
	AdsAvatar,
	AdsButton,
	AdsCombobox,
	AdsIcon,
	AdsLoadingIndicator,
	AdsTooltip,
	type AdsAvatarTone,
	type AdsComboboxOption,
	type AdsOverlayPlacement,
} from '@dvmarques/admin-ds-components';
import {
	forwardRef,
	useMemo,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
} from 'react';
import { useOptionalAdminShellContext } from './admin-shell-state.js';
import { classNames } from './class-names.js';
import { getInitials, useGuardedAction, useOpenState } from './panel-utils.js';

export interface AdsOrganization {
	/** Avatar token tone. Defaults to neutral; applies to trigger and options. */
	avatarTone?: AdsAvatarTone;
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
	/** Prefix of the accessible name: "<trigger>: <initials> <organization>". */
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
 *
 * Composes `AdsCombobox` with `presentation="popover"`: search, keyboard navigation and selection
 * come from the primitive, while this wrapper owns the organization visuals, the asynchronous
 * switch (pending, failure, no optimistic confirmation) and the `manage` action.
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
	const { failedId, pendingId, reset, run } = useGuardedAction();

	const currentId = value ?? uncontrolledValue;
	const current = organizations.find((organization) => organization.id === currentId);
	const empty = organizations.length === 0;
	const showSearch =
		searchable === true || (searchable === 'auto' && organizations.length >= autoSearchThreshold);

	const options = useMemo<AdsComboboxOption[]>(
		() =>
			organizations.map((organization) => ({
				value: organization.id,
				label: organization.name,
				...(organization.description ? { description: organization.description } : {}),
				// Durante uma troca pendente nenhuma outra opção pode ser acionada.
				disabled: organization.disabled || (Boolean(pendingId) && pendingId !== organization.id),
			})),
		[organizations, pendingId],
	);
	const byId = useMemo(
		() => new Map(organizations.map((organization) => [organization.id, organization])),
		[organizations],
	);

	const openRef = useRef(open);
	openRef.current = open;
	const finish = () => {
		reset();
		setOpen(false);
	};
	const choose = (id: string | null) => {
		if (!id) return;
		run(
			id,
			() => onValueChange?.(id),
			() => {
				// Confirmação só após o sucesso: aqui o estado não controlado é atualizado.
				if (value === undefined) setUncontrolledValue(id);
				// Só fecha se o painel não foi dispensado enquanto a troca estava pendente.
				if (openRef.current) finish();
			},
		);
	};

	const name = current?.name ?? labels.none;
	const logoInitials = getInitials(current?.name, current?.initials);
	const accessibleName = `${labels.trigger}: ${logoInitials ? `${logoInitials} ` : ''}${name}${current?.description ? ` ${current.description}` : ''}`;

	const retry = status === 'error' && onRetry;
	const footer =
		failedId || manage || retry ? (
			<>
				{retry ? (
					<AdsButton onClick={onRetry} size="sm" variant="secondary">
						{labels.retry}
					</AdsButton>
				) : null}
				{failedId ? (
					<p className="ads-organization-switcher-error" role="alert">
						{labels.switchError}
					</p>
				) : null}
				{manage ? (
					<div className="ads-organization-switcher-footer">
						{manage.href ? (
							<a
								className="ads-organization-switcher-manage"
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
			</>
		) : undefined;

	return (
		<div
			{...props}
			className={classNames('ads-organization-switcher', className)}
			data-collapsed={collapsed ? 'true' : 'false'}
		>
			<AdsCombobox
				align="center"
				aria-label={accessibleName}
				closeOnSelect={false}
				disabled={empty}
				emptyText={labels.noResults}
				error={status === 'error' ? labels.error : undefined}
				filterOption={(option, query) => {
					const needle = normalize(query);
					return normalize(`${option.label} ${option.description ?? ''}`).includes(needle);
				}}
				footer={footer}
				listLabel={labels.list}
				loading={status === 'loading'}
				loadingText={labels.loading}
				onOpenChange={(next) => {
					reset();
					setOpen(next);
				}}
				onValueChange={(id) => choose(id)}
				open={open}
				options={options}
				panelClassName="ads-organization-switcher-popover"
				panelLabel={labels.panel}
				placement={placement}
				presentation="popover"
				renderOption={(option) => {
					const organization = byId.get(option.value);
					if (!organization) return option.label;
					const isCurrent = organization.id === currentId;
					return (
						<>
							<OrganizationLogo organization={organization} />
							<span className="ads-organization-switcher-option-text">
								<span className="ads-organization-switcher-option-name" title={organization.name}>
									{organization.name}
								</span>
								{organization.description ? (
									<span className="ads-organization-switcher-option-description">
										{organization.description}
									</span>
								) : null}
							</span>
							{pendingId === organization.id ? (
								<AdsLoadingIndicator aria-hidden="true" label={labels.switching} size="sm" />
							) : null}
							{isCurrent ? (
								<>
									<AdsIcon className="ads-organization-switcher-check" name="check" size="sm" />
									<span className="ads-organization-switcher-visually-hidden">
										({labels.current})
									</span>
								</>
							) : null}
						</>
					);
				}}
				renderTrigger={({ triggerProps }) => (
					<TriggerButton
						{...triggerProps}
						className="ads-organization-switcher-trigger"
						tooltip={collapsed && !empty ? name : undefined}
					>
						{current ? <OrganizationLogo organization={current} /> : <OrganizationLogo />}
						<span className="ads-organization-switcher-text">
							<span className="ads-organization-switcher-name" title={name}>
								{' '}{name}
							</span>
							{current?.description ? (
								<span className="ads-organization-switcher-description" title={current.description}>
									{' '}{current.description}
								</span>
							) : null}
						</span>
						<span aria-hidden="true" className="ads-organization-switcher-chevron">
							<AdsIcon name="chevronsUpDown" size="sm" />
						</span>
					</TriggerButton>
				)}
				searchLabel={labels.search}
				searchPlaceholder={labels.searchPlaceholder}
				searchable={showSearch && status === 'ready'}
				showOptionVisuals={false}
				statusMessage={pendingId ? labels.switching : undefined}
				value={currentId ?? null}
			/>
		</div>
	);
}

/** Logo with the configured tone; falls back to initials. Decorative: the name is in the text. */
function OrganizationLogo({ organization }: { organization?: AdsOrganization | undefined }) {
	return (
		<span aria-hidden="true" className="ads-organization-switcher-logo">
			<AdsAvatar
				alt=""
				fallback={getInitials(organization?.name, organization?.initials)}
				size="sm"
				src={organization?.logoSrc}
				tone={organization?.avatarTone ?? 'neutral'}
			/>
		</span>
	);
}
