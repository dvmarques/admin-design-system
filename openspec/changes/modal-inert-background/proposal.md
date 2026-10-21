## Why

A issue #149 reproduz uma lacuna de acessibilidade: `AdsDialog` e `AdsDrawer` expõem `aria-modal="true"` e prendem o foco por um listener de Tab, mas o restante da página continua alcançável por clique, por leitores de tela que ignoram `aria-modal` e por outros mecanismos de navegação. A validação do `AdsDrawer` na #91 (PR #137) confirmou o contrato atual e registrou essa lacuna. Sem tornar o fundo inerte, o contrato "não alcança o conteúdo inativo da página" só vale para o Tab.

## What Changes

- Enquanto houver um `AdsDialog` ou `AdsDrawer` aberto, o conteúdo da página fora do overlay passa a ficar inerte (atributo `inert`): sem foco, sem cliques e fora da árvore de acessibilidade. Ao fechar ou desmontar, o estado anterior é restaurado, inclusive um `inert` que o consumidor já tivesse aplicado.
- Overlays modais aninhados são contados: só o modal mais recente fica interativo, e a página só volta a ser interativa quando o último modal fecha ou desmonta, em qualquer ordem de fechamento.
- Popover, tooltip, menu do `AdsDropdown` e calendário do `AdsDatePicker` abertos depois do modal continuam interativos. `AdsToast` nunca fica inerte.
- Sem suporte a `inert` no navegador, o comportamento atual é mantido (foco preso por Tab e `aria-modal`), sem erro e sem fallback por `aria-hidden`.
- O registro acontece só em efeitos, no cliente: renderização no servidor, hidratação e Server Components não mudam.
- Testes de componente, `axe` e E2E com foco real no Chromium; story e documentação; registro no CHANGELOG.
- Fora do escopo: bloqueio de rolagem do fundo (scroll lock), `aria-hidden` como alternativa, observação de nós adicionados ao `body` depois da abertura do modal, API pública para registrar camadas modais, #133 e #135, estilos, tokens e dependências.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `overlay-dialogs`: o conteúdo fora de `AdsDialog` e `AdsDrawer` abertos fica inerte, com restauração do estado anterior, contagem de modais aninhados e comportamento sem suporte a `inert`.
- `anchored-overlays`: overlays ancorados abertos dentro de um modal continuam interativos.
- `toast-notifications`: um toast nunca fica inerte por causa de um modal aberto.

## Impact

- Pacotes afetados: `@admin-ds/components` (`overlay-utils`, `overlay-dialog`, `overlay-toast`). `@admin-ds/admin` herda o comportamento por `AdsConfirmDialog` e pelo drawer de navegação do `AdsAdminShell`, sem mudança de código esperada.
- APIs públicas: nenhuma assinatura, export, classe CSS ou variável CSS muda. O registro de modais e a marca `data-ads-overlay-layer` no root do portal são internos.
- Mudança de comportamento observável: com um modal aberto, o fundo deixa de receber foco, clique e leitura por tecnologia assistiva nos navegadores com suporte a `inert`. Aplicações que dependiam de interagir com a página por trás de um modal aberto deixam de poder fazê-lo.
- Biblioteca reutilizável e demonstração separadas: a correção fica em `packages/components`; `apps/docs` ganha uma story e `e2e` um fluxo no navegador sobre a demonstração pública. Impacto de bundle pequeno (cerca de 1 KB antes de minificar) e nenhuma dependência nova.
