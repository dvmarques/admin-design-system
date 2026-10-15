import { AdsTypography } from '@admin-ds/components';
import type { Customer } from '../../../lib/data/customers';
import type { CustomersQuery, CustomersState } from '../../../lib/customers-query';
import { CustomersListing } from './customers-listing';

interface CustomersContentProps {
	query: CustomersQuery;
	state: CustomersState;
	rows: readonly Customer[];
	total: number;
	page: number;
	pageCount: number;
	placeholderRows: number;
}

/** Presentational customers page: the route reads the URL and passes the resulting view. */
export function CustomersContent({ total, ...listing }: CustomersContentProps) {
	return (
		<div className="demo-page">
			<div className="demo-shell">
				<header className="demo-section">
					<p className="demo-kicker">Cadastro</p>
					<AdsTypography as="h1" variant="heading1">
						Clientes
					</AdsTypography>
					<AdsTypography variant="muted">
						Filtros, ordenação e página guardados na URL, com os estados de dados, carregamento,
						vazio e erro.
					</AdsTypography>
				</header>

				<section aria-label="Lista de clientes" className="demo-section">
					<AdsTypography variant="muted">
						{total === 1 ? '1 cliente encontrado' : `${total} clientes encontrados`}
					</AdsTypography>
					<CustomersListing {...listing} />
				</section>
			</div>
		</div>
	);
}
