## Why

A spec de `admin-flows` exige foco inicial em "Cancelar" sem exceção, mas o comentário público de `AdsConfirmDialog` já descreve que controles focáveis em `children` recebem o foco antes das ações. Os testes não cobriam a composição, e a escolha do foco inicial (`useOverlayFocus`) aceitava controles desabilitados por `fieldset`, ocultos (`hidden`, `display: none`, `visibility: hidden`) e inertes (issue #192; complementa #92 e não incorpora a #133).

## What Changes

- Regra aprovada, preservando o comportamento atual: o foco inicial vai ao primeiro controle interativo elegível de `children` e, sem ele, a "Cancelar". Spec, `docs/integration.md` e o comentário público passam a descrever a mesma regra e a exceção.
- Testes: "Cancelar" na composição padrão e com conteúdo apenas informativo; primeiro controle elegível de `children`; controles desabilitados, em `fieldset` desabilitado, ocultos e inertes são ignorados, com retorno a "Cancelar". Retorno de foco, `returnFocusRef`, `pending`, `alertdialog`/`dialog` e `Escape` em camadas seguem protegidos pelas regressões existentes.
- Os testes revelaram divergência: `useOverlayFocus` escolhia o primeiro seletor focável sem checar elegibilidade. Correção mínima no foco inicial, com filtro de elegibilidade.
- Exemplos: story `ConfirmWithInteractiveContent` e `ConfirmDialogDemo` do catálogo com conteúdo interativo.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-flows`: regra de foco inicial de `AdsConfirmDialog`.

## Impact

Perfil **Critical**: altera o comportamento de foco de overlays públicos e acessibilidade. Pacotes: `@admin-ds/components` (`useOverlayFocus`, usado por `AdsDialog`, `AdsDrawer` e `AdsConfirmDialog`; o foco inicial deixa de escolher controles desabilitados por `fieldset`, ocultos ou inertes, que já não eram alcançáveis pelo teclado), `@admin-ds/admin` (comentário e testes), `apps/docs` e `apps/admin-demo`. Sem nova prop, token ou dependência; a armadilha de Tab (`focusableSelector`) não muda. Fora do escopo: nova prop de foco, forçar "Cancelar" em todas as composições, mudanças gerais nos overlays e a #133.
