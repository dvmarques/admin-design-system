'use client';

import {
	forwardRef,
	useEffect,
	useId,
	useRef,
	useState,
	type ChangeEvent,
	type CompositionEvent,
	type FocusEvent,
	type InputHTMLAttributes,
	type SyntheticEvent,
} from 'react';
import { classNames } from './class-names.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';

export interface AdsOTPInputProps
	extends Omit<
			InputHTMLAttributes<HTMLInputElement>,
			'type' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'maxLength' | 'children' | 'className'
		>,
		AdsFormControlBase {
	/** Number of numeric positions; defaults to 6. Must be a positive integer. */
	length?: number;
	/** Current code as a string (leading zeros are preserved). */
	value?: string;
	/** Initial code in uncontrolled mode. */
	defaultValue?: string;
	/** Receives the normalized code whenever an edit changes its digits. */
	onChange?: (value: string) => void;
	/** Fired when a user edit transitions an incomplete code into a complete code. */
	onComplete?: (value: string) => void;
	size?: AdsFormSize;
}

const sizes: Record<AdsFormSize, string> = {
	sm: 'min-h-[var(--ads-dimension-field-sm)] text-sm',
	md: 'min-h-[var(--ads-dimension-field-md)] text-base',
	lg: 'min-h-[var(--ads-dimension-field-lg)] text-lg',
};

function normalize(value: string, length: number) {
	return value.replace(/[^0-9]/g, '').slice(0, length);
}

/**
 * A single native input with visually segmented digits. Arrows, Delete, Backspace,
 * selections, paste and OTP autofill remain native, including form submission.
 * The visual segments are hidden from assistive technology.
 */
export const AdsOTPInput = forwardRef<HTMLInputElement, AdsOTPInputProps>(function AdsOTPInput(
	{
		['aria-describedby']: ariaDescribedBy,
		['aria-invalid']: ariaInvalid,
		autoComplete = 'one-time-code',
		className,
		defaultValue = '',
		disabled,
		id,
		inputMode = 'numeric',
		length = 6,
		onBlur,
		onChange,
		onComplete,
		onCompositionEnd,
		onCompositionStart,
		onFocus,
		onSelect,
		readOnly,
		size = 'md',
		validationState = 'default',
		value,
		...props
	},
	forwardedRef,
) {
	const count = Number.isSafeInteger(length) && length > 0 ? length : 6;
	const [uncontrolledValue, setUncontrolledValue] = useState(() => normalize(defaultValue, count));
	const currentValue = normalize(value === undefined ? uncontrolledValue : value, count);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const composing = useRef(false);
	const [focused, setFocused] = useState(false);
	const [caret, setCaret] = useState(currentValue.length);
	const hintId = useId();
	const describedBy = [ariaDescribedBy, hintId].filter(Boolean).join(' ');

	useEffect(() => {
		if (value === undefined) {
			setUncontrolledValue((previous) => normalize(previous, count));
		}
	}, [count, value]);

	function setRef(node: HTMLInputElement | null) {
		inputRef.current = node;
		if (typeof forwardedRef === 'function') forwardedRef(node);
		else if (forwardedRef) forwardedRef.current = node;
	}

	function syncSelection(node: HTMLInputElement) {
		setCaret(Math.min(node.selectionStart ?? node.value.length, count));
	}

	function acceptInput(node: HTMLInputElement) {
		const raw = node.value;
		const nextCaret = normalize(raw.slice(0, node.selectionStart ?? raw.length), count).length;
		const next = normalize(raw, count);
		node.value = next;
		node.setSelectionRange(nextCaret, nextCaret);
		setCaret(nextCaret);
		if (next === currentValue) return;
		if (value === undefined) setUncontrolledValue(next);
		onChange?.(next);
		if (currentValue.length < count && next.length === count) onComplete?.(next);
	}

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		if (!composing.current) acceptInput(event.currentTarget);
	}

	function handleCompositionStart(event: CompositionEvent<HTMLInputElement>) {
		composing.current = true;
		onCompositionStart?.(event);
	}

	function handleCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
		composing.current = false;
		acceptInput(event.currentTarget);
		onCompositionEnd?.(event);
	}

	function handleFocus(event: FocusEvent<HTMLInputElement>) {
		setFocused(true);
		syncSelection(event.currentTarget);
		onFocus?.(event);
	}

	function handleBlur(event: FocusEvent<HTMLInputElement>) {
		setFocused(false);
		onBlur?.(event);
	}

	function handleSelect(event: SyntheticEvent<HTMLInputElement>) {
		syncSelection(event.currentTarget);
		onSelect?.(event);
	}

	return (
		<div
			className={classNames('ads-otp-input relative inline-flex w-full gap-1', className)}
			data-disabled={disabled ? 'true' : undefined}
		>
			<input
				{...props}
				aria-describedby={describedBy}
				aria-invalid={validationState === 'error' ? true : ariaInvalid}
				autoComplete={autoComplete}
				className="ads-otp-input__native absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
				disabled={disabled}
				id={id}
				inputMode={inputMode}
				onBlur={handleBlur}
				onChange={handleChange}
				onCompositionEnd={handleCompositionEnd}
				onCompositionStart={handleCompositionStart}
				onFocus={handleFocus}
				onSelect={handleSelect}
				readOnly={readOnly}
				ref={setRef}
				type="text"
				value={currentValue}
			/>
			<span className="sr-only" id={hintId}>
				{count} dígitos. Use as setas para navegar e Backspace para apagar.
			</span>
			{Array.from({ length: count }, (_, index) => (
				<span
					aria-hidden="true"
					className={classNames(
						'ads-otp-input__slot box-border flex min-w-0 flex-1 items-center justify-center rounded-md border bg-form-background font-sans font-medium text-text',
						sizes[size],
						validationState === 'error'
							? 'border-form-invalid'
							: validationState === 'success'
								? 'border-form-success'
								: 'border-border-control',
						focused && Math.min(caret, count - 1) === index
							? 'outline-2 outline-offset-2 outline-focus-ring ring-2 ring-focus-ring-offset'
							: undefined,
						disabled ? 'border-transparent bg-form-background-disabled opacity-60' : undefined,
						readOnly ? 'bg-surface-muted' : undefined,
					)}
					data-active={focused && Math.min(caret, count - 1) === index ? 'true' : undefined}
					key={index}
					style={{ maxWidth: `var(--ads-dimension-field-${size})` }}
				>
					{currentValue[index] ?? ''}
				</span>
			))}
		</div>
	);
});
