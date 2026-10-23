## Why

A infraestrutura interna de overlays já coordena Escape por pilha e isola o fundo com `inert`, mas o Tab/Shift+Tab (`useOverlayFocus`) e o clique externo (`useClickOutside`) usam listeners independentes e só consideram a árvore DOM. Com Dialog/Drawer, Popover e Dropdown aninhados em portais de `document.body`, um modal inferior pode reagir ao Tab do superior, um clique em um popup filho pode fechar o popup pai, um clique no backdrop pode fechar o modal junto com o popup aberto sobre ele, e o scroll da página continua ativo atrás de um modal.

## What Changes

- Centralizar em `overlay-utils` a identidade e a hierarquia lógica das camadas (modais e popups), reaproveitando a origem lógica dos portais.
- Tab e Shift+Tab passam a ser tratados somente pelo modal superior, considerando popups descendentes como parte dele.
- O clique externo considera a hierarquia lógica dos portais: interação em uma camada filha não fecha a camada pai.
- O clique no backdrop fecha apenas a camada superior: com um popup aberto sobre o modal, fecha o popup, não o modal.
- Bloquear o scroll da página enquanto houver modal aberto, com contagem para modais empilhados e restauração dos valores originais ao fechar o último.
- Cobrir Dialog+Dialog, Dialog/Drawer+Popover/Dropdown, desmontagem, gatilho removido, SSR, StrictMode e axe.

## Impact

- Biblioteca: `@admin-ds/components` (`overlay-utils`, `overlay-dialog`, `overlay-anchored`, `dropdown`, `date-picker` se consumir `useClickOutside`).
- Aplicações: `apps/admin-demo` e `apps/docs` não mudam; validadas como consumidoras.
- API pública: sem alterações. Os hooks e utilitários permanecem internos (não exportados em `exports`); CSS e classes `ads-` preservados.

## Out of Scope

- Tooltip e Escape da issue #91 (em andamento, não modificada nem incorporada).
- Painel de colunas da SmartTable (#133), que apenas se beneficia desta infraestrutura.
- Novas props, tokens ou mudanças visuais.

## Perfil de execução

Critical: altera acessibilidade transversal (foco, modalidade, isolamento e scroll) de componentes públicos. Mantém APIs e CSS; exige testes de regressão, axe, SSR, StrictMode e validação nos consumidores. Rollback: reverter `overlay-utils` e os testes em conjunto.
