# Proposal

## Why

A issue #213 pede visualização de código com syntax highlighting via **AdsHighlightedCodeSnippet**, em pacote opcional e independente, sem incluir Shiki no bundle principal do design system. O catálogo do demo hoje usa `<pre><code>` plain; não existe `CodeSnippet` reutilizável em `packages/components`.

## What Changes

Perfil: **Standard** (novo pacote público opcional, integração no demo/catálogo, testes unitários e E2E, medição de bundle, documentação).

- Novo workspace `@admin-ds/highlighted-code` com dependência `shiki`, export próprio (nunca reexportado por `@admin-ds/components`).
- Carregamento sob demanda do motor, gramáticas e temas; código plain imediato; fallback plain em falha ou linguagem desconhecida.
- Linguagens iniciais: TypeScript, TSX, JavaScript, JSX, Java, SQL, JSON, HTML, CSS, XML, YAML e Bash; API extensível.
- Cabeçalho com linguagem e copiar código original; `showLineNumbers`, `wrapLines`, `theme: 'light' | 'dark' | 'auto'`.
- Catálogo do demo substitui `<pre><code>` por `AdsHighlightedCodeSnippet`, preservando snippets automáticos e cópia.
- Página de exemplos interativos no demo (Java, SQL, TSX, temas) sem substituir rotas existentes.
- Documentação de instalação, props, fallback e testes (idiomas, tema, cópia, linhas, wrap, falhas).
- Orçamentos de bundle: baseline do pacote novo; `@admin-ds/components` inalterado por Shiki.

Fora do escopo: `CodeEditor`/CodeMirror, archive desta change na mesma PR, novo `CodeSnippet` plain.

## Capabilities

### New Capabilities

- `highlighted-code`: pacote opcional, componente público, highlighting assíncrono e requisitos de segurança/acessibilidade.

### Modified Capabilities

- `component-catalog`: exibição de código TSX copiável com highlighting no preview.
- `admin-demo-application`: exemplos interativos e navegação para a demonstração de código destacado.

## Impact

- `packages/highlighted-code` (novo), `apps/admin-demo`, `e2e`, `docs/`, scripts de build/inspeção e orçamentos.
- `CHANGELOG.md`, `README.md`, grafo de workspaces em `scripts/ci-impact.mjs`.
- Pacotes `@admin-ds/tokens`, `@admin-ds/components` e `@admin-ds/admin` sem reexport nem dependência de Shiki.
