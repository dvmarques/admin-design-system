'use client';

import {
	AdsButton,
	AdsCheckbox,
	AdsDatePicker,
	AdsField,
	AdsFieldDescription,
	AdsFieldMessage,
	AdsIcon,
	AdsInput,
	AdsSelect,
	AdsSelectionGroup,
	type AdsDateRange,
} from '@admin-ds/components';
import {
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type FocusEvent,
	type HTMLAttributes,
	type MouseEvent,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';

export interface AdsFilterOption {
	label: string;
	value: string;
	disabled?: boolean;
}

interface AdsFilterBase {
	/**
	 * Chave do filtro em `AdsFilterValues`. Deve ser única na barra, inclusive depois da
	 * sanitização usada nos ids do DOM, que remove caracteres fora de `[A-Za-z0-9_-]`
	 * (`'a b'` e `'ab'` colidem).
	 */
	id: string;
	label: string;
	description?: ReactNode;
	/** Mensagem de erro do campo, associada a ele e anunciada. */
	error?: ReactNode;
	disabled?: boolean;
	className?: string;
}

export interface AdsTextFilter extends AdsFilterBase {
	type: 'text';
	placeholder?: string;
}

export interface AdsSelectFilter extends AdsFilterBase {
	type: 'select';
	options: readonly AdsFilterOption[];
	/** Texto da opção que remove o filtro. Padrão: `labels.allOption`. */
	placeholder?: string;
}

export interface AdsMultiSelectFilter extends AdsFilterBase {
	type: 'multiselect';
	options: readonly AdsFilterOption[];
}

export interface AdsDateFilter extends AdsFilterBase {
	type: 'date';
	min?: string;
	max?: string;
}

export interface AdsDateRangeFilter extends AdsFilterBase {
	type: 'date-range';
	min?: string;
	max?: string;
}

export type AdsFilterDefinition =
	AdsTextFilter | AdsSelectFilter | AdsMultiSelectFilter | AdsDateFilter | AdsDateRangeFilter;

/** Texto, seleção e data: `string` (data ISO `AAAA-MM-DD`); seleção múltipla: `string[]`; intervalo: `AdsDateRange`. */
export type AdsFilterValue = string | string[] | AdsDateRange;
export type AdsFilterValues = Record<string, AdsFilterValue>;

/** Textos da interface; os padrões estão em pt-BR. `{count}`, `{label}` e `{value}` são substituídos. */
export interface AdsFilterBarLabels {
	activeFilters?: string;
	activeCountOne?: string;
	activeCountOther?: string;
	allOption?: string;
	clearAll?: string;
	loading?: string;
	noActiveFilters?: string;
	/** Marcador de extremidade ausente em um intervalo de datas. */
	openEnded?: string;
	removeFilter?: string;
	toggle?: string;
}

const defaultLabels: Required<AdsFilterBarLabels> = {
	activeFilters: 'Filtros ativos',
	activeCountOne: '{count} filtro ativo',
	activeCountOther: '{count} filtros ativos',
	allOption: 'Todos',
	clearAll: 'Limpar filtros',
	loading: 'Aplicando filtros',
	noActiveFilters: 'Nenhum filtro ativo',
	openEnded: '…',
	removeFilter: 'Remover filtro {label}: {value}',
	toggle: 'Filtros',
};

export interface AdsFilterBarProps extends Omit<
	HTMLAttributes<HTMLElement>,
	'onChange' | 'children'
> {
	filters: readonly AdsFilterDefinition[];
	/**
	 * Valores atuais. Cada emissão de `onChange` parte deste `value`: aplique as mudanças em
	 * sequência (atualize o estado na hora ou use um updater funcional), senão duas ações
	 * seguidas antes do novo `value` fazem a segunda desfazer a primeira.
	 */
	value: AdsFilterValues;
	/**
	 * Recebe os valores completos, sem as chaves de filtros vazios, calculados a partir do
	 * `value` atual.
	 */
	onChange: (value: AdsFilterValues) => void;
	disabled?: boolean;
	/** Mantém a barra utilizável, define `aria-busy` e anuncia `labels.loading`. */
	loading?: boolean;
	labels?: AdsFilterBarLabels;
	/** BCP 47 tag usada nos seletores e nos chips de data. Padrão: `pt-BR`. */
	locale?: string;
	/** Nome acessível da região. Padrão: "Filtros". */
	'aria-label'?: string;
	/** Estado inicial dos campos em telas estreitas. Padrão: recolhido. */
	defaultExpanded?: boolean;
	/** Controla o estado dos campos em telas estreitas. */
	expanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
}

interface ActiveChip {
	key: string;
	filterId: string;
	optionValue?: string;
	label: string;
	text: string;
}

const emptyRange: AdsDateRange = { start: null, end: null };

function isEmpty(value: AdsFilterValue | undefined): boolean {
	if (value === undefined) return true;
	if (typeof value === 'string') return value === '';
	if (Array.isArray(value)) return value.length === 0;
	return !value.start && !value.end;
}

function asString(value: AdsFilterValue | undefined): string {
	return typeof value === 'string' ? value : '';
}

function asList(value: AdsFilterValue | undefined): string[] {
	return Array.isArray(value) ? value : [];
}

function asRange(value: AdsFilterValue | undefined): AdsDateRange {
	return value && typeof value === 'object' && !Array.isArray(value) ? value : emptyRange;
}

function bounds(filter: { min?: string | undefined; max?: string | undefined }) {
	return {
		...(filter.min !== undefined && { min: filter.min }),
		...(filter.max !== undefined && { max: filter.max }),
	};
}

function fill(template: string, values: Record<string, string | number>) {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match,
	);
}

