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
} from '@dvmarques/admin-ds-components';
import {
	useEffect,
	useId,
	useRef,
	useState,
	type CSSProperties,
	type HTMLAttributes,
	type KeyboardEvent,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';
import type { AdsSmartTableExport, AdsSmartTableExportValue } from './smart-table-export.js';
import {
	clampWidth,
	defaultColumnMaxWidth,
	defaultColumnMinWidth,
	defaultColumnWidth,
	SmartTableResizer,
} from './smart-table-resizer.js';
import {
	getVirtualSlices,
	isValidVirtualization,
	type AdsSmartTableVirtualization,
} from './smart-table-virtual.js';

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
	/** Com `onColumnWidthsChange`, quando `false`, a coluna não ganha alça de redimensionamento. */
	resizable?: boolean;
	/** Largura mínima, em pixels, ao redimensionar. Padrão: 80. */
	minWidth?: number;
	/** Largura máxima, em pixels, ao redimensionar. Padrão: 640. */
	maxWidth?: number;
	/** Largura exposta à tecnologia assistiva enquanto a coluna não foi medida. Padrão: 160. */
	defaultWidth?: number;
	/** Quando `false`, a coluna não entra nos dados de `onExport`. Padrão: `true`. */
	exportable?: boolean;
	/**
	 * Valor da célula na exportação. Sem ele, usa o retorno de `cell` quando for texto ou número;
	 * conteúdo React vira `null`.
	 */
	exportValue?: (row: Row, index: number) => AdsSmartTableExportValue;
}

export interface AdsSmartTableLabels {
	pageSize?: string;
	pageSummary?: (first: number, last: number, total: number) => string;
	emptyPage?: string;
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
	/** Texto do botão de exportação (`onExport`). */
	export?: string;
	/** Nome acessível da alça de redimensionamento de uma coluna. */
	resizeColumn?: (column: string) => string;
	/** Texto de valor da alça de redimensionamento, lido por tecnologia assistiva. */
	resizeValue?: (width: number) => string;
}

const defaultLabels: Required<AdsSmartTableLabels> = {
	pageSize: 'Registros por página',
	pageSummary: (first, last, total) => `Exibindo ${first}–${last} de ${total} registros`,
	emptyPage: 'Nenhum registro nesta página',
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
	export: 'Exportar',
	resizeColumn: (column) => `Redimensionar coluna ${column}`,
	resizeValue: (width) => `${width} px`,
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
	/** Quantidade total de registros, quando conhecida. */
	totalItems?: number;
	/** Tamanho da página controlado pela aplicação. */
	pageSize?: number;
	pageSizeOptions?: readonly number[];
	onPageSizeChange?: (size: number) => void;
	labels?: Partial<AdsSmartTableLabels>;
	/**
	 * Renderiza só as linhas visíveis da região rolável (altura fixa por linha). Opcional; sem a
	 * prop, todas as linhas são renderizadas.
	 */
	virtualization?: AdsSmartTableVirtualization;
	/** Larguras, em pixels, por id de coluna. Colunas ausentes mantêm a largura automática. */
	columnWidths?: Readonly<Record<string, number>>;
	/** Habilita o redimensionamento. Recebe a lista completa de larguras; o estado é do consumidor. */
	onColumnWidthsChange?: (widths: Record<string, number>) => void;
	/** Habilita o botão de exportação. A tabela só emite colunas visíveis e dados, sem gerar arquivo. */
	onExport?: (data: AdsSmartTableExport<Row>) => void;
}

const emptyIds: readonly string[] = [];
const emptyWidths: Readonly<Record<string, number>> = {};
const defaultOverscan = 6;
/** O `divide-y` da tabela soma bordas à altura da linha; a virtualização usa sombras no lugar. */
const virtualRowStyle: CSSProperties = { borderWidth: 0 };

function getExportValue<Row>(
	column: AdsSmartTableColumn<Row>,
	row: Row,
	index: number,
): AdsSmartTableExportValue {
	if (column.exportValue) return column.exportValue(row, index);
	const content = column.cell(row, index);
	return typeof content === 'string' || typeof content === 'number' ? content : null;
}

