'use client';

import {
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
	type InputHTMLAttributes,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';
import { formControlClasses } from './form-control-classes.js';
import { AdsIcon, type AdsIconName } from './icon.js';
import { AdsAvatar } from './avatar.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';
import {
	OverlayPortal,
	useAnchoredPosition,
	useClickOutside,
	useEscapeKey,
	useStableId,
} from './overlay-utils.js';

export interface AdsComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
	description?: string;
	icon?: AdsIconName;
	avatar?: { src?: string | undefined; fallback: string };
}

export type AdsComboboxInputReason = 'input' | 'select' | 'clear';

export interface AdsComboboxProps
	extends
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			'children' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'name' | 'className'
		>,
		AdsFormControlBase {
	options: readonly AdsComboboxOption[];
	value?: string | null;
	defaultValue?: string | null;
	onValueChange?: (value: string | null, option: AdsComboboxOption | null) => void;
	inputValue?: string;
	defaultInputValue?: string;
	onInputValueChange?: (text: string, reason: AdsComboboxInputReason) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	renderOption?: (option: AdsComboboxOption) => ReactNode;
	showOptionVisuals?: boolean;
	filterOptions?: boolean;
	loading?: boolean;
	error?: ReactNode;
	emptyText?: string;
	loadingText?: string;
	clearLabel?: string;
	clearable?: boolean;
	size?: AdsFormSize;
	name?: string;
	selectedOption?: AdsComboboxOption | null;
	onRetry?: () => void;
}

