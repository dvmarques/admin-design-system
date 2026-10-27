import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
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

function mockMatchMedia(matches: boolean) {
	window.matchMedia = vi.fn().mockImplementation((query: string) => ({
		matches,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})) as unknown as typeof window.matchMedia;
}

/** matchMedia que guarda os handlers de `change` e permite disparar a troca do sistema. */
function mockMatchMediaWithChange(initial: boolean) {
	let matches = initial;
	const handlers = new Set<(event: MediaQueryListEvent) => void>();
	const addEventListener = vi.fn((type: string, handler: (event: MediaQueryListEvent) => void) => {
		if (type === 'change') handlers.add(handler);
	});
	const removeEventListener = vi.fn(
		(type: string, handler: (event: MediaQueryListEvent) => void) => {
			if (type === 'change') handlers.delete(handler);
		},
	);
	window.matchMedia = vi.fn().mockImplementation((query: string) => ({
		get matches() {
			return matches;
		},
		media: query,
		onchange: null,
		addEventListener,
		removeEventListener,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})) as unknown as typeof window.matchMedia;
	return {
		addEventListener,
		removeEventListener,
		handlers,
		setSystemDark(value: boolean) {
			matches = value;
			for (const handler of [...handlers]) handler({ matches: value } as MediaQueryListEvent);
		},
	};
}

function lineTexts(container: HTMLElement) {
	return [...container.querySelectorAll('.ads-highlighted-code-snippet__line-content')].map(
		(line) => line.textContent,
	);
}

afterEach(() => {
	highlighter.resetHighlighterForTests();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	vi.useRealTimers();
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

	it('dá nome acessível ao bloco de código focável', () => {
		render(<AdsHighlightedCodeSnippet code="x" language="typescript" theme="light" />);
		expect(screen.getByRole('group', { name: 'Código TypeScript: conteúdo' })).toHaveAttribute(
			'tabindex',
			'0',
		);
		render(<AdsHighlightedCodeSnippet code="y" codeLabel="Consulta" theme="light" />);
		expect(screen.getByRole('group', { name: 'Consulta: conteúdo' })).toBeInTheDocument();
	});
});

describe('linhas', () => {
	it('mantém a linha vazia com altura de linha no plain e no destacado', async () => {
		vi.spyOn(highlighter, 'tokenizeHighlightedCode').mockResolvedValue([
			[{ content: 'a' }],
			[],
			[{ content: 'b' }],
		]);
		const { container } = render(
			<AdsHighlightedCodeSnippet code={'a\n\nb'} language="bash" theme="light" showLineNumbers />,
		);
		expect(lineTexts(container)).toEqual(['a', ' ', 'b']);
		await waitFor(() => {
			expect(highlighter.tokenizeHighlightedCode).toHaveBeenCalledTimes(1);
		});
		await act(async () => {});
		expect(lineTexts(container)).toEqual(['a', ' ', 'b']);
	});

	it('não cria linha extra numerada para a quebra final e normaliza CRLF', () => {
		const { container } = render(
			<AdsHighlightedCodeSnippet
				code={'a\r\nb\r\n'}
				language="cobol"
				theme="light"
				showLineNumbers
			/>,
		);
		expect(lineTexts(container)).toEqual(['a', 'b']);
		expect(container.querySelectorAll('.ads-highlighted-code-snippet__line-number')).toHaveLength(
			2,
		);
	});

	it('renderiza código extenso em plain sem destacar', async () => {
		const code = Array.from(
			{ length: highlighter.MAX_HIGHLIGHTED_LINES + 200 },
			(_, i) => `l${i}`,
		).join('\n');
		const { container } = render(
			<AdsHighlightedCodeSnippet code={code} language="bash" theme="light" showLineNumbers />,
		);
		await act(async () => {});
		expect(container.querySelectorAll('.ads-highlighted-code-snippet__line')).toHaveLength(
			highlighter.MAX_HIGHLIGHTED_LINES + 200,
		);
		expect(container.querySelector('.ads-highlighted-code-snippet__plain')).not.toBeNull();
	});
});

