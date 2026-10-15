'use client';

import {
	AdsFilterBar,
	AdsSmartTable,
	type AdsFilterDefinition,
	type AdsFilterValues,
	type AdsSmartTableColumn,
	type AdsSmartTableSort,
} from '@admin-ds/admin';
import { AdsBadge, AdsEmptyState, AdsPagination, type AdsBadgeVariant } from '@admin-ds/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import type { Customer, CustomerStatus } from '../../../lib/data/customers';
import {
	customerPlans,
	customerStatuses,
	customersHref,
	type CustomerSortColumn,
	type CustomersQuery,
	type CustomersState,
} from '../../../lib/customers-query';

const statusVariants: Record<CustomerStatus, AdsBadgeVariant> = {
	Ativo: 'success',
	Pendente: 'warning',
	Inativo: 'neutral',
};

const filters: AdsFilterDefinition[] = [
	{ id: 'q', type: 'text', label: 'Busca', placeholder: 'Nome ou e-mail' },
	{
		id: 'status',
		type: 'select',
		label: 'Status',
		options: customerStatuses.map((status) => ({ label: status, value: status })),
	},
	{
		id: 'plano',
		type: 'multiselect',
		label: 'Plano',
		options: customerPlans.map((plan) => ({ label: plan, value: plan })),
	},
	{ id: 'periodo', type: 'date-range', label: 'Cliente desde' },
];

const columns: AdsSmartTableColumn<Customer>[] = [
	{ id: 'name', label: 'Nome', sortable: true, hideable: false, cell: (row) => row.name },
	{ id: 'email', label: 'E-mail', cell: (row) => row.email },
	{
		id: 'status',
		label: 'Status',
		sortable: true,
		cell: (row) => <AdsBadge variant={statusVariants[row.status]}>{row.status}</AdsBadge>,
	},
	{ id: 'plan', label: 'Plano', sortable: true, cell: (row) => row.plan },
	{ id: 'orders', label: 'Pedidos', align: 'end', sortable: true, cell: (row) => row.orders },
	{ id: 'since', label: 'Cliente desde', sortable: true, cell: (row) => row.since },
];

function toValues(query: CustomersQuery): AdsFilterValues {
	const value: AdsFilterValues = {};
	if (query.q) value.q = query.q;
	if (query.status) value.status = query.status;
	if (query.plans.length > 0) value.plano = query.plans;
	if (query.from || query.to) value.periodo = { start: query.from, end: query.to };
	return value;
}

/** Turns the bar's values back into a query; the server validates it again on every request. */
function toQuery(values: AdsFilterValues, sort: CustomersQuery['sort']): CustomersQuery {
	const { q, status, plano, periodo } = values;
	const range = periodo && !Array.isArray(periodo) && typeof periodo === 'object' ? periodo : null;
	return {
		q: typeof q === 'string' ? q : '',
		status: customerStatuses.find((item) => item === status) ?? null,
		plans: Array.isArray(plano) ? customerPlans.filter((plan) => plano.includes(plan)) : [],
		from: range?.start ?? null,
		to: range?.end ?? null,
		sort,
	};
}

interface CustomersListingProps {
	query: CustomersQuery;
	state: CustomersState;
	rows: readonly Customer[];
	page: number;
	pageCount: number;
	placeholderRows: number;
}

/**
 * Customers listing. The server reads the URL and passes the resulting view; this component only
 * presents it and writes filters and sorting back to the URL. Selection and hidden columns are
 * local state and are not persisted.
 */
export function CustomersListing({
	query,
	state,
	rows,
	page,
	pageCount,
	placeholderRows,
}: CustomersListingProps) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [selected, setSelected] = useState<string[]>([]);
	const [hidden, setHidden] = useState<string[]>([]);
	// Applied immediately so typing and consecutive filter actions always start from the latest value.
	const [value, setValue] = useState(() => toValues(query));
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const ownHrefs = useRef(new Set<string>());
	const urlHref = customersHref(query, { state });

	useEffect(() => () => clearTimeout(timer.current), []);
	useEffect(() => {
		// URL changed from outside (for example Back): apply it again.
		if (ownHrefs.current.delete(urlHref)) return;
		clearTimeout(timer.current);
		setValue(toValues(query));
	}, [urlHref]);

	function navigate(next: CustomersQuery, nextState: CustomersState = state) {
		// A pending text debounce would otherwise overwrite this navigation with stale sorting.
		clearTimeout(timer.current);
		// No page is passed, so changing filters or sorting returns to the first page.
		const href = customersHref(next, { state: nextState });
		if (href !== urlHref) ownHrefs.current.add(href);
		startTransition(() => router.replace(href, { scroll: false }));
	}

	function onFiltersChange(next: AdsFilterValues) {
		const { q: nextText = '', ...nextOthers } = next;
		const { q: text = '', ...others } = value;
		const cleared = Object.keys(next).length === 0;
		const nextQuery = toQuery(next, query.sort);
		const typing =
			!cleared &&
			nextText !== text &&
			customersHref(toQuery(nextOthers, null)) === customersHref(toQuery(others, null));
		clearTimeout(timer.current);
		setValue(next);
		if (typing) {
			timer.current = setTimeout(() => navigate(nextQuery), 300);
			return;
		}
		navigate(nextQuery);
	}

	function onSortChange(next: AdsSmartTableSort | null) {
		// The columns above are the only ones that can be sorted, so the id is a CustomerSortColumn.
		const sort = next
			? { columnId: next.columnId as CustomerSortColumn, direction: next.direction }
			: null;
		navigate(toQuery(value, sort));
	}

	const hasFilters = Object.keys(value).length > 0;

	return (
		<>
			<AdsSmartTable<Customer>
				caption="Clientes"
				columns={columns}
				emptyState={
					<AdsEmptyState
						actions={
							<Link className="demo-action-link" href="/clientes">
								{hasFilters ? 'Limpar filtros' : 'Ver todos os clientes'}
							</Link>
						}
						description="Nenhum cliente corresponde à seleção atual."
						title="Nenhum cliente encontrado"
					/>
				}
				error={
					state === 'erro'
						? 'Ocorreu uma falha ao buscar a lista. Tente novamente em instantes.'
						: undefined
				}
				filters={
					<AdsFilterBar
						aria-label="Filtros de clientes"
						filters={filters}
						loading={pending}
						onChange={onFiltersChange}
						value={value}
					/>
				}
				getRowId={(row) => row.id}
				getRowLabel={(row) => row.name}
				hiddenColumnIds={hidden}
				labels={{
					loading: 'Carregando clientes',
					errorTitle: 'Não foi possível carregar os clientes',
				}}
				loading={state === 'carregando'}
				loadingRows={placeholderRows}
				onHiddenColumnsChange={setHidden}
				onRetry={() => navigate(toQuery(value, query.sort), 'dados')}
				onSelectionChange={setSelected}
				onSortChange={onSortChange}
				rows={state === 'vazio' ? [] : rows}
				selectedIds={selected}
				sort={query.sort}
			/>
			{pageCount > 1 ? (
				<div className="demo-table-pagination">
					<AdsPagination
						page={page}
						pageCount={pageCount}
						renderPageLink={(target, props) => (
							<Link href={customersHref(query, { page: target, state })} {...props} />
						)}
					/>
				</div>
			) : null}
		</>
	);
}
