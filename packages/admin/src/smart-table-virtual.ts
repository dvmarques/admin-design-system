export interface AdsSmartTableVirtualization {
	/** Altura fixa de cada linha, em pixels. O conteúdo das células deve caber nela. */
	rowHeight: number;
	/** Altura máxima da região rolável, em pixels. */
	height: number;
	/** Linhas extras renderizadas acima e abaixo da janela visível. Padrão: 6. */
	overscan?: number;
}

export type VirtualSlice = { type: 'row'; index: number } | { type: 'spacer'; height: number };

export function isValidVirtualization(
	value: AdsSmartTableVirtualization | undefined,
): value is AdsSmartTableVirtualization {
	return (
		value !== undefined &&
		Number.isFinite(value.rowHeight) &&
		value.rowHeight > 0 &&
		Number.isFinite(value.height) &&
		value.height > 0
	);
}

/**
 * Janela de linhas a renderizar: as visíveis mais o overscan, e opcionalmente a linha com foco,
 * que não pode ser desmontada. Lacunas viram espaçadores para preservar a altura total.
 */
export function getVirtualSlices({
	count,
	focusedIndex,
	height,
	overscan,
	rowHeight,
	scrollTop,
}: {
	count: number;
	focusedIndex: number | null;
	height: number;
	overscan: number;
	rowHeight: number;
	scrollTop: number;
}): VirtualSlice[] {
	if (count <= 0) return [];
	const top = Math.max(0, Number.isFinite(scrollTop) ? scrollTop : 0);
	const extra = Math.max(0, Math.floor(overscan));
	const start = Math.min(count - 1, Math.max(0, Math.floor(top / rowHeight) - extra));
	const end = Math.min(count, Math.ceil((top + height) / rowHeight) + extra);
	const wanted = new Set<number>();
	for (let index = start; index < Math.max(end, start + 1); index += 1) wanted.add(index);
	// A linha focada e suas vizinhas ficam montadas: o próximo Tab alcança a vizinha, o navegador
	// a rola para a vista e a janela acompanha.
	if (focusedIndex !== null && focusedIndex >= 0 && focusedIndex < count)
		for (const index of [focusedIndex - 1, focusedIndex, focusedIndex + 1])
			if (index >= 0 && index < count) wanted.add(index);
	const indexes = [...wanted].sort((a, b) => a - b);

	const slices: VirtualSlice[] = [];
	let next = 0;
	for (const index of indexes) {
		if (index > next) slices.push({ type: 'spacer', height: (index - next) * rowHeight });
		slices.push({ type: 'row', index });
		next = index + 1;
	}
	if (next < count) slices.push({ type: 'spacer', height: (count - next) * rowHeight });
	return slices;
}
