import type { SelectHTMLAttributes } from 'react';
import { classNames } from './class-names.js';
import { formControlClasses } from './form-control-classes.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';
import { AdsSelectPlaceholder, type AdsSelectValue } from './select-placeholder.js';

export type { AdsSelectValue } from './select-placeholder.js';

export interface AdsSelectProps
	extends
		Omit<
			SelectHTMLAttributes<HTMLSelectElement>,
			'size' | 'className' | 'value' | 'defaultValue' | 'placeholder'
		>,
		AdsFormControlBase {
	size?: AdsFormSize;
	/**
	 * Texto da ausência de escolha, exibido como primeira opção do `select` simples. Opt-in: sem ele
	 * o componente é o `select` nativo. Ignorado quando `multiple` é usado.
	 */
	placeholder?: string;
	/**
	 * Valor controlado. Com `placeholder`, `null` indica ausência de seleção e `""` seleciona a
	 * opção real de valor vazio; sem `placeholder`, `null` equivale a `""`.
	 */
	value?: AdsSelectValue;
	/** Valor inicial não controlado, com a mesma semântica de `value`. */
	defaultValue?: AdsSelectValue;
}

/** A native select with design-system sizing and validation states. */
export function AdsSelect({
	['aria-invalid']: ariaInvalid,
	className,
	defaultValue,
	placeholder,
	size = 'md',
	validationState = 'default',
	value,
	...props
}: AdsSelectProps) {
	const nativeProps = {
		...props,
		'aria-invalid': validationState === 'error' ? true : ariaInvalid,
		className: formControlClasses(size, validationState, classNames('ads-select', className)),
	};
	if (placeholder !== undefined && !props.multiple) {
		return (
			<AdsSelectPlaceholder
				{...nativeProps}
				defaultValue={defaultValue}
				placeholder={placeholder}
				value={value}
			/>
		);
	}
	return (
		<select
			{...nativeProps}
			defaultValue={defaultValue === null ? '' : defaultValue}
			value={value === null ? '' : value}
		/>
	);
}
