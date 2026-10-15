import { AdsAdminShell } from '@admin-ds/admin';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CustomersContent } from '../app/(admin)/clientes/customers-content';
import { customers, customersPageSize } from '../lib/data/customers';
import {
	applyCustomersQuery,
	parseCustomersQuery,
	type CustomersState,
} from '../lib/customers-query';

vi.mock('next/navigation', () => ({
	useRouter: () => ({ replace: vi.fn() }),
	usePathname: () => '/clientes',
}));

function renderListing(state: CustomersState, params: Record<string, string> = {}, page = 1) {
	const query = parseCustomersQuery(params);
	const matches = applyCustomersQuery(query, customers);
	const pageCount = Math.max(1, Math.ceil(matches.length / customersPageSize));
	const start = (page - 1) * customersPageSize;
	return renderToString(
		<AdsAdminShell>
			<CustomersContent
				page={page}
				pageCount={pageCount}
				placeholderRows={customersPageSize}
				query={query}
				rows={matches.slice(start, start + customersPageSize)}
				state={state}
				total={matches.length}
			/>
		</AdsAdminShell>,
	);
}

function parse(html: string) {
	const container = document.createElement('div');
	container.innerHTML = html;
	return container;
}

describe('CustomersContent', () => {
	it.each<CustomersState>(['dados', 'vazio', 'carregando', 'erro'])(
		'renders the same markup twice for the %s state',
		(state) => {
			expect(renderListing(state)).toBe(renderListing(state));
		},
	);

	it('shows the smart table with the page rows, the filter bar and the current page', () => {
		const view = parse(renderListing('dados', {}, 2));

		expect(view.querySelector('table')?.textContent).toContain('Clientes');
		expect(view.querySelectorAll('tbody tr')).toHaveLength(customersPageSize);
		expect(view.textContent).toContain(customers[customersPageSize]?.name);
		expect(view.textContent).not.toContain(customers[0]?.name);
		expect(view.querySelector('[aria-label="Filtros de clientes"]')).not.toBeNull();
		expect(view.querySelector('a[aria-current="page"]')?.getAttribute('aria-label')).toBe(
			'Página 2',
		);
	});

	it('keeps filters and sorting in the pagination links', () => {
		const view = parse(renderListing('dados', { status: 'Ativo', ordem: 'orders:desc' }));

		const next = view.querySelector('a[aria-label="Página 2"]');
		expect(next?.getAttribute('href')).toBe('/clientes?status=Ativo&ordem=orders%3Adesc&pagina=2');
	});

	it('marks the sorted column and applies the filter on the server', () => {
		const view = parse(renderListing('dados', { status: 'Inativo', ordem: 'name:asc' }));

		expect(view.querySelector('th[aria-sort="ascending"]')?.textContent).toContain('Nome');
		const inactive = customers.filter((customer) => customer.status === 'Inativo');
		expect(view.querySelectorAll('tbody tr')).toHaveLength(inactive.length);
		expect(view.textContent).toContain(`${inactive.length} clientes encontrados`);
	});

	it('shows an empty state that offers to clear the filters when nothing matches', () => {
		const view = parse(renderListing('dados', { q: 'zzz-sem-resultado' }));

		expect(view.textContent).toContain('Nenhum cliente encontrado');
		expect(view.querySelector('a[href="/clientes"]')?.textContent).toBe('Limpar filtros');
		expect(view.querySelector('[aria-label="Filtros de clientes"]')).not.toBeNull();
	});

	it('offers a way back to the full list in the empty state', () => {
		const view = parse(renderListing('vazio'));

		expect(view.textContent).toContain('Nenhum cliente encontrado');
		expect(view.querySelectorAll('tbody tr')).toHaveLength(1);
		expect(view.querySelector('a[href="/clientes"]')?.textContent).toBe('Ver todos os clientes');
	});

	it('keeps the table structure with a single labelled status while loading', () => {
		const view = parse(renderListing('carregando'));

		expect(view.querySelector('table[aria-busy="true"]')).not.toBeNull();
		expect(view.querySelectorAll('th[scope="col"]').length).toBeGreaterThanOrEqual(6);
		expect(view.querySelectorAll('tbody tr')).toHaveLength(customersPageSize);
		expect(view.textContent).toContain('Carregando clientes');
		for (const customer of customers) {
			expect(view.textContent).not.toContain(customer.name);
		}
	});

	it('announces the error with a retry button', () => {
		const view = parse(renderListing('erro'));

		expect(view.querySelector('[role="alert"]')?.textContent).toContain(
			'Não foi possível carregar os clientes',
		);
		expect(
			[...view.querySelectorAll('button')].some(
				(button) => button.textContent === 'Tentar novamente',
			),
		).toBe(true);
	});
});