describe('troca dinâmica', () => {
	it('retokeniza ao mudar código, linguagem e tema e descarta tokens antigos', async () => {
		const tokenize = vi
			.spyOn(highlighter, 'tokenizeHighlightedCode')
			.mockImplementation(async (code, language, theme) => [
				[{ content: `${code}|${language}|${theme}` }],
			]);
		const { rerender, container } = render(
			<AdsHighlightedCodeSnippet code="um" language="bash" theme="light" />,
		);
		await waitFor(() => expect(container.textContent).toContain('um|bash|light'));

		rerender(<AdsHighlightedCodeSnippet code="dois" language="bash" theme="light" />);
		expect(container.textContent).not.toContain('um|bash|light');
		expect(container.textContent).toContain('dois');
		await waitFor(() => expect(container.textContent).toContain('dois|bash|light'));

		rerender(<AdsHighlightedCodeSnippet code="dois" language="sql" theme="light" />);
		await waitFor(() => expect(container.textContent).toContain('dois|sql|light'));

		rerender(<AdsHighlightedCodeSnippet code="dois" language="sql" theme="dark" />);
		expect(container.querySelector('section')).toHaveAttribute('data-resolved-theme', 'dark');
		await waitFor(() => expect(container.textContent).toContain('dois|sql|dark'));
		expect(tokenize).toHaveBeenCalledTimes(4);
	});

	it('mostra o código plain de uma linguagem desconhecida ao trocar de linguagem', async () => {
		vi.spyOn(highlighter, 'tokenizeHighlightedCode').mockResolvedValue([[{ content: 'tok' }]]);
		const { rerender, container } = render(
			<AdsHighlightedCodeSnippet code="x" language="bash" theme="light" />,
		);
		await waitFor(() => expect(container.textContent).toContain('tok'));
		rerender(<AdsHighlightedCodeSnippet code="x" language="cobol" theme="light" />);
		expect(container.textContent).not.toContain('tok');
		expect(container.querySelector('section')).toHaveAttribute('data-language', 'plain');
	});
});

describe('copiar', () => {
	function stubClipboard(writeText: ReturnType<typeof vi.fn>) {
		vi.stubGlobal('navigator', { clipboard: { writeText } });
	}

	it('copia o código original e anuncia numa região de status persistente', async () => {
		const user = userEvent.setup();
		const writeText = vi.fn().mockResolvedValue(undefined);
		stubClipboard(writeText);
		render(<AdsHighlightedCodeSnippet code={'linha\n2'} language="json" theme="light" />);
		const status = screen.getByRole('status');
		expect(status).toBeEmptyDOMElement();
		await user.click(screen.getByRole('button', { name: 'Copiar código' }));
		expect(writeText).toHaveBeenCalledWith('linha\n2');
		expect(screen.getByRole('status')).toBe(status);
		expect(status).toHaveTextContent('Código copiado.');
	});

	it('copia CRLF, linhas vazias e caracteres especiais sem alterar', async () => {
		const user = userEvent.setup();
		const writeText = vi.fn().mockResolvedValue(undefined);
		stubClipboard(writeText);
		const code = 'a\r\n\r\n<b>&"\'`${x}</b>\t日本語\r\n';
		render(<AdsHighlightedCodeSnippet code={code} language="html" theme="light" />);
		await user.click(screen.getByRole('button', { name: 'Copiar código' }));
		expect(writeText).toHaveBeenCalledWith(code);
	});

	it('informa a falha do clipboard sem quebrar o componente', async () => {
		const user = userEvent.setup();
		stubClipboard(vi.fn().mockRejectedValue(new Error('negado')));
		render(<AdsHighlightedCodeSnippet code="x" language="bash" theme="light" />);
		await user.click(screen.getByRole('button', { name: 'Copiar código' }));
		expect(screen.getByRole('status')).toHaveTextContent('Não foi possível copiar');
		expect(screen.getByRole('button', { name: 'Copiar código' })).toBeEnabled();
	});

	it('limpa a mensagem depois de um tempo e ao trocar o código', async () => {
		vi.useFakeTimers();
		stubClipboard(vi.fn().mockResolvedValue(undefined));
		const { rerender } = render(
			<AdsHighlightedCodeSnippet code="x" language="cobol" theme="light" />,
		);
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Copiar código' }));
		});
		expect(screen.getByRole('status')).toHaveTextContent('Código copiado.');
		await act(async () => {
			vi.advanceTimersByTime(4000);
		});
		expect(screen.getByRole('status')).toBeEmptyDOMElement();

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Copiar código' }));
		});
		expect(screen.getByRole('status')).toHaveTextContent('Código copiado.');
		rerender(<AdsHighlightedCodeSnippet code="y" language="cobol" theme="light" />);
		expect(screen.getByRole('status')).toBeEmptyDOMElement();
	});
});

