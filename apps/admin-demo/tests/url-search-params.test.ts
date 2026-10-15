import { describe, expect, it } from 'vitest';
import { hrefWithParams, withParams } from '../lib/url-search-params';

describe('withParams', () => {
	it('keeps existing keys and applies changes', () => {
		expect(withParams({ q: 'ana', pagina: '2' }, { ordem: 'nome:asc', pagina: null })).toBe(
			'q=ana&ordem=nome:asc',
		);
	});

	it('encodes special characters but leaves colon readable in values', () => {
		expect(withParams({}, { q: 'a b', ordem: 'nome:asc' })).toBe('q=a+b&ordem=nome:asc');
	});

	it('returns an empty string when no keys remain', () => {
		expect(withParams({ pagina: '2' }, { pagina: null })).toBe('');
	});
});

describe('hrefWithParams', () => {
	it('omits a trailing question mark when the query is empty', () => {
		expect(hrefWithParams('/usuarios', { status: 'ativo' }, { status: null })).toBe('/usuarios');
	});
});
