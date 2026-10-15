'use client';

import { useCallback, useId, type ReactNode } from 'react';
import { AdsBulkActionBar, type AdsBulkActionBarLabels } from './bulk-action-bar.js';
import { classNames } from './class-names.js';
import { AdsFilterBar, type AdsFilterBarProps } from './filter-bar.js';
import { getSmartTableSelectionFocusTarget } from './selection-focus.js';
import { AdsSmartTable, type AdsSmartTableProps } from './smart-table.js';

export interface AdsListFlowProps<Row> extends Omit<AdsSmartTableProps<Row>, 'filters'> {
	/** Props de `AdsFilterBar`. Omitida, nenhuma barra de filtros é renderizada. */
	filterBar?: AdsFilterBarProps;
	/**
	 * Ações em massa (normalmente `AdsButton`). Com elas, `AdsBulkActionBar` aparece quando há
	 * itens em `selectedIds`.
	 */
	bulkActions?: ReactNode;
	/** Padrão: `onSelectionChange([])`. */
	onClearSelection?: () => void;
	bulkActionLabels?: Partial<AdsBulkActionBarLabels>;
}

/**
 * Fluxo de listagem: filtros, ações em massa, tabela inteligente e paginação. O estado é todo do
 * consumidor; o fluxo não busca, filtra, ordena nem pagina dados.
 */
export function AdsListFlow<Row>({
	bulkActionLabels,
	bulkActions,
	className,
	filterBar,
	id,
	labels,
	onClearSelection,
	onSelectionChange,
	selectedIds = [],
	...props
}: AdsListFlowProps<Row>) {
	const generatedId = useId();
	const rootId = id ?? generatedId;
	const focusTarget = useCallback(() => {
		return getSmartTableSelectionFocusTarget(document.getElementById(rootId));
	}, [rootId]);
	const clear = onClearSelection ?? (onSelectionChange ? () => onSelectionChange([]) : undefined);
	const hasBulk = bulkActions !== undefined && bulkActions !== null && bulkActions !== false;
	const filters =
		filterBar || hasBulk ? (
			<>
				{filterBar ? <AdsFilterBar {...filterBar} /> : null}
				{hasBulk ? (
					<AdsBulkActionBar
						{...(bulkActionLabels && { labels: bulkActionLabels })}
						{...(clear && { onClear: clear })}
						getFocusTargetOnEmpty={focusTarget}
						selectedCount={selectedIds.length}
					>
						{bulkActions}
					</AdsBulkActionBar>
				) : null}
			</>
		) : undefined;
	return (
		<AdsSmartTable<Row>
			{...props}
			className={classNames('ads-list-flow', className)}
			id={rootId}
			{...(filters && { filters })}
			// A contagem é anunciada pela barra de ações em massa; evita o anúncio duplicado.
			labels={{ ...labels, ...(hasBulk && { selectedCount: () => '' }) }}
			{...(onSelectionChange && { onSelectionChange })}
			selectedIds={selectedIds}
		/>
	);
}
