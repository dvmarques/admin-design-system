// Type-only import: this module is also used by a Client Component and must not ship the data.
import type { Customer, CustomerPlan, CustomerStatus } from './data/customers';

export type CustomersState = 'dados' | 'vazio' | 'carregando' | 'erro';

const demoStates = ['vazio', 'carregando', 'erro'] as const;

/** Takes the first value of a repeated search parameter. */
export function firstParam(value: string | string[] | undefined): string | undefined {
	return Array.isArray(value) ? value[0] : value;
}

/** Maps `?estado=` to a view state; absent or unknown values mean regular data. */
export function parseCustomersState(value: string | undefined): CustomersState {
	return demoStates.find((state) => state === value) ?? 'dados';
}

/**
 * Maps `?pagina=` to a valid page: absent, non-numeric and values below 1 become 1, decimals are
 * truncated and values above the last page become the last page.
 */
export function normalizePage(value: string | undefined, pageCount: number): number {
	const requested = value === undefined || value.trim() === '' ? Number.NaN : Number(value);
	if (!Number.isFinite(requested)) return 1;
	return Math.min(Math.max(1, Math.trunc(requested)), Math.max(1, pageCount));
}

export const customerStatuses: readonly CustomerStatus[] = ['Ativo', 'Pendente', 'Inativo'];
export const customerPlans: readonly CustomerPlan[] = ['Essencial', 'Profissional', 'Empresarial'];

export type CustomerSortColumn = 'name' | 'status' | 'plan' | 'orders' | 'since';
export const customerSortColumns: readonly CustomerSortColumn[] = [
	'name',
	'status',
	'plan',
	'orders',
	'since',
];

export interface CustomersSort {
	columnId: CustomerSortColumn;
	direction: 'asc' | 'desc';
}

/** Filters and sorting read from the URL; absent keys mean "no filter". */
export interface CustomersQuery {
	q: string;
	status: CustomerStatus | null;
	plans: CustomerPlan[];
	from: string | null;
	to: string | null;
	sort: CustomersSort | null;
}

const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Accepts only real calendar dates in ISO `YYYY-MM-DD`; anything else is ignored. */
export function parseIsoDate(value: string | undefined): string | null {
	const match = value ? isoDate.exec(value) : null;
	if (!match) return null;
	const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
	const date = new Date(Date.UTC(year, month - 1, day));
	const valid =
		date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
	return valid ? (value as string) : null;
}

/** Converts the demo's `DD/MM/YYYY` registration date to ISO so it can be compared as text. */
export function customerSinceIso(customer: Customer): string {
	const [day, month, year] = customer.since.split('/');
	return `${year}-${month}-${day}`;
}

export function parseCustomersSort(value: string | undefined): CustomersSort | null {
	const [columnId, direction] = (value ?? '').split(':');
	const column = customerSortColumns.find((candidate) => candidate === columnId);
	if (!column || (direction !== 'asc' && direction !== 'desc')) return null;
	return { columnId: column, direction };
}

export function formatCustomersSort(sort: CustomersSort | null): string | undefined {
	return sort ? `${sort.columnId}:${sort.direction}` : undefined;
}

/** Reads every filter parameter; unknown values are dropped instead of failing. */
export function parseCustomersQuery(params: Record<string, string | string[] | undefined>) {
	const status = customerStatuses.find((candidate) => candidate === firstParam(params.status));
	const plans = (firstParam(params.plano) ?? '')
		.split(',')
		.filter((value): value is CustomerPlan => customerPlans.some((plan) => plan === value));
	const from = parseIsoDate(firstParam(params.de));
	const to = parseIsoDate(firstParam(params.ate));
	const query: CustomersQuery = {
		q: (firstParam(params.q) ?? '').trim(),
		status: status ?? null,
		plans: customerPlans.filter((plan) => plans.includes(plan)),
		from,
		to,
		sort: parseCustomersSort(firstParam(params.ordem)),
	};
	return query;
}

const collator = new Intl.Collator('pt-BR');

function compare(column: CustomerSortColumn, a: Customer, b: Customer): number {
	switch (column) {
		case 'orders':
			return a.orders - b.orders;
		case 'since':
			return customerSinceIso(a).localeCompare(customerSinceIso(b));
		case 'status':
			return customerStatuses.indexOf(a.status) - customerStatuses.indexOf(b.status);
		case 'plan':
			return customerPlans.indexOf(a.plan) - customerPlans.indexOf(b.plan);
		default:
			return collator.compare(a.name, b.name);
	}
}

/** Pure and deterministic: the same query always yields the same ordered rows. */
export function applyCustomersQuery(
	query: CustomersQuery,
	source: readonly Customer[],
): Customer[] {
	const text = query.q.toLocaleLowerCase('pt-BR');
	const start = query.from;
	const end = query.to;
	const rows = source.filter((customer) => {
		if (text && !`${customer.name} ${customer.email}`.toLocaleLowerCase('pt-BR').includes(text)) {
			return false;
		}
		if (query.status && customer.status !== query.status) return false;
		if (query.plans.length > 0 && !query.plans.includes(customer.plan)) return false;
		const since = customerSinceIso(customer);
		if (start && since < start) return false;
		if (end && since > end) return false;
		return true;
	});
	const { sort } = query;
	if (!sort) return rows;
	const factor = sort.direction === 'asc' ? 1 : -1;
	// Array.prototype.sort is stable, so ties keep the source order.
	return rows.sort((a, b) => factor * compare(sort.columnId, a, b));
}

/** Builds `/clientes` hrefs from the active query, in a fixed parameter order. */
export function customersHref(
	query: CustomersQuery,
	extra: { page?: number; state?: CustomersState } = {},
): string {
	const search = new URLSearchParams();
	if (query.q) search.set('q', query.q);
	if (query.status) search.set('status', query.status);
	if (query.plans.length > 0) search.set('plano', query.plans.join(','));
	if (query.from) search.set('de', query.from);
	if (query.to) search.set('ate', query.to);
	const order = formatCustomersSort(query.sort);
	if (order) search.set('ordem', order);
	if (extra.page && extra.page > 1) search.set('pagina', String(extra.page));
	if (extra.state && extra.state !== 'dados') search.set('estado', extra.state);
	const text = search.toString();
	return text ? `/clientes?${text}` : '/clientes';
}
