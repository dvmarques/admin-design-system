## Why

A issue #127 mostra que um único Escape fecha ao mesmo tempo um overlay interno (`AdsPopover`, calendário do `AdsDatePicker`, `AdsDropdown`) e o `AdsDialog` ou `AdsDrawer` pai. Cada camada instala seu próprio listener em `document`, sem coordenação, e o pai fecha de forma involuntária, interrompendo o fluxo do usuário.

## What Changes

- Coordenar o Escape entre as camadas que usam a infraestrutura compartilhada: o primeiro Escape é tratado apenas pela camada superior, na ordem de abertura.
- A camada tratada marca o evento com `preventDefault()`, sem `stopPropagation()`.
- Uma camada que está aberta mas não pode fechar por Escape (`closeOnEscape={false}`, `pending` do `AdsConfirmDialog`) absorve o Escape e não deixa um ancestral fechar.
- Preservar a devolução de foco já existente em cada camada.
- Acrescentar regressões de componente e de navegador e documentar o comportamento no Storybook.
- Fora do escopo: Escape no `AdsTooltip` e validação do `AdsDrawer` (#91), clique dentro do `AdsPopover` (#126), o painel de colunas do `AdsSmartTable`, estilos, tokens e dependências.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `overlay-dialogs`: Escape em overlays aninhados fecha só a camada superior.
- `anchored-overlays`: popovers e menus aninhados em outro overlay respeitam a ordem das camadas.
- `admin-flows`: `AdsConfirmDialog` com `pending` não fecha por um Escape destinado a uma camada interna nem deixa o Escape alcançar um ancestral.

## Impact

- Pacotes afetados: `@admin-ds/components` (`overlay-utils`, `overlay-dialog`, `overlay-anchored`, `dropdown`). `@admin-ds/admin` só ganha testes, porque o `AdsConfirmDialog` já repassa `closeOnEscape` ao `AdsDialog`.
- APIs públicas: nenhuma assinatura, export, classe CSS ou variável CSS muda. O hook `useEscapeKey` é interno e não consta nos `exports` do pacote.
- Biblioteca reutilizável: a correção fica em `packages/components`. A demonstração (`apps/admin-demo`) ganha apenas um exemplo de consumo público para o teste E2E, e o Storybook documenta a interação.
- Mudança de comportamento observável, sem alterar tipos: o Escape tratado fica marcado com `defaultPrevented`, e um diálogo que não fecha por Escape (`closeOnEscape={false}` ou `pending`) passa a impedir que um ancestral feche (ver `design.md`).
- Sem impacto em tokens, roteamento, dependências ou bundle significativo (uma lista em módulo e um listener).
