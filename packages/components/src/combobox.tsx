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
}

export type AdsComboboxInputReason = 'input' | 'select' | 'clear';

export interface AdsComboboxProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'children' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'name'
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
  const [editing, setEditing] = useState(defaultInputValue !== undefined);
  const [cachedOption, setCachedOption] = useState<AdsComboboxOption | null>(selectedOption ?? null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const stableInputId = useStableId('ads-combobox-input');
  const listId = useStableId('ads-combobox-list');
  const inputId = id ?? stableInputId;
  const selected =
    options.find((option) => option.value === selectedValue) ??
    (selectedOption?.value === selectedValue ? selectedOption : null) ??
    (cachedOption?.value === selectedValue ? cachedOption : null);
  const text = inputValue ?? (editing ? draftInput : (selected?.label ?? ''));
  const query = (editing || (inputValue !== undefined && selectedValue === null) ? text : '').trim().toLocaleLowerCase();
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
    if (value !== undefined) setEditing(false);
  }, [value]);

  const move = (direction: 'first' | 'last' | 'next' | 'previous') => {
    if (!open) setOpen(true);
    if (enabledIndices.length === 0) return;
    const position = enabledIndices.indexOf(active);
    const next =
      direction === 'first'
        ? 0
        : direction === 'last'
          ? enabledIndices.length - 1
          : direction === 'next'
            ? (position + 1) % enabledIndices.length
            : (position - 1 + enabledIndices.length) % enabledIndices.length;
    setActiveIndex(enabledIndices[next]!);
  };

  return (
    <div className="ads-combobox relative w-full min-w-0" ref={rootRef}>
      <div className="relative">
        <input
          {...inputProps}
          aria-activedescendant={open && active >= 0 ? listId + '-option-' + active : undefined}
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
            clearable ? 'pr-16' : 'pr-8',
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
            setText(event.target.value, 'input');
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            if (!event.defaultPrevented && !readOnly) setOpen(true);
          }}
          onKeyDown={(event) => {
            inputProps.onKeyDown?.(event);
            if (event.defaultPrevented || event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              move(event.key === 'ArrowDown' ? 'next' : 'previous');
            } else if (event.key === 'Home' && open) {
              event.preventDefault();
              move('first');
            } else if (event.key === 'End' && open) {
              event.preventDefault();
              move('last');
            } else if (event.key === 'Enter' && open && active >= 0) {
              event.preventDefault();
              const option = matches[active];
              if (option) choose(option);
            } else if (event.key === 'Escape' && open) {
              event.preventDefault();
              dismiss();
            } else if (event.key === 'Tab') {
              dismiss();
            }
          }}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={(node) => {
            inputRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          role="combobox"
          type="text"
          value={text}
        />
        {clearable && (selectedValue !== null || text.length > 0) && !disabled && !readOnly ? (
          <button
            aria-label={clearLabel}
            className="ads-combobox__clear absolute inset-y-0 right-8 px-1 text-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-focus-ring"
            onClick={clear}
            onMouseDown={(event) => event.preventDefault()}
            type="button"
          >
            ×
          </button>
        ) : null}
        <button
          aria-label={open ? 'Fechar opções' : 'Mostrar opções'}
          aria-expanded={open}
          className="ads-combobox__toggle absolute inset-y-0 right-1 px-2 text-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-focus-ring disabled:opacity-50"
          disabled={disabled || readOnly}
          onClick={() => {
            setOpen(!open);
            inputRef.current?.focus({ preventScroll: true });
          }}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          <span aria-hidden="true">{open ? '⌃' : '⌄'}</span>
        </button>
      </div>
      {name ? <input name={name} type="hidden" value={selectedValue ?? ''} /> : null}
      {open ? (
        <OverlayPortal>
          <ul
            aria-label="Sugestões"
            className="ads-combobox__list fixed z-[var(--ads-layer-dropdown)] m-0 max-h-64 overflow-y-auto overscroll-contain rounded-md border border-border bg-surface-raised p-1 font-sans text-sm text-text shadow-md"
            id={listId}
            ref={position.attachContent}
            role="listbox"
            style={{
              ...position.style,
              width: Math.max(200, rootRef.current?.getBoundingClientRect().width ?? 200),
              maxWidth: 'calc(100vw - 16px)',
            }}
          >
            {loading ? (
              <li aria-live="polite" className="px-3 py-2 text-text-muted" role="status">
                {loadingText}
              </li>
            ) : error ? (
              <li className="flex items-center justify-between gap-2 px-3 py-2 text-form-invalid" role="status">
                <span>{error}</span>
                {onRetry ? (
                  <button className="underline" onClick={onRetry} type="button">
                    Tentar novamente
                  </button>
                ) : null}
              </li>
            ) : matches.length === 0 ? (
              <li aria-live="polite" className="px-3 py-2 text-text-muted" role="status">
                {emptyText}
              </li>
            ) : (
              matches.map((option, index) => (
                <li
                  aria-disabled={option.disabled || undefined}
                  aria-selected={selectedValue === option.value}
                  className={classNames(
                    'ads-combobox__option cursor-pointer rounded px-3 py-2',
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
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  role="option"
                >
                  {renderOption ? renderOption(option) : (
                    <span className="flex flex-col gap-0.5">
                      <span>{option.label}</span>
                      {option.description ? (
                        <span className="text-xs opacity-80">{option.description}</span>
                      ) : null}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </OverlayPortal>
      ) : null}
    </div>
  );
});
