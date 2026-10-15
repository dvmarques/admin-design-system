# Tasks

## 1. Sobrescrita de tokens em overlays

- [x] 1.1 Em `packages/tokens/README.md`, trocar o exemplo `:root[data-theme='dark']` por `[data-theme='dark']`, explicar a ordem de carga e o motivo (overlays em portal), e remover o parágrafo duplicado sobre overlays; verificar que o texto concorda com `docs/integration.md`.
- [x] 1.2 Criar `packages/components/tests/token-override-docs.test.ts`, que falha se o README de tokens ou `docs/integration.md` tiverem uma linha de exemplo começando com `:root[data-theme` e que exige o seletor `[data-theme='dark']` no README; verificar que falha ao reintroduzir o seletor antigo.

## 2. Testes de estilos executados

- [x] 2.1 Migrar `packages/components/tests/styles.test.mjs` para `styles.test.ts` (Vitest), mantendo as asserções; verificar que `npm run test --workspace @admin-ds/components` o executa.
- [x] 2.2 Criar teste que lista os arquivos `*.test.*` de `packages/components/tests` e falha se algum não casar com `**/*.test.{ts,tsx}`; verificar que falha ao recriar um `.mjs`.

## 3. Sublinhado em AdsNav

- [x] 3.1 Em `packages/components/src/navigation.tsx`, adicionar `no-underline` ao `<a>` de `AdsNav`; verificar em `navigation.test.tsx` a classe, em `navigation-styles.test.ts` a existência de `.no-underline` em `dist/styles.css`, e que `aria-current` permanece.

## 4. Integração e documentação

- [x] 4.1 Remover de `docs/limitations.md` as entradas da sobrescrita `:root[data-theme=…]` e do sublinhado de `AdsNav` (o trecho de links de consumidor permanece) e registrar a change em `CHANGELOG.md`, em `[0.0.2]`, seção Changed; verificar que o texto descreve o que mudou.

## 5. Validação final

- [x] 5.1 Executar `npx prettier --write` nos arquivos alterados; verificar que conclui sem erros.
- [x] 5.2 Executar `npm run lint`, `npm run typecheck`, `npm run test:quiet` e `npm run build`; verificar que passam.
- [ ] 5.3 Executar `CI=1 npm run test:e2e` (snapshots sem baseline são pulados fora do Windows; relatar que a validação visual não foi feita).
- [x] 5.4 Executar `openspec validate --all --strict`; verificar que passa.
- [x] 5.5 Tarefa final: executar `npm run format`; verificar saída sem falhas.
