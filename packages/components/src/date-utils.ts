/** Internal calendar helpers: ISO `YYYY-MM-DD` strings and `Intl`, no time zones, no dependencies. */

export interface CalendarDate {
	year: number;
	month: number; // 1-12
	day: number;
}

const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const minYear = 1000;
const maxYear = 9999;

export function daysInMonth(year: number, month: number) {
	return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isValidDate({ year, month, day }: CalendarDate) {
	return (
		Number.isInteger(year) &&
		year >= minYear &&
		year <= maxYear &&
		month >= 1 &&
		month <= 12 &&
		day >= 1 &&
		day <= daysInMonth(year, month)
	);
}

export function parseIso(value: string | null | undefined): CalendarDate | null {
	const match = value ? isoPattern.exec(value) : null;
	if (!match) return null;
	const date = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
	return isValidDate(date) ? date : null;
}

const pad = (value: number, length: number) => String(value).padStart(length, '0');

export function toIso({ year, month, day }: CalendarDate) {
	return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

export function toUtc({ year, month, day }: CalendarDate) {
	return new Date(Date.UTC(year, month - 1, day));
}

function fromUtc(date: Date): CalendarDate {
	return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function addDays(date: CalendarDate, amount: number) {
	const next = toUtc(date);
	next.setUTCDate(next.getUTCDate() + amount);
	return clampYear(fromUtc(next));
}

/** Moves by months, keeping the day when possible (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(date: CalendarDate, amount: number) {
	const index = date.year * 12 + (date.month - 1) + amount;
	const year = Math.floor(index / 12);
	const month = (index % 12) + 1;
	return clampYear({ year, month, day: Math.min(date.day, daysInMonth(year, month)) });
}

function clampYear(date: CalendarDate): CalendarDate {
	if (date.year < minYear) return { year: minYear, month: 1, day: 1 };
	if (date.year > maxYear) return { year: maxYear, month: 12, day: 31 };
	return date;
}

/** Day of week, 0 = Sunday. */
export function weekday(date: CalendarDate) {
	return toUtc(date).getUTCDay();
}

export function resolveLocale(locale: string) {
	try {
		return Intl.getCanonicalLocales(locale)[0] ?? 'pt-BR';
	} catch {
		return 'pt-BR';
	}
}

const sundayFirstRegions = new Set([
	'AG',
	'AS',
	'BR',
	'BS',
	'BT',
	'BW',
	'BZ',
	'CA',
	'CO',
	'DM',
	'DO',
	'ET',
	'GT',
	'GU',
	'HK',
	'HN',
	'ID',
	'IL',
	'IN',
	'JM',
	'JP',
	'KE',
	'KH',
	'KR',
	'LA',
	'MH',
	'MM',
	'MO',
	'MT',
	'MX',
	'MZ',
	'NI',
	'NP',
	'PA',
	'PE',
	'PH',
	'PK',
	'PR',
	'PT',
	'PY',
	'SA',
	'SG',
	'SV',
	'TH',
	'TT',
	'TW',
	'UM',
	'US',
	'VE',
	'VI',
	'WS',
	'YE',
	'ZA',
	'ZW',
]);

/** Returns 0 (Sunday) to 6 (Saturday). Uses `Intl.Locale` week info when available. */
export function defaultFirstDayOfWeek(locale: string): number {
	try {
		const intlLocale = new Intl.Locale(locale) as Intl.Locale & {
			getWeekInfo?: () => { firstDay: number };
			weekInfo?: { firstDay: number };
		};
		const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
		if (info) return info.firstDay % 7;
		const region = intlLocale.maximize().region;
		return region && sundayFirstRegions.has(region) ? 0 : 1;
	} catch {
		return 0;
	}
}

export function formatMonthTitle(locale: string, year: number, month: number) {
	return new Intl.DateTimeFormat(locale, {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(toUtc({ year, month, day: 1 }));
}

export function formatLongDate(locale: string, date: CalendarDate) {
	return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(
		toUtc(date),
	);
}

/** Weekday names starting at `firstDay`: `[narrow label, full name]`. */
export function weekdayNames(locale: string, firstDay: number) {
	const short = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
	const long = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
	return Array.from({ length: 7 }, (_, index) => {
		// 2023-01-01 is a Sunday.
		const date = new Date(Date.UTC(2023, 0, 1 + ((firstDay + index) % 7)));
		return { short: short.format(date), long: long.format(date) };
	});
}

type FormatPartType = 'day' | 'month' | 'year';

export interface DateFormat {
	order: FormatPartType[];
	separator: string;
}

/** Numeric `day/month/year` order and separator for a locale (e.g. `pt-BR` → day, month, year, `/`). */
export function getDateFormat(locale: string): DateFormat {
	const parts = new Intl.DateTimeFormat(locale, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: 'UTC',
		numberingSystem: 'latn',
	}).formatToParts(Date.UTC(2023, 10, 25));
	const order = parts
		.filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
		.map((part) => part.type as FormatPartType);
	const separator = parts.find((part) => part.type === 'literal')?.value.trim() || '/';
	return { order, separator };
}

export function formatDate(locale: string, date: CalendarDate | null) {
	if (!date) return '';
	const { order, separator } = getDateFormat(locale);
	const values: Record<FormatPartType, string> = {
		day: pad(date.day, 2),
		month: pad(date.month, 2),
		year: pad(date.year, 4),
	};
	return order.map((type) => values[type]).join(separator);
}

const placeholderWords: Record<string, Record<FormatPartType, string>> = {
	pt: { day: 'dd', month: 'mm', year: 'aaaa' },
	default: { day: 'dd', month: 'mm', year: 'yyyy' },
};

export function formatPlaceholder(locale: string) {
	const { order, separator } = getDateFormat(locale);
	const words = placeholderWords[locale.split('-')[0] ?? ''] ?? placeholderWords.default!;
	return order.map((type) => words[type]).join(separator);
}

/** Parses typed text using the locale's day/month/year order; also accepts ISO `YYYY-MM-DD`. */
export function parseTypedDate(locale: string, text: string): CalendarDate | null {
	const trimmed = text.trim();
	const iso = parseIso(trimmed);
	if (iso) return iso;
	const { order } = getDateFormat(locale);
	const pieces = trimmed.split(/[^\d]+/);
	if (pieces.length !== 3 || pieces.some((piece) => !/^\d+$/.test(piece))) return null;
	const values = {} as Record<FormatPartType, number>;
	order.forEach((type, index) => {
		values[type] = Number(pieces[index]);
	});
	const yearText = pieces[order.indexOf('year')]!;
	if (yearText.length !== 4) return null;
	const date = { year: values.year, month: values.month, day: values.day };
	return isValidDate(date) ? date : null;
}

export function compareIso(a: string, b: string) {
	return a < b ? -1 : a > b ? 1 : 0;
}
