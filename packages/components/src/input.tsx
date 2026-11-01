import { forwardRef, type InputHTMLAttributes } from 'react';
import { formControlClasses } from './form-control-classes.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';

export interface AdsInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className'>, AdsFormControlBase {
	size?: AdsFormSize;
}

/** A native text input with design-system sizing and validation states. */
export const AdsInput = forwardRef<HTMLInputElement, AdsInputProps>(function AdsInput(
	{
		['aria-invalid']: ariaInvalid,
		className,
		size = 'md',
		validationState = 'default',
		...props
	}: AdsInputProps,
	ref,
) {
	return (
		<input
			ref={ref}
			{...props}
			aria-invalid={validationState === 'error' ? true : ariaInvalid}
			className={formControlClasses(size, validationState, className)}
		/>
	);
});
