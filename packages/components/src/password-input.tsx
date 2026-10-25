'use client';

import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { AdsInput, type AdsInputProps } from './input.js';
import { classNames } from './class-names.js';

export interface AdsPasswordInputProps extends Omit<AdsInputProps, 'type'> {
  /** Accessible text for the visibility control. */
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
  /** Hide the visibility action entirely. */
  showVisibilityToggle?: boolean;
}

/** Password input with a keyboard-accessible visibility action. */
export function AdsPasswordInput({
  className,
  disabled,
  hidePasswordLabel = 'Ocultar senha',
  showPasswordLabel = 'Mostrar senha',
  showVisibilityToggle = true,
  ...props
}: AdsPasswordInputProps) {
  const [visible, setVisible] = useState(false);
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
    <div className="ads-password-input relative w-full">
      <AdsInput
        {...props}
        className={classNames('pr-20', className)}
        disabled={disabled}
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
  );
}