function formatIso(iso: string | null, locale: string, fallback: string) {
	const match = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
	if (!match) return iso || fallback;
	const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
	try {
		return new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(date);
	} catch {
		return iso as string;
	}
}

function collectChips(
	filters: readonly AdsFilterDefinition[],
	value: AdsFilterValues,
	locale: string,
	labels: Required<AdsFilterBarLabels>,
): ActiveChip[] {
	const chips: ActiveChip[] = [];
	for (const filter of filters) {
		const current = value[filter.id];
		if (isEmpty(current)) continue;
		if (filter.type === 'multiselect') {
			for (const optionValue of asList(current)) {
				const option = filter.options.find((item) => item.value === optionValue);
				chips.push({
					key: `${filter.id}:${optionValue}`,
					filterId: filter.id,
					optionValue,
					label: filter.label,
					text: option?.label ?? optionValue,
				});
			}
			continue;
		}
		let text: string;
		if (filter.type === 'select') {
			text = filter.options.find((item) => item.value === current)?.label ?? asString(current);
		} else if (filter.type === 'date') {
			text = formatIso(asString(current), locale, labels.openEnded);
		} else if (filter.type === 'date-range') {
			const range = asRange(current);
			text = `${formatIso(range.start, locale, labels.openEnded)} – ${formatIso(range.end, locale, labels.openEnded)}`;
		} else {
			text = asString(current);
		}
		chips.push({ key: filter.id, filterId: filter.id, label: filter.label, text });
	}
	return chips;
}

/**
 * Barra de filtros administrativos controlada pelo consumidor. Emite o estado do filtro e não
 * consulta dados, não acessa a URL nem o roteador: o consumidor decide como persistir.
 */
