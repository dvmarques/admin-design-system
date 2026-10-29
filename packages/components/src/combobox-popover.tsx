'use client';

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type CSSProperties,
	type KeyboardEvent,
} from 'react';
import { classNames } from './class-names.js';
import { formControlClasses } from './form-control-classes.js';
import { AdsIcon } from './icon.js';
import { AdsInput } from './input.js';
import {
	OptionVisual,
	assignRef,
	defaultOptionMatch,
	enabledIndicesOf,
	stepEnabledIndex,
	useComboboxSelection,
} from './combobox-shared.js';
import type {
	AdsComboboxOption,
	AdsComboboxPopoverProps,
	AdsComboboxQueryReason,
	AdsComboboxTriggerContext,
} from './combobox-types.js';
import {
	OverlayPortal,
	useAnchoredPosition,
	useClickOutside,
	useEscapeKey,
	useStableId,
} from './overlay-utils.js';

const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Apresentação `popover` do `AdsCombobox`: um botão (gatilho) abre um painel de diálogo não modal
 * com pesquisa separada, lista de seleção única (`listbox`) e rodapé. O gatilho não é um
 * `combobox`: ele abre um diálogo. O valor confirmado e a consulta são estados independentes.
 */
export function ComboboxPopover({
	['aria-describedby']: describedBy,
	['aria-invalid']: ariaInvalid,
	['aria-label']: ariaLabel,
	['aria-labelledby']: ariaLabelledBy,
	align = 'start',
	className,
	closeOnSelect = true,
	defaultInputValue,
	defaultOpen = false,
	defaultValue = null,
	disabled,
	emptyText = 'Nenhuma opção encontrada',
	error,
	filterOption,
	filterOptions = true,
	footer,
	form,
	id,
	inputValue,
	listLabel = 'Opções',
	loading = false,
	loadingText = 'Buscando opções...',
	name,
	onInputValueChange,
	onOpenChange,
	onRetry,
	onValueChange,
	open: controlledOpen,
	options,
	panelClassName,
	panelLabel,
	placeholder = 'Selecione uma opção',
	placement = 'bottom',
	readOnly,
	renderOption,
	renderTrigger,
	required,
	retryLabel = 'Tentar novamente',
	searchInputRef,
	searchLabel = 'Pesquisar',
	searchPlaceholder,
	searchable = true,
	selectedOption,
	showOptionVisuals = true,
	size = 'md',
	statusMessage,
	triggerRef,
	validationState = 'default',
	value,
}: AdsComboboxPopoverProps) {
	const { selected, selectedValue, setCachedOption, setUncontrolledValue } = useComboboxSelection({
		defaultValue,
		options,
		selectedOption,
		value,
	});
	const initialValueRef = useRef(defaultValue);
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const open = !disabled && !readOnly && (controlledOpen ?? uncontrolledOpen);
	const [draftQuery, setDraftQuery] = useState(defaultInputValue ?? '');
	const query = inputValue ?? draftQuery;
	const [activeIndex, setActiveIndex] = useState(-1);
	const [invalidReported, setInvalidReported] = useState(false);
	// O erro de validação deriva do estado atual: some sozinho quando há valor, o campo deixa de ser
	// obrigatório ou fica somente leitura (fora da validação nativa).
	const invalid = invalidReported && Boolean(required) && !readOnly && !selectedValue;
	const clearReported = !invalid && invalidReported;
	useEffect(() => {
		if (clearReported) setInvalidReported(false);
	}, [clearReported]);
	const rootRef = useRef<HTMLSpanElement>(null);
	const triggerElRef = useRef<HTMLButtonElement | null>(null);
	const panelRef = useRef<HTMLElement | null>(null);
	const searchElRef = useRef<HTMLInputElement | null>(null);
	const listElRef = useRef<HTMLUListElement | null>(null);
	const validityRef = useRef<HTMLInputElement>(null);
	const keyboardNavigationRef = useRef(false);
	const closeReasonRef = useRef<AdsComboboxQueryReason>('close');
	const [panelEl, setPanelEl] = useState<HTMLElement | null>(null);
	const stableTriggerId = useStableId('ads-combobox-trigger');
	const panelId = useStableId('ads-combobox-panel');
	const listId = useStableId('ads-combobox-list');
	const triggerId = id ?? stableTriggerId;
	const position = useAnchoredPosition(open, rootRef, panelRef, placement, align);

	const normalizedQuery = query.trim().toLocaleLowerCase();
	const matches =
		filterOptions && normalizedQuery
			? options.filter((option) =>
					filterOption
						? filterOption(option, query.trim())
						: defaultOptionMatch(option, normalizedQuery),
				)
			: options;
	const enabled = enabledIndicesOf(matches);
	const selectedIndex = matches.findIndex(
		(option) => option.value === selectedValue && !option.disabled,
	);
	const fallbackIndex =
		selectedIndex >= 0 && !normalizedQuery
			? selectedIndex
			: normalizedQuery
				? (enabled[0] ?? -1)
				: -1;
	const active = enabled.includes(activeIndex) ? activeIndex : fallbackIndex;
	const stateShown = loading || Boolean(error) || matches.length === 0;
	const listVisible = !stateShown;
	const stateNode = loading ? loadingText : error ? error : emptyText;

	const setOpen = useCallback(
		(next: boolean) => {
			if (controlledOpen === undefined) setUncontrolledOpen(next);
			onOpenChange?.(next);
		},
		[controlledOpen, onOpenChange],
	);

	const setQuery = (next: string, reason: AdsComboboxQueryReason) => {
		if (inputValue === undefined) setDraftQuery(next);
		onInputValueChange?.(next, reason);
	};

	const focusTrigger = () => triggerElRef.current?.focus({ preventScroll: true });

	const choose = (option: AdsComboboxOption) => {
		if (option.disabled) return;
		if (option.value !== selectedValue) {
			if (value === undefined) setUncontrolledValue(option.value);
			setCachedOption(option);
			setInvalidReported(false);
			onValueChange?.(option.value, option);
		}
		// Escolher o valor já confirmado não pede mudança alguma: apenas fecha.
		if (closeOnSelect || option.value === selectedValue) {
			closeReasonRef.current = 'select';
			setActiveIndex(-1);
			setOpen(false);
		}
	};

	const dismiss = useCallback(() => {
		closeReasonRef.current = 'close';
		setOpen(false);
	}, [setOpen]);

	// Uma única camada de Escape: fecha só o popover e devolve o foco ao gatilho.
	useEscapeKey(open, () => {
		dismiss();
		focusTrigger();
	});
	useClickOutside(open, panelRef, (event) => {
		if (event.target instanceof Node && !rootRef.current?.contains(event.target)) dismiss();
	});

	// Ao fechar: consulta zerada, destaque limpo e foco devolvido ao gatilho se nada o recebeu.
	const previousOpen = useRef(open);
	useEffect(() => {
		if (previousOpen.current && !open) {
			setActiveIndex(-1);
			if (query !== '') setQuery('', closeReasonRef.current);
			closeReasonRef.current = 'close';
			const current = document.activeElement;
			if (!current || current === document.body) focusTrigger();
		}
		previousOpen.current = open;
	}, [open]);

	// Foco inicial na pesquisa, na lista ou no painel; repete se o alvo surgir depois (fim do loading).
	const focusTarget = searchable ? 'search' : listVisible ? 'list' : 'panel';
	useEffect(() => {
		if (!panelEl) return;
		const current = document.activeElement;
		if (current && panelEl.contains(current) && current !== panelEl) return;
		const target =
			focusTarget === 'search'
				? searchElRef.current
				: focusTarget === 'list'
					? listElRef.current
					: panelEl;
		(target ?? panelEl).focus({ preventScroll: true });
	}, [panelEl, focusTarget]);

	useEffect(() => {
		if (open && active >= 0 && keyboardNavigationRef.current)
			document.getElementById(listId + '-option-' + active)?.scrollIntoView?.({ block: 'nearest' });
	}, [active, listId, open]);

	// Reset do formulário: restaura o valor inicial quando não controlado.
	useEffect(() => {
		const owner = validityRef.current?.form;
		if (!owner || value !== undefined) return;
		const onReset = () => {
			setUncontrolledValue(initialValueRef.current);
			setCachedOption(null);
			setInvalidReported(false);
		};
		owner.addEventListener('reset', onReset);
		return () => owner.removeEventListener('reset', onReset);
	}, [setCachedOption, setUncontrolledValue, value, name, required, form]);

	const move = (direction: 'next' | 'previous') => {
		if (!listVisible || enabled.length === 0) return;
		keyboardNavigationRef.current = true;
		setActiveIndex(stepEnabledIndex(enabled, active, direction));
	};

	const navigationKeys = (event: KeyboardEvent<HTMLElement>, list: boolean) => {
		if (event.defaultPrevented || event.nativeEvent.isComposing) return;
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			move(event.key === 'ArrowDown' ? 'next' : 'previous');
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const option = listVisible ? matches[active] : undefined;
			if (option) choose(option);
		} else if (list && (event.key === 'Home' || event.key === 'End') && enabled.length > 0) {
			event.preventDefault();
			keyboardNavigationRef.current = true;
			setActiveIndex(event.key === 'Home' ? enabled[0]! : enabled[enabled.length - 1]!);
		}
	};

	// Tab além das extremidades fecha o painel não modal e segue o fluxo da página a partir do gatilho.
	const panelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key !== 'Tab' || event.defaultPrevented) return;
		const panel = event.currentTarget;
		const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
			(element) => !element.closest('[hidden]'),
		);
		const current = document.activeElement;
		const atEnd = !event.shiftKey && (focusable.length === 0 || current === focusable.at(-1));
		const atStart =
			event.shiftKey && (focusable.length === 0 || current === panel || current === focusable[0]);
		if (!atEnd && !atStart) return;
		dismiss();
		focusTrigger();
		if (atStart) event.preventDefault();
	};

	const triggerProps: AdsComboboxTriggerContext['triggerProps'] = {
		'aria-controls': open ? panelId : undefined,
		'aria-describedby': describedBy,
		'aria-expanded': open,
		'aria-haspopup': 'dialog',
		// `aria-readonly` não é válido em `button`: o estado somente leitura é `aria-disabled`.
		'aria-disabled': readOnly ? true : undefined,
		'aria-invalid': validationState === 'error' || invalid ? true : ariaInvalid,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		disabled,
		id: triggerId,
		onClick: () => {
			if (readOnly) return;
			if (open) dismiss();
			else setOpen(true);
		},
		onKeyDown: (event) => {
			if (event.defaultPrevented || open || readOnly) return;
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				setOpen(true);
			}
		},
		ref: (node: HTMLButtonElement | null) => {
			triggerElRef.current = node;
			assignRef(triggerRef, node);
		},
		type: 'button',
	};

	const context: AdsComboboxTriggerContext = {
		disabled: Boolean(disabled),
		invalid,
		open,
		selectedOption: selected,
		triggerProps,
	};

	const { attachContent } = position;
	const attachPanel = useCallback(
		(node: HTMLElement | null) => {
			attachContent(node);
			setPanelEl(node);
		},
		[attachContent],
	);

	// A largura mínima do painel acompanha a do gatilho; só é medida com o painel aberto.
	const panelStyle = {
		...position.style,
		'--ads-combobox-anchor-width': `${open ? (rootRef.current?.getBoundingClientRect().width ?? 0) : 0}px`,
	} as CSSProperties;
	const liveContent = statusMessage ?? (stateShown ? stateNode : null);
	const [announce, setAnnounce] = useState(false);
	useEffect(() => {
		setAnnounce(open);
	}, [open]);
	const requiredMessage = 'Selecione uma opção';

	return (
		<span className="ads-combobox ads-combobox--popover inline-flex" ref={rootRef}>
			{renderTrigger ? (
				renderTrigger(context)
			) : (
				<button
					{...triggerProps}
					className={classNames(
						formControlClasses(size, invalid ? 'error' : validationState, className),
						'ads-combobox__trigger flex items-center justify-between gap-2 text-start',
						readOnly ? 'cursor-default bg-surface-muted' : 'cursor-pointer',
					)}
				>
					<span className="flex min-w-0 items-center gap-2">
						{showOptionVisuals && selected && (selected.avatar || selected.icon) ? (
							<span className="ads-combobox__visual" aria-hidden="true">
								<OptionVisual option={selected} />
							</span>
						) : null}
						<span className={classNames('truncate', selected ? undefined : 'text-text-muted')}>
							{selected?.label ?? placeholder}
						</span>
					</span>
					<AdsIcon
						name="chevronDown"
						size="sm"
						className={classNames('shrink-0', open ? 'rotate-180' : undefined)}
					/>
				</button>
			)}
			{name || required ? (
				<input
					aria-hidden="true"
					autoComplete="off"
					className="sr-only"
					disabled={disabled}
					form={form}
					name={name}
					onChange={() => undefined}
					onInvalid={(event) => {
						// A interface nativa focaria este controle oculto: o foco vai ao gatilho.
						event.preventDefault();
						setInvalidReported(true);
						// Só o primeiro controle inválido do formulário recebe o foco.
						const first = Array.from(event.currentTarget.form?.elements ?? []).find(
							(element) =>
								(element as HTMLInputElement).willValidate &&
								(element as HTMLInputElement).validity.valid === false,
						);
						if (!first || first === event.currentTarget) focusTrigger();
					}}
					ref={validityRef}
					readOnly={readOnly}
					required={required}
					tabIndex={-1}
					value={selectedValue ?? ''}
				/>
			) : null}
			{invalid ? (
				<span className="sr-only" role="alert">
					{requiredMessage}
				</span>
			) : null}
			{open ? (
				<OverlayPortal>
					<section
						aria-label={panelLabel}
						aria-labelledby={panelLabel ? undefined : triggerId}
						className={classNames('ads-combobox__panel', panelClassName)}
						data-placement={position.placement}
						id={panelId}
						onKeyDown={panelKeyDown}
						ref={attachPanel}
						role="dialog"
						style={panelStyle}
						tabIndex={-1}
					>
						{searchable ? (
							<AdsInput
								aria-activedescendant={
									listVisible && active >= 0 ? listId + '-option-' + active : undefined
								}
								aria-controls={listId}
								aria-label={searchLabel}
								autoComplete="off"
								className="ads-combobox__search"
								onChange={(event: ChangeEvent<HTMLInputElement>) => {
									setQuery(event.target.value, 'input');
									setActiveIndex(-1);
								}}
								onKeyDown={(event) => navigationKeys(event, false)}
								placeholder={searchPlaceholder}
								ref={(node) => {
									searchElRef.current = node;
									assignRef(searchInputRef, node);
								}}
								size="sm"
								type="search"
								value={query}
							/>
						) : null}
						{/* Região viva única e persistente: nasce vazia e é preenchida depois da montagem. */}
						<div
							aria-live="polite"
							className={stateShown ? 'ads-combobox__state' : 'sr-only'}
							role="status"
						>
							{announce ? liveContent : null}
						</div>
						<ul
							aria-activedescendant={
								!searchable && listVisible && active >= 0 ? listId + '-option-' + active : undefined
							}
							aria-label={listLabel}
							className="ads-combobox__list-popover"
							hidden={!listVisible}
							id={listId}
							onKeyDown={searchable ? undefined : (event) => navigationKeys(event, true)}
							ref={listElRef}
							role="listbox"
							tabIndex={searchable ? undefined : 0}
						>
							{listVisible
								? matches.map((option, index) => (
										<li
											aria-disabled={option.disabled || undefined}
											aria-selected={selectedValue === option.value}
											className="ads-combobox__option ads-combobox__option--popover"
											data-active={index === active ? 'true' : undefined}
											id={listId + '-option-' + index}
											key={option.value}
											onClick={() => choose(option)}
											onMouseDown={(event) => event.preventDefault()}
											onMouseEnter={() => {
												keyboardNavigationRef.current = false;
												if (!option.disabled) setActiveIndex(index);
											}}
											role="option"
										>
											{showOptionVisuals && (option.avatar || option.icon) ? (
												<span className="ads-combobox__visual" aria-hidden="true">
													<OptionVisual option={option} />
												</span>
											) : null}
											{renderOption ? (
												renderOption(option)
											) : (
												<span className="ads-combobox__option-text">
													<span>{option.label}</span>
													{option.description ? (
														<span className="ads-combobox__option-description">
															{option.description}
														</span>
													) : null}
												</span>
											)}
										</li>
									))
								: null}
						</ul>
						{error && !loading && onRetry ? (
							<button className="ads-combobox__retry" onClick={onRetry} type="button">
								{retryLabel}
							</button>
						) : null}
						{footer ? <div className="ads-combobox__footer">{footer}</div> : null}
					</section>
				</OverlayPortal>
			) : null}
		</span>
	);
}
