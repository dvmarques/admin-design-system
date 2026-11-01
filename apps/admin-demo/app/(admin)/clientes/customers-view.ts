import { customers, customersPageSize } from '../../../lib/data/customers';
import {
	applyCustomersQuery,
	firstParam,
	normalizePage,
	parseCustomersQuery,
	parseCustomersState,
} from '../../../lib/customers-query';

export type CustomersSearchParams = Record<string, string | string[] | undefined>;

/** Builds the customers view (filters, sorting, page) from the URL search parameters. */
export function buildCustomersView(params: CustomersSearchParams) {
	const state = parseCustomersState(firstParam(params.estado));
	const query = parseCustomersQuery(params);
	const matches = applyCustomersQuery(query, customers);
	const pageCount = Math.max(1, Math.ceil(matches.length / customersPageSize));
	const page = normalizePage(firstParam(params.pagina), pageCount);
	const start = (page - 1) * customersPageSize;

	return {
		page,
		pageCount,
		placeholderRows: customersPageSize,
		query,
		rows: matches.slice(start, start + customersPageSize),
		state,
		total: matches.length,
	};
}
