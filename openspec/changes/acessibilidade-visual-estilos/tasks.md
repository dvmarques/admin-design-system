## 1. Tokens e geração

- [ ] 1.1 Adicionar `color.borderControl` (claro e escuro) em `packages/tokens/source/tokens.mjs` com contraste ≥ 3:1 sobre `surface` e `formBackground`, e verificar com `npm run build --workspace @admin-ds/tokens` que `--ads-color-border-control` existe em `dist/tokens.css`
- [ ] 1.2 Adicionar `color.semanticContrast` e emitir o bloco `prefers-contrast: more` (três combinações de seletor) no gerador, verificando por teste do CSS gerado que a ordem e os seletores estão corretos
- [ ] 1.3 Emitir `@media (prefers-reduced-motion: reduce)` zerando `--ads-motion-fast`/`--ads-motion-normal` e verificar por teste do CSS gerado; rodar `npm run generate --workspace @admin-ds/tokens` e conferir `check:generated`
- [ ] 1.4 Migrar para `contrastPairs` os testes atuais de contraste e incluir os pares de 3:1 (limite de controle, foco, seleção, `prefers-contrast: more`); verificar que o teste falha ao reduzir temporariamente um token e passa ao restaurá-lo

## 2. Movimento reduzido

- [ ] 2.1 Migrar `transition-*` de form controls, Field, Dropdown, DatePicker, SelectionControl, DataTable e DataCollection para os tokens de duração ou `motion-reduce:`, verificando com o teste de varredura de `packages/components/src`
- [ ] 2.2 Criar o teste de varredura (exceções em lista justificada) e verificar que ele falha ao inserir uma `transition-*` sem tratamento
- [ ] 2.3 Remover os blocos `prefers-reduced-motion` redundantes de `packages/admin/src/styles.css` e `apps/admin-demo/app/globals.css` mantendo `scroll-behavior: auto`, verificando que os testes do admin passam

## 3. forced-colors e prefers-contrast nos componentes

- [ ] 3.1 Aplicar `border-border-control` em form controls, Select, DatePicker e SelectionControl e verificar nos testes de classes (`form-controls-styles.test.ts`)
- [ ] 3.2 Adicionar `@media (forced-colors: active)` em `packages/components/src/styles.css` para foco, bordas, Button, Input e Badge, e verificar no CSS compilado (`styles.test.ts`)
- [ ] 3.3 Cobrir a seleção em tabelas, navegação, abas e DatePicker em `forced-colors` (componentes e `packages/admin/src/styles.css`) e verificar nos testes de CSS
- [ ] 3.4 Confirmar que o CSS compilado continua utilizável sem Tailwind no consumidor (teste de consumo público existente) e que o tamanho respeita o baseline de 10%

## 4. E2E e acessibilidade

- [ ] 4.1 Criar `e2e/accessibility-preferences.spec.ts` (Chromium) com `emulateMedia` para movimento reduzido, cores forçadas e `contrast: 'more'`, usando papéis ARIA e estilo computado, e verificar que passa em `npm run test:e2e`
- [ ] 4.2 Rodar `axe` nos temas claro e escuro e com `contrast: 'more'` nas rotas já cobertas e verificar zero violações
- [ ] 4.3 Se `borderControl` alterar snapshots, executar o workflow "Atualizar baselines visuais", revisar o diff das imagens e fazer push adicional (ou alternar Draft/Ready) para disparar a CI

## 5. Documentação e validação

- [ ] 5.1 Criar `docs/visual-accessibility.md` (movimento, `forced-colors`, `prefers-contrast`, tokens, teste de contraste e como adicionar pares), linkar no `README.md` e atualizar `docs/quality.md` e `docs/limitations.md`; verificar links
- [ ] 5.2 Executar `npx --yes prettier@3.9.6 --write` nos arquivos alterados, `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` e `npm run test:e2e`, e confirmar que nenhum falha
- [ ] 5.3 Validar com `npx --yes @fission-ai/openspec@1.10.0 validate --all --strict --no-interactive` e confirmar CI verde da PR (`Closes #87`)
