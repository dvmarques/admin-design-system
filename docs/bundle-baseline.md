# Orçamentos de distribuição — guia vigente

Os limites executáveis são os arquivos versionados [bundle-baseline.json](bundle-baseline.json), [browser-budget.json](browser-budget.json) e [scenario-budget.json](scenario-budget.json). Este guia explica **como medir e interpretar** os resultados, não fornece uma medição corrente do branch.

## Validar os pacotes

Com Node 24 e npm 11.19.1 (versões prescritas em `.nvmrc` e `packageManager`), use a raiz do repositório:

```bash
npm ci
npm run build
npm run inspect:packages
```

A inspeção verifica exports, arquivos publicados, peer dependencies, `dist/` e limites orçamentários. `bundle-baseline.json` admite até **10% acima do baseline versionado**, salvo atualização explícita e justificada. Consulte também [medição e cenários de browser](bundle-measurement.md).

Antes de comparar bytes, preserve e anote: **commit SHA**, data, SO, Node/npm, toolchain de build, `dist/` limpo e LF versus CRLF. Builds de commits diferentes e toolchains distintas não são automaticamente comparáveis. React e React DOM permanecem peer dependencies dos pacotes de renderização; não se deve adicionar dependência de runtime sem justificativa.

## Alterar um orçamento

Somente atualize os JSONs após build limpo, inspecione as diferenças e justifique na change/PR o novo artefato público e seu custo. Não eleve um limite para mascarar falha; esta issue #197 **não altera nenhum orçamento**.

## Medição da mudança #257 — licenciamento dos 20 ícones

Em **2026-10-29**, o job [Artefatos de distribuição da PR #258](https://github.com/dvmarques/admin-design-system/actions/runs/40948420869), sobre o commit `47ec85d640641104bcefa95025bad57dd8d2e85d`, mediu **531.534 bytes** de `@admin-ds/components/dist` em Linux/Node **24.22.1**. O limite anterior era **513.370 bytes** (baseline 466.700 × 1,10), gerando excesso de **18.164 bytes**.

O aumento nesta mudança tem causa funcional identificada: o `dist` agora inclui `LICENSE.md` e `THIRD_PARTY_NOTICES.md` com as licenças integrais MIT/ISC dos ícones Feather, Lucide e Hugeicons Free, além dos novos elementos SVG oficiais e seus artefatos de compilação. Os avisos de terceiros precisam acompanhar a distribuição; não devem ser excluídos para cumprir o orçamento.

O baseline de distribuição de `@admin-ds/components` foi ajustado para **484.000 bytes** (limite executável de **532.400 bytes**, com a tolerância de 10% já definida no projeto), deixando 866 bytes de margem frente à medição indicada. O job [Artefatos de distribuição da execução seguinte](https://github.com/dvmarques/admin-design-system/actions/runs/40950748996) mediu **232.180 bytes** de JS/CSS publicados de `@admin-ds/components`, acima do orçamento anterior de **228.000 bytes**. Por essa razão, o limite de JS/CSS sem compressão foi elevado especificamente para **233.000 bytes** (820 bytes de margem sobre a medição), em `docs/browser-budget.json`. Os orçamentos de gzip e dos cenários permanecem inalterados até que seus valores possam ser medidos, sem elevar limites preventivamente.

## Registro de decisões e resultados passados

A cronologia de medições foi movida para comentários nas issues de origem de cada change (por exemplo [#135](https://github.com/dvmarques/admin-design-system/issues/135#issuecomment-6403057452), [#138](https://github.com/dvmarques/admin-design-system/issues/138#issuecomment-6403059227), [#136](https://github.com/dvmarques/admin-design-system/issues/136#issuecomment-6403059406), [#92](https://github.com/dvmarques/admin-design-system/issues/92#issuecomment-6403059645), [#93](https://github.com/dvmarques/admin-design-system/issues/93#issuecomment-6403059824), [#185](https://github.com/dvmarques/admin-design-system/issues/185#issuecomment-6403060029) e [#147](https://github.com/dvmarques/admin-design-system/issues/147#issuecomment-6403060274)); trechos sem issue única identificada estão na [#197](https://github.com/dvmarques/admin-design-system/issues/197#issuecomment-6403060491). Os comentários documentam aumentos históricos por change, revisões, commits e exceções de toolchain. Os números ali **não** são a medição do HEAD atual. Alguns registros foram medidos em Node 22.22.0/LF (por exemplo, AdsSmartTable), enquanto o fluxo atual usa Node 24/npm 11.19.1. Preserve diferenças, anotações e incertezas na evidência original; não as «corrija» retroativamente com um novo build.
