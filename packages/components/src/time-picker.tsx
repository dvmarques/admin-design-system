'use client';

import { useEffect, useState } from 'react';
import { classNames } from './class-names.js';
import { AdsSelect } from './select.js';
import type { AdsFormSize, AdsValidationState } from './form-types.js';

export interface AdsTimePickerLabels {
	hour?: string;
	minute?: string;
	period?: string;
	chooseHour?: string;
	chooseMinute?: string;
}

export interface AdsTimePickerProps {
	'aria-describedby'?: string;
	'aria-invalid'?: boolean | 'false' | 'true';
	'aria-label'?: string;
	className?: string;
	defaultValue?: string | null;
	disabled?: boolean;
	/** 12h changes the presentation only. All values use 24-hour HH:mm. */
	format?: '12h' | '24h';
	id?: string;
	labels?: AdsTimePickerLabels;
	/** Inclusive lower bound, HH:mm. Does not support overnight ranges. */
	min?: string;
	/** Inclusive upper bound, HH:mm. */
	max?: string;
	/** Integer 1..60, aligned to minute 00 of each hour. Defaults to 1. */
	minuteStep?: number;
	/** Serializes a single canonical HH:mm value when provided. */
	name?: string;
	onValueChange?: (value: string | null) => void;
	required?: boolean;
	size?: AdsFormSize;
	validationState?: AdsValidationState;
	value?: string | null;
}

interface TimeParts {
	hour: string;
	minute: string;
	period: 'AM' | 'PM';
}
const defaults: Required<AdsTimePickerLabels> = {
	hour: 'Horas',
	minute: 'Minutos',
	period: 'Período',
	chooseHour: 'Selecionar hora',
	chooseMinute: 'Selecionar minuto',
};
const pad = (value: number) => String(value).padStart(2, '0');

function parseTime(value: string | null | undefined): number | null {
	if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
	const [hour, minute] = value.split(':').map(Number);
	return hour! * 60 + minute!;
}

function splitTime(value: string | null | undefined, format: '12h' | '24h'): TimeParts {
	const time = parseTime(value);
	if (time === null) return { hour: '', minute: '', period: 'AM' };
	const hour = Math.floor(time / 60);
	return {
		hour: pad(format === '12h' ? hour % 12 || 12 : hour),
		minute: pad(time % 60),
		period: hour >= 12 ? 'PM' : 'AM',
	};
}

function toMinutes(parts: TimeParts, format: '12h' | '24h'): number | null {
	if (parts.hour === '' || parts.minute === '') return null;
	const hour = Number(parts.hour);
	const minute = Number(parts.minute);
	if (format === '12h') {
		if (hour < 1 || hour > 12) return null;
		return ((hour % 12) + (parts.period === 'PM' ? 12 : 0)) * 60 + minute;
	}
	if (hour < 0 || hour > 23) return null;
	return hour * 60 + minute;
}

