import { restoreFocusAfterClearSelection } from './selection-clear-focus.js';

export const SELECT_ALL_CHECKBOX_SELECTOR =
	'input[type="checkbox"][aria-label="Selecionar todas as linhas da página"]';

export function findSelectionClearFocusTargets(root: ParentNode | null) {
	return {
		selectAll: root?.querySelector<HTMLInputElement>(SELECT_ALL_CHECKBOX_SELECTOR) ?? null,
		scrollRegion: root?.querySelector<HTMLElement>('.ads-smart-table-scroll') ?? null,
	};
}

export type PendingClearSelectionResult = 'idle' | 'waiting' | 'dropped' | 'applied';

/** Espelha o `useLayoutEffect` do exemplo em `docs/integration.md` (tabela inteligente). */
export function applyPendingClearSelectionFocus(
	pending: HTMLElement | null,
	root: HTMLElement | null,
	doc: Document = document,
): PendingClearSelectionResult {
	if (pending === null) return 'idle';
	const active = doc.activeElement;
	const focusLost = !active || active === doc.body;
	if (!focusLost && root && !root.contains(active)) return 'dropped';
	if (pending.isConnected) return 'waiting';
	if (!focusLost) return 'dropped';
	restoreFocusAfterClearSelection(pending, findSelectionClearFocusTargets(root), doc);
	return 'applied';
}
