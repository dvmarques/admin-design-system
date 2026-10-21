## 1. Componente `AdsSparkline` (`packages/components`)

- [x] 1.1 Implementar `AdsSparkline` (geometria, dados ausentes, ponto único, série constante, `min` e `max`, marcador final, `tone`) sem `"use client"` e exportar com os tipos em `index.ts`
- [x] 1.2 Gerar o texto acessível (`label`, `labels`, `summary`, `formatValue` com `Intl.NumberFormat('pt-BR')`)
- [x] 1.3 Estilos `ads-sparkline*` em `styles.css` (tons por token, `non-scaling-stroke`, `forced-colors`)
- [x] 1.4 Testes de componente, de estilos e SSR/hidratação, com `axe`

## 2. Card de métrica (`packages/admin`)

- [x] 2.1 Prop `sparkline` em `AdsMetricCard` (tom pelo `sentiment`, omissão sem pontos, `loading`, `error`, `empty`) e tipo `AdsMetricSparklineProps` exportado
- [x] 2.2 Estilos do sparkline e do skeleton no card
- [x] 2.3 Testes de componente, SSR e `axe`, incluindo o `sentiment` invertido e a ausência de regressão sem `sparkline`

## 3. Contraste

- [x] 3.1 Incluir `success` e `danger` contra `surface` e `surfaceRaised` (3:1) em `contrast-pairs.mjs` e confirmar `contrast.test.mjs`

## 4. Documentação, stories e demo

- [x] 4.1 Story do `AdsSparkline` e stories do `AdsMetricCard` com sparkline, sentimento invertido e estados, nos dois temas
- [x] 4.2 Atualizar `docs/integration.md`, `docs/limitations.md`, `docs/visual-identity.md`, `README.md` e a descrição da story do dashboard; registrar no `CHANGELOG.md`
- [x] 4.3 Dados de exemplo com séries e `sentiment` na visão geral da demo, com teste do conteúdo
- [x] 4.4 Atualizar `docs/bundle-baseline.md` e `docs/bundle-baseline.json` se o crescimento exigir

## 5. Validação

- [x] 5.1 `npx prettier --write` nos arquivos alterados, `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet` e `openspec validate --all --strict`
- [x] 5.2 `npm run test:e2e`; regenerar as baselines visuais afetadas pelo workflow "Atualizar baselines visuais" e revisar o diff
- [x] 5.3 Verificar nos temas claro e escuro e com `forced-colors`; abrir a PR e acompanhar a CI até ficar verde