export function AdsFilterBar({
	'aria-label': ariaLabel = 'Filtros',
	className,
	defaultExpanded = false,
	disabled = false,
	expanded: expandedProp,
	filters,
	labels: labelsProp,
	loading = false,
	locale = 'pt-BR',
	onChange,
	onExpandedChange,
	value,
	...props
}: AdsFilterBarProps) {
	const labels = { ...defaultLabels, ...labelsProp };
	const bodyId = useId();
	const idBase = `ads-filter-bar-${bodyId.replace(/[^\w-]/g, '')}`;
	const [expandedState, setExpandedState] = useState(defaultExpanded);
	const expanded = expandedProp ?? expandedState;
	const fieldsRef = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLButtonElement>(null);
	const chipsRef = useRef<HTMLUListElement>(null);
	const sectionRef = useRef<HTMLElement>(null);
	/** Foco pendente após remover ou limpar: o botão acionado e a posição do chip. */
	const pendingFocus = useRef<{ trigger: HTMLElement; index: number } | null>(null);

	const chips = collectChips(filters, value, locale, labels);
	const count = chips.length;
	const countText = fill(count === 1 ? labels.activeCountOne : labels.activeCountOther, { count });

	useLayoutEffect(() => {
		const pending = pendingFocus.current;
		if (pending === null) return;
		const doc = pending.trigger.ownerDocument;
		const active = doc.activeElement;
		const focusLost = !active || active === doc.body;
		// A pessoa levou o foco para fora da barra: o pendente é descartado.
		if (!focusLost && !sectionRef.current?.contains(active)) {
			pendingFocus.current = null;
			return;
		}
		// Enquanto o botão acionado existe, o foco não se perdeu: o consumidor pode aplicar o value
		// em etapas (por exemplo, com startTransition) ou rejeitá-lo. Tenta de novo no próximo render.
		if (pending.trigger.isConnected) return;
		pendingFocus.current = null;
		// Só repõe o foco se ele se perdeu com a remoção do botão.
		if (!focusLost) return;
		const index = pending.index;
		const buttons = chipsRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
		if (buttons?.length) {
			buttons[Math.min(Math.max(index, 0), buttons.length - 1)]?.focus();
			return;
		}
		const toggleButton = toggleRef.current;
		if (!expanded && toggleButton) {
			// Campos recolhidos: o primeiro campo pode estar oculto, então o foco vai para "Filtros".
			toggleButton.focus();
			// Em telas largas o botão fica oculto e não recebe foco; os campos estão visíveis.
			if (toggleButton.ownerDocument.activeElement === toggleButton) return;
		}
		fieldsRef.current
			?.querySelector<HTMLElement>('input:not(:disabled), select:not(:disabled)')
			?.focus();
	});

	function emit(filterId: string, next: AdsFilterValue | undefined) {
		// Uma alteração feita pela pessoa em um campo cancela o foco pendente de uma remoção.
		pendingFocus.current = null;
		commit(filterId, next);
	}

	function commit(filterId: string, next: AdsFilterValue | undefined) {
		const result: AdsFilterValues = {};
		for (const [key, current] of Object.entries(value)) {
			if (key !== filterId && !isEmpty(current)) result[key] = current;
		}
		if (!isEmpty(next)) result[filterId] = next as AdsFilterValue;
		onChange(result);
	}

	function removeChip(chip: ActiveChip, index: number, event: MouseEvent<HTMLElement>) {
		pendingFocus.current = { trigger: event.currentTarget, index };
		if (chip.optionValue === undefined) {
			commit(chip.filterId, undefined);
		} else {
			commit(
				chip.filterId,
				asList(value[chip.filterId]).filter((item) => item !== chip.optionValue),
			);
		}
	}

	function clearAll(event: MouseEvent<HTMLElement>) {
		pendingFocus.current = { trigger: event.currentTarget, index: -1 };
		onChange({});
	}

	function handleTriggerBlur(event: FocusEvent<HTMLElement>) {
		const trigger = event.currentTarget;
		if (pendingFocus.current?.trigger !== trigger) return;
		// A remoção do botão também pode gerar blur; só descarta se ele continua na página, ou seja,
		// se a pessoa levou o foco para outro lugar (inclusive uma área vazia).
		queueMicrotask(() => {
			if (trigger.isConnected && pendingFocus.current?.trigger === trigger) {
				pendingFocus.current = null;
			}
		});
	}

	function toggle() {
		const next = !expanded;
		if (expandedProp === undefined) setExpandedState(next);
		onExpandedChange?.(next);
	}

	function renderFilter(filter: AdsFilterDefinition) {
		const current = value[filter.id];
		const isDisabled = disabled || filter.disabled === true;
		const common = { disabled: isDisabled };
		const field = (control: ReactNode) => (
			<AdsField
				className={classNames('ads-filter-bar-field', filter.className)}
				description={filter.description}
				error={filter.error}
				key={filter.id}
				label={filter.label}
				validationState={filter.error ? 'error' : 'default'}
			>
				{control as never}
			</AdsField>
		);
		switch (filter.type) {
			case 'text':
				return field(
					<AdsInput
						{...common}
						onChange={(event) => emit(filter.id, event.currentTarget.value)}
						placeholder={filter.placeholder}
						type="text"
						value={asString(current)}
					/>,
				);
			case 'select':
				return field(
					<AdsSelect
						{...common}
						onChange={(event) => emit(filter.id, event.currentTarget.value)}
						value={asString(current)}
					>
						<option value="">{filter.placeholder ?? labels.allOption}</option>
						{filter.options.map((option) => (
							<option disabled={option.disabled} key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</AdsSelect>,
				);
			case 'multiselect': {
				const selected = asList(current);
				// O id do filtro pode ter espaços, que quebrariam a lista do aria-describedby.
				const fieldId = `${idBase}-${filter.id.replace(/[^\w-]/g, '')}`;
				const descriptionId = filter.description ? `${fieldId}-description` : undefined;
				const errorId = filter.error ? `${fieldId}-error` : undefined;
				const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
				return (
					<div className={classNames('ads-filter-bar-field', filter.className)} key={filter.id}>
						<AdsSelectionGroup aria-describedby={describedBy} legend={filter.label}>
							{filter.options.map((option) => (
								<AdsCheckbox
									checked={selected.includes(option.value)}
									disabled={isDisabled || option.disabled}
									key={option.value}
									label={option.label}
									validationState={filter.error ? 'error' : 'default'}
									onChange={(event) => {
										const checked = event.currentTarget.checked;
										emit(
											filter.id,
											filter.options
												.map((item) => item.value)
												.filter((item) =>
													item === option.value ? checked : selected.includes(item),
												),
										);
									}}
								/>
							))}
						</AdsSelectionGroup>
						{filter.description ? (
							<AdsFieldDescription id={descriptionId}>{filter.description}</AdsFieldDescription>
						) : null}
						{filter.error ? <AdsFieldMessage id={errorId}>{filter.error}</AdsFieldMessage> : null}
					</div>
				);
			}
			case 'date':
				return field(
					<AdsDatePicker
						{...common}
						locale={locale}
						{...bounds(filter)}
						onValueChange={(next) => emit(filter.id, next ?? undefined)}
						value={asString(current) || null}
					/>,
				);
			case 'date-range':
				return field(
					<AdsDatePicker
						{...common}
						locale={locale}
						{...bounds(filter)}
						mode="range"
						onValueChange={(next) => emit(filter.id, next)}
						value={asRange(current)}
					/>,
				);
		}
	}

	return (
		<section
			{...props}
			aria-busy={loading || undefined}
			aria-label={ariaLabel}
			className={classNames('ads-filter-bar', className)}
			data-disabled={disabled || undefined}
			data-loading={loading || undefined}
			ref={sectionRef}
		>
			<div className="ads-filter-bar-header">
				<button
					aria-controls={bodyId}
					aria-expanded={expanded}
					className="ads-filter-bar-toggle"
					onClick={toggle}
					ref={toggleRef}
					type="button"
				>
					{labels.toggle}
					{count > 0 ? ' ' : null}
					{count > 0 ? <span className="ads-filter-bar-count">{count}</span> : null}
				</button>
			</div>
			<div className="ads-filter-bar-body" data-expanded={expanded} id={bodyId}>
				<div className="ads-filter-bar-fields" ref={fieldsRef}>
					{filters.map(renderFilter)}
				</div>
			</div>
			<div className="ads-filter-bar-active">
				{count > 0 ? (
					<>
						<ul aria-label={labels.activeFilters} className="ads-filter-bar-chips" ref={chipsRef}>
							{chips.map((chip, index) => (
								<li className="ads-filter-bar-chip" key={chip.key}>
									<span className="ads-filter-bar-chip-text">
										{chip.label}: {chip.text}
									</span>
									<button
										aria-label={fill(labels.removeFilter, { label: chip.label, value: chip.text })}
										className="ads-filter-bar-chip-remove"
										disabled={disabled}
										onBlur={handleTriggerBlur}
										onClick={(event) => removeChip(chip, index, event)}
										type="button"
									>
										<AdsIcon name="close" size="sm" />
									</button>
								</li>
							))}
						</ul>
						<AdsButton
							className="ads-filter-bar-clear"
							disabled={disabled}
							onBlur={handleTriggerBlur}
							onClick={clearAll}
							size="sm"
							variant="ghost"
						>
							{labels.clearAll}
						</AdsButton>
					</>
				) : (
					<p className="ads-filter-bar-empty">{labels.noActiveFilters}</p>
				)}
			</div>
			<div aria-live="polite" className="ads-filter-bar-status" role="status">
				{loading ? labels.loading : countText}
			</div>
		</section>
	);
}
