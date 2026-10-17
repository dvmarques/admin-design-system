## 1. Tokens e geração

- [x] 1.1 Adicionar `color.borderControl` (claro `slate500`, escuro `slate400`) em `packages/tokens/source/tokens.mjs` com contraste ≥ 3:1 sobre as superfícies e fundos de campo, e verificar com `npm run build --workspace @admin-ds/tokens` que `--ads-color-border-control` existe em `dist/tokens.css`
- [x] 1.2 Adicionar `color.semanticContrast` e emitir o bloco `prefers-contrast: more` (três combinações de seletor) no gerador, verificando por teste do CSS gerado que a ordem e os seletores estão corretos
- [x] 1.3 Emitir `@media (prefers-reduced-motion: reduce)` (incluindo `:root:not([data-theme])`) zerando `--ads-motion-fast`/`--ads-motion-normal` e verificar por teste do CSS gerado; rodar `npm run generate --workspace @admin-ds/tokens` e conferir `check:generated`
- [x] 1.4 Migrar para `contrastPairs` os testes atuais de contraste e incluir os pares de 3:1 (limite de controle, foco, seleção, `prefers-contrast: more`); verificar que o teste falha ao reduzir temporariamente um token e passa ao restaurá-lo

## 2. Movimento reduzido

- [x] 2.1 Mapear `--default-transition-duration` para o token em `styles.css` e migrar as durações literais (`duration-150`) para `duration-[var(--ads-motion-fast)]`, verificando com o teste de varredura de `packages/components/src`
- [x] 2.2 Criar o teste de varredura (exceções em lista justificada) e verificar que ele falha ao inserir `duration-<número>` literal ou `animate-*` sem `motion-reduce`
- [x] 2.3 Migrar as durações literais de `packages/admin/src/styles.css` e `apps/admin-demo/app/globals.css` para os tokens e remover os blocos que só zeravam transições (mantendo animação contínua e `scroll-behavior: auto`), verificando que os testes do admin e o E2E de movimento reduzido passam

## 3. forced-colors e prefers-contrast nos componentes

- [x] 3.1 Aplicar `border-border-control` em form controls (incluindo Select e DatePicker) e nos indicadores de checkbox, radio e switch e verificar nos testes de classes (`form-controls-styles.test.ts`)
- [x] 3.2 Adicionar `@media (forced-colors: active)` em `packages/components/src/styles.css` para indicadores marcados e estados selecionados, e verificar no CSS compilado (`visual-accessibility.test.ts`)
- [x] 3.3 Cobrir a linha selecionada da `AdsSmartTable` e a faixa de carregamento do filtro em `forced-colors` em `packages/admin/src/styles.css` e verificar nos testes de CSS
- [x] 3.4 Confirmar que o CSS compilado continua utilizável sem Tailwind no consumidor (teste de consumo público existente) e que o tamanho respeita o baseline de 10%

## 4. E2E e acessibilidade

- [x] 4.1 Criar `e2e/accessibility-preferences.spec.ts` (Chromium) com `emulateMedia` para movimento reduzido, cores forçadas e `contrast: 'more'`, usando papéis ARIA e estilo computado, e verificar que passa em `npm run test:e2e`
- [x] 4.2 Rodar `axe` nos temas claro e escuro e com `contrast: 'more'` nas rotas já cobertas e verificar zero violações
- [x] 4.3 Se `borderControl` alterar snapshots, executar o workflow "Atualizar baselines visuais", revisar o diff das imagens e fazer push adicional (ou alternar Draft/Ready) para disparar a CI

## 5. Documentação e validação

- [x] 5.1 Criar `docs/visual-accessibility.md` (movimento, `forced-colors`, `prefers-contrast`, tokens, teste de contraste e como adicionar pares), linkar no `README.md` e atualizar `docs/quality.md` e `docs/limitations.md`; verificar links
- [x] 5.2 Executar `npx --yes prettier@3.9.6 --write` nos arquivos alterados, `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` e `npm run test:e2e`, e confirmar que nenhum falha
- [x] 5.3 Validar com `npx --yes @fission-ai/openspec@1.10.0 validate --all --strict --no-interactive` e confirmar CI verde da PR (`Closes #87`)
