## Why

A issue #91 reproduz um bug de acessibilidade: com o foco no gatilho de um `AdsTooltip`, o Escape não fecha o tooltip (WCAG 1.4.13 e padrão WAI-ARIA de tooltip exigem poder dispensá-lo sem mover foco ou ponteiro). Com a pilha de camadas da #127 já em `develop`, o Tooltip é a única camada ancorada fora dela, e o `AdsDrawer` e o painel de colunas do `AdsSmartTable` ainda não têm regressões que travem o contrato de Escape.

## What Changes

- `AdsTooltip` passa a participar da pilha de camadas de Escape enquanto está aberto, por foco ou por apontamento: o primeiro Escape fecha só o tooltip, sem capturar nem deslocar o foco; um segundo Escape chega à camada seguinte (por exemplo, o diálogo que contém o gatilho).
- Depois do Escape, o tooltip só reabre quando o gatilho recebe um novo foco ou um novo apontamento; o foco ou o ponteiro que continuam no gatilho não o reabrem.
- `aria-describedby` do gatilho continua presente apenas enquanto o tooltip está aberto.
- Validar `AdsDrawer` com testes (posicionamento à esquerda e à direita, `aria-modal`, foco preso, Escape e retorno de foco) e corrigir apenas as divergências que os testes revelarem. Tornar o restante da página inerte fica fora do escopo.
- Acrescentar regressão do painel de colunas do `AdsSmartTable` dentro de `AdsDialog` e `AdsDrawer`, sem alterar o mecanismo local de Escape do painel.
- Atualizar stories e documentação; registrar no CHANGELOG que um tooltip aberto absorve o Escape.
- Fora do escopo: API pública para registrar camadas de Escape e integração do painel de colunas à pilha (#133, change separada), `inert` no fundo dos modais, estilos, tokens e dependências.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `anchored-overlays`: Escape dispensa o `AdsTooltip` aberto, em ordem de camadas, sem mover o foco, com reabertura apenas por novo gatilho.
- `overlay-dialogs`: `AdsDrawer` mantém o contrato modal (semântica, foco, Escape, retorno de foco) nos dois posicionamentos.
- `smart-table`: o Escape que fecha o painel de colunas dentro de um diálogo não fecha o diálogo no mesmo pressionamento.

## Impact

- Pacotes afetados: `@admin-ds/components` (`overlay-anchored`, possivelmente `overlay-dialog` se os testes do drawer revelarem divergência) e testes em `@admin-ds/admin` (`AdsSmartTable`).
- APIs públicas: nenhuma assinatura, export, classe CSS ou variável CSS muda. `useEscapeKey` continua interno.
- Mudança de comportamento observável: um tooltip aberto passa a absorver o Escape, que fica marcado com `defaultPrevented`; um Escape que antes fechava só o diálogo ao redor passa a exigir dois pressionamentos quando há um tooltip aberto.
- `prefers-reduced-motion`: o tooltip não tem transição e nenhuma animação é adicionada.
- Biblioteca reutilizável e demonstração separadas: a correção fica em `packages/components`; `apps/docs` ganha stories e `e2e` um fluxo no navegador. Sem impacto relevante no bundle nem em dependências.
