/** Verdadeiro quando o foco se perdeu para o documento (`body` ou `null`). */
export function isFocusLost(doc: Document = document): boolean {
	const active = doc.activeElement;
	return active === null || active === doc.body;
}

/**
 * Destino estável do foco após a barra de ações sumir: checkbox "selecionar todas" da página
 * ou a região rolável da tabela. Usa a estrutura do DOM, sem depender de rótulos fixos.
 */
export function getSmartTableSelectionFocusTarget(
	root: HTMLElement | null | undefined,
): HTMLElement | null {
	if (!root) return null;
	const selectAll = root.querySelector<HTMLInputElement>(
		'thead input[type="checkbox"]:not(:disabled)',
	);
	if (selectAll) return selectAll;
	return root.querySelector<HTMLElement>('.ads-smart-table-scroll');
}
