'use client';

import {
	AdsButton,
	AdsCheckbox,
	AdsEmptyState,
	AdsPagination,
	AdsRadio,
	AdsSelectionGroup,
	AdsSkeleton,
	AdsTable,
	type AdsTableDensity,
	AdsTableBody,
	AdsTableCaption,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
	type AdsPaginationProps,
	type AdsTableAlignment,
} from '@admin-ds/components';
import {
	useEffect,
	useId,
	useRef,
	useState,
	type HTMLAttributes,
	type KeyboardEvent,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';

export type AdsSmartTableSortDirection = 'asc' | 'desc';
export type AdsSmartTableSelectionMode = 'multiple' | 'single';

export interface AdsSmartTableSort {
	columnId: string;
	direction: AdsSmartTableSortDirection;
}

export interface AdsSmartTableColumn<Row> {
	/** Identificador estável da coluna, usado em `sort` e `hiddenColumnIds`. */
	id: string;
	/** Texto do cabeçalho; também nomeia o botão de ordenação e a opção do seletor de colunas. */
	label: string;
	cell: (row: Row, index: number) => ReactNode;
	align?: AdsTableAlignment;
	/** Exibe o botão de ordenação quando `onSortChange` é informado. */
	sortable?: boolean;
	/** Quando `false`, a coluna não pode ser ocultada. Padrão: `true`. */
	hideable?: boolean;
	headerClassName?: string;
	cellClassName?: string;
}

export interface AdsSmartTableLabels {
	selectAll: string;
	selectionColumn: string;
	selectRow: (rowLabel: string) => string;
	/**
	 * Contagem da seleção. `count` inclui ids de outras páginas; `onPage` conta só as linhas
	 * selecionadas da página exibida.
	 */
	selectedCount: (count: number, onPage: number) => string;
	columns: string;
	columnsPanel: string;
	loading: string;
	emptyTitle: string;
	emptyDescription: string;
	errorTitle: string;
	retry: string;
	sortedBy: (column: string, direction: AdsSmartTableSortDirection) => string;
	sortCleared: string;
	scrollRegion: string;
}

const defaultLabels: AdsSmartTableLabels = {
	selectAll: 'Selecionar todas as linhas da página',
	selectionColumn: 'Seleção',
	selectRow: (rowLabel) => `Selecionar ${rowLabel}`,
	selectedCount: (count, onPage) => {
		const total = count === 1 ? '1 linha selecionada' : `${count} linhas selecionadas`;
		return onPage === count ? total : `${total}, ${onPage} nesta página`;
	},
	columns: 'Colunas',
	columnsPanel: 'Colunas visíveis',
	loading: 'Carregando dados',
	emptyTitle: 'Nenhum registro encontrado',
	emptyDescription: 'Não há linhas para exibir.',
	errorTitle: 'Não foi possível carregar os dados',
	retry: 'Tentar novamente',
	sortedBy: (column, direction) =>
		`Ordenado por ${column}, ${direction === 'asc' ? 'ascendente' : 'descendente'}`,
	sortCleared: 'Ordenação removida',
	scrollRegion: 'Tabela rolável',
};

export interface AdsSmartTableProps<Row> extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'children' | 'onSelect'
> {
	/** Legenda e nome acessível da tabela. */
	caption: ReactNode;
	hideCaption?: boolean;
	columns: readonly AdsSmartTableColumn<Row>[];
	/** Linhas já filtradas, ordenadas e paginadas pelo consumidor. */
	rows: readonly Row[];
	getRowId: (row: Row) => string;
	/** Texto que nomeia o controle de seleção da linha. Padrão: o id da linha. */
	getRowLabel?: (row: Row) => string;
	sort?: AdsSmartTableSort | null;
	onSortChange?: (next: AdsSmartTableSort | null) => void;
	selectionMode?: AdsSmartTableSelectionMode;
	selectedIds?: readonly string[];
	/** Habilita a coluna de seleção. Recebe a lista completa de ids selecionados. */
	onSelectionChange?: (ids: string[]) => void;
	isRowSelectable?: (row: Row) => boolean;
	hiddenColumnIds?: readonly string[];
	/** Habilita o seletor de colunas. Recebe a lista completa de colunas ocultas. */
	onHiddenColumnsChange?: (ids: string[]) => void;
	/** Densidade das células. Sem a prop, vale a herdada de um ancestral ou a confortável. */
	density?: AdsTableDensity;
	loading?: boolean;
	loadingRows?: number;
	error?: ReactNode;
	onRetry?: () => void;
	emptyState?: ReactNode;
	/** Conteúdo opcional acima da tabela, por exemplo um `AdsFilterBar`. */
	filters?: ReactNode;
	/** Paginação opcional, abaixo da tabela. */
	pagination?: AdsPaginationProps;
	labels?: Partial<AdsSmartTableLabels>;
}

const emptyIds: readonly string[] = [];

/** Cabeçalho e linhas de estado (vazio, erro e carregamento), sem realce de hover. */
function StaticRow({ children }: { children: ReactNode }) {
	return <AdsTableRow interactive={false}>{children}</AdsTableRow>;
}

function SortIndicator({ direction }: { direction: AdsSmartTableSortDirection | null }) {
	return (
		<svg
			aria-hidden="true"
			className="ads-smart-table-sort-icon"
			data-direction={direction ?? 'none'}
			fill="none"
			focusable="false"
			height="16"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			width="16"
		>
			<path d="m8 9 4-4 4 4" data-part="up" />
			<path d="m8 15 4 4 4-4" data-part="down" />
		</svg>
	);
}

/** Tabela administrativa controlada: ordenação, seleção, colunas e estados, sem lógica de dados. */
export function AdsSmartTable<Row>({
	caption,
	className,
	columns,
	density,
	emptyState,
	error,
	filters,
	getRowId,
	getRowLabel,
	hiddenColumnIds = emptyIds,
	hideCaption = false,
	isRowSelectable,
	labels: labelOverrides,
	loading = false,
	loadingRows = 5,
	onHiddenColumnsChange,
	onRetry,
	onSelectionChange,
	onSortChange,
	pagination,
	rows,
	selectedIds = emptyIds,
	selectionMode = 'multiple',
	sort = null,
	...props
}: AdsSmartTableProps<Row>) {
	const labels = { ...defaultLabels, ...labelOverrides };
	const baseId = useId();
	const captionId = `${baseId}-caption`;
	const panelId = `${baseId}-columns`;
	const [columnsOpen, setColumnsOpen] = useState(false);
	const [sortMessage, setSortMessage] = useState('');
	const columnsButtonRef = useRef<HTMLButtonElement>(null);
	const selectAllRef = useRef<HTMLSpanElement>(null);

	const hidden = new Set(hiddenColumnIds);
	const visibleColumns = columns.filter((column) => !hidden.has(column.id));
	const selectable = onSelectionChange !== undefined;
	const selected = new Set(selectedIds);
	const hasError = error !== undefined && error !== false && error !== null;
	const blocked = loading || hasError;

	const pageRows = rows.map((row) => ({
		row,
		id: getRowId(row),
		enabled: isRowSelectable ? isRowSelectable(row) : true,
	}));
	const selectableIds = pageRows.filter((item) => item.enabled).map((item) => item.id);
	const selectedOnPage = selectableIds.filter((id) => selected.has(id)).length;
	const selectedVisible = pageRows.filter((item) => selected.has(item.id)).length;
	const allSelected = selectableIds.length > 0 && selectedOnPage === selectableIds.length;
	const partiallySelected = selectedOnPage > 0 && !allSelected;

	useEffect(() => {
		const input = selectAllRef.current?.querySelector('input');
		if (input) input.indeterminate = partiallySelected;
	}, [partiallySelected, allSelected, selectable]);

	const toggleAll = () => {
		if (!onSelectionChange) return;
		const pageIds = new Set(selectableIds);
		const others = selectedIds.filter((id) => !pageIds.has(id));
		onSelectionChange(allSelected ? others : [...others, ...selectableIds]);
	};

	const toggleRow = (id: string, checked: boolean) => {
		if (!onSelectionChange) return;
		if (selectionMode === 'single') {
			onSelectionChange(checked ? [id] : []);
			return;
		}
		onSelectionChange(
			checked ? [...selectedIds.filter((x) => x !== id), id] : selectedIds.filter((x) => x !== id),
		);
	};

	const changeSort = (column: AdsSmartTableColumn<Row>) => {
		if (!onSortChange) return;
		let next: AdsSmartTableSort | null = null;
		if (sort?.columnId !== column.id) next = { columnId: column.id, direction: 'asc' };
		else if (sort.direction === 'asc') next = { columnId: column.id, direction: 'desc' };
		setSortMessage(next ? labels.sortedBy(column.label, next.direction) : labels.sortCleared);
		onSortChange(next);
	};

	const toggleColumn = (id: string, visible: boolean) => {
		if (!onHiddenColumnsChange) return;
		onHiddenColumnsChange(
			visible
				? hiddenColumnIds.filter((x) => x !== id)
				: [...hiddenColumnIds.filter((x) => x !== id), id],
		);
	};

	const closeColumns = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key !== 'Escape' || !columnsOpen) return;
		event.stopPropagation();
		setColumnsOpen(false);
		columnsButtonRef.current?.focus();
	};

	const selectedCount = selectedIds.length;
	const colSpan = Math.max(1, visibleColumns.length + (selectable ? 1 : 0));
	const showToolbar = selectable || onHiddenColumnsChange !== undefined;

	let body: ReactNode;
	if (hasError) {
		body = (
			<AdsEmptyState
				actions={onRetry ? <AdsButton onClick={onRetry}>{labels.retry}</AdsButton> : undefined}
				description={error === true ? undefined : error}
				role="alert"
				title={labels.errorTitle}
			/>
		);
	} else if (!loading && pageRows.length === 0) {
		body = emptyState ?? (
			<AdsEmptyState description={labels.emptyDescription} title={labels.emptyTitle} />
		);
	}

	return (
		<div
			{...props}
			className={classNames('ads-smart-table', className)}
			data-loading={loading ? '' : undefined}
		>
			{filters ? <div className="ads-smart-table-filters">{filters}</div> : null}
			{showToolbar ? (
				<div className="ads-smart-table-toolbar" onKeyDown={closeColumns}>
					<span aria-live="polite" className="ads-smart-table-selection-summary" role="status">
						{selectable && selectedCount > 0
							? labels.selectedCount(selectedCount, selectedVisible)
							: null}
					</span>
					{onHiddenColumnsChange ? (
						<>
							<div className="ads-smart-table-columns">
								<AdsButton
									aria-controls={panelId}
									aria-expanded={columnsOpen}
									onClick={() => setColumnsOpen((open) => !open)}
									ref={columnsButtonRef}
									size="sm"
									variant="secondary"
								>
									{labels.columns}
								</AdsButton>
							</div>
							{/* Painel inline: ocupa a própria linha da barra e empurra a tabela, sem sobrepor. */}
							<div className="ads-smart-table-columns-panel" hidden={!columnsOpen} id={panelId}>
								<AdsSelectionGroup legend={labels.columnsPanel}>
									{columns.map((column) => {
										const visible = !hidden.has(column.id);
										return (
											<AdsCheckbox
												checked={visible}
												disabled={
													column.hideable === false || (visible && visibleColumns.length === 1)
												}
												key={column.id}
												label={column.label}
												onChange={(event) => toggleColumn(column.id, event.target.checked)}
											/>
										);
									})}
								</AdsSelectionGroup>
							</div>
						</>
					) : null}
				</div>
			) : null}
			<AdsTable
				{...(density && { density })}
				aria-busy={loading ? true : undefined}
				containerClassName="ads-smart-table-scroll"
				containerProps={{
					'aria-labelledby': captionId,
					role: 'region',
					tabIndex: 0,
				}}
			>
				<AdsTableCaption
					className={hideCaption ? 'ads-smart-table-visually-hidden' : undefined}
					id={captionId}
				>
					{caption}
				</AdsTableCaption>
				<AdsTableHead>
					<StaticRow>
						{selectable ? (
							<AdsTableHeader className="ads-smart-table-select-cell">
								{selectionMode === 'multiple' ? (
									<span ref={selectAllRef}>
										<AdsCheckbox
											aria-label={labels.selectAll}
											checked={allSelected}
											disabled={blocked || selectableIds.length === 0}
											onChange={toggleAll}
										/>
									</span>
								) : (
									<span className="ads-smart-table-visually-hidden">{labels.selectionColumn}</span>
								)}
							</AdsTableHeader>
						) : null}
						{visibleColumns.map((column) => {
							const sortable = column.sortable === true && onSortChange !== undefined;
							const direction = sort?.columnId === column.id ? sort.direction : null;
							return (
								<AdsTableHeader
									align={column.align ?? 'start'}
									aria-sort={
										sortable
											? direction === 'asc'
												? 'ascending'
												: direction === 'desc'
													? 'descending'
													: 'none'
											: undefined
									}
									className={classNames(column.headerClassName)}
									key={column.id}
								>
									{sortable ? (
										<button
											className="ads-smart-table-sort"
											onClick={() => changeSort(column)}
											type="button"
										>
											<span>{column.label}</span>
											<SortIndicator direction={direction} />
										</button>
									) : (
										column.label
									)}
								</AdsTableHeader>
							);
						})}
					</StaticRow>
				</AdsTableHead>
				<AdsTableBody>
					{body ? (
						<StaticRow>
							<AdsTableCell className="ads-smart-table-state" colSpan={colSpan}>
								{body}
							</AdsTableCell>
						</StaticRow>
					) : loading ? (
						Array.from({ length: Math.max(1, loadingRows) }, (_, index) => (
							<StaticRow key={index}>
								{Array.from({ length: colSpan }, (_, cell) => (
									<AdsTableCell key={cell}>
										<AdsSkeleton className="ads-smart-table-skeleton" variant="text" />
									</AdsTableCell>
								))}
							</StaticRow>
						))
					) : (
						pageRows.map(({ enabled, id, row }, index) => {
							const isSelected = selected.has(id);
							const rowLabel = getRowLabel ? getRowLabel(row) : id;
							return (
								<AdsTableRow data-selected={isSelected ? '' : undefined} key={id}>
									{selectable ? (
										<AdsTableCell className="ads-smart-table-select-cell">
											{selectionMode === 'multiple' ? (
												<AdsCheckbox
													aria-label={labels.selectRow(rowLabel)}
													checked={isSelected}
													disabled={!enabled}
													onChange={(event) => toggleRow(id, event.target.checked)}
												/>
											) : (
												<AdsRadio
													aria-label={labels.selectRow(rowLabel)}
													checked={isSelected}
													disabled={!enabled}
													name={`${baseId}-selection`}
													onChange={(event) => toggleRow(id, event.target.checked)}
												/>
											)}
										</AdsTableCell>
									) : null}
									{visibleColumns.map((column) => (
										<AdsTableCell
											align={column.align ?? 'start'}
											className={classNames(column.cellClassName)}
											key={column.id}
										>
											{column.cell(row, index)}
										</AdsTableCell>
									))}
								</AdsTableRow>
							);
						})
					)}
				</AdsTableBody>
			</AdsTable>
			{pagination ? (
				<div className="ads-smart-table-pagination">
					<AdsPagination {...pagination} />
				</div>
			) : null}
			{/*
			 * Regiões separadas: o fim de um carregamento não reescreve a região da ordenação, então
			 * o último "Ordenado por…" não é anunciado de novo a cada carga (por exemplo, ao paginar).
			 */}
			<div className="ads-smart-table-status" data-status="loading" role="status">
				{loading ? labels.loading : null}
			</div>
			<div className="ads-smart-table-status" data-status="sort" role="status">
				{sortMessage}
			</div>
		</div>
	);
}
