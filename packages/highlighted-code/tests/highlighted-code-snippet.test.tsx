import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdsHighlightedCodeSnippet } from '../src/highlighted-code-snippet.js';
import * as highlighter from '../src/highlighter.js';
import {
	languageLabel,
	normalizeHighlightedLanguage,
	registerHighlightedLanguageLoader,
} from '../src/languages.js';

const maliciousSample = '<script>alert(1)</script>\n<img src=x onerror=alert(1)>';

function expectLiteralHtmlSample(container: HTMLElement) {
	const region = container.querySelector('.ads-highlighted-code-snippet') ?? container;
	expect(region.textContent).toContain('<script>alert(1)</script>');
	expect(region.textContent).toContain('<img src=x onerror=alert(1)>');
	expect(within(region as HTMLElement).queryByRole('img')).toBeNull();
	expect(region.querySelector('script')).toBeNull();
	expect(region.querySelector('img')).toBeNull();
}

afterEach(() => {
	highlighter.resetHighlighterForTests();
	vi.restoreAllMocks();
	document.documentElement.dataset.theme = 'light';
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

	it('exibe marcadores HTML/script como texto literal após o highlight assíncrono', async () => {
		vi.spyOn(highlighter, 'tokenizeHighlightedCode').mockResolvedValue([
			[{ content: '<script>alert(1)</script>' }],
			[{ content: '<img src=x onerror=alert(1)>' }],
		]);
		const { container } = render(
			<AdsHighlightedCodeSnippet code={maliciousSample} language="html" theme="light" />,
		);
		expectLiteralHtmlSample(container);
		await waitFor(() => {
			expect(highlighter.tokenizeHighlightedCode).toHaveBeenCalled();
		});
		expectLiteralHtmlSample(container);
	});

	it('exibe marcadores HTML/script como texto literal no fallback plain', async () => {
		vi.spyOn(highlighter, 'tokenizeHighlightedCode').mockResolvedValue(null);
		const { container } = render(
			<AdsHighlightedCodeSnippet code={maliciousSample} language="html" theme="light" />,
		);
		expectLiteralHtmlSample(container);
		await waitFor(() => {
			expect(highlighter.tokenizeHighlightedCode).toHaveBeenCalled();
		});
		expectLiteralHtmlSample(container);
	});

	it('exibe marcadores HTML/script como texto literal sem motor de highlighting', () => {
		const { container } = render(
			<AdsHighlightedCodeSnippet code={maliciousSample} language="cobol" theme="light" />,
		);
		expectLiteralHtmlSample(container);
	});

	describe('theme auto', () => {
		beforeEach(() => {
			window.matchMedia = vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				addListener: vi.fn(),
				removeListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})) as unknown as typeof window.matchMedia;
		});

		it('acompanha data-theme no documentElement', async () => {
			document.documentElement.dataset.theme = 'dark';
			const { container } = render(
				<AdsHighlightedCodeSnippet code="const x = 1" language="typescript" theme="auto" />,
			);
			const section = container.querySelector('section');
			expect(section).not.toBeNull();
			await waitFor(() => {
				expect(section).toHaveAttribute('data-resolved-theme', 'dark');
			});
		});

		it('reage a mudanças de data-theme via MutationObserver', async () => {
			document.documentElement.dataset.theme = 'light';
			const { container } = render(
				<AdsHighlightedCodeSnippet code="const x = 1" language="typescript" theme="auto" />,
			);
			const section = container.querySelector('section');
			expect(section).not.toBeNull();
			await waitFor(() => {
				expect(section).toHaveAttribute('data-resolved-theme', 'light');
			});
			await act(async () => {
				document.documentElement.dataset.theme = 'dark';
			});
			await waitFor(() => {
				expect(section).toHaveAttribute('data-resolved-theme', 'dark');
			});
		});

		it('desconecta o MutationObserver ao desmontar', () => {
			document.documentElement.dataset.theme = 'light';
			const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');
			const { unmount } = render(
				<AdsHighlightedCodeSnippet code="const x = 1" language="typescript" theme="auto" />,
			);
			unmount();
			expect(disconnectSpy).toHaveBeenCalled();
			disconnectSpy.mockRestore();
		});
	});
});
