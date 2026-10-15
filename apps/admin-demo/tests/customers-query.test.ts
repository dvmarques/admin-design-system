import { describe, expect, it } from 'vitest';
import { customers } from '../lib/data/customers';
import {
	applyCustomersQuery as applyQuery,
	customersHref,
	firstParam,
	normalizePage,
	parseCustomersQuery,
	parseCustomersSort,
	parseCustomersState,
	parseIsoDate,
} from '../lib/customers-query';

const applyCustomersQuery = (query: Parameters<typeof applyQuery>[0]) =>
	applyQuery(query, customers);

describe('normalizePage', () => {
	it.each([
		[undefined, 1],
		['', 1],
		['abc', 1],
		['0', 1],
		['-3', 1],
		['1.7', 1],
		['1', 1],
		['3', 3],
		['5', 5],
		['6', 5],
		['999', 5],
		['Infinity', 1],
		['NaN', 1],
	])(
		'maps ?pagina=%s to page %s with 5 pages (non-finite values are not page numbers)',
		(value, expected) => {
			expect(normalizePage(value, 5)).toBe(expected);
		},
	);

	it('never goes below the first page when there are no pages', () => {
		expect(normalizePage('3', 0)).toBe(1);
	});
});

describe('parseCustomersState', () => {
	it.each([
		['vazio', 'vazio'],
		['carregando', 'carregando'],
		['erro', 'erro'],
		['desconhecido', 'dados'],
		['', 'dados'],
		[undefined, 'dados'],
	])('maps ?estado=%s to %s', (value, expected) => {
		expect(parseCustomersState(value)).toBe(expected);
	});
});

describe('firstParam', () => {
	it('takes the first value of a repeated parameter', () => {
		expect(firstParam(['2', '3'])).toBe('2');
		expect(firstParam('2')).toBe('2');
		expect(firstParam(undefined)).toBeUndefined();
	});
});

describe('parseCustomersQuery', () => {
	it('reads every filter and sorting parameter', () => {
		expect(
			parseCustomersQuery({
				q: '  mari ',
				status: 'Ativo',
				plano: 'Empresarial,Essencial',
				de: '2023-01-01',
				ate: '2023-12-31',
				ordem: 'orders:desc',
			}),
		).toEqual({
			q: 'mari',
			status: 'Ativo',
			plans: ['Essencial', 'Empresarial'],
			from: '2023-01-01',
			to: '2023-12-31',
			sort: { columnId: 'orders', direction: 'desc' },
		});
	});

	it('ignores unknown values instead of failing', () => {
		expect(
			parseCustomersQuery({
				status: 'Desconhecido',
				plano: 'Inexistente,,x',
				de: '2023-02-31',
				ate: 'ontem',
				ordem: 'email:asc',
			}),
		).toEqual({ q: '', status: null, plans: [], from: null, to: null, sort: null });
	});

	it('takes the first value of repeated parameters', () => {
		expect(parseCustomersQuery({ status: ['Ativo', 'Inativo'] }).status).toBe('Ativo');
	});
});

describe('parseIsoDate and parseCustomersSort', () => {
	it.each([
		['2024-02-29', '2024-02-29'],
		['2023-02-29', null],
		['2023-13-01', null],
		['23-01-01', null],
		['', null],
		[undefined, null],
	])('maps %s to %s', (value, expected) => {
		expect(parseIsoDate(value)).toBe(expected);
	});

	it.each([
		['name:asc', { columnId: 'name', direction: 'asc' }],
		['since:desc', { columnId: 'since', direction: 'desc' }],
		['name', null],
		['name:up', null],
		['x:asc', null],
		[undefined, null],
	])('maps ?ordem=%s', (value, expected) => {
		expect(parseCustomersSort(value)).toEqual(expected);
	});
});

describe('applyCustomersQuery', () => {
	const none = parseCustomersQuery({});

	it('returns every customer, in source order, without filters or sorting', () => {
		expect(applyCustomersQuery(none)).toEqual([...customers]);
	});

	it('is deterministic and does not mutate the source', () => {
		const query = parseCustomersQuery({ ordem: 'name:desc', status: 'Ativo' });
		const before = customers.map((customer) => customer.id);

		expect(applyCustomersQuery(query)).toEqual(applyCustomersQuery(query));
		expect(customers.map((customer) => customer.id)).toEqual(before);
	});

	it('filters by text on name and e-mail, ignoring case', () => {
		const rows = applyCustomersQuery(parseCustomersQuery({ q: 'MARIANA.COSTA@' }));
		expect(rows.map((row) => row.name)).toEqual(['Mariana Costa']);
	});

	it('combines status, plans and the inclusive date range', () => {
		const rows = applyCustomersQuery(
			parseCustomersQuery({
				status: 'Ativo',
				plano: 'Empresarial,Profissional',
				de: '2022-01-01',
				ate: '2023-12-31',
			}),
		);

		expect(rows.length).toBeGreaterThan(0);
		for (const row of rows) {
			expect(row.status).toBe('Ativo');
			expect(['Empresarial', 'Profissional']).toContain(row.plan);
			const [day, month, year] = row.since.split('/');
			const iso = `${year}-${month}-${day}`;
			expect(iso >= '2022-01-01' && iso <= '2023-12-31').toBe(true);
		}
	});

	it('sorts numbers and dates, both directions', () => {
		const orders = applyCustomersQuery(parseCustomersQuery({ ordem: 'orders:desc' })).map(
			(row) => row.orders,
		);
		expect(orders).toEqual([...orders].sort((a, b) => b - a));

		const since = applyCustomersQuery(parseCustomersQuery({ ordem: 'since:asc' })).map((row) =>
			row.since.split('/').reverse().join('-'),
		);
		expect(since).toEqual([...since].sort());
	});

	it('returns an empty list when nothing matches', () => {
		expect(applyCustomersQuery(parseCustomersQuery({ q: 'zzz' }))).toEqual([]);
	});
});

describe('customersHref', () => {
	it('builds a stable href and omits default values', () => {
		expect(customersHref(parseCustomersQuery({}))).toBe('/clientes');
		expect(
			customersHref(parseCustomersQuery({ ordem: 'name:asc', q: 'ana', plano: 'Essencial' }), {
				page: 3,
				state: 'erro',
			}),
		).toBe('/clientes?q=ana&plano=Essencial&ordem=name%3Aasc&pagina=3&estado=erro');
		expect(customersHref(parseCustomersQuery({}), { page: 1, state: 'dados' })).toBe('/clientes');
	});
});
