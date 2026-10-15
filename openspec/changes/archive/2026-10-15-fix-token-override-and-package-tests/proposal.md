# Proposal

## Why

A issue #52 reúne divergências encontradas ao implementar `add-nextjs-admin-demo`.
Esta change trata dos itens que **não** envolvem links do consumidor:

- A sobrescrita de tokens documentada em `packages/tokens/README.md`
  (`:root[data-theme=…]`) não alcança overlays em portal, porque o
  `OverlayPortal` renderiza cada overlay em um `div` com `data-theme` próprio,
  que casa com as regras geradas e redeclara todas as variáveis. A
  documentação em `docs/integration.md` já indica o seletor correto; o README
  do pacote de tokens ainda ensina o errado.
- `packages/components/tests/styles.test.mjs` não é executado por nenhum script
  do pacote: o `test` roda só o Vitest, que inclui apenas `.ts` e `.tsx`.
- Os links de `AdsNav` com `href` mantêm o sublinhado padrão do navegador.

O `fieldset` de `AdsSelectionGroup` (outro detalhe do item 4) já foi corrigido
em `fix-navigation-theme-contrast`.

## What Changes

**Biblioteca reutilizável (`packages/tokens`, `packages/components`)**

- `packages/tokens/README.md`: o exemplo de sobrescrita passa a usar
  `[data-theme='dark']` (sem `:root`), com a explicação do motivo e a ordem de
  carga, alinhado a `docs/integration.md`. Não há mudança de mecanismo.
- Teste de documentação que falha se o README de tokens ou `docs/integration.md`
  recomendarem `:root[data-theme=…]` para sobrescrita, e teste de que a
  sobrescrita `[data-theme='dark']` alcança o overlay portado.
- `styles.test.mjs` é migrado para `styles.test.ts` (Vitest), passando a ser
  executado por `npm test` e `npm run test:quiet` do pacote.
- `AdsNav`: o link com `href` recebe `no-underline`.

**Aplicações de demonstração**

- Nenhuma mudança de código.

**Documentação**

- Remover de `docs/limitations.md` as entradas sobre a sobrescrita de tokens e
  o item de sublinhado, e registrar a change no `CHANGELOG.md`.
- O `styles.test.mjs` não é mencionado em `docs/limitations.md`; nada a remover.

## Objetivos e fora do escopo

Objetivos: documentação de tokens correta para overlays, teste de estilos
executado automaticamente, links de `AdsNav` sem sublinhado nativo.

Fora do escopo: links do consumidor em `AdsNav`, `AdsBreadcrumb` e
`AdsPagination` (item 1 da issue, em changes próprias por família); alterar o
mecanismo de tema do `OverlayPortal`; novos tokens.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `theming`: requisito de que a sobrescrita de tokens documentada alcance
  overlays portados.
- `quality-assurance`: requisito de que todo teste do pacote seja executado
  pelo script de teste.
- `navigation-structure`: requisito de que links de `AdsNav` não mostrem o
  sublinhado nativo.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components` (`AdsNav`, apenas visual) e
  `@admin-ds/tokens` (apenas documentação). Nenhuma prop, tipo, export, classe
  `ads-*` ou variável `--ads-*` muda; compatibilidade retroativa preservada.
- **Dependências**: nenhuma.
- **Consumidores**: quem seguiu o README com `:root[data-theme=…]` deve migrar
  para `[data-theme=…]` para alcançar overlays; links de `AdsNav` perdem o
  sublinhado nativo.
