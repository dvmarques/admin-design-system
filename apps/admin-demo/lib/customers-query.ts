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