describe('copiar repetido', () => {
	it('reanuncia a mesma mensagem em dois cliques seguidos sem texto extra', async () => {
		vi.useFakeTimers();
		vi.stubGlobal('navigator', {
			clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
		});
		render(<AdsHighlightedCodeSnippet code="x" language="cobol" theme="light" />);
		const status = screen.getByRole('status');
		const texts: string[] = [];
		const observer = new MutationObserver(() => texts.push(status.textContent ?? ''));
		observer.observe(status, { childList: true, characterData: true, subtree: true });

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Copiar código' }));
		});
		expect(status).toHaveTextContent('Código copiado.');
		await act(async () => {
			vi.advanceTimersByTime(3000);
		});

		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Copiar código' }));
		});
		expect(status).toBeEmptyDOMElement();
		await act(async () => {
			vi.advanceTimersByTime(1);
		});
		expect(status).toHaveTextContent('Código copiado.');

		// O timer reinicia a partir da reposição: 3000 ms depois a mensagem ainda está lá.
		await act(async () => {
			vi.advanceTimersByTime(3000);
		});
		expect(status).toHaveTextContent('Código copiado.');
		await act(async () => {
			vi.advanceTimersByTime(1000);
		});
		expect(status).toBeEmptyDOMElement();

		await act(async () => {
			await Promise.resolve();
		});
		expect(texts.every((text) => text === '' || text === 'Código copiado.')).toBe(true);
		observer.disconnect();
	});
});

