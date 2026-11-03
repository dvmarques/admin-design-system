'use client';

import {
	forwardRef,
	useEffect,
	useId,
	useRef,
	useState,
	type InputHTMLAttributes,
	type MouseEvent as ReactMouseEvent,
} from 'react';
import { classNames } from './class-names.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';

export interface AdsMultiSelectOption {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
}

export interface AdsMultiSelectProps
	extends
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			'value' | 'defaultValue' | 'onChange' | 'name' | 'size' | 'className' | 'children'
		>,
		AdsFormControlBase {
	options: readonly AdsMultiSelectOption[];
	value?: readonly string[];
	defaultValue?: readonly string[];
	onValueChange?: (values: string[]) => void;
	maxSelections?: number;
	name?: string;
	size?: AdsFormSize;
	clearable?: boolean;
	clearLabel?: string;
	removeLabel?: (label: string) => string;
	loading?: boolean;
	loadingText?: string;
	error?: string;
	emptyText?: string;
}

const normalize = (text: string) =>
	text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLocaleLowerCase()
		.trim();

const unique = (values: readonly string[]) => [...new Set(values)];

/**
 * Multiple-value combobox. The editable input is the single focus target; its query is never
 * submitted as a chosen value. FormData receives repeated `name` entries for selected values.
 */
