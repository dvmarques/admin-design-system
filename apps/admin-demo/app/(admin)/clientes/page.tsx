import { customers, customersPageSize } from '../../../lib/data/customers';
import {
	applyCustomersQuery,
	firstParam,
	normalizePage,
	parseCustomersQuery,
	parseCustomersState,
} from '../../../lib/customers-query';
import { CustomersContent } from './customers-content';

interface CustomersPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
	const params = await searchParams;
	const state = parseCustomersState(firstParam(params.estado));
	const query = parseCustomersQuery(params);
	const matches = applyCustomersQuery(query, customers);
	const pageCount = Math.max(1, Math.ceil(matches.length / customersPageSize));
	const page = normalizePage(firstParam(params.pagina), pageCount);
	const start = (page - 1) * customersPageSize;

	return (
		<CustomersContent
			page={page}
			pageCount={pageCount}
			placeholderRows={customersPageSize}
			query={query}
			rows={matches.slice(start, start + customersPageSize)}
			state={state}
			total={matches.length}
		/>
	);
}
