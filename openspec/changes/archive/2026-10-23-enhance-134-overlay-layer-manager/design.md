## Context

`overlay-utils.tsx` já mantém `openModals`, `escapeLayers`, `overlaySources` (origem lógica do root de cada portal) e um `MutationObserver` que aplica `inert` ao fundo. Falta unificar foco, clique externo e scroll sob a mesma noção de camada.

## Decision

Manter tudo interno ao módulo, sem dependência nova nem API pública:

- `logicalContains(container, target)`: sobe de `target` pelos roots de portal usando `overlaySources` até encontrar `container`. Substitui `contains` em `useClickOutside` e no controle de Tab.
- `isTopModal(container)`: o container pertence ao modal superior de `openModals`.
- Tab: o listener global de cada modal só age se for o modal superior. Foco dentro de um popup descendente não é interceptado; foco fora do modal (por exemplo `body`) volta ao primeiro elemento.
- Clique externo: `useClickOutside` registra a camada dispensável; o backdrop do modal não fecha enquanto houver uma camada dispensável logicamente descendente aberta, pois o mesmo clique já a fecha.
- Scroll: contador no `registerModal`; ao entrar o primeiro modal, guarda `overflow` e `padding-right` inline de `documentElement` e compensa a largura da barra; ao sair o último, restaura apenas se o valor ainda for o aplicado pela biblioteca.
- Foco: a restauração e os fallbacks existentes são preservados; testes cobrem desmontagem e gatilho removido.

## Alternatives

Biblioteca de gerenciamento de camadas (Radix/react-aria): menos código próprio, mas adiciona dependência de runtime e API/semântica distintas. Um contexto React de camadas exigiria provider público e quebraria o uso isolado dos componentes. A derivação pela origem lógica dos portais reaproveita o que já existe.

## Accessibility, SSR and compatibility

Nenhum acesso a `window`/`document` na renderização; efeitos apenas no cliente. Listeners são registrados por efeito e removidos no cleanup (StrictMode safe). Componentes públicos, CSS compilado e tokens não mudam; sem impacto no bundle além de poucas linhas.
