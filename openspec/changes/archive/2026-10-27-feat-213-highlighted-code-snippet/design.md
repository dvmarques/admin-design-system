# Design

## Isolamento de pacote

- Workspace `packages/highlighted-code` (`@admin-ds/highlighted-code`), versão `0.1.0` coordenada com os demais.
- Exports: `.` (componente e utilitários de linguagem) e `./styles.css`.
- `scripts/build-all.mjs` inclui o pacote após `components` (sem dependência de `admin`).
- `inspect:packages` mede distribuição e cenário `highlighted-code-public` separados; baseline de `@admin-ds/components` não absorve bytes de Shiki.

## Shiki sob demanda

- `createHighlighterCore` + `createOnigurumaEngine` com WASM carregado dinamicamente.
- Temas `github-light` e `github-dark` importados sob demanda; resolução `auto` via `data-theme` / `prefers-color-scheme` (hook interno).
- Gramáticas mapeadas por idioma suportado com `import()` de `@shikijs/langs/*`; registro extensível via mapa exportado.
- Renderização com `codeToTokens` em React (sem `dangerouslySetInnerHTML`); plain imediato até tokens prontos.

## Visual e tokens

- Container `ads-highlighted-code-snippet` com borda, raio e fundo `var(--ads-color-surface-muted)`; texto `var(--ads-color-text)`.
- Consumidor importa `@admin-ds/tokens/styles.css` (e opcionalmente components) para variáveis; pacote não acopla Tailwind.

## Catálogo do demo

- `catalog-preview.tsx` usa `AdsHighlightedCodeSnippet` com `language="tsx"`; botão **Copiar código** no cabeçalho do componente (mantém contrato E2E).
- Classe `demo-catalog-code` aplicada ao snippet para continuidade visual.

## Demo adicional

- Rota `/exemplos/codigo-destacado` com controles de linguagem, tema, linhas e wrap; exemplos fixos em Java, SQL e TSX.
- Link em **Exemplos de aplicação** na navegação.

## Segurança e acessibilidade

- Conteúdo do usuário só em nós de texto React; tokens Shiki renderizados como `span` com `color` inline do tema.
- Botão copiar com nome acessível, feedback `role="status"`; região de código com `tabIndex={0}` e label; linhas longas com rolagem horizontal no snippet, não na página.

## Testes

- Vitest: idiomas, fallback, troca de tema/linguagem, cópia, linhas, wrap, falha simulada de carregamento.
- Playwright: catálogo (código + cópia), página de exemplos, temas e 320/375/1280 px.
- Teste de integração: cenário `components-public` não referencia `@admin-ds/highlighted-code`.
