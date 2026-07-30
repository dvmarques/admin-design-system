import type { TextareaHTMLAttributes } from 'react';
import { formControlClasses } from './form-control-classes.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';

export interface AdsTextareaProps
	 extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>,
		AdsFormControlBase {
	size?: AdsFormSize;
}

/** A native textarea with design-system sizing and validation states. */
export function AdsTextarea({
	['aria-invalid']: ariaInvalid,
	className,
	size = 'md',
	validationState = 'default',
	...props
}: AdsTextareaProps) {
	return (
		<textarea
			{...props}
			aria-invalid={validationState === 'error' ? true : ariaInvalid}
			className={formControlClasses(size, validationState, className)}
		/>
	);
}
