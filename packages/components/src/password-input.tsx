'use client';

import { useLayoutEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { AdsInput, type AdsInputProps } from './input.js';
import { classNames } from './class-names.js';

export interface AdsPasswordInputProps extends Omit<AdsInputProps, 'type'> {
  /** Accessible text for the visibility control. */
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
  /** Hide the visibility action entirely. */
  showVisibilityToggle?: boolean;
  /** Show a simple, advisory strength score (never a security guarantee). */
  showStrength?: boolean;
}

/** Password input with a keyboard-accessible visibility action. */
export function AdsPasswordInput({
  className,
  disabled,
  hidePasswordLabel = 'Ocultar senha',
  showPasswordLabel = 'Mostrar senha',
  showVisibilityToggle = true,
  showStrength = false,
  onChange,
  value,
  defaultValue,
  ...props
}: AdsPasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ''));
  const password = String(value ?? uncontrolledValue);
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const strength = password.length === 0 ? 'Não avaliada' : score <= 1 ? 'Fraca' : score <= 2 ? 'Média' : 'Forte';
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) setUncontrolledValue(event.target.value);
    onChange?.(event);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input || !selectionRef.current) return;
    input.focus();
    const { start, end } = selectionRef.current;
    selectionRef.current = null;
    try { input.setSelectionRange(start, end); } catch { /* Browser does not support selection. */ }
  }, [visible]);

  function toggleVisibility(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const input = inputRef.current;
    try {
      const start = input?.selectionStart;
      const end = input?.selectionEnd;
      selectionRef.current = start != null && end != null ? { start, end } : null;
    } catch { selectionRef.current = null; }
    setVisible((current) => !current);
  }

  return (
    <div className="ads-password-input w-full">
      <div className="relative">
      <AdsInput
        {...props}
        className={classNames('pr-20', className)}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        ref={inputRef}
        type={visible ? 'text' : 'password'}
      />
      {showVisibilityToggle ? (
        <button
          aria-label={visible ? hidePasswordLabel : showPasswordLabel}
          aria-pressed={visible}
          className="ads-password-input__toggle absolute inset-y-0 right-0 inline-flex min-w-18 px-2 items-center justify-center rounded-r-md text-sm text-text-muted focus-visible:outline-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          onClick={toggleVisibility}
          type="button"
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      ) : null}
      </div>
      {showStrength ? (
        <p className="ads-password-input__strength mt-2 text-xs text-text-muted" role="status">
          Força da senha: {strength}
        </p>
      ) : null}
    </div>
  );
}
