import { cloneElement, useId, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { classNames } from './class-names.js';
import type { AdsFormControlBase, AdsValidationState } from './form-types.js';

export interface AdsFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	children: ReactElement;
	description?: ReactNode;
	error?: ReactNode;
	label: ReactNode;
	validationState?: AdsValidationState;
}

/** Associates a native form control with its label, description and validation message. */
export function AdsField({
	children,
	className,
	description,
	error,
	label,
	validationState = 'default',
	...props
}: AdsFieldProps) {
	const generatedId = useId();
	const childProps = children.props as AdsFormControlBase & {
		id?: string;
		['aria-describedby']?: string;
		['aria-invalid']?: boolean | 'false' | 'true';
	};
	const controlId = childProps.id ?? `ads-field-${generatedId.replaceAll(':', '')}`;
	const descriptionId = description ? `${controlId}-description` : undefined;
	const errorId = error ? `${controlId}-error` : undefined;
	const describedBy =
		[childProps['aria-describedby'], descriptionId, errorId].filter(Boolean).join(' ') || undefined;
	const control = cloneElement(children, {
		id: controlId,
		'aria-describedby': describedBy,
		'aria-invalid': validationState === 'error' ? true : childProps['aria-invalid'],
		validationState,
	} as Partial<typeof childProps>);

	return (
		<div
			{...props}
			className={classNames('ads-field flex flex-col gap-[var(--ads-spacing-1)]', className)}
		>
			<label
				className="ads-field__label mb-1 text-sm font-medium text-text max-md:mb-0.5"
				htmlFor={controlId}
				id={`${controlId}-label`}
			>
				{label}
			</label>
			{control}
			{description ? (
				<p
					className="ads-field__description m-0 text-xs leading-normal text-text-muted"
					id={descriptionId}
				>
					{description}
				</p>
			) : null}
			{error ? (
				<p
					className="ads-field__message m-0 text-xs font-medium leading-normal text-form-invalid"
					id={errorId}
					role="alert"
				>
					{error}
				</p>
			) : null}
		</div>
	);
}

export interface AdsFieldLabelProps extends HTMLAttributes<HTMLLabelElement> {
	children: ReactNode;
}

export function AdsFieldLabel({ className, ...props }: AdsFieldLabelProps) {
	return (
		<label
			{...props}
			className={classNames(
				'ads-field__label text-sm font-medium leading-tight text-text',
				className,
			)}
		/>
	);
}

export interface AdsFieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

export function AdsFieldDescription({ className, ...props }: AdsFieldDescriptionProps) {
	return (
		<p
			{...props}
			className={classNames(
				'ads-field__description m-0 text-xs leading-normal text-text-muted',
				className,
			)}
		/>
	);
}

export interface AdsFieldMessageProps extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

export function AdsFieldMessage({ className, ...props }: AdsFieldMessageProps) {
	return (
		<p
			{...props}
			className={classNames(
				'ads-field__message m-0 text-xs font-medium leading-normal text-form-invalid',
				className,
			)}
			role="alert"
		/>
	);
}

// Um `AdsButton` no adendo vira parte do campo: sem a moldura (borda, fundo e padding) do adendo de
// texto, esticado até a altura do campo em vez de impor a sua (`min-h-0!`, pois os dois `min-h-*`
// empatariam), colado ao campo com a quina externa arredondada e sem o deslize de hover, que
// abriria uma fresta de 1px. Vários botões no mesmo adendo ficam contíguos: só a quina externa do
// conjunto é arredondada e cada junção sobrepõe 1px, como a do adendo com o campo.
const buttonAddonClassName =
	'has-[>.ads-button]:items-stretch has-[>.ads-button]:border-0 has-[>.ads-button]:bg-transparent has-[>.ads-button]:p-0 [&>.ads-button]:whitespace-nowrap [&>.ads-button]:min-h-0! [&>.ads-button]:translate-y-0! [&>.ads-button+.ads-button]:-ml-px';
const buttonStartClassName =
	'has-[>.ads-button]:-mr-px [&>.ads-button]:rounded-r-none [&>.ads-button:not(:first-child)]:rounded-l-none';
const buttonEndClassName =
	'has-[>.ads-button]:-ml-px [&>.ads-button]:rounded-l-none [&>.ads-button:not(:last-child)]:rounded-r-none';

export interface AdsInputGroupProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	startContent?: ReactNode;
	endContent?: ReactNode;
}

export function AdsInputGroup({
	children,
	className,
	endContent,
	startContent,
	...props
}: AdsInputGroupProps) {
	return (
		<div
			{...props}
			className={classNames(
				'ads-input-group flex max-w-full items-stretch overflow-x-auto rounded-md transition-shadow duration-[var(--ads-motion-normal)] ease-[var(--ads-motion-easing)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring focus-within:ring-2 focus-within:ring-focus-ring-offset',
				startContent ? '[&>.ads-form-control]:rounded-l-none' : undefined,
				'[&>.ads-form-control]:min-w-[4rem]',
				endContent ? '[&>.ads-form-control]:rounded-r-none' : undefined,
				className,
			)}
		>
			{startContent ? (
				<span
					className={classNames(
						'ads-input-group__start inline-flex shrink-0 items-center whitespace-nowrap rounded-l-md border border-r-0 border-border bg-surface-muted px-3 text-sm text-text-muted',
						buttonAddonClassName,
						buttonStartClassName,
					)}
				>
					{startContent}
				</span>
			) : null}
			{children}
			{endContent ? (
				<span
					className={classNames(
						'ads-input-group__end inline-flex shrink-0 items-center whitespace-nowrap rounded-r-md border border-l-0 border-border bg-surface-muted px-3 text-sm text-text-muted',
						buttonAddonClassName,
						buttonEndClassName,
					)}
				>
					{endContent}
				</span>
			) : null}
		</div>
	);
}

export interface AdsSelectionGroupProps extends HTMLAttributes<HTMLFieldSetElement> {
	children: ReactNode;
	legend: ReactNode;
}

export function AdsSelectionGroup({
	children,
	className,
	legend,
	...props
}: AdsSelectionGroupProps) {
	return (
		<fieldset
			{...props}
			className={classNames(
				'ads-selection-group m-0 flex min-w-0 flex-col gap-2 border-0 p-0',
				className,
			)}
		>
			<legend className="p-0 text-sm font-medium text-text">{legend}</legend>
			{children}
		</fieldset>
	);
}
