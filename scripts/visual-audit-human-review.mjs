/**
 * Contrato de revisão humana na auditoria visual: `Aprovado (revisor, DD/MM/AAAA)`.
 */

const APPROVED_PREFIX = 'Aprovado (';

/** @param {string} value */
export function parseApprovedHumanReview(value) {
	const text = String(value ?? '').trim();
	if (!text.startsWith(APPROVED_PREFIX) || !text.endsWith(')')) return null;
	const inner = text.slice(APPROVED_PREFIX.length, -1);
	const comma = inner.lastIndexOf(',');
	if (comma < 0) return null;
	const reviewer = inner.slice(0, comma).trim();
	const datePart = inner.slice(comma + 1).trim();
	const dateMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(datePart);
	if (!reviewer || !dateMatch) return null;
	const day = Number(dateMatch[1]);
	const month = Number(dateMatch[2]);
	const year = Number(dateMatch[3]);
	if (!isValidCalendarDate(day, month, year)) return null;
	return { reviewer, date: datePart, day, month, year };
}

/**
 * @param {number} day
 * @param {number} month 1–12
 * @param {number} year
 */
export function isValidCalendarDate(day, month, year) {
	if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
		return false;
	}
	if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) {
		return false;
	}
	const probe = new Date(year, month - 1, day);
	return probe.getFullYear() === year && probe.getMonth() === month - 1 && probe.getDate() === day;
}

/** @param {unknown} value */
export function isApprovedHumanReview(value) {
	return parseApprovedHumanReview(value) !== null;
}

const INVENTORY_STATIC_STATUSES = new Set([
	'Pendente',
	'Em análise',
	'Sem divergência',
	'Divergência confirmada',
	'Não aplicável',
]);

/** Status da coluna Inspeção do inventário (sem aprovação humana datada). */
export function isStaticInspectionStatus(value) {
	return INVENTORY_STATIC_STATUSES.has(String(value ?? '').trim());
}

/** Status válido na matriz de inspeção: estático ou aprovação humana completa. */
export function isValidInspectionStatus(value) {
	const text = String(value ?? '').trim();
	return isStaticInspectionStatus(text) || isApprovedHumanReview(text);
}

/** Valor `review` válido na matriz de cobertura: Pendente ou aprovação completa. */
export function isValidCoverageReviewStatus(value) {
	const text = String(value ?? '').trim();
	if (text === 'Pendente') return true;
	return isApprovedHumanReview(text);
}