export const AdsMultiSelect = forwardRef<HTMLInputElement, AdsMultiSelectProps>(function AdsMultiSelect(
	{
		['aria-describedby']: describedBy,
		['aria-invalid']: ariaInvalid,
		className,
		clearable = true,
		clearLabel = 'Limpar todas as seleções',
		defaultValue = [],
		disabled,
		emptyText = 'Nenhuma opção encontrada',
		error,
		id,
		loading = false,
		loadingText = 'Carregando opções...',
		maxSelections,
		name,
		onBlur,
		onFocus,
		onKeyDown,
		onValueChange,
		options,
		placeholder = 'Pesquisar opções',
		readOnly,
		removeLabel = (label) => 'Remover ' + label,
		required,
		size = 'md',
		validationState = 'default',
		value,
		...inputProps
	},
	forwardedRef,
) {
	const [uncontrolled, setUncontrolled] = useState(() => unique(defaultValue));
	const selected = unique(value === undefined ? uncontrolled : value);
	const [query, setQuery] = useState('');
	const [expanded, setExpanded] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const generatedId = useId().replaceAll(':', '');
	const inputId = id ?? 'ads-multi-select-' + generatedId;
	const listId = inputId + '-list';
	const statusId = inputId + '-status';
	const selectedSet = new Set(selected);
	const limit = maxSelections === undefined || !Number.isFinite(maxSelections)
		? Infinity
		: Math.max(0, Math.floor(maxSelections));
	const limitReached = selected.length >= limit;
	const open = expanded && !disabled;
	const items = options.filter((option) => {
		const search = normalize(query);
		return normalize(option.label).includes(search) || normalize(option.value).includes(search);
	});
	const selectable = (option: AdsMultiSelectOption) =>
		!disabled && !readOnly && !loading && !error && !option.disabled &&
		(selectedSet.has(option.value) || !limitReached);
	const active = open && activeIndex >= 0 && activeIndex < items.length &&
		selectable(items[activeIndex]) ? activeIndex : -1;

	const commit = (next: string[]) => {
		if (disabled || readOnly) return;
		const distinct = unique(next);
		if (distinct.length === selected.length && distinct.every((item, index) => item === selected[index]))
			return;
		if (value === undefined) setUncontrolled(distinct);
		onValueChange?.(distinct);
	};

	const toggle = (option: AdsMultiSelectOption) => {
		if (!option || !selectable(option)) return;
		if (selectedSet.has(option.value)) commit(selected.filter((item) => item !== option.value));
		else commit([...selected, option.value]);
		setQuery('');
		setActiveIndex(-1);
		inputRef.current?.focus({ preventScroll: true });
	};

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;
		// Hidden inputs serialize values but never participate in constraint validation.
		// The visible, focusable search input owns the validity state.
		input.setCustomValidity(required && selected.length === 0 ? 'Selecione pelo menos uma opção.' : '');
	}, [required, selected.length]);

	useEffect(() => {
		const form = inputRef.current?.form;
		if (!form) return;
		const reset = () => {
			if (value === undefined) setUncontrolled(unique(defaultValue));
			setQuery('');
			setExpanded(false);
			setActiveIndex(-1);
		};
		form.addEventListener('reset', reset);
		return () => form.removeEventListener('reset', reset);
	}, [value, defaultValue]);

	useEffect(() => {
		if (!open) return;
		const dismiss = (event: PointerEvent) => {
			if (event.target instanceof Node && !rootRef.current?.contains(event.target))
				setExpanded(false);
		};
		document.addEventListener('pointerdown', dismiss);
		return () => document.removeEventListener('pointerdown', dismiss);
	}, [open]);

	const move = (direction: 1 | -1) => {
		if (!open) setExpanded(true);
		const indices = items.flatMap((item, index) => selectable(item) ? [index] : []);
		if (!indices.length) return;
		const cursor = indices.indexOf(active);
		const target = cursor === -1
			? (direction === 1 ? 0 : indices.length - 1)
			: (cursor + direction + indices.length) % indices.length;
		setActiveIndex(indices[target] ?? -1);
	};

	const remove = (item: string, event?: ReactMouseEvent<HTMLButtonElement>) => {
		event?.preventDefault();
		commit(selected.filter((current) => current !== item));
		inputRef.current?.focus({ preventScroll: true });
	};

	return (
		<div className={classNames('ads-multi-select relative min-w-0 w-full', className)} ref={rootRef}>
			<div
				className={classNames(
					'ads-multi-select__control',
					validationState === 'error' || ariaInvalid === true || ariaInvalid === 'true'
						? 'ads-multi-select__control--error'
						: undefined,
					disabled ? 'ads-multi-select__control--disabled' : undefined,
				)}
				data-size={size}
			>
				{selected.map((item) => {
					const label = options.find((option) => option.value === item)?.label ?? item;
					return (
						<span className="ads-multi-select__chip" key={item}>
							<span className="ads-multi-select__chip-label">{label}</span>
							{!disabled && !readOnly ? (
								<button
									aria-label={removeLabel(label)}
									className="ads-multi-select__remove"
									onClick={(event) => remove(item, event)}
									type="button"
								>
									<span aria-hidden="true">×</span>
								</button>
							) : null}
						</span>
					);
				})}
				<input
					{...inputProps}
					aria-activedescendant={active >= 0 ? listId + '-option-' + active : undefined}
					aria-autocomplete="list"
					aria-busy={loading || undefined}
					aria-controls={open ? listId : undefined}
					aria-describedby={[describedBy, statusId].filter(Boolean).join(' ')}
					aria-expanded={open}
					aria-invalid={validationState === 'error' || ariaInvalid === true || ariaInvalid === 'true'}
					aria-required={required || undefined}
					autoComplete="off"
					className="ads-multi-select__input"
					disabled={disabled}
					id={inputId}
					onBlur={(event) => {
						onBlur?.(event);
						if (!rootRef.current?.contains(event.relatedTarget as Node | null))
							setExpanded(false);
					}}
					onChange={(event) => {
						setQuery(event.target.value);
						setExpanded(true);
						setActiveIndex(-1);
					}}
					onFocus={(event) => {
						onFocus?.(event);
						if (!event.defaultPrevented) setExpanded(true);
					}}
					onKeyDown={(event) => {
						onKeyDown?.(event);
						if (event.defaultPrevented || event.nativeEvent.isComposing) return;
						if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
							event.preventDefault();
							move(event.key === 'ArrowDown' ? 1 : -1);
						} else if (event.key === 'Enter' && open && active >= 0) {
							event.preventDefault();
							const option = items[active];
			if (option) toggle(option);
						} else if (event.key === 'Escape' && open) {
							event.preventDefault();
							setExpanded(false);
						} else if (event.key === 'Backspace' && query === '' && selected.length && !readOnly) {
							event.preventDefault();
							commit(selected.slice(0, -1));
						} else if (event.key === 'Tab') {
							setExpanded(false);
						}
					}}
					placeholder={selected.length ? '' : placeholder}
					readOnly={readOnly}
					ref={(node) => {
						inputRef.current = node;
						if (typeof forwardedRef === 'function') forwardedRef(node);
						else if (forwardedRef) forwardedRef.current = node;
					}}
					required={required && selected.length === 0}
					role="combobox"
					type="text"
					value={query}
				/>
				{clearable && selected.length > 0 && !disabled && !readOnly ? (
					<button
						aria-label={clearLabel}
						className="ads-multi-select__clear"
						onClick={() => {
							commit([]);
							inputRef.current?.focus({ preventScroll: true });
						}}
						type="button"
					>
						Limpar
					</button>
				) : null}
			</div>
			<span className="sr-only" id={statusId} role="status">
				{loading ? loadingText : error ?? (limitReached ? 'Limite de seleções atingido.' : selected.length + ' opções selecionadas.')}
			</span>
			{!disabled && name
				? selected.map((item) => (
						<input form={inputProps.form} key={item} name={name} type="hidden" value={item} />
					))
				: null}
			{open ? (
				<div className="ads-multi-select__popup">
					{loading ? (
						<p className="ads-multi-select__message" role="status">{loadingText}</p>
					) : error ? (
						<p className="ads-multi-select__message" role="alert">{error}</p>
					) : items.length === 0 ? (
						<p className="ads-multi-select__message" role="status">{emptyText}</p>
					) : (
						<ul aria-label="Opções disponíveis" aria-multiselectable="true" className="ads-multi-select__list" id={listId} role="listbox">
							{items.map((option, index) => {
								const unavailable = !selectable(option);
								return (
									<li
										aria-disabled={unavailable || undefined}
										aria-selected={selectedSet.has(option.value)}
										className="ads-multi-select__option"
										data-active={active === index ? 'true' : undefined}
										id={listId + '-option-' + index}
										key={option.value}
										onClick={() => toggle(option)}
										onKeyDown={(event) => {
											if (event.key === 'Enter' || event.key === ' ') {
												event.preventDefault();
												toggle(option);
											}
										}}
										onMouseDown={(event) => event.preventDefault()}
										role="option"
										tabIndex={-1}
									>
										<span aria-hidden="true" className="ads-multi-select__check">
											{selectedSet.has(option.value) ? '✓' : ''}
										</span>
										<span>
											<span>{option.label}</span>
											{option.description ? (
												<small className="ads-multi-select__description">{option.description}</small>
											) : null}
										</span>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			) : null}
		</div>
	);
});
