import { customers, customersPageSize } from '../../../lib/data/customers';
import { firstParam, normalizePage, parseCustomersState } from '../../../lib/customers-query';
import { CustomersContent } from './customers-content';

interface CustomersPageProps {
	searchParams: Promise<{ pagina?: string | string[]; estado?: string | string[] }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
	const params = await searchParams;
	const state = parseCustomersState(firstParam(params.estado));
	const pageCount = Math.ceil(customers.length / customersPageSize);
	const page = normalizePage(firstParam(params.pagina), pageCount);
	const start = (page - 1) * customersPageSize;

	return (
		<CustomersContent
			page={page}
			pageCount={pageCount}
			placeholderRows={customersPageSize}
			rows={customers.slice(start, start + customersPageSize)}
			state={state}
		/>
	);
}
