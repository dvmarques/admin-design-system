import { AdsAdminShell } from '@admin-ds/admin';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CustomersContent } from '../app/(admin)/clientes/customers-content';
import { customers, customersPageSize } from '../lib/data/customers';
import type { CustomersState } from '../lib/customers-query';

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: vi.fn() }),
	usePathname: () => '/clientes',
}));

const pageCount = Math.ceil(customers.length / customersPageSize);

function renderListing(state: CustomersState, page = 1) {
	const start = (page - 1) * customersPageSize;
	return renderToString(
		<AdsAdminShell>
			<CustomersContent
				page={page}
				pageCount={pageCount}
				placeholderRows={customersPageSize}
				rows={customers.slice(start, start + customersPageSize)}
				state={state}
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

	it('shows the table with the page rows and marks the current page', () => {
		const view = parse(renderListing('dados', 2));

		expect(view.querySelector('table[aria-label="Clientes"]')).not.toBeNull();
		expect(view.querySelectorAll('tbody tr')).toHaveLength(customersPageSize);
		expect(view.textContent).toContain(customers[customersPageSize]?.name);
		expect(view.textContent).not.toContain(customers[0]?.name);
		const current = view.querySelector('button[aria-current="page"]');
		expect(current?.getAttribute('aria-label')).toBe('Página 2');
	});

	it('replaces the table with an empty state that offers a way back', () => {
		const view = parse(renderListing('vazio'));

		expect(view.querySelector('table')).toBeNull();
		expect(view.textContent).toContain('Nenhum cliente encontrado');
		expect(view.querySelector('a[href="/clientes"]')?.textContent).toBe('Ver todos os clientes');
	});

	it('keeps the table structure with a single labelled placeholder while loading', () => {
		const view = parse(renderListing('carregando'));

		expect(view.querySelector('[aria-busy="true"]')).not.toBeNull();
		expect(view.querySelector('table[aria-label="Clientes"]')).not.toBeNull();
		expect(view.querySelectorAll('th[scope="col"]')).toHaveLength(6);
		expect(view.querySelectorAll('[role="status"]')).toHaveLength(1);
		expect(view.querySelector('[role="status"]')?.getAttribute('aria-label')).toBe(
			'Carregando clientes',
		);
		for (const customer of customers) {
			expect(view.textContent).not.toContain(customer.name);
		}
	});

	it('announces the error with a retry link', () => {
		const view = parse(renderListing('erro'));

		expect(view.querySelector('table')).toBeNull();
		expect(view.querySelector('[role="alert"]')?.textContent).toContain(
			'Não foi possível carregar os clientes',
		);
		expect(view.querySelector('a[href="/clientes"]')?.textContent).toBe('Tentar novamente');
	});
});