/** Cabeçalho e linhas de estado (vazio, erro e carregamento), sem realce de hover. */
function StaticRow({ children, rowIndex }: { children: ReactNode; rowIndex?: number }) {
	return (
		<AdsTableRow aria-rowindex={rowIndex} interactive={false}>
			{children}
		</AdsTableRow>
	);
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
	pageSize,
	pageSizeOptions = [10, 25, 50, 100],
	onPageSizeChange,
	totalItems,
	rows,
	selectedIds = emptyIds,
	selectionMode = 'multiple',
	sort = null,
	virtualization,
	columnWidths = emptyWidths,
	onColumnWidthsChange,
	onExport,
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
	const [scrollTop, setScrollTop] = useState(0);
	const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
	const virtual = isValidVirtualization(virtualization) ? virtualization : undefined;

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
	// O foco é guardado por id: reordenar ou atualizar `rows` não pode apontar para outra linha.
	const focusedIndex =
		virtual && focusedRowId !== null ? pageRows.findIndex((item) => item.id === focusedRowId) : -1;
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
		// Tratado localmente: `defaultPrevented` é o marcador que a pilha de Escape respeita, e
		// `stopPropagation` evita que o evento chegue ao `document`. Nenhum fecha o overlay ao redor.
		event.preventDefault();
		event.stopPropagation();
		setColumnsOpen(false);
		columnsButtonRef.current?.focus();
	};

	const selectedCount = selectedIds.length;
	const colSpan = Math.max(1, visibleColumns.length + (selectable ? 1 : 0));
	const showToolbar = selectable || onHiddenColumnsChange !== undefined || onExport !== undefined;
	const hasTotal = totalItems !== undefined && Number.isSafeInteger(totalItems) && totalItems >= 0;
	const validPageSize = pageSize !== undefined && Number.isSafeInteger(pageSize) && pageSize > 0;
	const paginationLoading = loading || pagination?.loading === true;
	const validPage =
		pagination &&
		Number.isSafeInteger(pagination.page) &&
		pagination.page >= 1 &&
		pagination.page <= pagination.pageCount;
	const firstItem = validPage && validPageSize ? (pagination.page - 1) * pageSize + 1 : 0;
	const lastItem =
		hasTotal && firstItem > 0
			? Math.min(totalItems, firstItem + Math.min(pageRows.length, pageSize ?? 0) - 1)
			: 0;
	const showSummary =
		hasTotal &&
		validPageSize &&
		!paginationLoading &&
		!hasError &&
		(totalItems === 0 || (validPage && firstItem <= totalItems));

	const exportRows = () => {
		if (!onExport) return;
		const exported = visibleColumns.filter((column) => column.exportable !== false);
		onExport({
			columns: exported.map(({ id, label }) => ({ id, label })),
			rows: [...rows],
			records: rows.map((row, index) =>
				Object.fromEntries(
					exported.map((column) => [column.id, getExportValue(column, row, index)]),
				),
			),
			selectedIds: [...selectedIds],
			selectedRows: rows.filter((row) => selected.has(getRowId(row))),
		});
	};

	const widthFor = (column: AdsSmartTableColumn<Row>) => {
		const width = columnWidths[column.id];
		return Number.isFinite(width) && width! > 0 ? width : undefined;
	};
	const resizing = onColumnWidthsChange !== undefined;
	const setWidth = (column: AdsSmartTableColumn<Row>, width: number | null) => {
		if (!onColumnWidthsChange) return;
		const others = Object.fromEntries(
			Object.entries(columnWidths).filter(([id]) => id !== column.id),
		);
		onColumnWidthsChange(width === null ? others : { ...others, [column.id]: width });
	};

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

	const showsRows = !body && !loading;
	const widthStyle = (width: number | undefined): CSSProperties | undefined =>
		width ? { width, minWidth: width, maxWidth: width } : undefined;

	const renderRow = (index: number) => {
		const { enabled, id, row } = pageRows[index]!;
		const isSelected = selected.has(id);
		const rowLabel = getRowLabel ? getRowLabel(row) : id;
		return (
			<AdsTableRow
				aria-rowindex={virtual ? index + 2 : undefined}
				data-row-id={virtual ? id : undefined}
				data-selected={isSelected ? '' : undefined}
				key={id}
				style={virtual ? { ...virtualRowStyle, height: virtual.rowHeight } : undefined}
			>
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
				{visibleColumns.map((column) => {
					const width = widthFor(column);
					return (
						<AdsTableCell
							align={column.align ?? 'start'}
							className={classNames(
								column.cellClassName,
								width !== undefined && 'ads-smart-table-fixed-width',
							)}
							key={column.id}
							style={widthStyle(width)}
						>
							{column.cell(row, index)}
						</AdsTableCell>
					);
				})}
			</AdsTableRow>
		);
	};

	return (
		<div
			{...props}
			className={classNames('ads-smart-table', className)}
			data-loading={loading ? '' : undefined}
			data-virtualized={virtual ? '' : undefined}
		>
			{filters ? <div className="ads-smart-table-filters">{filters}</div> : null}
			{showToolbar ? (
				<div className="ads-smart-table-toolbar" onKeyDown={closeColumns}>
					<span aria-live="polite" className="ads-smart-table-selection-summary" role="status">
						{selectable && selectedCount > 0
							? labels.selectedCount(selectedCount, selectedVisible)
							: null}
					</span>
					{onExport ? (
						<AdsButton
							disabled={blocked || pageRows.length === 0}
							onClick={exportRows}
							size="sm"
							variant="secondary"
						>
							{labels.export}
						</AdsButton>
					) : null}
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
				aria-rowcount={showsRows && virtual ? pageRows.length + 1 : undefined}
				containerClassName="ads-smart-table-scroll"
				containerProps={{
					'aria-labelledby': captionId,
					onScroll: virtual ? (event) => setScrollTop(event.currentTarget.scrollTop) : undefined,
					role: 'region',
					style: virtual ? { maxHeight: virtual.height } : undefined,
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
					<StaticRow {...(virtual && { rowIndex: 1 })}>
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
						{visibleColumns.map((column, columnIndex) => {
							const labelId = `${baseId}-header-${columnIndex}`;
							const sortable = column.sortable === true && onSortChange !== undefined;
							const direction = sort?.columnId === column.id ? sort.direction : null;
							const width = widthFor(column);
							const canResize = resizing && column.resizable !== false;
							const minWidth = column.minWidth ?? defaultColumnMinWidth;
							const maxWidth = column.maxWidth ?? defaultColumnMaxWidth;
							return (
								<AdsTableHeader
									align={column.align ?? 'start'}
									// A alça é descendente do <th>; o nome do cabeçalho vem só do rótulo.
									aria-labelledby={canResize ? labelId : undefined}
									style={widthStyle(width)}
									aria-sort={
										sortable
											? direction === 'asc'
												? 'ascending'
												: direction === 'desc'
													? 'descending'
													: 'none'
											: undefined
									}
									className={classNames(
										column.headerClassName,
										canResize && 'ads-smart-table-resizable',
										width !== undefined && 'ads-smart-table-fixed-width',
									)}
									key={column.id}
								>
									{sortable ? (
										<button
											className="ads-smart-table-sort"
											onClick={() => changeSort(column)}
											type="button"
										>
											<span id={canResize ? labelId : undefined}>{column.label}</span>
											<SortIndicator direction={direction} />
										</button>
									) : canResize ? (
										<span id={labelId}>{column.label}</span>
									) : (
										column.label
									)}
									{canResize ? (
										<SmartTableResizer
											fallback={column.defaultWidth ?? defaultColumnWidth}
											label={labels.resizeColumn(column.label)}
											formatValue={labels.resizeValue}
											max={maxWidth}
											min={minWidth}
											onReset={() => setWidth(column, null)}
											onResize={(next) => setWidth(column, clampWidth(next, minWidth, maxWidth))}
											width={width}
										/>
									) : null}
								</AdsTableHeader>
							);
						})}
					</StaticRow>
				</AdsTableHead>
				<AdsTableBody
					onBlur={
						virtual
							? (event) => {
									if (!event.currentTarget.contains(event.relatedTarget)) setFocusedRowId(null);
								}
							: undefined
					}
					onFocus={
						virtual
							? (event) => {
									const row = (event.target as HTMLElement).closest<HTMLElement>('tr[data-row-id]');
									setFocusedRowId(row?.dataset.rowId ?? null);
								}
							: undefined
					}
				>
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
					) : virtual ? (
						getVirtualSlices({
							count: pageRows.length,
							focusedIndex: focusedIndex >= 0 ? focusedIndex : null,
							height: virtual.height,
							overscan: virtual.overscan ?? defaultOverscan,
							rowHeight: virtual.rowHeight,
							scrollTop,
						}).map((slice, position) =>
							slice.type === 'row' ? (
								renderRow(slice.index)
							) : (
								<tr
									aria-hidden="true"
									className="ads-smart-table-spacer"
									key={`spacer-${position}`}
									style={{ ...virtualRowStyle, height: slice.height }}
								>
									<td colSpan={colSpan} />
								</tr>
							),
						)
					) : (
						pageRows.map((_, index) => renderRow(index))
					)}
				</AdsTableBody>
			</AdsTable>
			{pagination ? (
				<div className="ads-smart-table-pagination">
					{showSummary ? (
						<span className="ads-smart-table-page-summary">
							{totalItems === 0 || pageRows.length === 0
								? labels.emptyPage
								: labels.pageSummary(firstItem, lastItem, totalItems!)}
						</span>
					) : null}
					{validPageSize && onPageSizeChange ? (
						<label className="ads-smart-table-page-size">
							<span>{labels.pageSize}</span>
							<select
								disabled={blocked || paginationLoading}
								value={pageSize}
								onChange={(event) => {
									const next = Number(event.target.value);
									if (
										!blocked &&
										!paginationLoading &&
										Number.isSafeInteger(next) &&
										next > 0 &&
										next !== pageSize &&
										pageSizeOptions.includes(next)
									)
										onPageSizeChange(next);
								}}
							>
								{[...new Set([...pageSizeOptions, pageSize!])]
									.filter((size) => Number.isSafeInteger(size) && size > 0)
									.sort((a, b) => a - b)
									.map((size) => (
										<option key={size} value={size}>
											{size}
										</option>
									))}
							</select>
						</label>
					) : null}
					<AdsPagination {...pagination} loading={paginationLoading} />
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
