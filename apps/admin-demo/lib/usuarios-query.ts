import type { AdsSmartTableSort } from '@admin-ds/admin';
import type { SearchParams } from './url-search-params';

export function firstParam(value: string | string[] | undefined) {
	return [value].flat()[0];
}

export function normalizePage(raw: string | undefined, pageCount: number) {
	const parsed = Number.parseInt(raw ?? '1', 10);
	if (!Number.isFinite(parsed) || parsed < 1) return 1;
	return Math.min(parsed, Math.max(1, pageCount));
}

export function parseSort(raw: string | undefined): AdsSmartTableSort | null {
	if (!raw) return null;
	const [columnId, direction] = raw.split(':');
	if (!columnId || (direction !== 'asc' && direction !== 'desc')) return null;
	return { columnId, direction };
}

export function sortUsuarios<T extends { nome: string; perfil: string }>(
	rows: readonly T[],
	sort: AdsSmartTableSort | null,
) {
	if (!sort) return [...rows];
	const factor = sort.direction === 'asc' ? 1 : -1;
	return [...rows].sort((a, b) => {
		const left = sort.columnId === 'perfil' ? a.perfil : a.nome;
		const right = sort.columnId === 'perfil' ? b.perfil : b.nome;
		return left.localeCompare(right, 'pt-BR') * factor;
	});
}

export function readUsuariosParams(params: SearchParams) {
	const ordem = firstParam(params.ordem);
	return {
		pageRaw: firstParam(params.pagina),
		status: firstParam(params.status),
		sort: parseSort(ordem),
	};
}
