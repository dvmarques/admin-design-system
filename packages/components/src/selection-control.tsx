import type { InputHTMLAttributes, ReactNode } from 'react';
import { classNames } from './class-names.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';

const selectionSizes = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
} as const;

const switchSizes = {
	sm: {
		track: 'h-5 w-9 peer-checked:[&>span]:translate-x-4',
		thumb: 'left-0.5 top-0.5 h-4 w-4',
	},
	md: {
		track: 'h-6 w-10 peer-checked:[&>span]:translate-x-4',
		thumb: 'left-1 top-1 h-4 w-4',
	},
	lg: {
		track: 'h-7 w-12 peer-checked:[&>span]:translate-x-5',
		thumb: 'left-1 top-1 h-5 w-5',
	},
} as const;

export interface AdsSelectionControlProps
	extends
		Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'size'>,
		AdsFormControlBase {
	label?: ReactNode;
	size?: AdsFormSize;
}

function selectionControl(type: 'checkbox' | 'radio', props: AdsSelectionControlProps) {
	const {
		['aria-invalid']: ariaInvalid,
		className,
		label,
		size = 'md',
		validationState = 'default',
		...inputProps
	} = props;
	return (
		<label
			className={classNames(
				'ads-selection-control inline-flex items-center gap-2 text-text',
				className,
			)}
		>
			<input
				{...inputProps}
				aria-invalid={validationState === 'error' ? true : ariaInvalid}
				className={classNames(
					'ads-selection-control__input accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-form-border-focus disabled:cursor-not-allowed disabled:opacity-50',
					selectionSizes[size],
					validationState === 'error' && 'accent-form-invalid',
				)}
				type={type}
			/>
			{label ? <span>{label}</span> : null}
		</label>
	);
}

export function AdsCheckbox(props: AdsSelectionControlProps) {
	return selectionControl('checkbox', props);
}

export function AdsRadio(props: AdsSelectionControlProps) {
	return selectionControl('radio', props);
}

export function AdsSwitch(props: AdsSelectionControlProps) {
	const {
		['aria-invalid']: ariaInvalid,
		className,
		label,
		size = 'md',
		validationState = 'default',
		...inputProps
	} = props;
	return (
		<label className={classNames('ads-switch inline-flex items-center gap-2 text-text', className)}>
			<span className="relative inline-flex">
				<input
					{...inputProps}
					aria-invalid={validationState === 'error' ? true : ariaInvalid}
					className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
					type="checkbox"
				/>
				<span
					aria-hidden="true"
					className={classNames(
						'pointer-events-none relative block rounded-full border border-border bg-surface transition-colors duration-150 peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-form-border-focus peer-disabled:opacity-50',
						switchSizes[size].track,
						validationState === 'error' && 'border-form-invalid',
					)}
				>
					<span
						className={classNames(
							'absolute block rounded-full bg-surface-muted transition-[background-color,transform] duration-150 peer-checked:bg-surface',
							switchSizes[size].thumb,
						)}
					/>
				</span>
			</span>
			{label ? <span>{label}</span> : null}
		</label>
	);
}
