import { classNames } from './class-names.js';
import type { AdsFormSize, AdsValidationState } from './form-types.js';

const controlSizes = {
	sm: 'min-h-[var(--ads-dimension-field-sm)] px-2 py-1 text-sm',
	md: 'min-h-[var(--ads-dimension-field-md)] px-3 py-1 text-sm',
	lg: 'min-h-[var(--ads-dimension-field-lg)] px-4 py-1.5 text-sm',
} as const;

const validationClasses = {
	default: 'border-border focus-visible:border-form-border-focus',
	success: 'border-form-success focus-visible:border-form-success',
	error: 'border-form-invalid focus-visible:border-form-invalid',
} as const;

export function formControlClasses(
	size: AdsFormSize,
	validationState: AdsValidationState,
	className?: string,
) {
	return classNames(
		'ads-form-control block w-full rounded-md border bg-form-background text-text transition-[border-color,box-shadow,background-color,transform] duration-[var(--ads-motion-normal)] ease-[var(--ads-motion-easing)] placeholder:text-text-muted hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring focus-visible:outline-[var(--ads-color-focus-ring)] focus-visible:outline-offset-[2px] focus-visible:ring-2 focus-visible:ring-focus-ring-offset disabled:cursor-not-allowed disabled:border-transparent disabled:bg-form-background-disabled disabled:opacity-60 read-only:cursor-default read-only:border-border read-only:bg-surface-muted read-only:hover:bg-surface-muted',
		controlSizes[size],
		validationClasses[validationState],
		className,
	);
}

export { controlSizes, validationClasses };
