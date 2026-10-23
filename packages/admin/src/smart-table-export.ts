export type AdsSmartTableExportValue = string | number | boolean | Date | null;

export interface AdsSmartTableExportColumn {
	id: string;
	label: string;
}

/**
 * Dados emitidos por `onExport`: as colunas visíveis, na ordem exibida, e as linhas recebidas pela
 * tabela. O formato do arquivo (CSV, XLSX, API) é decisão do consumidor.
 */
export interface AdsSmartTableExport<Row> {
	columns: AdsSmartTableExportColumn[];
	/** Linhas recebidas pela tabela (por exemplo, a página exibida), na ordem recebida. */
	rows: Row[];
	/** Valores por linha, indexados pelo `id` das colunas exportadas. */
	records: Record<string, AdsSmartTableExportValue>[];
	/** Ids selecionados; podem incluir linhas que não estão em `rows`. */
	selectedIds: string[];
	/** Subconjunto de `rows` cujo id está em `selectedIds`. */
	selectedRows: Row[];
}

export interface AdsSmartTableCsvOptions {
	/** Separador de campos. Padrão: `,`. */
	separator?: ',' | ';' | '\t';
	/** Exporta só as linhas selecionadas. Padrão: `false`. */
	onlySelected?: boolean;
	/** Prefixa o arquivo com BOM UTF-8, útil para abrir acentos no Excel. Padrão: `false`. */
	bom?: boolean;
	/** Neutraliza textos iniciados por `=`, `+`, `-` ou `@` (injeção de fórmulas). Padrão: `true`. */
	neutralizeFormulas?: boolean;
}

const formulaStart = /^[=+\-@\t\r]/;

function formatValue(
	value: AdsSmartTableExportValue | undefined,
	separator: string,
	neutralize: boolean,
) {
	if (value === null || value === undefined) return '';
	let text: string;
	if (value instanceof Date) text = Number.isNaN(value.getTime()) ? '' : value.toISOString();
	else text = String(value);
	if (neutralize && typeof value === 'string' && formulaStart.test(text)) text = `'${text}`;
	const needsQuotes = text.includes('"') || text.includes('\n') || text.includes('\r');
	return needsQuotes || text.includes(separator) ? `"${text.replaceAll('"', '""')}"` : text;
}

/** Converte os dados de `onExport` em CSV (RFC 4180), sem dependências nem download. */
export function getAdsSmartTableCsv<Row>(
	data: AdsSmartTableExport<Row>,
	{
		separator = ',',
		onlySelected = false,
		bom = false,
		neutralizeFormulas = true,
	}: AdsSmartTableCsvOptions = {},
): string {
	const selected = new Set(data.selectedRows);
	const records = onlySelected
		? data.records.filter((_, index) => selected.has(data.rows[index] as Row))
		: data.records;
	const lines = [
		data.columns.map((column) => formatValue(column.label, separator, neutralizeFormulas)),
		...records.map((record) =>
			data.columns.map((column) => formatValue(record[column.id], separator, neutralizeFormulas)),
		),
	].map((cells) => cells.join(separator));
	return `${bom ? '﻿' : ''}${lines.join('\r\n')}\r\n`;
}
