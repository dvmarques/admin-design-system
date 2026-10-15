import { describe, expect, it } from 'vitest';
import { hrefWithParams, withParams } from '../lib/url-search-params';

type Params = Record<string, string | string[] | undefined>;

/** Comportamento anterior ao R2: `URLSearchParams` sem decodificar `:` nos valores. */
function withParamsLegacy(params: Params, changes: Record<string, string | null>) {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		for (const item of [value].flat()) if (item !== undefined) query.append(key, item);
	}
	for (const [key, value] of Object.entries(changes)) {
		if (value === null) query.delete(key);
		else query.set(key, value);
	}
	return query.toString();
}

describe('withParams', () => {
	it('keeps existing keys, clears pagina on sort and uses readable ordem=nome:asc', () => {
		expect(withParams({ q: 'ana', pagina: '2' }, { ordem: 'nome:asc', pagina: null })).toBe(
			'q=ana&ordem=nome:asc',
		);
		expect(withParamsLegacy({ q: 'ana', pagina: '2' }, { ordem: 'nome:asc', pagina: null })).toBe(
			'q=ana&ordem=nome%3Aasc',
		);
	});

	it('encodes special characters but leaves colon readable in values', () => {
		expect(withParams({}, { q: 'a b', ordem: 'nome:asc' })).toBe('q=a+b&ordem=nome:asc');
		expect(withParamsLegacy({}, { q: 'a b', ordem: 'nome:asc' })).toBe('q=a+b&ordem=nome%3Aasc');
	});

	it('returns an empty string when no keys remain', () => {
		expect(withParams({ pagina: '2' }, { pagina: null })).toBe('');
	});
});

describe('hrefWithParams', () => {
	it('omits a trailing question mark when the query is empty', () => {
		expect(hrefWithParams('/usuarios', { status: 'ativo' }, { status: null })).toBe('/usuarios');
	});

	it('builds a readable sort href that preserves filters', () => {
		expect(
			hrefWithParams(
				'/usuarios',
				{ q: 'ana', pagina: '2', status: 'ativo' },
				{ ordem: 'nome:asc', pagina: null },
			),
		).toBe('/usuarios?q=ana&status=ativo&ordem=nome:asc');
	});
});
