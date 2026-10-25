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

## Registro de decisões e resultados passados

A cronologia de medições foi movida para comentários nas issues de origem de cada change (por exemplo [#135](https://github.com/dvmarques/admin-design-system/issues/135), [#138](https://github.com/dvmarques/admin-design-system/issues/138), [#136](https://github.com/dvmarques/admin-design-system/issues/136), [#92](https://github.com/dvmarques/admin-design-system/issues/92), [#93](https://github.com/dvmarques/admin-design-system/issues/93), [#185](https://github.com/dvmarques/admin-design-system/issues/185) e [#147](https://github.com/dvmarques/admin-design-system/issues/147)); trechos sem issue única identificada estão na [#197](https://github.com/dvmarques/admin-design-system/issues/197). Os comentários documentam aumentos históricos por change, revisões, commits e exceções de toolchain. Os números ali **não** são a medição do HEAD atual. Alguns registros foram medidos em Node 22.22.0/LF (por exemplo, AdsSmartTable), enquanto o fluxo atual usa Node 24/npm 11.19.1. Preserve diferenças, anotações e incertezas na evidência original; não as «corrija» retroativamente com um novo build.
