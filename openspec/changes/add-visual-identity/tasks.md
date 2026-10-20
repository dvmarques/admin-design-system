## 1. Tokens e geração (sem decisões pendentes)

- [x] 1.1 Dar valores distintos a `surfaceMuted`, `surfaceRaised` e `surfaceHover` no tema escuro (`slate850` e `slate650` como novas referências) e confirmar por `contrast.test.mjs` os pares de texto e de `borderControl` sobre as superfícies, com e sem `prefers-contrast: more`
- [x] 1.2 Adicionar `spacing` 5, 10, 12 e 16 sem alterar os valores existentes; verificar no CSS e nos metadados gerados por `npm run generate --workspace @admin-ds/tokens`
- [x] 1.3 Adicionar `chart1`…`chart8` nos dois temas, os pares de contraste de 3:1 em `contrast-pairs.mjs` e o teste `chart-colors.test.mjs` com a simulação de deuteranopia, protanopia e tritanopia

## 2. Documentação e visual

- [x] 2.1 Corrigir os valores de elevação em `docs/visual-polish.md`
- [x] 2.2 Criar `docs/visual-identity.md` (superfícies, espaçamento, tokens de gráfico, método de daltonismo, regra de não depender só de cor, estado da escala de marca e da tipografia) e linká-lo no `README.md`; corrigir a descrição da tipografia em `packages/tokens/README.md`
- [x] 2.3 Adicionar a story de fundamentos (paleta, tipografia, espaçamento, superfícies e cores de gráfico) em `apps/docs`, nos dois temas
- [x] 2.4 Registrar a mudança no `CHANGELOG.md`

## 3. Validação

- [x] 3.1 Executar `npx prettier --write` nos arquivos alterados, `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` e `openspec validate --all --strict`
- [ ] 3.2 Executar `npm run test:e2e` e confirmar que nenhum teste falha; atualizar baselines visuais somente se a mudança for intencional e o diff revisado (rodado só no Chromium do ambiente de desenvolvimento: 130 passam e os 7 snapshots visuais falham também sem esta change, por diferença do ambiente; confirmar na CI e, se o diff for intencional e revisado, usar o workflow "Atualizar baselines visuais")

## 4. Pendente de decisão de produto/design (PR seguinte)

- [ ] 4.1 Escala de marca: com o hex da marca (ou mantendo a família azul), adicionar `brand50`…`brand900`, repontar `primary`, `primaryHover`, `focus`, `focusRing`, `formBorderFocus`, `surfaceSelected`, `onSurfaceSelected` e `semanticContrast`, manter os pares de contraste verdes e só remover `blue*` se nada mais as usar
- [ ] 4.2 Tipografia: escolher a fonte e a estratégia de carregamento, adicionar `fontFamilyHeading` e `fontFamilyMono`, aplicá-los em `AdsTypography` e onde houver código, registrar a justificativa de dependência ou asset e o impacto no peso do CSS neste `design.md` e avisar a mudança de fonte padrão no `CHANGELOG.md`
- [ ] 4.3 Atualizar `docs/visual-identity.md` e a story de fundamentos com a escala de marca e a fonte, e arquivar a change
