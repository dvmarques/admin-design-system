import type { LanguageInput } from 'shiki';

export type AdsHighlightedCodeLanguage =
	| 'typescript'
	| 'tsx'
	| 'javascript'
	| 'jsx'
	| 'java'
	| 'sql'
	| 'json'
	| 'html'
	| 'css'
	| 'xml'
	| 'yaml'
	| 'bash';

export const ADS_HIGHLIGHTED_CODE_LANGUAGES: readonly AdsHighlightedCodeLanguage[] = [
	'typescript',
	'tsx',
	'javascript',
	'jsx',
	'java',
	'sql',
	'json',
	'html',
	'css',
	'xml',
	'yaml',
	'bash',
];

const ALIASES: Record<string, AdsHighlightedCodeLanguage> = {
	ts: 'typescript',
	js: 'javascript',
	yml: 'yaml',
	sh: 'bash',
	shell: 'bash',
};

const LABELS: Record<AdsHighlightedCodeLanguage, string> = {
	typescript: 'TypeScript',
	tsx: 'TSX',
	javascript: 'JavaScript',
	jsx: 'JSX',
	java: 'Java',
	sql: 'SQL',
	json: 'JSON',
	html: 'HTML',
	css: 'CSS',
	xml: 'XML',
	yaml: 'YAML',
	bash: 'Bash',
};

type LanguageModule = { default: LanguageInput };

const LOADERS: Record<AdsHighlightedCodeLanguage, () => Promise<LanguageModule>> = {
	typescript: () => import('@shikijs/langs/typescript'),
	tsx: () => import('@shikijs/langs/tsx'),
	javascript: () => import('@shikijs/langs/javascript'),
	jsx: () => import('@shikijs/langs/jsx'),
	java: () => import('@shikijs/langs/java'),
	sql: () => import('@shikijs/langs/sql'),
	json: () => import('@shikijs/langs/json'),
	html: () => import('@shikijs/langs/html'),
	css: () => import('@shikijs/langs/css'),
	xml: () => import('@shikijs/langs/xml'),
	yaml: () => import('@shikijs/langs/yaml'),
	bash: () => import('@shikijs/langs/bash'),
};

const customLoaders = new Map<string, () => Promise<LanguageModule>>();

export function normalizeHighlightedLanguage(
	language: string | undefined,
): AdsHighlightedCodeLanguage | undefined {
	if (!language) return undefined;
	const key = language.trim().toLowerCase();
	const resolved = (ALIASES[key] ?? key) as AdsHighlightedCodeLanguage;
	return ADS_HIGHLIGHTED_CODE_LANGUAGES.includes(resolved) || customLoaders.has(resolved)
		? resolved
		: undefined;
}

export function languageLabel(language: string | undefined): string {
	const normalized = normalizeHighlightedLanguage(language);
	if (!normalized) return language?.trim() || 'Texto';
	return LABELS[normalized] ?? normalized;
}

export function registerHighlightedLanguageLoader(
	id: string,
	loader: () => Promise<LanguageModule>,
): void {
	const key = id.trim().toLowerCase();
	if (!key) throw new Error('O identificador da linguagem não pode ser vazio.');
	customLoaders.set(key, loader);
}

export async function loadLanguageModule(
	language: AdsHighlightedCodeLanguage,
): Promise<LanguageModule> {
	const loader = customLoaders.get(language) ?? LOADERS[language];
	return loader();
}
