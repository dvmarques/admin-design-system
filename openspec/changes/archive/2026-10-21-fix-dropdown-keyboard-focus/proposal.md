## Why

A issue #125 mostra que abrir AdsDropdown pelo teclado deixa o foco no gatilho quando o portal ainda não montou. O usuário precisa alcançar os itens e navegar pelo menu usando teclado.

## What Changes

- Coordenar o foco inicial com a montagem efetiva do conteúdo e registrar a intenção de abertura por teclado.
- Preservar abertura por mouse, estado controlado/não controlado, navegação, ativação e Escape.
- Acrescentar regressões de componente e navegador e documentar o contrato no Storybook.
- Fora do escopo: outros overlays, estilos, tokens, dependências e o lint de worktrees aninhados (#128).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `navigation-menus`: explicitar o foco após montagem tardia, reabertura e preservação do mouse.

## Impact

A implementação muda apenas `@admin-ds/components`, nas APIs existentes AdsDropdown, Trigger e Content, sem alterar assinaturas, exports ou CSS. Storybook documenta a interação; o admin-demo existente valida os pacotes públicos e CSS compilado via Playwright, sem regras novas no app. Sem impacto em tokens, admin, roteamento, dependências ou bundle significativo.
