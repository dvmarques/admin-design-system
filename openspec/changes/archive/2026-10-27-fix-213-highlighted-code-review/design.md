# Design

## Tema `auto`

- `useResolvedTheme` começa em `null` para `auto` e resolve no efeito de layout (`useLayoutEffect` no cliente, `useEffect` no servidor para não gerar aviso de SSR): percorre `section.closest('[data-theme]')` e, se o valor não é `light`/`dark`, sobe ao próximo ancestral com o atributo (como a herança de variáveis dos tokens); valor inválido em `documentElement` vale `light` (`:root` nos tokens) e só a ausência do atributo usa `matchMedia('(prefers-color-scheme: dark)')`.
- `MutationObserver` em `documentElement` com `{ attributes, subtree, attributeFilter: ['data-theme'] }` cobre mudança no documento e em qualquer ancestral; um listener de `matchMedia` cobre o sistema. Ambos são desconectados no unmount.
- Enquanto pendente: sem tokenização e sem `data-resolved-theme`; o CSS usa as propriedades `--ads-hc-surface/text/line-number`, definidas em `:root`, `[data-theme='light']`, `[data-theme='dark']` e `:root:not([data-theme])` sob `prefers-color-scheme: dark` (e, depois da resolução, no próprio snippet por `[data-resolved-theme]`) (mesmas regras dos tokens, herança pelo `[data-theme]` mais próximo), com os valores do tema do Shiki (`#fff`/`#1e1e1e`). Assim não há flash claro nem deslocamento de tom na hidratação, sem JavaScript, e a tokenização acontece uma vez, no tema final. Alternativa descartada: `codeToTokens` com `themes: { light, dark }` (dobra o custo de tokenização e o payload de cores).

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

- `<p role="status">` sempre montado (vazio ocupa 0 px), limpo após ~4 s e quando `code` muda; `<pre tabIndex=0>` com `role="group"` e `aria-label`. Cópias seguidas com a mesma mensagem visível a marcam como oculta e a repõem no tick seguinte (`setTimeout(0)` no mesmo efeito do timer de 4 s, que reinicia), pois uma região `status` só anuncia quando o texto muda; sem caractere invisível e sem refs.
- Número de linha: `#6e7681` sobre `#fff` (4,59:1) no claro e `#8b8b8b` sobre `#1e1e1e` (4,89:1) no escuro, definidos pelas propriedades acima (antes da resolução) e por `[data-resolved-theme]` (depois).

## Testes

- Vitest com o motor real para as 12 linguagens, falha única do motor e da gramática com nova tentativa, concorrência, limites, SSR + `hydrateRoot` sem `console.error`, tema por ancestral (inclusive valor inválido) e `prefers-color-scheme` (com o evento `change` capturado no mock e `removeEventListener` com o mesmo handler no unmount), componente com o motor real (tema por ancestral e linha vazia), cópia (CRLF, linhas vazias, caracteres especiais, falha do clipboard, mensagem repetida) e troca dinâmica de código/linguagem/tema.
- `bundle-isolation.test.mjs` cobre `components`, `admin` e `tokens` (cenário e `dist`).
- Playwright: altura das linhas (inclusive vazias) depois do destaque.

## Orçamento de bundle

- O cenário minificado `highlighted-code-public` cresce apenas ~0,8 KB (o Shiki domina); `components`, `admin` e `tokens` ficam idênticos. O `dist` do pacote opcional cresce mais (código, comentários, maps e `.d.ts` não minificados, além do CSS por tema), então `bundle-baseline.json` (`@admin-ds/highlighted-code`) e `browser-budget.json` (bytes e gzip) do pacote opcional foram atualizados de forma explícita; os demais orçamentos não mudam.
