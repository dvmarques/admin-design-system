# Design

## Tema `auto`

- `useResolvedTheme` começa em `null` para `auto` e resolve no efeito de layout (`useLayoutEffect` no cliente, `useEffect` no servidor para não gerar aviso de SSR): `section.closest('[data-theme]') ?? document.documentElement`; valor `light`/`dark` vence, senão `matchMedia('(prefers-color-scheme: dark)')`.
- `MutationObserver` em `documentElement` com `{ attributes, subtree, attributeFilter: ['data-theme'] }` cobre mudança no documento e em qualquer ancestral; um listener de `matchMedia` cobre o sistema. Ambos são desconectados no unmount.
- Enquanto pendente: sem tokenização e sem `data-resolved-theme`; o CSS usa `--ads-color-surface` e `--ads-color-text`, que já seguem o tema local. Assim não há flash claro e a tokenização acontece uma vez, no tema final. Alternativa descartada: `codeToTokens` com `themes: { light, dark }` (dobra o custo de tokenização e o payload de cores).

## Linhas

- `splitHighlightedCodeLines` normaliza CRLF/CR e descarta uma única quebra final; a mesma fonte normalizada alimenta a tokenização e a exibição, então plain e destacado têm o mesmo número de linhas. A cópia continua usando `code` original.
- Linha sem tokens renderiza `' '` (igual ao plain).

## Carregamento

- Estado único do highlighter (`core`, temas, linguagens) descartado em qualquer falha do `createHighlighterCore`; `loadOnce` guarda a `Promise` por chave, deduplica concorrência e remove a chave se falhar. `resetHighlighterForTests` limpa tudo, inclusive carregadores customizados.
- Limite de código extenso (`MAX_HIGHLIGHTED_LINES = 1000`, `MAX_HIGHLIGHTED_CHARACTERS = 100_000`): acima dele `tokenizeHighlightedCode` devolve `null` antes de carregar o motor. Escolhido por ser a opção mais simples e previsível; `tokenizeTimeLimit` seria dependente de máquina.

## Dependências

- O Shiki só expõe barris `./langs` e `./themes` (todas as gramáticas), que inflariam o bundle; por isso `@shikijs/langs` e `@shikijs/themes` são declaradas em `packages/highlighted-code/package.json` na versão exata já instalada (4.5.0). Nenhuma versão existente muda e os demais pacotes não são tocados.
- `registerHighlightedLanguageLoader` usa o tipo público `AdsHighlightedCodeLanguageModule`; o `name` da gramática deve ser igual ao `id`.

## Acessibilidade e CSS

- `<p role="status">` sempre montado (vazio ocupa 0 px), limpo após ~4 s e quando `code` muda; `<pre tabIndex=0>` com `role="group"` e `aria-label`.
- Número de linha: `#6e7681` sobre `#fff` (4,59:1) no claro e `#8b8b8b` sobre `#1e1e1e` (4,89:1) no escuro, definidos dentro de `[data-resolved-theme]`.

## Testes

- Vitest com o motor real para as 12 linguagens, falha única do motor e da gramática com nova tentativa, concorrência, limites, SSR + `hydrateRoot` sem `console.error`, tema por ancestral e `prefers-color-scheme`, cópia (CRLF, linhas vazias, caracteres especiais, falha do clipboard) e troca dinâmica de código/linguagem/tema.
- `bundle-isolation.test.mjs` cobre `components`, `admin` e `tokens` (cenário e `dist`).
- Playwright: altura das linhas (inclusive vazias) depois do destaque.

## Orçamento de bundle

- O cenário minificado `highlighted-code-public` cresce apenas ~0,8 KB (o Shiki domina); `components`, `admin` e `tokens` ficam idênticos. O `dist` do pacote opcional cresce mais (código, comentários, maps e `.d.ts` não minificados, além do CSS por tema), então `bundle-baseline.json` (`@admin-ds/highlighted-code`) e `browser-budget.json` (bytes e gzip) do pacote opcional foram atualizados de forma explícita; os demais orçamentos não mudam.
