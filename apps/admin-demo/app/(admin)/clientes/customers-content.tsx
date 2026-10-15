import {
	AdsBadge,
	AdsEmptyState,
	AdsSkeleton,
	AdsTable,
	AdsTableBody,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
	AdsTypography,
	type AdsBadgeVariant,
} from '@admin-ds/components';
import Link from 'next/link';
import type { Customer, CustomerStatus } from '../../../lib/data/customers';
import type { CustomersState } from '../../../lib/customers-query';
import { CustomersPagination } from './customers-pagination';

const statusVariants: Record<CustomerStatus, AdsBadgeVariant> = {
	Ativo: 'success',
	Pendente: 'warning',
	Inativo: 'neutral',
};

const columns = [
	{ label: 'Nome', align: 'start' },
	{ label: 'E-mail', align: 'start' },
	{ label: 'Status', align: 'start' },
	{ label: 'Plano', align: 'start' },
	{ label: 'Pedidos', align: 'end' },
	{ label: 'Cliente desde', align: 'start' },
] as const;

interface CustomersContentProps {
	state: CustomersState;
	rows: readonly Customer[];
	page: number;
	pageCount: number;
	placeholderRows: number;
}

function TableHeadRow() {
	return (
		<AdsTableHead>
			<AdsTableRow>
				{columns.map((column) => (
					<AdsTableHeader align={column.align} key={column.label}>
						{column.label}
					</AdsTableHeader>
				))}
			</AdsTableRow>
		</AdsTableHead>
	);
}

/** Presentational customers listing: the route reads the URL and passes the resulting view. */
export function CustomersContent({
	state,
	rows,
	page,
	pageCount,
	placeholderRows,
}: CustomersContentProps) {
	return (
		<div className="demo-page">
			<div className="demo-shell">
				<header className="demo-section">
					<p className="demo-kicker">Cadastro</p>
					<AdsTypography as="h1" variant="heading1">
						Clientes
					</AdsTypography>
					<AdsTypography variant="muted">
						Listagem paginada com os estados de dados, carregamento, vazio e erro.
					</AdsTypography>
				</header>

				<section aria-label="Lista de clientes" className="demo-section">
					{state === 'vazio' ? (
						<AdsEmptyState
							actions={
								<Link className="demo-action-link" href="/clientes">
									Ver todos os clientes
								</Link>
							}
							description="Nenhum cliente corresponde à seleção atual."
							title="Nenhum cliente encontrado"
						/>
					) : null}

					{state === 'erro' ? (
						<AdsEmptyState
							actions={
								<Link className="demo-action-link" href="/clientes">
									Tentar novamente
								</Link>
							}
							description="Ocorreu uma falha ao buscar a lista. Tente novamente em instantes."
							role="alert"
							title="Não foi possível carregar os clientes"
						/>
					) : null}

					{state === 'carregando' ? (
						<div aria-busy="true">
							<AdsTable aria-label="Clientes">
								<TableHeadRow />
								<AdsTableBody>
									{Array.from({ length: placeholderRows }, (_, row) => (
										<AdsTableRow key={row}>
											{columns.map((column, cell) => (
												<AdsTableCell align={column.align} key={column.label}>
													<AdsSkeleton
														className="demo-skeleton-cell"
														{...(row === 0 && cell === 0 ? { label: 'Carregando clientes' } : {})}
													/>
												</AdsTableCell>
											))}
										</AdsTableRow>
									))}
								</AdsTableBody>
							</AdsTable>
						</div>
					) : null}

					{state === 'dados' ? (
						<>
							<AdsTable aria-label="Clientes">
								<TableHeadRow />
								<AdsTableBody>
									{rows.map((customer) => (
										<AdsTableRow key={customer.id}>
											<AdsTableCell>{customer.name}</AdsTableCell>
											<AdsTableCell>{customer.email}</AdsTableCell>
											<AdsTableCell>
												<AdsBadge variant={statusVariants[customer.status]}>
													{customer.status}
												</AdsBadge>
											</AdsTableCell>
											<AdsTableCell>{customer.plan}</AdsTableCell>
											<AdsTableCell align="end">{customer.orders}</AdsTableCell>
											<AdsTableCell>{customer.since}</AdsTableCell>
										</AdsTableRow>
									))}
								</AdsTableBody>
							</AdsTable>
							<div className="demo-table-pagination">
								<CustomersPagination page={page} pageCount={pageCount} />
							</div>
						</>
					) : null}
				</section>
			</div>
		</div>
	);
}
