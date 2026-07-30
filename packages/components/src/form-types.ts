import type { InputHTMLAttributes } from 'react';

export type AdsFormSize = 'sm' | 'md' | 'lg';
export type AdsValidationState = 'default' | 'success' | 'error';

export interface AdsFormControlBase {
	className?: string;
	validationState?: AdsValidationState;
}

export type AdsInputType = InputHTMLAttributes<HTMLInputElement>['type'];
