export interface SelectionClearFocusTargets {
	selectAll?: HTMLElement | null;
	scrollRegion?: HTMLElement | null;
}

/**
 * Repõe o foco após "Limpar seleção" sumir: checkbox do cabeçalho ou região rolável da tabela.
 * Só age quando o botão acionado foi desconectado e o foco se perdeu (`body` ou `null`).
 */
export function restoreFocusAfterClearSelection(
	trigger: HTMLElement | null,
	targets: SelectionClearFocusTargets,
	doc: Document = document,
) {
	if (!trigger || trigger.isConnected) return;
	const active = doc.activeElement;
	const focusLost = !active || active === doc.body;
	if (!focusLost) return;
	const selectAll = targets.selectAll;
	if (selectAll && !selectAll.disabled) {
		selectAll.focus();
		return;
	}
	targets.scrollRegion?.focus();
}
