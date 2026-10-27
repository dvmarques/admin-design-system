import type * as OnigurumaModule from 'shiki/engine/oniguruma';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	MAX_HIGHLIGHTED_CHARACTERS,
	MAX_HIGHLIGHTED_LINES,
	resetHighlighterForTests,
	splitHighlightedCodeLines,
	tokenizeHighlightedCode,
} from '../src/highlighter.js';
import {
	ADS_HIGHLIGHTED_CODE_LANGUAGES,
	normalizeHighlightedLanguage,
	registerHighlightedLanguageLoader,
} from '../src/languages.js';

const engine = vi.hoisted(() => ({ failNext: 0 }));

vi.mock('shiki/engine/oniguruma', async (importOriginal) => {
	const actual = await importOriginal<typeof OnigurumaModule>();
	return {
		...actual,
		createOnigurumaEngine: (...args: Parameters<typeof actual.createOnigurumaEngine>) => {
			if (engine.failNext > 0) {
				engine.failNext -= 1;
				return Promise.reject(new Error('WASM indisponível'));
			}
			return actual.createOnigurumaEngine(...args);
		},
	};
});

const SAMPLES: Record<string, string> = {
	java: 'public class A { private int x = 1; String s = "oi"; }',
	sql: 'SELECT id, name FROM users WHERE id = 1;',
	tsx: 'export function A() { return <div className="x">{1}</div>; }',
	typescript: 'const x: number = 1; interface A { b: string }',
	javascript: 'const x = 1; function f() { return "a"; }',
	jsx: 'const A = () => <p id="a">texto</p>;',
	json: '{"a": 1, "b": [true, null, "x"]}',
	html: '<div class="a"><span>oi</span></div>',
	css: '.a { color: red; margin: 0 }',
	xml: '<?xml version="1.0"?><root a="1"><b>t</b></root>',
	yaml: 'a: 1\nb:\n  - x\n  - "y"',
	bash: 'if [ -f x ]; then echo "$HOME"; fi',
};

function colors(tokens: NonNullable<Awaited<ReturnType<typeof tokenizeHighlightedCode>>>) {
	return new Set(tokens.flat().map((token) => token.color));
}

afterEach(() => {
	resetHighlighterForTests();
	engine.failNext = 0;
	vi.restoreAllMocks();
});

describe('tokenização real', () => {
	it('cobre exatamente as 12 linguagens declaradas', () => {
		expect(Object.keys(SAMPLES).sort()).toEqual([...ADS_HIGHLIGHTED_CODE_LANGUAGES].sort());
	});

	it.each(Object.entries(SAMPLES))('%s gera tokens com mais de uma cor', async (language, code) => {
		const tokens = await tokenizeHighlightedCode(code, language, 'light');
		expect(tokens).not.toBeNull();
		expect(tokens).toHaveLength(code.split('\n').length);
		expect(colors(tokens!).size).toBeGreaterThan(1);
	});

	it('usa cores diferentes no tema escuro', async () => {
		const light = await tokenizeHighlightedCode(SAMPLES.sql, 'sql', 'light');
		const dark = await tokenizeHighlightedCode(SAMPLES.sql, 'sql', 'dark');
		expect(dark).not.toBeNull();
		expect(colors(dark!)).not.toEqual(colors(light!));
	});

	it('preserva linhas vazias como linhas sem tokens e ignora a quebra final', async () => {
		const tokens = await tokenizeHighlightedCode('a\n\nb\n', 'bash', 'light');
		expect(tokens).toHaveLength(3);
		expect(tokens![1]).toHaveLength(0);
	});

	it('devolve null para linguagem desconhecida sem carregar o motor', async () => {
		engine.failNext = 1;
		expect(await tokenizeHighlightedCode('x', 'cobol', 'light')).toBeNull();
		expect(engine.failNext).toBe(1);
	});
});

describe('falhas e nova tentativa', () => {
	it('tenta de novo depois que o motor falha ao carregar', async () => {
		engine.failNext = 1;
		expect(await tokenizeHighlightedCode(SAMPLES.sql, 'sql', 'light')).toBeNull();
		expect(await tokenizeHighlightedCode(SAMPLES.sql, 'sql', 'light')).not.toBeNull();
	});

	it('tenta de novo depois que a gramática falha ao carregar', async () => {
		let attempts = 0;
		registerHighlightedLanguageLoader('instavel', async () => {
			attempts += 1;
			if (attempts === 1) throw new Error('rede');
			return {
				default: {
					name: 'instavel',
					scopeName: 'source.instavel',
					patterns: [{ match: '\\bfoo\\b', name: 'keyword.instavel' }],
				},
			};
		});
		expect(await tokenizeHighlightedCode('foo bar', 'instavel', 'light')).toBeNull();
		const retry = await tokenizeHighlightedCode('foo bar', 'instavel', 'light');
		expect(retry).not.toBeNull();
		expect(attempts).toBe(2);
	});

	it('uma gramática cujo name difere do id mantém o plain', async () => {
		registerHighlightedLanguageLoader('outro-id', async () => ({
			default: { name: 'nome-diferente', scopeName: 'source.x', patterns: [] },
		}));
		expect(await tokenizeHighlightedCode('x', 'outro-id', 'light')).toBeNull();
	});
});

describe('concorrência', () => {
	it('carrega a gramática uma única vez para chamadas simultâneas', async () => {
		let loads = 0;
		registerHighlightedLanguageLoader('sql', async () => {
			loads += 1;
			return import('@shikijs/langs/sql');
		});
		const results = await Promise.all(
			Array.from({ length: 6 }, () => tokenizeHighlightedCode(SAMPLES.sql, 'sql', 'light')),
		);
		expect(results.every((tokens) => tokens !== null)).toBe(true);
		expect(loads).toBe(1);
	});
});

describe('código extenso', () => {
	it('não destaca acima do limite de linhas', async () => {
		engine.failNext = 1;
		const code = Array.from({ length: MAX_HIGHLIGHTED_LINES + 1 }, () => 'x').join('\n');
		expect(await tokenizeHighlightedCode(code, 'bash', 'light')).toBeNull();
		expect(engine.failNext).toBe(1);
	});

	it('não destaca acima do limite de caracteres', async () => {
		const code = 'a'.repeat(MAX_HIGHLIGHTED_CHARACTERS + 1);
		expect(await tokenizeHighlightedCode(code, 'bash', 'light')).toBeNull();
	});
});

describe('splitHighlightedCodeLines', () => {
	it('normaliza CRLF e CR e ignora uma única quebra final', () => {
		expect(splitHighlightedCodeLines('a\r\nb\rc\n')).toEqual(['a', 'b', 'c']);
		expect(splitHighlightedCodeLines('a\n\n')).toEqual(['a', '']);
		expect(splitHighlightedCodeLines('')).toEqual(['']);
		expect(splitHighlightedCodeLines('\n')).toEqual(['']);
	});
});

describe('registro de linguagens', () => {
	it('o reset descarta carregadores registrados', () => {
		registerHighlightedLanguageLoader('temporaria', async () => ({ default: {} }));
		expect(normalizeHighlightedLanguage('temporaria')).toBe('temporaria');
		resetHighlighterForTests();
		expect(normalizeHighlightedLanguage('temporaria')).toBeUndefined();
	});
});
