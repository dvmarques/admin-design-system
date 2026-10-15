import { describe, expect, it } from 'vitest';
import { firstParam, normalizePage, parseCustomersState } from '../lib/customers-query';

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
