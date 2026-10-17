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
   `--ads-motion-normal` como `0ms` (e `--ads-motion-easing` inalterado), nos três
   seletores de tema. Alternativa: `* { transition: none !important }` em
   `.ads-*`; descartada por `!important`, por conflitar com consumidores e por
   não ser personalizável. Trade-off: componentes que não usam o token precisam
   ser migrados; um teste varre `packages/components/src` e exige que toda
   classe `transition-*` use `duration-[var(--ads-motion-*)]` ou `motion-reduce:`.
2. **Animações contínuas e transformações mantêm `motion-reduce:`.** Spinner e
   skeleton não dependem de duração de token; `animate-*` e `hover:-translate-y-px`
   ficam com `motion-reduce:animate-none`/`transform-none`. O LoadingIndicator já
   expõe `role="status"` e texto, preservando o estado.
3. **`forced-colors` em CSS compilado dos pacotes, com cores de sistema.** Um bloco
   `@media (forced-colors: active)` em cada `styles.css` (`components` e `admin`)
   usa seletores `.ads-*` existentes e `Highlight`, `CanvasText`, `ButtonText`,
   `GrayText`, `Canvas`. Foco usa `outline` com `CanvasText`/`Highlight` e
   `outline-offset`; seleção usa `outline`/borda `Highlight` (o fundo é descartado);
   Badge e campos ganham `border: 1px solid` de sistema. Sem novos prefixos
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
5. **Novo papel `borderControl` em vez de escurecer `border`.** `border` é
   decorativo (divisores, cartões) e escurecê-lo mudaria todo o visual; limites de
   controles precisam de 3:1 (WCAG 1.4.11). Form controls, Select, DatePicker e
   SelectionControl passam a usar `border-border-control`. É um token novo
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
