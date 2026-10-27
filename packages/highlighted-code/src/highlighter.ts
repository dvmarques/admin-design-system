import type { HighlighterCore, ThemedToken } from 'shiki/core';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import {
	loadLanguageModule,
	normalizeHighlightedLanguage,
	resetCustomLanguageLoadersForTests,
	type AdsHighlightedCodeLanguage,
} from './languages.js';

export type AdsHighlightedCodeThemeMode = 'light' | 'dark';

const THEME_IDS: Record<AdsHighlightedCodeThemeMode, string> = {
	light: 'light-plus',
	dark: 'dark-plus',
};

/**
 * Acima destes limites o destaque é dispensado e o código segue em texto plain: tokenizar roda
 * na thread principal (cerca de 800 ms para 5000 linhas) e o ganho visual não compensa.
 */
export const MAX_HIGHLIGHTED_LINES = 1000;
export const MAX_HIGHLIGHTED_CHARACTERS = 100_000;

interface HighlighterState {
	core: Promise<HighlighterCore>;
	themes: Map<string, Promise<string>>;
	languages: Map<string, Promise<string>>;
}

// Estado único do motor. Uma falha ao criá-lo descarta o estado inteiro, para a próxima chamada
// tentar de novo em vez de ficar presa a uma promise rejeitada.
let state: HighlighterState | null = null;

function getState(): HighlighterState {
	if (state) return state;
	const created: HighlighterState = {
		core: createHighlighterCore({
			themes: [],
			langs: [],
			engine: createOnigurumaEngine(() => import('shiki/wasm')),
		}).catch((error: unknown) => {
			if (state === created) state = null;
			throw error;
		}),
		themes: new Map(),
		languages: new Map(),
	};
	state = created;
	return created;
}

/** Deduplica carregamentos em andamento e esquece os que falharam, para permitir nova tentativa. */
function loadOnce(cache: Map<string, Promise<string>>, key: string, load: () => Promise<void>) {
	let pending = cache.get(key);
	if (!pending) {
		const created = load().then(() => key);
		pending = created;
		cache.set(key, created);
		created.catch(() => {
			if (cache.get(key) === created) cache.delete(key);
		});
	}
	return pending;
}

function ensureTheme(
	current: HighlighterState,
	highlighter: HighlighterCore,
	mode: AdsHighlightedCodeThemeMode,
) {
	const id = THEME_IDS[mode];
	return loadOnce(current.themes, id, async () => {
		const module =
			mode === 'light'
				? await import('@shikijs/themes/light-plus')
				: await import('@shikijs/themes/dark-plus');
		await highlighter.loadTheme(module.default);
	});
}

function ensureLanguage(
	current: HighlighterState,
	highlighter: HighlighterCore,
	language: AdsHighlightedCodeLanguage,
) {
	return loadOnce(current.languages, language, async () => {
		const module = await loadLanguageModule(language);
		await highlighter.loadLanguage(
			module.default as Parameters<HighlighterCore['loadLanguage']>[0],
		);
	});
}

/**
 * Linhas exibidas: quebras CRLF/CR viram LF e uma única quebra final não gera linha extra.
 * O modo plain e o destacado usam a mesma divisão, então as linhas e a numeração coincidem.
 */
export function splitHighlightedCodeLines(code: string): string[] {
	const lines = code.replace(/\r\n?/g, '\n').split('\n');
	if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
	return lines;
}

export async function tokenizeHighlightedCode(
	code: string,
	languageInput: string | undefined,
	themeMode: AdsHighlightedCodeThemeMode,
): Promise<ThemedToken[][] | null> {
	const language = normalizeHighlightedLanguage(languageInput);
	if (!language) return null;
	const lines = splitHighlightedCodeLines(code);
	const source = lines.join('\n');
	if (lines.length > MAX_HIGHLIGHTED_LINES || source.length > MAX_HIGHLIGHTED_CHARACTERS) {
		return null;
	}
	try {
		const current = getState();
		const highlighter = await current.core;
		const [theme, lang] = await Promise.all([
			ensureTheme(current, highlighter, themeMode),
			ensureLanguage(current, highlighter, language),
		]);
		return highlighter.codeToTokens(source, { lang, theme }).tokens;
	} catch {
		return null;
	}
}

export function resetHighlighterForTests(): void {
	state = null;
	resetCustomLanguageLoadersForTests();
}