/** Single-select ARIA combobox. The selected value and the input text are separate states. */
export const AdsCombobox = forwardRef<HTMLInputElement, AdsComboboxProps>(function AdsCombobox(
	{
		['aria-describedby']: describedBy,
		['aria-invalid']: ariaInvalid,
		className,
		clearLabel = 'Limpar seleção',
		clearable = true,
		defaultInputValue,
		defaultOpen = false,
		defaultValue = null,
		disabled,
		emptyText = 'Nenhuma opção encontrada',
		error,
		filterOptions = true,
		id,
		inputValue,
		loading = false,
		loadingText = 'Buscando opções...',
		name,
		onBlur,
		onFocus,
		onInputValueChange,
		onOpenChange,
		onRetry,
		onValueChange,
		open: controlledOpen,
		options,
		placeholder = 'Selecione uma opção',
		readOnly,
		renderOption,
		required,
		selectedOption,
		showOptionVisuals = true,
		size = 'md',
		validationState = 'default',
		value,
		...inputProps
	},
	forwardedRef,
) {
	const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue);
	const selectedValue = value !== undefined ? value : uncontrolledValue;
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const open = !disabled && !readOnly && (controlledOpen ?? uncontrolledOpen);
	const [draftInput, setDraftInput] = useState(defaultInputValue ?? '');
	const [editing, setEditing] = useState(defaultInputValue !== undefined && selectedValue === null);
	// Valores antigos não podem ser enviados enquanto o input exibe texto livre.
	const committedValue = editing ? null : selectedValue;
	const [cachedOption, setCachedOption] = useState<AdsComboboxOption | null>(
		selectedOption ?? null,
	);
	const [activeIndex, setActiveIndex] = useState(-1);
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const retryRef = useRef<HTMLButtonElement>(null);
	const keyboardNavigationRef = useRef(false);
	const ignoreNextFocusRef = useRef(false);
	const listRef = useRef<HTMLElement>(null);
	const stableInputId = useStableId('ads-combobox-input');
	const listId = useStableId('ads-combobox-list');
	const inputId = id ?? stableInputId;
	const selected =
		options.find((option) => option.value === selectedValue) ??
		(selectedOption?.value === selectedValue ? selectedOption : null) ??
		(cachedOption?.value === selectedValue ? cachedOption : null);
	const selectedVisual =
		showOptionVisuals && !editing && selected && (selected.avatar || selected.icon);
	const text =
		inputValue ??
		(editing
			? draftInput
			: selectedValue !== null
				? (selected?.label ?? defaultInputValue ?? '')
				: '');
	const query = (editing || (inputValue !== undefined && selectedValue === null) ? text : '')
		.trim()
		.toLocaleLowerCase();
	const matches = filterOptions
		? options.filter(
				(option) =>
					option.label.toLocaleLowerCase().includes(query) ||
					option.value.toLocaleLowerCase().includes(query),
			)
		: options;
	const enabledIndices = matches.flatMap((option, index) => (option.disabled ? [] : [index]));
	const active = enabledIndices.includes(activeIndex) ? activeIndex : -1;
	const position = useAnchoredPosition(open, rootRef, listRef, 'bottom', 'start');

	const setOpen = useCallback(
		(next: boolean) => {
			if (controlledOpen === undefined) setUncontrolledOpen(next);
			onOpenChange?.(next);
		},
		[controlledOpen, onOpenChange],
	);

	const setText = (next: string, reason: AdsComboboxInputReason) => {
		if (inputValue === undefined) {
			setDraftInput(next);
		}
		setEditing(reason === 'input');
		onInputValueChange?.(next, reason);
	};

	const choose = (option: AdsComboboxOption) => {
		if (option.disabled) return;
		if (value === undefined) setUncontrolledValue(option.value);
		setCachedOption(option);
		setActiveIndex(-1);
		setText(option.label, 'select');
		onValueChange?.(option.value, option);
		setOpen(false);
		inputRef.current?.focus({ preventScroll: true });
	};

	const clear = () => {
		if (value === undefined) setUncontrolledValue(null);
		setCachedOption(null);
		setText('', 'clear');
		onValueChange?.(null, null);
		setActiveIndex(-1);
		setOpen(false);
		if (document.activeElement !== inputRef.current) ignoreNextFocusRef.current = true;
		inputRef.current?.focus({ preventScroll: true });
	};

	const dismiss = useCallback(() => setOpen(false), [setOpen]);
	useEscapeKey(open, () => {
		dismiss();
		inputRef.current?.focus({ preventScroll: true });
	});
	useClickOutside(open, listRef, (event) => {
		if (event.target instanceof Node && !rootRef.current?.contains(event.target)) dismiss();
	});
	// An externally controlled selected value supersedes any previous free-text edit.
	useEffect(() => {
		if (value !== undefined && value !== null) setEditing(false);
	}, [value]);

	useEffect(() => {
		if (open && active >= 0 && keyboardNavigationRef.current)
			document.getElementById(listId + '-option-' + active)?.scrollIntoView?.({ block: 'nearest' });
	}, [active, listId, open]);

	useEffect(() => {
		inputRef.current?.setCustomValidity(
			required && committedValue === null ? 'Selecione uma opção' : '',
		);
	}, [committedValue, required]);

	const move = (direction: 'next' | 'previous') => {
		if (!open) setOpen(true);
		if (loading || error || enabledIndices.length === 0) return;
		keyboardNavigationRef.current = true;
		const position = enabledIndices.indexOf(active);
		const next =
			direction === 'next'
				? (position + 1) % enabledIndices.length
				: position < 0
					? enabledIndices.length - 1
					: (position - 1 + enabledIndices.length) % enabledIndices.length;
		setActiveIndex(enabledIndices[next]!);
	};
	return (
		<div className="ads-combobox relative w-full min-w-0" ref={rootRef}>
			<span role="status" aria-live="polite" className="sr-only">
				{open ? (loading ? loadingText : error || (matches.length === 0 ? emptyText : null)) : null}
			</span>
			<div className="relative">
				<input
					{...inputProps}
					aria-activedescendant={
						open && !loading && !error && active >= 0 ? listId + '-option-' + active : undefined
					}
					aria-autocomplete="list"
					aria-busy={loading || undefined}
					aria-controls={open ? listId : undefined}
					aria-describedby={describedBy}
					aria-expanded={open}
					aria-invalid={validationState === 'error' ? true : ariaInvalid}
					aria-required={required || undefined}
					autoComplete="off"
					className={classNames(
						formControlClasses(size, validationState, className),
						clearable ? 'pe-[4.5rem]' : 'pe-9',
						selectedVisual ? 'ads-combobox__input--visual' : undefined,
					)}
					disabled={disabled}
					id={inputId}
					onBlur={(event) => {
						onBlur?.(event);
						const next = event.relatedTarget;
						if (
							!event.defaultPrevented &&
							(!next ||
								(next instanceof Node &&
									!rootRef.current?.contains(next) &&
									!listRef.current?.contains(next)))
						)
							setOpen(false);
					}}
					onChange={(event) => {
						// Um valor anterior não pode ser enviado enquanto um novo texto está sendo pesquisado.
						if (selectedValue !== null && !editing) {
							if (value === undefined) setUncontrolledValue(null);
							setCachedOption(null);
							onValueChange?.(null, null);
						}
						setText(event.target.value, 'input');
						setActiveIndex(-1);
						if (!open) setOpen(true);
					}}
					onFocus={(event) => {
						onFocus?.(event);
						if (ignoreNextFocusRef.current) {
							ignoreNextFocusRef.current = false;
						} else if (!event.defaultPrevented && !readOnly && !open) {
							setOpen(true);
						}
					}}
					onKeyDown={(event) => {
						inputProps.onKeyDown?.(event);
						if (event.defaultPrevented || event.nativeEvent.isComposing) return;
						if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
							event.preventDefault();
							move(event.key === 'ArrowDown' ? 'next' : 'previous');
						} else if (event.key === 'Enter' && open && !loading && !error && active >= 0) {
							event.preventDefault();
							const option = matches[active];
							if (option) choose(option);
						} else if (event.key === 'Escape' && open) {
							event.preventDefault();
							dismiss();
						} else if (event.key === 'Tab') {
							if (!event.shiftKey && open && error && onRetry) {
								event.preventDefault();
								retryRef.current?.focus({ preventScroll: true });
							} else if (open) {
								dismiss();
							}
						}
					}}
					placeholder={placeholder}
					readOnly={readOnly}
					required={required}
					ref={(node) => {
						inputRef.current = node;
						if (typeof forwardedRef === 'function') forwardedRef(node);
						else if (forwardedRef) forwardedRef.current = node;
					}}
					role="combobox"
					type="text"
					value={text}
				/>
				{selectedVisual ? (
					<span className="ads-combobox__selected-visual" aria-hidden="true">
						<OptionVisual option={selected!} />
					</span>
				) : null}
				{clearable && (selectedValue !== null || text.length > 0) && !disabled && !readOnly ? (
					<button
						aria-label={clearLabel}
						className="ads-combobox__clear absolute inset-y-0 end-9 flex w-8 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-focus-ring"
						onClick={clear}
						onMouseDown={(event) => event.preventDefault()}
						type="button"
					>
						<AdsIcon name="close" size="sm" />
					</button>
				) : null}
				<button
					aria-label="Mostrar opções"
					aria-expanded={open}
					className="ads-combobox__toggle absolute inset-y-0 end-1 flex w-8 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
					disabled={disabled || readOnly}
					onClick={() => {
						const next = !open;
						setOpen(next);
						if (next && document.activeElement !== inputRef.current) {
							ignoreNextFocusRef.current = true;
							inputRef.current?.focus({ preventScroll: true });
						}
					}}
					onMouseDown={(event) => event.preventDefault()}
					type="button"
				>
					<AdsIcon name="chevronDown" size="sm" className={open ? 'rotate-180' : undefined} />
				</button>
			</div>
			{name ? (
				<input
					disabled={disabled}
					form={inputProps.form}
					name={name}
					type="hidden"
					value={committedValue ?? ''}
				/>
			) : null}
			{open ? (
				<OverlayPortal>
					<section
						aria-label="Sugestões de pesquisa"
						className="ads-combobox__list fixed z-[var(--ads-layer-overlay)] m-0 max-h-64 overflow-y-auto overscroll-contain rounded-md border border-border bg-surface-raised p-1 font-sans text-sm text-text shadow-md"
						ref={position.attachContent}
						style={{
							...position.style,
							width: Math.max(200, rootRef.current?.getBoundingClientRect().width ?? 200),
							maxWidth: 'calc(100vw - 16px)',
						}}
					>
						<div
							aria-hidden="true"
							className={
								loading || error || matches.length === 0 ? 'px-3 py-2 text-text-muted' : 'sr-only'
							}
						>
							{loading ? loadingText : error || (matches.length === 0 ? emptyText : null)}
						</div>
						<ul
							aria-label="Sugestões"
							id={listId}
							role="listbox"
							hidden={Boolean(loading || error || matches.length === 0)}
							className="m-0 list-none p-0"
						>
							{!loading &&
								!error &&
								matches.map((option, index) => (
									<li
										aria-disabled={option.disabled || undefined}
										aria-selected={committedValue === option.value}
										className={classNames(
											'ads-combobox__option flex items-center gap-2 cursor-pointer rounded px-3 py-2',
											option.disabled
												? 'cursor-not-allowed opacity-50'
												: index === active
													? 'bg-surface-selected text-on-surface-selected'
													: 'hover:bg-surface-hover',
										)}
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
											<span className="flex flex-col gap-0.5">
												<span>{option.label}</span>
												{option.description ? (
													<span className="text-xs opacity-80">{option.description}</span>
												) : null}
											</span>
										)}
									</li>
								))}
						</ul>
						{error && onRetry ? (
							<button
								className="underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring"
								onKeyDown={(event) => {
									if (event.key !== 'Tab') return;
									if (event.shiftKey) {
										event.preventDefault();
										event.stopPropagation();
										inputRef.current?.focus({ preventScroll: true });
										return;
									}
									const root = rootRef.current;
									const dialog = root?.closest('[role="dialog"], [role="alertdialog"]');
									const candidates = Array.from(
										(dialog ?? document).querySelectorAll<HTMLElement>(
											'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
										),
									).filter(
										(element) =>
											root &&
											!root.contains(element) &&
											!listRef.current?.contains(element) &&
											element.getClientRects().length > 0,
									);
									const next =
										candidates.find(
											(element) =>
												root &&
												Boolean(
													root.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING,
												),
										) ?? (dialog ? (candidates[0] ?? inputRef.current) : null);
									if (next) {
										event.preventDefault();
										event.stopPropagation();
										setOpen(false);
										next.focus();
									}
								}}
								ref={retryRef}
								onMouseDown={(event) => event.preventDefault()}
								type="button"
								onBlur={(event) => {
									if (
										!rootRef.current?.contains(event.relatedTarget) &&
										!listRef.current?.contains(event.relatedTarget)
									)
										setOpen(false);
								}}
								onClick={() => {
									onRetry();
									inputRef.current?.focus({ preventScroll: true });
								}}
							>
								Tentar novamente
							</button>
						) : null}
					</section>
				</OverlayPortal>
			) : null}
		</div>
	);
});

function OptionVisual({ option }: { option: AdsComboboxOption }) {
	if (option.avatar)
		return <AdsAvatar size="sm" fallback={option.avatar.fallback} src={option.avatar.src} />;
	if (option.icon) return <AdsIcon name={option.icon} size="sm" />;
	return null;
}
