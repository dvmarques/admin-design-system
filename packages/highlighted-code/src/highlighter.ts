import type { HighlighterCore } from 'shiki';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import type { ThemedToken } from 'shiki/core';
import {
	loadLanguageModule,
	normalizeHighlightedLanguage,
	type AdsHighlightedCodeLanguage,
} from './languages.js';

export type AdsHighlightedCodeThemeMode = 'light' | 'dark';

const THEME_IDS: Record<AdsHighlightedCodeThemeMode, string> = {
	light: 'light-plus',
	dark: 'dark-plus',
};

let highlighterPromise: Promise<HighlighterCore> | null = null;
const loadedLanguages = new Set<string>();
const loadedThemes = new Set<string>();

async function getHighlighter(): Promise<HighlighterCore> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [],
			langs: [],
			engine: createOnigurumaEngine(() => import('shiki/wasm')),
		});
	}
	return highlighterPromise;
}

async function ensureTheme(highlighter: HighlighterCore, mode: AdsHighlightedCodeThemeMode) {
	const id = THEME_IDS[mode];
	if (loadedThemes.has(id)) return id;
	const module =
		mode === 'light'
			? await import('@shikijs/themes/light-plus')
			: await import('@shikijs/themes/dark-plus');
	await highlighter.loadTheme(module.default);
	loadedThemes.add(id);
	return id;
}

async function ensureLanguage(highlighter: HighlighterCore, language: AdsHighlightedCodeLanguage) {
	if (loadedLanguages.has(language)) return language;
	const module = await loadLanguageModule(language);
	await highlighter.loadLanguage(module.default as Parameters<HighlighterCore['loadLanguage']>[0]);
	loadedLanguages.add(language);
	return language;
}

export async function tokenizeHighlightedCode(
	code: string,
	languageInput: string | undefined,
	themeMode: AdsHighlightedCodeThemeMode,
): Promise<ThemedToken[][] | null> {
	const language = normalizeHighlightedLanguage(languageInput);
	if (!language) return null;
	try {
		const highlighter = await getHighlighter();
		const theme = await ensureTheme(highlighter, themeMode);
		const lang = await ensureLanguage(highlighter, language);
		const result = await highlighter.codeToTokens(code, { lang, theme });
		return result.tokens;
	} catch {
		return null;
	}
}

export function resetHighlighterForTests(): void {
	highlighterPromise = null;
	loadedLanguages.clear();
	loadedThemes.clear();
}
