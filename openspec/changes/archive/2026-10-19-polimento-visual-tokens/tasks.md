## 1. Tokens e geração

- [x] 1.1 Adicionar `elevationDark`, `density`, `densityCompact` e `skeleton` em `packages/tokens/source/tokens.mjs` e validar no gerador que `elevationDark` e `densityCompact` têm as mesmas chaves de `elevation` e `density`; verificar por testes de `generation.test.mjs`
- [x] 1.2 Emitir elevação escura nos blocos de tema escuro, os blocos de densidade e os tokens de skeleton, e incluí-los nos metadados; verificar por teste do CSS gerado (ordem, seletores) e `npm run generate --workspace @admin-ds/tokens` com `check:generated`

## 2. Componentes

- [x] 2.1 `AdsTable`: prop `density` e padding de `AdsTableHeader`/`AdsTableCell` por token; testes de atributo, classes e ausência de mudança sem a prop
- [x] 2.2 `AdsSkeleton`: prop `variant` e CSS por token; testes e consumo dos tokens em tabela, métrica e painel
- [x] 2.3 `AdsEmptyState`: prop `size`; testes de classes e de DOM idêntico sem a prop

## 3. Admin

- [x] 3.1 `AdsSmartTable`: prop `density` repassada a `AdsTable` e skeleton por variante; testes
- [x] 3.2 `AdsMetricCard` e `AdsDashboardPanel`: `empty` textual usa `AdsEmptyState` compacto e nós continuam inalterados; testes (incluindo SSR sem avisos de hidratação)
- [x] 3.3 Substituir alturas literais de skeleton em `packages/admin/src/styles.css` pelos tokens

## 4. Documentação e visual

- [x] 4.1 Atualizar stories (tabela compacta/confortável, skeleton, vazio compacto, elevação nos dois temas) em `apps/docs`
- [x] 4.2 Adicionar `docs/` sobre elevação, densidade e estados, atualizar `packages/tokens/README.md` e linkar no `README.md`
- [x] 4.3 Adicionar cena E2E de tabela compacta nos temas claro e escuro e demais ajustes da demo, com seletores por papel ARIA e identificadores semânticos

## 5. Validação

- [x] 5.1 Executar `npx.cmd prettier --write` nos arquivos alterados, `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` e `npm run test:e2e`, confirmar que nenhum falha e executar `openspec validate --all --strict`