describe('tema', () => {
	beforeEach(() => mockMatchMedia(false));

	it('claro e escuro explícitos independem da página', () => {
		document.documentElement.dataset.theme = 'dark';
		const { container } = render(
			<>
				<AdsHighlightedCodeSnippet code="x" language="cobol" theme="light" />
				<AdsHighlightedCodeSnippet code="x" language="cobol" theme="dark" />
			</>,
		);
		const [light, dark] = [...container.querySelectorAll('section')];
		expect(light).toHaveAttribute('data-resolved-theme', 'light');
		expect(dark).toHaveAttribute('data-resolved-theme', 'dark');
	});

	it('auto acompanha data-theme no documentElement', async () => {
		document.documentElement.dataset.theme = 'dark';
		const { container } = render(
			<AdsHighlightedCodeSnippet code="const x = 1" language="typescript" theme="auto" />,
		);
		await waitFor(() => {
			expect(container.querySelector('section')).toHaveAttribute('data-resolved-theme', 'dark');
		});
	});

	it('auto reage a mudanças de data-theme via MutationObserver', async () => {
		document.documentElement.dataset.theme = 'light';
		const { container } = render(
			<AdsHighlightedCodeSnippet code="const x = 1" language="typescript" theme="auto" />,
		);
		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-resolved-theme', 'light');
		await act(async () => {
			document.documentElement.dataset.theme = 'dark';
		});
		await waitFor(() => expect(section).toHaveAttribute('data-resolved-theme', 'dark'));
	});

	it('auto usa o data-theme do ancestral mais próximo, não o do documento', async () => {
		document.documentElement.dataset.theme = 'light';
		const { container } = render(
			<div data-theme="dark" data-testid="escopo">
				<AdsHighlightedCodeSnippet code="x" language="cobol" theme="auto" />
			</div>,
		);
		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-resolved-theme', 'dark');

		await act(async () => {
			screen.getByTestId('escopo').dataset.theme = 'light';
		});
		await waitFor(() => expect(section).toHaveAttribute('data-resolved-theme', 'light'));

		document.documentElement.dataset.theme = 'dark';
		render(
			<div data-theme="light" data-testid="claro">
				<AdsHighlightedCodeSnippet code="y" language="cobol" theme="auto" />
			</div>,
		);
		expect(screen.getByTestId('claro').querySelector('section')).toHaveAttribute(
			'data-resolved-theme',
			'light',
		);
	});

	it('auto segue prefers-color-scheme quando não há data-theme', () => {
		delete document.documentElement.dataset.theme;
		mockMatchMedia(true);
		const { container, unmount } = render(
			<AdsHighlightedCodeSnippet code="x" language="cobol" theme="auto" />,
		);
		expect(container.querySelector('section')).toHaveAttribute('data-resolved-theme', 'dark');
		unmount();
		mockMatchMedia(false);
		const second = render(<AdsHighlightedCodeSnippet code="x" language="cobol" theme="auto" />);
		expect(second.container.querySelector('section')).toHaveAttribute(
			'data-resolved-theme',
			'light',
		);
	});

	it('auto em página escura tokeniza só o tema escuro', async () => {
		document.documentElement.dataset.theme = 'dark';
		const tokenize = vi.spyOn(highlighter, 'tokenizeHighlightedCode').mockResolvedValue(null);
		render(<AdsHighlightedCodeSnippet code="x" language="bash" theme="auto" />);
		await waitFor(() => expect(tokenize).toHaveBeenCalled());
		await act(async () => {});
		expect(tokenize.mock.calls.map((call) => call[2])).toEqual(['dark']);
	});

	it('desconecta o MutationObserver e o listener de mídia ao desmontar', () => {
		const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
		const media = mockMatchMediaWithChange(false);
		const { unmount } = render(
			<AdsHighlightedCodeSnippet code="x" language="cobol" theme="auto" />,
		);
		const added = media.addEventListener.mock.calls.filter(([type]) => type === 'change');
		expect(added).toHaveLength(1);
		unmount();
		expect(disconnect).toHaveBeenCalled();
		expect(media.removeEventListener).toHaveBeenCalledWith('change', added[0]![1]);
		expect(media.handlers.size).toBe(0);
	});

	it('auto reage à troca do esquema do sistema (evento change) sem data-theme', async () => {
		delete document.documentElement.dataset.theme;
		const media = mockMatchMediaWithChange(false);
		const { container } = render(
			<AdsHighlightedCodeSnippet code="x" language="cobol" theme="auto" />,
		);
		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-resolved-theme', 'light');
		await act(async () => media.setSystemDark(true));
		expect(section).toHaveAttribute('data-resolved-theme', 'dark');
		await act(async () => media.setSystemDark(false));
		expect(section).toHaveAttribute('data-resolved-theme', 'light');
	});

	it('auto ignora data-theme inválido no ancestral e sobe ao próximo válido', async () => {
		document.documentElement.dataset.theme = 'dark';
		const { container } = render(
			<div data-theme="system" data-testid="invalido">
				<AdsHighlightedCodeSnippet code="x" language="cobol" theme="auto" />
			</div>,
		);
		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-resolved-theme', 'dark');

		await act(async () => {
			screen.getByTestId('invalido').dataset.theme = 'light';
		});
		await waitFor(() => expect(section).toHaveAttribute('data-resolved-theme', 'light'));
		await act(async () => {
			screen.getByTestId('invalido').dataset.theme = 'sistema';
		});
		await waitFor(() => expect(section).toHaveAttribute('data-resolved-theme', 'dark'));
	});

	it('auto ignora ancestrais inválidos aninhados e usa o sistema se a raiz não tem atributo', () => {
		delete document.documentElement.dataset.theme;
		mockMatchMedia(true);
		const { container } = render(
			<div data-theme="a">
				<div data-theme="b">
					<AdsHighlightedCodeSnippet code="x" language="cobol" theme="auto" />
				</div>
			</div>,
		);
		expect(container.querySelector('section')).toHaveAttribute('data-resolved-theme', 'dark');
	});

	it('auto trata data-theme inválido na raiz como claro, como os tokens, mesmo com sistema escuro', () => {
		document.documentElement.dataset.theme = 'weird';
		mockMatchMedia(true);
		const { container } = render(
			<div data-theme="system">
				<AdsHighlightedCodeSnippet code="x" language="cobol" theme="auto" />
			</div>,
		);
		expect(container.querySelector('section')).toHaveAttribute('data-resolved-theme', 'light');
	});
});

