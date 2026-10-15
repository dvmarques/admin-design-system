# Design

## Decisões

### Corrigir a documentação, não o mecanismo

O `OverlayPortal` precisa de `data-theme` no `div` do portal para que o overlay
resolva os tokens do tema de origem (spec `theming`). O CSS gerado usa
`:root, [data-theme="light"]` e `[data-theme="dark"]`; o `div` casa com essas
regras e redeclara todas as variáveis, então uma sobrescrita em
`:root[data-theme=…]` (que só casa com o `<html>`) é encoberta nos overlays.

- **Alternativa descartada**: remover `data-theme` do portal e herdar variáveis.
  O portal vai para `document.body`, fora do escopo de temas locais, e isso
  quebraria "Overlays portados preservam o tema de origem".
- **Alternativa descartada**: gerar regras com `:where()` para reduzir
  especificidade. Mudaria o CSS distribuído e a ordem de cascata para todos os
  consumidores sem ganho sobre a orientação já válida.
- **Escolhida**: o consumidor sobrescreve com `[data-theme='light']` e
  `[data-theme='dark']` depois do CSS de tokens (mesma especificidade, vale a
  ordem de carga). Sem custo de bundle nem mudança de API.

### Teste de estilos no Vitest

O Vitest já roda com `include: ['{packages,apps}/**/*.test.{ts,tsx}']` e o
script `test` compila o CSS antes. Migrar `styles.test.mjs` para
`styles.test.ts` evita um segundo executor (`node --test`) e reaproveita o
padrão de `navigation-styles.test.ts`.

### Sublinhado em AdsNav

Classe estática `no-underline` no `<a>` do item; sem classes dinâmicas.

## Client e Server Components

Sem mudança: `AdsNav` continua um Server Component.

## Acessibilidade

Remover o sublinhado não altera o papel nem o nome do link. O item atual
continua indicado por `aria-current`, borda e superfície, e o foco visível é
preservado.

## Tailwind, CSS e bundle

`no-underline` é uma utilidade estática já analisável; o impacto no CSS
distribuído é de uma regra. Sem novas dependências.

## Conflitos de CSS com consumidores

Nenhuma classe pública nova. O reset vale só para `.ads-nav-item`.
