'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import type { ThemedToken } from 'shiki/core';
import {
	splitHighlightedCodeLines,
	tokenizeHighlightedCode,
	type AdsHighlightedCodeThemeMode,
} from './highlighter.js';
import { languageLabel, normalizeHighlightedLanguage } from './languages.js';

export type AdsHighlightedCodeTheme = AdsHighlightedCodeThemeMode | 'auto';

export interface AdsHighlightedCodeSnippetProps {
	code: string;
	language?: string;
	showLineNumbers?: boolean;
	wrapLines?: boolean;
	theme?: AdsHighlightedCodeTheme;
	className?: string;
	/** Rótulo acessível da região de código; padrão descreve a linguagem. */
	codeLabel?: string;
}

const COPY_FEEDBACK_MS = 4000;

// useLayoutEffect resolve o tema antes da pintura no cliente; no servidor vira useEffect (sem aviso).
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Tema efetivo no ponto da árvore: `[data-theme]` mais próximo, o documento ou o sistema. */
function resolveEffectiveTheme(element: Element): AdsHighlightedCodeThemeMode {
	const scope = element.closest<HTMLElement>('[data-theme]') ?? document.documentElement;
	const value = scope.dataset.theme;
	if (value === 'dark' || value === 'light') return value;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Tema usado pelo snippet. Em `auto` só é conhecido no cliente, depois da montagem: antes disso
 * (servidor e hidratação) retorna `null` e o CSS usa os tokens da página, sem tokenizar.
 */
function useResolvedTheme(
	theme: AdsHighlightedCodeTheme,
	elementRef: RefObject<HTMLElement | null>,
): AdsHighlightedCodeThemeMode | null {
	const [autoTheme, setAutoTheme] = useState<AdsHighlightedCodeThemeMode | null>(null);

	useIsomorphicLayoutEffect(() => {
		const element = elementRef.current;
		if (theme !== 'auto' || !element) return;
		const sync = () => setAutoTheme(resolveEffectiveTheme(element));
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(document.documentElement, {
			attributes: true,
			subtree: true,
			attributeFilter: ['data-theme'],
		});
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		media.addEventListener('change', sync);
		return () => {
			observer.disconnect();
			media.removeEventListener('change', sync);
		};
	}, [theme, elementRef]);

	return theme === 'auto' ? autoTheme : theme;
}

function LineContent({ line, tokens }: { line: string; tokens: ThemedToken[] | undefined }) {
	// Linha vazia mantém a altura de uma linha, igual no plain e no destacado.
	if (!tokens || tokens.length === 0) {
		return <span className="ads-highlighted-code-snippet__plain">{line || ' '}</span>;
	}
	return (
		<>
			{tokens.map((token, index) => (
				<span
					key={index}
					style={
						token.color || token.bgColor
							? { color: token.color, backgroundColor: token.bgColor }
							: undefined
					}
				>
					{token.content}
				</span>
			))}
		</>
	);
}

function CodeLines({
	lines,
	tokens,
	showLineNumbers,
	label,
}: {
	lines: string[];
	tokens: ThemedToken[][] | null;
	showLineNumbers: boolean;
	label: string;
}) {
	return (
		<pre className="ads-highlighted-code-snippet__pre" tabIndex={0} role="group" aria-label={label}>
			<code>
				{lines.map((line, index) => (
					<div className="ads-highlighted-code-snippet__line" key={index} role="none">
						{showLineNumbers ? (
							<span className="ads-highlighted-code-snippet__line-number" aria-hidden="true">
								{index + 1}
							</span>
						) : null}
						<span className="ads-highlighted-code-snippet__line-content">
							<LineContent line={line} tokens={tokens?.[index]} />
						</span>
					</div>
				))}
			</code>
		</pre>
	);
}

interface TokenResult {
	code: string;
	language: string;
	theme: AdsHighlightedCodeThemeMode;
	tokens: ThemedToken[][] | null;
}

export function AdsHighlightedCodeSnippet({
	code,
	language,
	showLineNumbers = false,
	wrapLines = false,
	theme = 'auto',
	className,
	codeLabel,
}: AdsHighlightedCodeSnippetProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const resolvedTheme = useResolvedTheme(theme, sectionRef);
	const [result, setResult] = useState<TokenResult | null>(null);
	const [copy, setCopy] = useState<{ code: string; message: string } | null>(null);
	const normalized = normalizeHighlightedLanguage(language);
	const label = languageLabel(language);
	const regionLabel = codeLabel ?? `Código ${label}`;
	const lines = useMemo(() => splitHighlightedCodeLines(code), [code]);
	const displayCode = useMemo(() => lines.join('\n'), [lines]);

	useEffect(() => {
		if (!normalized || !resolvedTheme) return;
		let cancelled = false;
		void tokenizeHighlightedCode(displayCode, normalized, resolvedTheme).then((tokens) => {
			if (!cancelled) {
				setResult({ code: displayCode, language: normalized, theme: resolvedTheme, tokens });
			}
		});
		return () => {
			cancelled = true;
		};
	}, [displayCode, normalized, resolvedTheme]);

	// O feedback some sozinho e não sobrevive a uma troca de código.
	useEffect(() => {
		if (!copy) return;
		const timer = setTimeout(() => setCopy(null), COPY_FEEDBACK_MS);
		return () => clearTimeout(timer);
	}, [copy]);

	const tokens =
		result &&
		result.code === displayCode &&
		result.language === normalized &&
		result.theme === resolvedTheme
			? result.tokens
			: null;
	const copyMessage = copy?.code === code ? copy.message : '';

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			setCopy({ code, message: 'Código copiado.' });
		} catch {
			setCopy({ code, message: 'Não foi possível copiar. Selecione o código abaixo.' });
		}
	}

	const classes = [
		'ads-highlighted-code-snippet',
		wrapLines ? 'ads-highlighted-code-snippet--wrap' : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<section
			ref={sectionRef}
			className={classes}
			aria-label={regionLabel}
			data-language={normalized ?? 'plain'}
			data-resolved-theme={resolvedTheme ?? undefined}
		>
			<header className="ads-highlighted-code-snippet__header">
				<span className="ads-highlighted-code-snippet__language">{label}</span>
				<button type="button" className="ads-highlighted-code-snippet__copy" onClick={copyCode}>
					Copiar código
				</button>
			</header>
			<p className="ads-highlighted-code-snippet__feedback" role="status">
				{copyMessage}
			</p>
			<div className="ads-highlighted-code-snippet__viewport">
				<CodeLines
					lines={lines}
					tokens={tokens}
					showLineNumbers={showLineNumbers}
					label={`${regionLabel}: conteúdo`}
				/>
			</div>
		</section>
	);
}
