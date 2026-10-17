## Context

Ver proposal.md. `@admin-ds/tokens` gera `dist/tokens.css` a partir de
`source/tokens.mjs` (`:root`/`[data-theme="light"]`, `[data-theme="dark"]` e
`prefers-color-scheme: dark` em `:root:not([data-theme])`). Os componentes usam
classes Tailwind que consomem `--ads-*`; 7 deles já têm `motion-reduce:`, mas
form controls, Field, Dropdown, DatePicker, SelectionControl, DataTable e
DataCollection têm `transition-*` sem tratamento. O foco usa `outline` e `ring`
(box-shadow, removido em `forced-colors`). Campos de formulário usam
`border-border` (slate200), que não atinge 3:1 sobre a superfície; seleção usa
`surface-selected` (fundo), que `forced-colors` descarta. O teste de contraste
atual (`packages/tokens/tests/generation.test.mjs`) cobre só 4,5:1.

## Goals / Non-Goals

**Goals:**

- Uma única fonte de verdade para movimento reduzido, herdada por todos os componentes.
- Foco, limites e seleção distinguíveis em `forced-colors` e `prefers-contrast: more`.
- Teste de contraste dirigido por dados que falhe ao ficar abaixo do AA.

**Non-Goals:**

- Tema de alto contraste nomeado, AAA, mudanças de API ou novas dependências.

## Decisions

1. **Movimento por token, não por regra global.** O gerador emite
   `@media (prefers-reduced-motion: reduce)` redefinindo `--ads-motion-fast` e
   `--ads-motion-normal` como `0ms` (e `--ads-motion-easing` inalterado), nos
   seletores `:root`, `[data-theme="light"]`, `[data-theme="dark"]` e também
   `:root:not([data-theme])`: este último tem maior especificidade e, sem ele, o
   bloco do tema escuro do sistema manteria a duração. `@theme inline` em
   `styles.css` mapeia `--default-transition-duration` para `--ads-motion-fast`,
   de modo que `transition-*` sem `duration-*` também herde o token; durações
   literais (`duration-150`) migram para o token. Alternativa:
   `* { transition: none !important }` em `.ads-*`; descartada por `!important`,
   por conflitar com consumidores e por não ser personalizável. Um teste varre
   `packages/components/src` e falha com `duration-<número>` literal ou
   `animate-*` sem `motion-reduce:animate-none`. Quem sobrescreve a duração deve
   fazê-lo fora de `reduce` (por exemplo em
   `@media (prefers-reduced-motion: no-preference)`); uma sobrescrita incondicional
   posterior ao `tokens.css` vence o bloco de movimento reduzido.
2. **Animações contínuas e transformações mantêm `motion-reduce:`.** Spinner e
   skeleton não dependem de duração de token; `animate-*` e `hover:-translate-y-px`
   ficam com `motion-reduce:animate-none`/`transform-none`. O LoadingIndicator já
   expõe `role="status"` e texto, preservando o estado.
3. **`forced-colors` em CSS compilado dos pacotes, com cores de sistema.** Um bloco
   `@media (forced-colors: active)` em cada `styles.css` (`components` e `admin`)
   usa seletores `.ads-*` existentes e as cores de sistema `Highlight`,
   `HighlightText` e `CanvasText`. O foco já usa `outline`, cuja cor o navegador
   força para uma cor de sistema (verificado por E2E), então só os estados que
   dependem de fundo ou `box-shadow` recebem regras: indicadores marcados de
   checkbox, radio e switch (`forced-color-adjust: none` com `Highlight`),
   itens de navegação, abas e dias do calendário selecionados (contorno
   `Highlight`, com foco em `CanvasText` para não se confundir com a seleção) e,
   em `@admin-ds/admin`, a linha selecionada da `AdsSmartTable` e a faixa de
   carregamento do filtro. Bordas de Button, Input e Badge já usam `border` e são
   forçadas pelo navegador. Sem novos prefixos
   públicos e sem exigir Tailwind do consumidor. Alternativa: variantes Tailwind
   `forced-colors:` nas classes dos componentes; descartada por espalhar a regra
   em dezenas de arquivos e inflar o CSS.
4. **`prefers-contrast: more` por sobrescrita de tokens.** `tokens.mjs` ganha
   `color.semanticContrast.{light,dark}` com apenas os papéis alterados (borda,
   borda de controle, texto secundário, foco). O gerador emite
   `@media (prefers-contrast: more)` para `:root`/`[data-theme]` e uma variante
   combinada com `prefers-color-scheme: dark` para `:root:not([data-theme])`,
   depois dos blocos de tema para vencer em especificidade igual. Sobrescritas da
   aplicação continuam funcionando porque ela redefine os mesmos `--ads-*` em
   seletor de maior especificidade ou posterior. Alternativa: duplicar a folha;
   descartada pelo tamanho.
5. **Novo papel `borderControl` em vez de escurecer `border`** (claro `slate500`,
   escuro `slate400`, nova referência: `slate500` no escuro dá só 2,18:1 sobre
   `surfaceHover`). `border` é
   decorativo (divisores, cartões) e escurecê-lo mudaria todo o visual; limites de
   controles precisam de 3:1 (WCAG 1.4.11). Form controls (incluindo Select e
   DatePicker) e o indicador de checkbox, radio e switch passam a usar
   `border-border-control`; Button secundário e Badge mantêm `border` porque têm
   rótulo textual. O estilo somente leitura passa de `read-only:` (que também
   casa com `select` e apagava a borda do `AdsSelect`) para o atributo
   `[readonly]`. É um token novo
   (compatível); `border` e `borderStrong` ficam como estão.
6. **Teste de contraste dirigido por dados.** Um módulo de apoio em
   `packages/tokens/tests` exporta `contrastPairs` (`{ foreground, background,
minimum, label }`), resolvido para claro, escuro e ambos com `prefers-contrast:
more`; um único teste itera e reporta par, tema e razão. Mínimos: 4,5 texto,
   3 não texto. Pares atuais (`generation.test.mjs`) migram para a lista.
7. **E2E por estilo computado, sem snapshots.** `page.emulateMedia({ reducedMotion,
forcedColors, contrast })` (Playwright 1.62) em Chromium; asserções de
   `transition-duration`, `outline-style/color` e `border-style` por papéis ARIA.
   Snapshots seguem só os atuais; mudanças de token (`borderControl`) podem
   alterá-los e são aceitas só pelo workflow de baselines, com diff revisado.

## Risks / Trade-offs

- [`borderControl` altera o visual e os snapshots] → atualizar baselines pelo
  workflow, revisar o diff e escolher o tom mais fraco que ainda atinja 3:1.
- [Cores de sistema variam entre navegadores/SO] → asserir presença e cor de
  sistema, não valores; `forced-colors` no WebKit/Firefox fica fora do E2E.
- [Ordem das regras: `prefers-contrast` vs. tema] → teste do CSS gerado verifica
  as três combinações de seletor; ordem fixa no gerador.
- [Varredura de `transition-*` pode ser rígida] → permitir exceções declaradas
  em lista no próprio teste, com justificativa.
- [Bundle] → estimado em poucos KB; validado contra o baseline de 10%.

## Migration Plan

Sem breaking changes: tokens existentes mantêm nomes e valores; `border-control`
é aditivo. Consumidores com sobrescritas não precisam agir. Rollback por revert
da PR (uma PR, `Closes #87`).
