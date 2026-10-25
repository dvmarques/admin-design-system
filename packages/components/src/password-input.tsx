'use client';

import {
	forwardRef,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type ChangeEvent,
	type MouseEvent,
	type ReactNode,
} from 'react';
import { AdsInput, type AdsInputProps } from './input.js';
import { classNames } from './class-names.js';

export interface AdsPasswordRule {
	id: string;
	label: ReactNode;
	/** Pure check applied to the current value; it never leaves the browser. */
	test: (value: string) => boolean;
}

export type AdsPasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

export interface AdsPasswordInputProps extends Omit<AdsInputProps, 'type'> {
	/** Accessible name while the password is hidden; start it with `showPasswordText`. */
	showPasswordLabel?: string;
	/** Accessible name while the password is visible; start it with `hidePasswordText`. */
	hidePasswordLabel?: string;
	/** Visible text of the visibility control while the password is hidden. */
	showPasswordText?: string;
	/** Visible text of the visibility control while the password is visible. */
	hidePasswordText?: string;
	/** Hide the visibility action entirely. */
	showVisibilityToggle?: boolean;
	/** Show a simple, advisory strength score (never a security guarantee). */
	showStrength?: boolean;
	/** Text for each strength level. */
	strengthLabels?: Partial<Record<AdsPasswordStrength, string>>;
	/** Prefix of the strength text, followed by the level. */
	strengthPrefix?: string;
	/** Accessible name of the rules list. */
	rulesLabel?: string;
	/** Optional checklist of rules shown below the field. */
	rules?: readonly AdsPasswordRule[];
	/** Text announced for each rule, in addition to the icon. */
	ruleStatusLabels?: { met: string; pending: string };
}

const defaultStrengthLabels: Record<AdsPasswordStrength, string> = {
	empty: 'Não avaliada',
	weak: 'Fraca',
	medium: 'Média',
	strong: 'Forte',
};

function evaluateStrength(password: string): AdsPasswordStrength {
	if (password.length === 0) return 'empty';
	const score = [
		password.length >= 8,
		/[A-Z]/.test(password),
		/[0-9]/.test(password),
		/[^A-Za-z0-9]/.test(password),
	].filter(Boolean).length;
	return score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
}

/** Password input with a keyboard-accessible visibility action and optional advisory feedback. */
export const AdsPasswordInput = forwardRef<HTMLInputElement, AdsPasswordInputProps>(
	function AdsPasswordInput(
		{
			['aria-describedby']: ariaDescribedBy,
			className,
			defaultValue,
			disabled,
			hidePasswordLabel = 'Ocultar senha',
			hidePasswordText = 'Ocultar',
			onChange,
			ruleStatusLabels = { met: 'Atendida', pending: 'Pendente' },
			rules,
			rulesLabel = 'Requisitos da senha',
			showPasswordText = 'Mostrar',
			showPasswordLabel = 'Mostrar senha',
			showStrength = false,
			showVisibilityToggle = true,
			strengthLabels,
			strengthPrefix = 'Força da senha:',
			value,
			...props
		}: AdsPasswordInputProps,
		forwardedRef,
	) {
		const feedbackId = useId();
		const [visible, setVisible] = useState(false);
		const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ''));
		const inputRef = useRef<HTMLInputElement | null>(null);
		const selectionRef = useRef<{ start: number; end: number } | null>(null);
		const password = String(value ?? uncontrolledValue);
		const strength = evaluateStrength(password);
		const strengthText = `${strengthPrefix} ${{ ...defaultStrengthLabels, ...strengthLabels }[strength]}`;
		const hasRules = Boolean(rules && rules.length > 0);
		const strengthId = showStrength ? `${feedbackId}-strength` : undefined;
		const rulesId = hasRules ? `${feedbackId}-rules` : undefined;
		const describedBy =
			[ariaDescribedBy, strengthId, rulesId].filter(Boolean).join(' ') || undefined;

		function setRefs(node: HTMLInputElement | null) {
			inputRef.current = node;
			if (typeof forwardedRef === 'function') forwardedRef(node);
			else if (forwardedRef) forwardedRef.current = node;
		}

		function handleChange(event: ChangeEvent<HTMLInputElement>) {
			if (value === undefined) setUncontrolledValue(event.target.value);
			onChange?.(event);
		}

		useLayoutEffect(() => {
			const input = inputRef.current;
			const selection = selectionRef.current;
			if (!input || !selection) return;
			selectionRef.current = null;
			input.focus();
			try {
				input.setSelectionRange(selection.start, selection.end);
			} catch {
				/* The browser does not support selection for this input type. */
			}
		}, [visible]);

		function toggleVisibility(event: MouseEvent<HTMLButtonElement>) {
			event.preventDefault();
			const input = inputRef.current;
			// Keyboard activation keeps focus on the button; pointer activation returns it to the field.
			if (event.detail === 0) {
				setVisible((current) => !current);
				return;
			}
			try {
				const start = input?.selectionStart;
				const end = input?.selectionEnd;
				selectionRef.current = start != null && end != null ? { start, end } : null;
			} catch {
				selectionRef.current = null;
			}
			setVisible((current) => !current);
		}

		return (
			<div className="ads-password-input w-full">
				<div className="relative">
					<AdsInput
						{...props}
						aria-describedby={describedBy}
						className={classNames(showVisibilityToggle ? 'pr-20' : undefined, className)}
						disabled={disabled}
						onChange={handleChange}
						ref={setRefs}
						type={visible ? 'text' : 'password'}
						{...(value === undefined ? { defaultValue } : { value })}
					/>
					{showVisibilityToggle ? (
						<button
							aria-label={visible ? hidePasswordLabel : showPasswordLabel}
							className="ads-password-input__toggle absolute inset-y-0 right-0 inline-flex min-w-18 items-center justify-center rounded-r-md px-2 text-sm text-text-muted focus-visible:outline-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
							disabled={disabled}
							onClick={toggleVisibility}
							type="button"
						>
							{visible ? hidePasswordText : showPasswordText}
						</button>
					) : null}
				</div>
				{showStrength ? (
					<>
						<p
							className="ads-password-input__strength mt-2 text-xs text-text-muted"
							id={strengthId}
						>
							{strengthText}
						</p>
						<span aria-atomic="true" className="sr-only" role="status">
							{password.length > 0 ? strengthText : ''}
						</span>
					</>
				) : null}
				{hasRules ? (
					<ul
						className="ads-password-input__rules mt-2 flex flex-col gap-1 text-xs text-text-muted"
						aria-label={rulesLabel}
						id={rulesId}
					>
						{rules!.map((rule) => {
							const met = rule.test(password);
							return (
								<li
									className="ads-password-input__rule flex items-center gap-1.5"
									data-met={met ? 'true' : 'false'}
									key={rule.id}
								>
									<span aria-hidden="true">{met ? '✓' : '○'}</span>
									<span>{rule.label}</span>
									<span className="sr-only">
										{': '}
										{met ? ruleStatusLabels.met : ruleStatusLabels.pending}
									</span>
								</li>
							);
						})}
					</ul>
				) : null}
			</div>
		);
	},
);
