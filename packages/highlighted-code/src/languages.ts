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

/**
 * Módulo de gramática TextMate no formato do Shiki (`@shikijs/langs/*`): o `default` é uma
 * gramática ou uma lista delas. O `name` da gramática precisa ser igual ao `id` registrado.
 */
export interface AdsHighlightedCodeLanguageModule {
	default: object | readonly object[];
}

type LanguageLoader = () => Promise<AdsHighlightedCodeLanguageModule>;

const LOADERS: Record<AdsHighlightedCodeLanguage, LanguageLoader> = {
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

const customLoaders = new Map<string, LanguageLoader>();

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

/**
 * Registra (ou substitui, inclusive uma linguagem embutida) o carregador de uma linguagem.
 * Registre durante a inicialização da aplicação, antes do primeiro uso da linguagem, e use um
 * `id` igual ao `name` da gramática: com nomes diferentes o código segue em texto plain.
 */
export function registerHighlightedLanguageLoader(id: string, loader: LanguageLoader): void {
	const key = id.trim().toLowerCase();
	if (!key) throw new Error('O identificador da linguagem não pode ser vazio.');
	customLoaders.set(key, loader);
}

export async function loadLanguageModule(
	language: AdsHighlightedCodeLanguage,
): Promise<AdsHighlightedCodeLanguageModule> {
	const loader = customLoaders.get(language) ?? LOADERS[language];
	return loader();
}

export function resetCustomLanguageLoadersForTests(): void {
	customLoaders.clear();
}
