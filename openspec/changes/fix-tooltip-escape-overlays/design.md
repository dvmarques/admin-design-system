## Context

`AdsTooltip` (`overlay-anchored.tsx`) abre por `onFocus`/`onPointerEnter` e fecha por `onBlur`/`onPointerLeave`, sem tratar Escape. A pilha de camadas da #127 (`useEscapeKey` em `overlay-utils.tsx`) trata o Escape apenas na camada superior e marca o evento com `preventDefault()`. O `AdsDrawer` compartilha o `OverlayPanel` do `AdsDialog`. O painel de colunas do `AdsSmartTable` fecha por Escape num `onKeyDown` React com `stopPropagation()`.

## Goals / Non-Goals

Fechar o tooltip com Escape reaproveitando a pilha existente, sem mudar a API pública, validar o `AdsDrawer` e travar por teste o contrato do painel de colunas. Não incluir API pública de camada de Escape nem integração do painel à pilha (#133), `inert` no fundo dos modais, estilos, tokens ou dependências.

## Decisions

O tooltip chama `useEscapeKey(open, close)` e registra a camada só enquanto aberto, seja por foco ou por apontamento. Assim o Escape fecha apenas o tooltip e um segundo Escape chega ao diálogo. Segue o padrão WAI-ARIA de tooltip e a WCAG 1.4.13, que pede dispensa sem mover ponteiro ou foco.

Estado `dismissed` no tooltip: o Escape fecha e marca o tooltip como dispensado. `onFocus` e `onPointerEnter` reabrem e limpam a marca; o foco ou o ponteiro que permanecem no gatilho não disparam novos eventos e portanto não reabrem. `onBlur` e `onPointerLeave` também limpam a marca. Um foco que chega por clique no gatilho durante o apontamento conta como novo foco. Se `dismissed` for resetado em `onPointerLeave` com o foco ainda no gatilho, o tooltip permanece fechado até um novo `pointerenter`, o que é aceitável.

O Escape não move o foco: o tooltip não captura foco e não há restauração, porque o foco nunca saiu do gatilho.

Drawer: escrever testes para os dois posicionamentos antes de qualquer correção. Hoje o código indica que não há divergência de semântica, foco preso nem Escape. Só corrigir o que os testes falharem, com a correção em `overlay-dialog.tsx`/`overlay-utils.tsx`.

Painel de colunas: apenas teste de regressão com `AdsDialog`/`AdsDrawer` ao redor. O mecanismo atual (`stopPropagation` no `onKeyDown` React) continua e fica registrado como contrato até a #133 decidir sobre a API.

## Risks / Trade-offs

Um tooltip aberto por apontamento passa a absorver o Escape que fecharia o diálogo: um pressionamento a mais. É o comportamento esperado pelo padrão e fica documentado no CHANGELOG, na spec e na story.

Dois mecanismos de Escape convivem até a #133 (pilha e `stopPropagation` do painel de colunas). O teste de regressão cobre o fluxo para que a mudança não se perca.

O tooltip depende do ciclo de efeitos para registrar a camada; como ele monta no portal só quando aberto, registra depois do diálogo pai, mesmo em StrictMode.

## Validation

Vitest: tooltip aberto por foco e por apontamento fechando com Escape, foco preservado, `aria-describedby` removido e restaurado na reabertura, reabertura apenas por novo gatilho, tooltip dentro de `AdsDialog` com dois Escapes, tooltip com `AdsPopover` aberto, drawer nos dois posicionamentos e painel de colunas dentro de diálogo e drawer. Axe com o tooltip aberto. Playwright com foco real no admin-demo público. Stories de Escape e de tooltip dentro de diálogo. Verificar temas claro e escuro e `prefers-reduced-motion` (sem transição no tooltip). Executar build, typecheck, lint, testes concisos, E2E, format e `openspec validate --all --strict`.
