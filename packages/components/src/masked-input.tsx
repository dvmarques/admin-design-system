'use client';

import {
	forwardRef,
	useCallback,
	useLayoutEffect,
	useRef,
	type ChangeEvent,
	type ComponentType,
	type InputHTMLAttributes,
	type Ref,
	type RefAttributes,
} from 'react';
import { IMaskInput } from 'react-imask';
import { classNames } from './class-names.js';
import { formControlClasses } from './form-control-classes.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';

/** Single mask form accepted by `mask`: a string pattern, regular expression, constructor or predicate. */
export type AdsMaskPattern =
	string | RegExp | NumberConstructor | DateConstructor | ((value: string) => boolean);

/** Read-only view of the dynamic mask state handed to `dispatch`. */
export interface AdsDynamicMaskState {
	readonly value: string;
	readonly unmaskedValue: string;
	readonly compiledMasks: readonly unknown[];
}

/**
 * Structured mask configuration. It is a deliberately small, documented subset of the options of the
 * underlying engine; options outside this list are not part of the public contract.
 */
export interface AdsMaskOptions {
	/** Pattern, or a list of patterns/options for a dynamic mask (the first one that fits is used). */
	mask: AdsMaskPattern | readonly (AdsMaskPattern | AdsMaskOptions)[];
	/** Pattern characters: `0` digit, `a` letter and `*` any by default; extend with new keys. */
	definitions?: Record<string, RegExp | ((char: string) => boolean)>;
	/** Show the placeholder only while typing (default) instead of the whole pattern. */
	lazy?: boolean;
	placeholderChar?: string;
	eager?: boolean | 'append' | 'remove';
	overwrite?: boolean | 'shift';
	skipInvalid?: boolean;
	/** Transforms the typed or pasted characters before they are accepted. */
	prepare?: (chars: string, ...rest: unknown[]) => string;
	/** Same as `prepare`, applied to each character. */
	prepareChar?: (char: string, ...rest: unknown[]) => string;
	/** Rejects values that do not satisfy the predicate. */
	validate?: (value: string, ...rest: unknown[]) => boolean;
	/** Called when the value is committed (blur or change). */
	commit?: (value: string, ...rest: unknown[]) => void;
	/** Chooses the active mask of a dynamic mask; return one of `compiledMasks`. */
	dispatch?: (appended: string, dynamicMasked: AdsDynamicMaskState) => unknown;
	/** Number masks (`mask: Number`). */
	scale?: number;
	radix?: string;
	thousandsSeparator?: string;
	mapToRadix?: readonly string[];
	normalizeZeros?: boolean;
	padFractionalZeros?: boolean;
	min?: number | Date;
	max?: number | Date;
	/** Date masks (`mask: Date`). */
	pattern?: string;
	format?: (date: Date) => string;
	parse?: (value: string) => Date;
	autofix?: boolean | 'pad';
}

/** What `mask` accepts: a pattern, a list of patterns (dynamic) or a structured configuration. */
export type AdsMask =
	AdsMaskPattern | readonly (AdsMaskPattern | AdsMaskOptions)[] | AdsMaskOptions;

/** Values reported by `onValueChange` after the mask accepts a change. */
export interface AdsMaskedInputValues {
	/** Text shown in the field, including literal characters of the mask. */
	maskedValue: string;
	/** Text without the literal characters of the mask; always a string, leading zeros included. */
	unmaskedValue: string;
	/** Typed value from the engine: a number for `Number` masks and a `Date` for `Date` masks; otherwise the masked text. */
	typedValue?: unknown;
	/** True when every required position of the mask is filled (always true without a mask). */
	complete: boolean;
}

export interface AdsMaskedInputProps
	extends
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			'size' | 'className' | 'value' | 'defaultValue' | 'children'
		>,
		AdsFormControlBase {
	size?: AdsFormSize;
	/** Mask configuration. Without it the field behaves as a regular text input. */
	mask?: AdsMask;
	/** Displayed (formatted) text of a controlled field. */
	value?: string;
	/** Initial displayed (formatted) text of an uncontrolled field. */
	defaultValue?: string;
	/** Called once for every change accepted from the user; never for mount or external `value` updates. */
	onValueChange?: (values: AdsMaskedInputValues) => void;
	/** Same element as `ref`: the underlying HTML input. */
	inputRef?: Ref<HTMLInputElement>;
}

interface MaskEngine {
	value: string;
	unmaskedValue: string;
	typedValue: unknown;
	masked: { isComplete: boolean };
	updateValue(): void;
	updateControl(cursorPos?: number | 'auto'): void;
}

interface MaskedComponentInstance {
	maskRef?: MaskEngine;
}

type ImplProps = Record<string, unknown> & RefAttributes<MaskedComponentInstance>;
const MaskedInputImpl = IMaskInput as unknown as ComponentType<ImplProps>;

function isOptions(mask: AdsMask): mask is AdsMaskOptions {
	return (
		typeof mask === 'object' && mask !== null && !Array.isArray(mask) && !(mask instanceof RegExp)
	);
}

// Engine options outside the public contract (cannot override `unmask=false` or value ownership).
const blockedMaskKeys = ['unmask', 'value', 'blocks', 'onAccept', 'onComplete', 'inputRef', 'ref'];

function pickMaskOptions(options: AdsMaskOptions) {
	const rest: Record<string, unknown> = { ...options };
	for (const key of blockedMaskKeys) delete rest[key];
	return rest;
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
	if (typeof ref === 'function') ref(node);
	else if (ref) (ref as { current: T | null }).current = node;
}

/**
 * Text input with an optional mask. It lives in the `@dvmarques/admin-ds-components/masked-input` entry point
 * and needs the optional peer dependency `react-imask`; the main entry point never loads it.
 */
