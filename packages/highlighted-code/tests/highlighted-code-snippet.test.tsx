import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdsHighlightedCodeSnippet } from '../src/highlighted-code-snippet.js';
import * as highlighter from '../src/highlighter.js';
import {
	languageLabel,
	normalizeHighlightedLanguage,
	registerHighlightedLanguageLoader,
} from '../src/languages.js';

afterEach(() => {
	highlighter.resetHighlighterForTests();
	vi.restoreAllMocks();
});

describe('normalizeHighlightedLanguage', () => {
	it('resolve aliases e rejeita idiomas desconhecidos', () => {
		expect(normalizeHighlightedLanguage('ts')).toBe('typescript');
		expect(normalizeHighlightedLanguage('yml')).toBe('yaml');
		expect(normalizeHighlightedLanguage('cobol')).toBeUndefined();
	});
});

describe('languageLabel', () => {
	it('formata nomes amigáveis', () => {
		expect(languageLabel('tsx')).toBe('TSX');
		expect(languageLabel('unknown')).toBe('unknown');
	});
});

describe('AdsHighlightedCodeSnippet', () => {
	it('mostra plain imediatamente e depois tokens destacados', async () => {
		vi.spyOn(highlighter, 'tokenizeHighlightedCode').mockResolvedValue([
			[{ content: 'const', color: '#ff0000' }],
		]);
		render(<AdsHighlightedCodeSnippet code="const x = 1" language="typescript" theme="light" />);
		expect(screen.getByText('const x = 1')).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.getAllByText('const').length).toBeGreaterThan(0);
		});
	});

	it('permanece plain quando o highlighting falha', async () => {
		vi.spyOn(highlighter, 'tokenizeHighlightedCode').mockResolvedValue(null);
		render(<AdsHighlightedCodeSnippet code="plain" language="typescript" theme="dark" />);
		await waitFor(() => {
			expect(highlighter.tokenizeHighlightedCode).toHaveBeenCalled();
		});
		expect(screen.getByText('plain')).toBeInTheDocument();
	});

	it('copia o código original', async () => {
		const user = userEvent.setup();
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', { clipboard: { writeText } });
		render(<AdsHighlightedCodeSnippet code={'linha\n2'} language="json" theme="light" />);
		await user.click(screen.getByRole('button', { name: 'Copiar código' }));
		expect(writeText).toHaveBeenCalledWith('linha\n2');
		expect(screen.getByRole('status')).toHaveTextContent('Código copiado.');
	});

	it('exibe numeração e respeita wrap', () => {
		const { container } = render(
			<AdsHighlightedCodeSnippet
				code={'a\nb'}
				language="bash"
				showLineNumbers
				wrapLines
				theme="light"
			/>,
		);
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(container.firstElementChild).toHaveClass('ads-highlighted-code-snippet--wrap');
	});

	it('permite registrar carregadores de linguagem', async () => {
		registerHighlightedLanguageLoader('demo', async () => ({
			default: { name: 'demo', scopeName: 'source.demo', patterns: [] },
		}));
		expect(normalizeHighlightedLanguage('demo')).toBe('demo');
	});
});