/** Selects a time without a date or timezone, using native accessible controls. */
export function AdsTimePicker({
	'aria-describedby': describedBy,
	'aria-invalid': ariaInvalid,
	'aria-label': ariaLabel,
	className,
	defaultValue = null,
	disabled = false,
	format = '24h',
	id,
	labels: customLabels,
	max,
	min,
	minuteStep = 1,
	name,
	onValueChange,
	required = false,
	size = 'md',
	validationState = 'default',
	value,
}: AdsTimePickerProps) {
	const labels = { ...defaults, ...customLabels };
	const controlled = value !== undefined;
	const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
	const current = controlled ? value : innerValue;
	const [draft, setDraft] = useState<TimeParts>(() => splitTime(current, format));
	useEffect(() => {
		setDraft(splitTime(current, format));
	}, [current, format]);
	const minMinutes = min === undefined ? 0 : parseTime(min);
	const maxMinutes = max === undefined ? 1439 : parseTime(max);
	const validStep = Number.isInteger(minuteStep) && minuteStep >= 1 && minuteStep <= 60;
	const validBounds = minMinutes !== null && maxMinutes !== null && minMinutes <= maxMinutes;
	const allowed = (minutes: number) =>
		validStep &&
		validBounds &&
		minutes >= minMinutes! &&
		minutes <= maxMinutes! &&
		(minutes % 60) % minuteStep === 0;
	const parsed = parseTime(current);
	const invalidValue = current !== null && (parsed === null || !allowed(parsed));
	const invalid =
		validationState === 'error' ||
		ariaInvalid === true ||
		ariaInvalid === 'true' ||
		invalidValue ||
		!validStep ||
		!validBounds;
	const visible = controlled && current !== null ? splitTime(current, format) : draft;
	const toHour24 = (hour: string, period: 'AM' | 'PM') => {
		const h = Number(hour);
		return format === '12h' ? (h % 12) + (period === 'PM' ? 12 : 0) : h;
	};
	const hourHasChoices = (hour: string, period: 'AM' | 'PM') => {
		const base = toHour24(hour, period) * 60;
		return Array.from({ length: 60 }, (_, i) => i).some((minute) => allowed(base + minute));
	};
	const minuteAllowed = (minute: number, parts: TimeParts) =>
		parts.hour
			? allowed(toHour24(parts.hour, parts.period) * 60 + minute)
			: Array.from({ length: format === '12h' ? 12 : 24 }, (_, i) =>
					format === '12h' ? pad(i + 1) : pad(i),
				).some((hour) => allowed(toHour24(hour, parts.period) * 60 + minute));

	const update = (key: keyof TimeParts, selection: string) => {
		let next: TimeParts = { ...visible, [key]: selection };
		if (next.hour && !hourHasChoices(next.hour, next.period)) {
			next = { ...next, hour: '', minute: '' };
		} else if (next.minute && !minuteAllowed(Number(next.minute), next)) {
			next = { ...next, minute: '' };
		}
		setDraft(next);
		const result = toMinutes(next, format);
		const nextValue =
			result !== null && allowed(result)
				? pad(Math.floor(result / 60)) + ':' + pad(result % 60)
				: null;
		if (!controlled) setInnerValue(nextValue);
		if (nextValue !== current) onValueChange?.(nextValue);
	};
	const shared = {
		'aria-describedby': describedBy,
		'aria-invalid': invalid || undefined,
		disabled,
		required,
		size,
		validationState: invalid ? ('error' as const) : validationState,
	};
	const hourOptions = Array.from({ length: format === '12h' ? 12 : 24 }, (_, i) =>
		pad(format === '12h' ? i + 1 : i),
	);
	const minuteOptions = Array.from({ length: 60 }, (_, i) => pad(i));

	return (
		<div
			className={classNames(
				'ads-time-picker flex w-full min-w-0 flex-wrap items-center gap-2',
				className,
			)}
		>
			<AdsSelect
				{...shared}
				aria-label={ariaLabel ?? (id ? undefined : labels.hour)}
				className="ads-time-picker__hour min-w-0 flex-[1_1_5rem]"
				id={id}
				onChange={(event) => update('hour', event.target.value)}
				value={visible.hour}
			>
				<option value="">{labels.chooseHour}</option>
				{hourOptions.map((hour) => (
					<option disabled={!hourHasChoices(hour, visible.period)} key={hour} value={hour}>
						{hour}
					</option>
				))}
			</AdsSelect>
			<span aria-hidden="true" className="ads-time-picker__separator text-text-muted">
				:
			</span>
			<AdsSelect
				{...shared}
				aria-label={labels.minute}
				className="ads-time-picker__minute min-w-0 flex-[1_1_5rem]"
				id={id ? id + '-minute' : undefined}
				onChange={(event) => update('minute', event.target.value)}
				value={visible.minute}
			>
				<option value="">{labels.chooseMinute}</option>
				{minuteOptions.map((minute) => (
					<option disabled={!minuteAllowed(Number(minute), visible)} key={minute} value={minute}>
						{minute}
					</option>
				))}
			</AdsSelect>
			{format === '12h' ? (
				<AdsSelect
					aria-describedby={describedBy}
					aria-invalid={invalid || undefined}
					aria-label={labels.period}
					className="ads-time-picker__period min-w-0 flex-[1_1_5rem]"
					disabled={disabled}
					id={id ? id + '-period' : undefined}
					onChange={(event) => update('period', event.target.value)}
					size={size}
					validationState={invalid ? 'error' : validationState}
					value={visible.period}
				>
					<option disabled={!hourOptions.some((hour) => hourHasChoices(hour, 'AM'))} value="AM">
						AM
					</option>
					<option disabled={!hourOptions.some((hour) => hourHasChoices(hour, 'PM'))} value="PM">
						PM
					</option>
				</AdsSelect>
			) : null}
			{name ? (
				<input
					disabled={disabled}
					name={name}
					type="hidden"
					value={parsed !== null && allowed(parsed) ? current! : ''}
				/>
			) : null}
		</div>
	);
}