export const AdsMaskedInput = forwardRef<HTMLInputElement, AdsMaskedInputProps>(
	function AdsMaskedInput(
		{
			['aria-invalid']: ariaInvalid,
			className,
			defaultValue,
			inputRef,
			mask,
			onChange,
			onValueChange,
			size = 'md',
			validationState = 'default',
			value,
			...props
		}: AdsMaskedInputProps,
		forwardedRef,
	) {
		const controlled = value !== undefined;
		const maskActive = mask !== undefined && mask !== null;
		const nodeRef = useRef<HTMLInputElement | null>(null);
		const implRef = useRef<MaskedComponentInstance | null>(null);
		const syncingRef = useRef(false);
		const initialRef = useRef(value ?? defaultValue ?? '');
		const mountedRef = useRef(false);
		const lastKnownRef = useRef<string>(initialRef.current);
		const appliedValueRef = useRef<string | undefined>(undefined);
		const latest = useRef({ controlled, value, onValueChange });
		useLayoutEffect(() => {
			latest.current = { controlled, value, onValueChange };
		});

		const setNode = useCallback((node: HTMLInputElement | null) => {
			nodeRef.current = node;
		}, []);

		// `useLayoutEffect` has no SSR guard (React >=18.2 peer), like `overlay-utils`; it never runs on the server.
		// Both refs point at the HTML input; the engine's own component ref never leaks out.
		useLayoutEffect(() => {
			const node = nodeRef.current;
			assignRef(forwardedRef, node);
			assignRef(inputRef, node);
			return () => {
				assignRef(forwardedRef, null);
				assignRef(inputRef, null);
			};
		}, [forwardedRef, inputRef]);

		/** Writes text into the field without notifying `onValueChange`. */
		const writeText = useCallback((text: string) => {
			const engine = implRef.current?.maskRef;
			const node = nodeRef.current;
			syncingRef.current = true;
			try {
				if (engine) {
					if (engine.value !== text) engine.value = text;
				} else if (node && node.value !== text) {
					node.value = text;
				}
			} finally {
				syncingRef.current = false;
			}
			lastKnownRef.current = engine ? engine.value : (node?.value ?? text);
		}, []);

		useLayoutEffect(() => {
			const { controlled: isControlled, value: current } = latest.current;
			if (isControlled) {
				appliedValueRef.current = current;
				writeText(current ?? '');
			} else if (!mountedRef.current) {
				// An uncontrolled field only receives its initial text, once.
				writeText(initialRef.current);
			}
			mountedRef.current = true;
		}, [value, controlled, maskActive, writeText]);

		const emit = useCallback(
			(values: AdsMaskedInputValues) => {
				lastKnownRef.current = values.maskedValue;
				latest.current.onValueChange?.(values);
				// A controlled field keeps showing `value` until the consumer changes it.
				queueMicrotask(() => {
					const { controlled: isControlled, value: current } = latest.current;
					if (!isControlled || current === undefined) return;
					if (appliedValueRef.current !== current) return;
					const engine = implRef.current?.maskRef;
					const shown = engine ? engine.value : nodeRef.current?.value;
					if (shown !== current) writeText(current);
				});
			},
			[writeText],
		);

		const handleAccept = useCallback(
			(_text: string, engine: MaskEngine) => {
				// Equal visible text means nothing changed for the consumer (for instance a rejected key).
				if (syncingRef.current || engine.value === lastKnownRef.current) return;
				emit({
					maskedValue: engine.value,
					unmaskedValue: engine.unmaskedValue,
					typedValue: engine.typedValue,
					complete: engine.masked.isComplete,
				});
			},
			[emit],
		);

		function handleChange(event: ChangeEvent<HTMLInputElement>) {
			onChange?.(event);
			// With a mask, notifications come from the engine; without one the native event is the source.
			if (!maskActive && event.target.value !== lastKnownRef.current) {
				const text = event.target.value;
				emit({ maskedValue: text, unmaskedValue: text, typedValue: text, complete: true });
			}
		}

		// `reset` restores the `defaultValue` attribute behind the engine's back; bring both back in sync.
		useLayoutEffect(() => {
			const form = nodeRef.current?.form;
			if (!form) return;
			const handleReset = () => {
				setTimeout(() => {
					const engine = implRef.current?.maskRef;
					const node = nodeRef.current;
					if (!node) return;
					if (engine) {
						engine.updateValue();
						engine.updateControl();
					}
					const { controlled: isControlled, value: current } = latest.current;
					if (isControlled) {
						writeText(current ?? '');
						return;
					}
					const shown = engine ? engine.value : node.value;
					if (shown === lastKnownRef.current) return;
					lastKnownRef.current = shown;
					latest.current.onValueChange?.({
						maskedValue: shown,
						unmaskedValue: engine ? engine.unmaskedValue : shown,
						typedValue: engine ? engine.typedValue : shown,
						complete: engine ? engine.masked.isComplete : true,
					});
				}, 0);
			};
			form.addEventListener('reset', handleReset);
			return () => form.removeEventListener('reset', handleReset);
		}, [writeText]);

		const maskProps = !maskActive
			? {}
			: isOptions(mask as AdsMask)
				? pickMaskOptions(mask as AdsMaskOptions)
				: { mask };

		return (
			<MaskedInputImpl
				{...props}
				{...maskProps}
				aria-invalid={validationState === 'error' ? true : ariaInvalid}
				className={formControlClasses(
					size,
					validationState,
					classNames('ads-masked-input', className),
				)}
				defaultValue={initialRef.current}
				inputRef={setNode}
				onAccept={handleAccept}
				onChange={handleChange}
				ref={implRef}
			/>
		);
	},
);

AdsMaskedInput.displayName = 'AdsMaskedInput';
