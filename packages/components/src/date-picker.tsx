'use client';

import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	type KeyboardEvent,
} from 'react';
import { AdsButton } from './button.js';
import { classNames } from './class-names.js';
import {
	addDays,
	addMonths,
	compareIso,
	daysInMonth,
	defaultFirstDayOfWeek,
	formatDate,
	formatLongDate,
	formatMonthTitle,
	formatPlaceholder,
	parseIso,
	parseTypedDate,
	resolveLocale,
	toIso,
	weekday,
	weekdayNames,
	type CalendarDate,
} from './date-utils.js';
import type { AdsFormSize, AdsValidationState } from './form-types.js';
import { AdsIcon } from './icon.js';
import { AdsInput } from './input.js';
import { AdsPopover, type AdsOverlayPlacement } from './overlay-anchored.js';

/** A date range of ISO `YYYY-MM-DD` strings; `null` marks a missing end. */
export interface AdsDateRange {
	start: string | null;
	end: string | null;
}

/** Interface texts; the defaults are in pt-BR. */
export interface AdsDatePickerLabels {
	calendar?: string;
	date?: string;
	endDate?: string;
	nextMonth?: string;
	openCalendar?: string;
	/** Announced while a range waits for its second date; `{date}` is replaced by the pending start. */
	pendingStart?: string;
	previousMonth?: string;
	startDate?: string;
}

const defaultLabels: Required<AdsDatePickerLabels> = {
	calendar: 'Calendário',
	date: 'Data',
	endDate: 'Data final',
	nextMonth: 'Próximo mês',
	openCalendar: 'Abrir calendário',
	pendingStart: 'Início em {date}. Escolha a data final.',
	previousMonth: 'Mês anterior',
	startDate: 'Data inicial',
};

interface AdsDatePickerBaseProps {
	'aria-describedby'?: string;
	'aria-invalid'?: boolean | 'false' | 'true';
	'aria-label'?: string;
	className?: string;
	disabled?: boolean;
	/** 0 (Sunday) to 6 (Saturday). Defaults to the locale's first day of the week. */
	firstDayOfWeek?: number;
	id?: string;
	isDateDisabled?: (date: string) => boolean;
	labels?: AdsDatePickerLabels;
	/** BCP 47 tag. Defaults to `pt-BR`. */
	locale?: string;
	/** Latest selectable date, ISO `YYYY-MM-DD`. */
	max?: string;
	/** Earliest selectable date, ISO `YYYY-MM-DD`. */
	min?: string;
	placeholder?: string;
	placement?: AdsOverlayPlacement;
	size?: AdsFormSize;
	validationState?: AdsValidationState;
}

export interface AdsDatePickerSingleProps extends AdsDatePickerBaseProps {
	defaultValue?: string | null;
	mode?: 'single';
	/** Name of the hidden field that submits the ISO value. */
	name?: string;
	onValueChange?: (value: string | null) => void;
	value?: string | null;
}

export interface AdsDatePickerRangeProps extends AdsDatePickerBaseProps {
	defaultValue?: AdsDateRange;
	endName?: string;
	mode: 'range';
	onValueChange?: (value: AdsDateRange) => void;
	startName?: string;
	value?: AdsDateRange;
}

export type AdsDatePickerProps = AdsDatePickerSingleProps | AdsDatePickerRangeProps;

const emptyRange: AdsDateRange = { start: null, end: null };

function normalizeRange(value: string | null | undefined | AdsDateRange): AdsDateRange {
	if (value && typeof value === 'object') {
		return {
			start: parseIso(value.start) ? value.start : null,
			end: parseIso(value.end) ? value.end : null,
		};
	}
	return { start: parseIso(value) ? (value as string) : null, end: null };
}

const dayBase =
	'ads-date-picker__day inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm [font-family:inherit] transition-colors duration-[var(--ads-motion-normal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:bg-transparent max-md:h-10 max-md:w-10';
const dayStates = {
	edge: 'border-transparent bg-primary text-[var(--ads-color-on-primary)] hover:bg-primary-hover',
	inRange: 'border-transparent bg-surface-selected text-on-surface-selected',
	today: 'border-border-strong bg-transparent text-text hover:bg-surface-hover',
	normal: 'border-transparent bg-transparent text-text hover:bg-surface-hover',
} as const;

// AdsButton only dims the native `disabled`; the month buttons stay focusable with aria-disabled.
const monthNavClassName =
	'aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:translate-y-0 aria-disabled:hover:bg-transparent';

interface CalendarProps {
	anchor: string | null;
	firstDay: number;
	isSelectable: (iso: string) => boolean;
	labels: Required<AdsDatePickerLabels>;
	locale: string;
	max: string | undefined;
	min: string | undefined;
	onSelect: (iso: string) => void;
	pendingText: string;
	value: AdsDateRange;
}

