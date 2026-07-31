import { classNames } from './class-names.js';
import type { AdsFormSize, AdsValidationState } from './form-types.js';

const controlSizes = {
	sm: 'min-h-[var(--ads-dimension-control-sm)] px-2 py-1 text-sm',
	md: 'min-h-[var(--ads-dimension-control-md)] px-3 py-1.5 text-sm',
	lg: 'min-h-[var(--ads-dimension-control-lg)] px-4 py-2 text-sm',
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
		'ads-form-control block w-full rounded-md border bg-form-background text-text transition-[border-color,box-shadow,background-color] duration-150 ease-out placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:bg-form-background-disabled disabled:opacity-50 read-only:bg-form-background-disabled',
		controlSizes[size],
		validationClasses[validationState],
		className,
	);
}

export { controlSizes, validationClasses };
