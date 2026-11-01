import type { ReactNode } from 'react';

/** `null`, `undefined`, `false` e string vazia não ativam o estado vazio; qualquer número (incluindo 0) ativa. */
export function hasDashboardEmpty(empty: ReactNode | undefined): boolean {
	if (empty === null || empty === undefined || empty === false) return false;
	if (typeof empty === 'string') return empty.length > 0;
	if (typeof empty === 'number') return true;
	return true;
}