function DatePickerCalendar({
	anchor,
	firstDay,
	isSelectable,
	labels,
	locale,
	max,
	min,
	onSelect,
	pendingText,
	value,
}: CalendarProps) {
	const titleId = useId();
	const gridRef = useRef<HTMLTableElement>(null);
	const shouldFocus = useRef(true);
	// Mounted only after the popover opens on the client, so reading the current date is safe here.
	const [focused, setFocused] = useState<CalendarDate>(() => {
		const selected = parseIso(value.start) ?? parseIso(value.end);
		if (selected) return selected;
		const now = new Date();
		let today = toIso({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
		if (min && compareIso(today, min) < 0) today = min;
		if (max && compareIso(today, max) > 0) today = max;
		return parseIso(today) ?? { year: now.getFullYear(), month: now.getMonth() + 1, day: 1 };
	});
	const todayIso = useMemo(() => {
		const now = new Date();
		return toIso({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
	}, []);
	const focusedIso = toIso(focused);

	useEffect(() => {
		if (!shouldFocus.current) return;
		shouldFocus.current = false;
		gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
	}, [focused]);

	const names = useMemo(() => weekdayNames(locale, firstDay), [firstDay, locale]);
	const offset = (weekday({ ...focused, day: 1 }) - firstDay + 7) % 7;
	const total = daysInMonth(focused.year, focused.month);
	const cells: Array<number | null> = [
		...Array.from({ length: offset }, () => null),
		...Array.from({ length: total }, (_, index) => index + 1),
	];
	while (cells.length % 7 !== 0) cells.push(null);
	const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
		cells.slice(index * 7, index * 7 + 7),
	);

	const monthStartIso = toIso({ ...focused, day: 1 });
	const monthEndIso = toIso({ ...focused, day: total });
	const canGoBack = !min || compareIso(min, monthStartIso) < 0;
	const canGoForward = !max || compareIso(max, monthEndIso) > 0;

	const moveFocus = (next: CalendarDate) => {
		shouldFocus.current = true;
		setFocused(next);
	};
	const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
		const sinceWeekStart = (weekday(focused) - firstDay + 7) % 7;
		const years = event.shiftKey ? 12 : 1;
		const next =
			event.key === 'ArrowLeft'
				? addDays(focused, -1)
				: event.key === 'ArrowRight'
					? addDays(focused, 1)
					: event.key === 'ArrowUp'
						? addDays(focused, -7)
						: event.key === 'ArrowDown'
							? addDays(focused, 7)
							: event.key === 'Home'
								? addDays(focused, -sinceWeekStart)
								: event.key === 'End'
									? addDays(focused, 6 - sinceWeekStart)
									: event.key === 'PageUp'
										? addMonths(focused, -years)
										: event.key === 'PageDown'
											? addMonths(focused, years)
											: null;
		if (!next) return;
		event.preventDefault();
		const nextIso = toIso(next);
		const bounded =
			min && compareIso(nextIso, min) < 0
				? parseIso(min)
				: max && compareIso(nextIso, max) > 0
					? parseIso(max)
					: next;
		moveFocus(bounded ?? next);
	};

	const rangeStart = value.start;
	const rangeEnd = value.end;

	return (
		// The popover content is a React child of the toggling anchor, so clicks must not bubble to it.
		<div
			className="ads-date-picker__calendar flex flex-col gap-2"
			onClick={(event) => event.stopPropagation()}
		>
			<div className="ads-date-picker__header flex items-center justify-between gap-2">
				<AdsButton
					aria-disabled={canGoBack ? undefined : true}
					aria-label={labels.previousMonth}
					className={monthNavClassName}
					onClick={() => canGoBack && setFocused(addMonths(focused, -1))}
					size="sm"
					type="button"
					variant="ghost"
				>
					<AdsIcon name="chevronLeft" size="sm" />
				</AdsButton>
				<div
					aria-live="polite"
					className="ads-date-picker__title text-sm font-semibold text-text first-letter:uppercase"
					id={titleId}
				>
					{formatMonthTitle(locale, focused.year, focused.month)}
				</div>
				<AdsButton
					aria-disabled={canGoForward ? undefined : true}
					aria-label={labels.nextMonth}
					className={monthNavClassName}
					onClick={() => canGoForward && setFocused(addMonths(focused, 1))}
					size="sm"
					type="button"
					variant="ghost"
				>
					<AdsIcon name="chevronRight" size="sm" />
				</AdsButton>
			</div>
			<table
				aria-labelledby={titleId}
				className="ads-date-picker__grid border-collapse"
				onKeyDown={onKeyDown}
				ref={gridRef}
				role="grid"
			>
				<thead>
					<tr>
						{names.map((name) => (
							<th
								abbr={name.long}
								className="pb-1 text-center text-xs font-medium capitalize text-text-muted"
								key={name.long}
								scope="col"
							>
								{name.short}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{weeks.map((week, weekIndex) => (
						<tr key={weekIndex}>
							{week.map((day, dayIndex) => {
								if (day === null) return <td key={dayIndex} role="gridcell" />;
								const date = { year: focused.year, month: focused.month, day };
								const iso = toIso(date);
								const selectable = isSelectable(iso);
								const isEdge = iso === rangeStart || iso === rangeEnd;
								const inRange =
									rangeStart !== null &&
									rangeEnd !== null &&
									compareIso(iso, rangeStart) > 0 &&
									compareIso(iso, rangeEnd) < 0;
								const selected = isEdge || inRange || iso === anchor;
								return (
									<td
										aria-selected={selected}
										className="p-0.5 text-center"
										key={dayIndex}
										role="gridcell"
									>
										<button
											aria-current={iso === todayIso ? 'date' : undefined}
											aria-disabled={selectable ? undefined : true}
											aria-label={formatLongDate(locale, date)}
											className={classNames(
												dayBase,
												isEdge || iso === anchor
													? dayStates.edge
													: inRange
														? dayStates.inRange
														: iso === todayIso
															? dayStates.today
															: dayStates.normal,
											)}
											data-date={iso}
											onClick={() => selectable && onSelect(iso)}
											tabIndex={iso === focusedIso ? 0 : -1}
											type="button"
										>
											{day}
										</button>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
			<p aria-live="polite" className="ads-date-picker__status sr-only">
				{pendingText}
			</p>
		</div>
	);
}

/** Selects a single date or a date range by typing or through an accessible calendar. */
export function AdsDatePicker(props: AdsDatePickerProps) {
	const {
		'aria-describedby': ariaDescribedBy,
		'aria-invalid': ariaInvalid,
		'aria-label': ariaLabel,
		className,
		disabled = false,
		id,
		isDateDisabled,
		max,
		min,
		placement = 'bottom',
		size = 'md',
		validationState = 'default',
	} = props;
	const isRange = props.mode === 'range';
	const locale = useMemo(() => resolveLocale(props.locale ?? 'pt-BR'), [props.locale]);
	const firstDay = props.firstDayOfWeek ?? defaultFirstDayOfWeek(locale);
	const labels = { ...defaultLabels, ...props.labels };
	const placeholder = props.placeholder ?? formatPlaceholder(locale);
	const minIso = parseIso(min) ? min : undefined;
	const maxIso = parseIso(max) ? max : undefined;

	const isControlled = props.value !== undefined;
	const [innerValue, setInnerValue] = useState<AdsDateRange>(() =>
		normalizeRange(props.defaultValue ?? emptyRange),
	);
	const current = isControlled ? normalizeRange(props.value) : innerValue;

	const [open, setOpen] = useState(false);
	const [anchor, setAnchor] = useState<string | null>(null);
	const [drafts, setDrafts] = useState<[string, string]>(() => [
		formatDate(locale, parseIso(current.start)),
		formatDate(locale, parseIso(current.end)),
	]);
	const [invalid, setInvalid] = useState<[boolean, boolean]>([false, false]);
	const popoverLabel = labels.calendar;

	useEffect(() => {
		setDrafts([
			formatDate(locale, parseIso(current.start)),
			formatDate(locale, parseIso(current.end)),
		]);
		setInvalid([false, false]);
	}, [current.start, current.end, locale]);

	const isSelectable = useCallback(
		(iso: string) =>
			(!minIso || compareIso(iso, minIso) >= 0) &&
			(!maxIso || compareIso(iso, maxIso) <= 0) &&
			!isDateDisabled?.(iso),
		[isDateDisabled, maxIso, minIso],
	);

	const commit = (next: AdsDateRange) => {
		if (next.start === current.start && next.end === current.end) return;
		if (!isControlled) setInnerValue(next);
		if (props.mode === 'range') props.onValueChange?.(next);
		else props.onValueChange?.(next.start);
	};

	const commitTyped = (index: 0 | 1, text: string) => {
		// Typing replaces any pending calendar start, so a later click starts a new range.
		setAnchor(null);
		const key = index === 0 ? 'start' : 'end';
		const flag = (value: boolean) =>
			setInvalid((previous) => (index === 0 ? [value, previous[1]] : [previous[0], value]));
		if (text.trim() === '') {
			flag(false);
			commit({ ...current, [key]: null });
			setDrafts((previous) => (index === 0 ? ['', previous[1]] : [previous[0], '']));
			return;
		}
		const parsed = parseTypedDate(locale, text);
		const iso = parsed ? toIso(parsed) : null;
		const next = iso ? { ...current, [key]: iso } : null;
		const ordered = !next || !next.start || !next.end || compareIso(next.start, next.end) <= 0;
		if (!iso || !next || !isSelectable(iso) || !ordered) {
			flag(true);
			return;
		}
		flag(false);
		setDrafts((previous) =>
			index === 0
				? [formatDate(locale, parsed), previous[1]]
				: [previous[0], formatDate(locale, parsed)],
		);
		commit(next);
	};

	const selectFromCalendar = (iso: string) => {
		if (!isRange) {
			commit({ start: iso, end: null });
			setOpen(false);
			return;
		}
		// The first click only marks the pending start; the value changes on the second click, so
		// closing the calendar in between keeps the previous range.
		if (anchor === null) {
			setAnchor(iso);
			return;
		}
		const [start, end] = compareIso(anchor, iso) <= 0 ? [anchor, iso] : [iso, anchor];
		setAnchor(null);
		commit({ start, end });
		setOpen(false);
	};

	const pendingDate = parseIso(anchor);
	const pendingText = pendingDate
		? labels.pendingStart.replace('{date}', formatLongDate(locale, pendingDate))
		: '';

	const changeOpen = (next: boolean) => {
		if (disabled) return;
		setAnchor(null);
		setOpen(next);
	};

	const inputProps = (index: 0 | 1) => {
		const inputId = index === 0 ? id : id ? `${id}-end` : undefined;
		const fallbackLabel = isRange ? (index === 0 ? labels.startDate : labels.endDate) : labels.date;
		const text = drafts[index];
		const committed = formatDate(locale, parseIso(index === 0 ? current.start : current.end));
		return {
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			'aria-label':
				index === 0 ? (ariaLabel ?? (id === undefined ? fallbackLabel : undefined)) : fallbackLabel,
			// Inside AdsField the end input is announced as "<field label> <end label>".
			'aria-labelledby': index === 1 && id ? `${id}-label ${inputId}` : undefined,
			autoComplete: 'off',
			disabled,
			id: inputId,
			inputMode: 'numeric' as const,
			onBlur: () => commitTyped(index, text),
			onChange: (event: { target: { value: string } }) => {
				const value = event.target.value;
				setDrafts((previous) => (index === 0 ? [value, previous[1]] : [previous[0], value]));
				setInvalid((previous) => (index === 0 ? [false, previous[1]] : [previous[0], false]));
			},
			onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
				if (event.key === 'Enter' && text !== committed) {
					event.preventDefault();
					commitTyped(index, text);
				}
				if (event.key === 'ArrowDown' && event.altKey) {
					event.preventDefault();
					changeOpen(true);
				}
			},
			placeholder,
			size,
			type: 'text' as const,
			validationState: invalid[index] ? ('error' as const) : validationState,
			value: text,
		};
	};

	return (
		<div
			className={classNames(
				'ads-date-picker flex w-full items-center gap-2',
				isRange ? 'ads-date-picker--range' : undefined,
				className,
			)}
			data-mode={isRange ? 'range' : 'single'}
		>
			<AdsInput {...inputProps(0)} />
			{isRange ? (
				<>
					<span aria-hidden="true" className="ads-date-picker__separator text-text-muted">
						–
					</span>
					<AdsInput {...inputProps(1)} />
				</>
			) : null}
			<AdsPopover
				aria-label={popoverLabel}
				content={
					<DatePickerCalendar
						anchor={anchor}
						firstDay={firstDay}
						isSelectable={isSelectable}
						labels={labels}
						locale={locale}
						max={maxIso}
						min={minIso}
						onSelect={selectFromCalendar}
						pendingText={pendingText}
						value={anchor === null ? current : { start: anchor, end: null }}
					/>
				}
				onOpenChange={changeOpen}
				open={open}
				placement={placement}
			>
				<AdsButton
					aria-haspopup="dialog"
					aria-label={labels.openCalendar}
					className="ads-date-picker__trigger shrink-0"
					disabled={disabled}
					size={size}
					type="button"
					variant="secondary"
				>
					<AdsIcon name="calendar" size="sm" />
				</AdsButton>
			</AdsPopover>
			{props.mode === 'range' ? (
				<>
					{props.startName ? (
						<input
							name={props.startName}
							disabled={disabled}
							type="hidden"
							value={current.start ?? ''}
						/>
					) : null}
					{props.endName ? (
						<input
							name={props.endName}
							disabled={disabled}
							type="hidden"
							value={current.end ?? ''}
						/>
					) : null}
				</>
			) : props.name ? (
				<input name={props.name} disabled={disabled} type="hidden" value={current.start ?? ''} />
			) : null}
		</div>
	);
}
