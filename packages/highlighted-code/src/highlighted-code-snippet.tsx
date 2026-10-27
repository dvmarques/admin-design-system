'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import type { ThemedToken } from 'shiki/core';
import { tokenizeHighlightedCode, type AdsHighlightedCodeThemeMode } from './highlighter.js';
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

function resolveDocumentTheme(): AdsHighlightedCodeThemeMode {
	const value = document.documentElement.dataset.theme;
	if (value === 'dark' || value === 'light') return value;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useResolvedTheme(theme: AdsHighlightedCodeTheme): AdsHighlightedCodeThemeMode {
	const [resolved, setResolved] = useState<AdsHighlightedCodeThemeMode>(() =>
		theme === 'auto' ? 'light' : theme,
	);

	useEffect(() => {
		if (theme !== 'auto') {
			setResolved(theme);
			return;
		}
		const sync = () => setResolved(resolveDocumentTheme());
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		});
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		media.addEventListener('change', sync);
		return () => {
			observer.disconnect();
			media.removeEventListener('change', sync);
		};
	}, [theme]);

	return theme === 'auto' ? resolved : theme;
}

function PlainLine({ line }: { line: string }) {
	return <span className="ads-highlighted-code-snippet__plain">{line || ' '}</span>;
}

function TokenLine({ tokens }: { tokens: ThemedToken[] }) {
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
	code,
	tokens,
	showLineNumbers,
}: {
	code: string;
	tokens: ThemedToken[][] | null;
	showLineNumbers: boolean;
}) {
	const lines = useMemo(() => code.split('\n'), [code]);
	return (
		<pre className="ads-highlighted-code-snippet__pre" tabIndex={0}>
			<code>
				{lines.map((line, index) => {
					const lineTokens = tokens?.[index];
					return (
						<div className="ads-highlighted-code-snippet__line" key={index} role="none">
							{showLineNumbers ? (
								<span className="ads-highlighted-code-snippet__line-number" aria-hidden="true">
									{index + 1}
								</span>
							) : null}
							<span className="ads-highlighted-code-snippet__line-content">
								{lineTokens ? <TokenLine tokens={lineTokens} /> : <PlainLine line={line} />}
							</span>
						</div>
					);
				})}
			</code>
		</pre>
	);
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
	const statusId = useId();
	const resolvedTheme = useResolvedTheme(theme);
	const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);
	const [copyStatus, setCopyStatus] = useState('');
	const normalized = normalizeHighlightedLanguage(language);
	const label = languageLabel(language);
	const regionLabel = codeLabel ?? `Código ${label}`;

	useEffect(() => {
		let cancelled = false;
		setTokens(null);
		if (!normalized) return;
		void tokenizeHighlightedCode(code, language, resolvedTheme).then((result) => {
			if (!cancelled) setTokens(result);
		});
		return () => {
			cancelled = true;
		};
	}, [code, language, normalized, resolvedTheme]);

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			setCopyStatus('Código copiado.');
		} catch {
			setCopyStatus('Não foi possível copiar. Selecione o código abaixo.');
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
			className={classes}
			aria-label={regionLabel}
			data-language={normalized ?? 'plain'}
			data-resolved-theme={resolvedTheme}
		>
			<header className="ads-highlighted-code-snippet__header">
				<span className="ads-highlighted-code-snippet__language">{label}</span>
				<button type="button" className="ads-highlighted-code-snippet__copy" onClick={copyCode}>
					Copiar código
				</button>
			</header>
			{copyStatus ? (
				<p id={statusId} className="ads-highlighted-code-snippet__feedback" role="status">
					{copyStatus}
				</p>
			) : null}
			<div className="ads-highlighted-code-snippet__viewport">
				<CodeLines code={code} tokens={tokens} showLineNumbers={showLineNumbers} />
			</div>
		</section>
	);
}