describe('SSR e hidratação', () => {
	function hydrate(element: React.ReactElement) {
		const html = renderToString(element);
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.append(container);
		const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
		let root!: ReturnType<typeof hydrateRoot>;
		act(() => {
			root = hydrateRoot(container, element);
		});
		return { html, container, errors, cleanup: () => act(() => root.unmount()) };
	}

	beforeEach(() => mockMatchMedia(false));

	it('hidrata o tema auto sem erros e resolve o tema no cliente', async () => {
		document.documentElement.dataset.theme = 'dark';
		const element = (
			<div data-theme="dark">
				<AdsHighlightedCodeSnippet code={'a\n\nb'} language="cobol" theme="auto" showLineNumbers />
			</div>
		);
		const { html, container, errors, cleanup } = hydrate(element);
		expect(html).not.toContain('data-resolved-theme');
		await waitFor(() => {
			expect(container.querySelector('section')).toHaveAttribute('data-resolved-theme', 'dark');
		});
		expect(errors).not.toHaveBeenCalled();
		cleanup();
		container.remove();
	});

	it('o tema escuro explícito não gera bloco claro no servidor', () => {
		const element = <AdsHighlightedCodeSnippet code="x" language="cobol" theme="dark" />;
		const { html, container, errors, cleanup } = hydrate(element);
		expect(html).toContain('data-resolved-theme="dark"');
		expect(html).not.toContain('data-resolved-theme="light"');
		expect(errors).not.toHaveBeenCalled();
		cleanup();
		container.remove();
	});
});

describe('motor real no componente', () => {
	beforeEach(() => mockMatchMedia(false));

	function tokenColors(container: HTMLElement) {
		return new Set(
			[
				...container.querySelectorAll<HTMLElement>(
					'.ads-highlighted-code-snippet__line-content span',
				),
			]
				.map((span) => span.style.color)
				.filter(Boolean),
		);
	}

	it('destaca no tema do ancestral e acompanha a troca do atributo', async () => {
		document.documentElement.dataset.theme = 'light';
		const { container } = render(
			<div data-theme="dark" data-testid="escopo">
				<AdsHighlightedCodeSnippet code="const a = 1;" language="typescript" theme="auto" />
			</div>,
		);
		const section = container.querySelector('section');
		expect(section).toHaveAttribute('data-resolved-theme', 'dark');
		await waitFor(() => expect(tokenColors(container).size).toBeGreaterThan(1));
		const dark = tokenColors(container);

		await act(async () => {
			screen.getByTestId('escopo').dataset.theme = 'light';
		});
		await waitFor(() => expect(section).toHaveAttribute('data-resolved-theme', 'light'));
		await waitFor(() => {
			const light = tokenColors(container);
			expect(light.size).toBeGreaterThan(1);
			expect([...light].some((color) => !dark.has(color))).toBe(true);
		});
		expect(container.textContent).toContain('const a = 1;');
	});

	it('mantém a linha vazia e a altura de linha depois do destaque real', async () => {
		const { container } = render(
			<AdsHighlightedCodeSnippet
				code={'const a = 1;\n\nconst b = 2;\n'}
				language="typescript"
				theme="light"
				showLineNumbers
			/>,
		);
		expect(lineTexts(container)).toEqual(['const a = 1;', ' ', 'const b = 2;']);
		await waitFor(() => expect(tokenColors(container).size).toBeGreaterThan(1));
		expect(lineTexts(container)).toEqual(['const a = 1;', ' ', 'const b = 2;']);
		expect(container.querySelectorAll('.ads-highlighted-code-snippet__line')).toHaveLength(3);
		expect(container.querySelectorAll('.ads-highlighted-code-snippet__line-number')).toHaveLength(
			3,
		);
	});
});
