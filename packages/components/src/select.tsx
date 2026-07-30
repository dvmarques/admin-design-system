import type { SelectHTMLAttributes } from 'react';
import { formControlClasses } from './form-control-classes.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';

export interface AdsSelectProps
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'className'>, AdsFormControlBase {
	size?: AdsFormSize;
}

/** A native select with design-system sizing and validation states. */
export function AdsSelect({
	['aria-invalid']: ariaInvalid,
	className,
	size = 'md',
	validationState = 'default',
	...props
}: AdsSelectProps) {
	return (
		<select
			{...props}
			aria-invalid={validationState === 'error' ? true : ariaInvalid}
			className={formControlClasses(size, validationState, className)}
		/>
	);
}
