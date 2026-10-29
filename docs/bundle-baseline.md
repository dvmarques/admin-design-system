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

A branch da PR #258 recebeu `develop` (incluindo [PR #254](https://github.com/dvmarques/admin-design-system/pull/254)) em 29/10/2026, por meio da [PR de sincronização #260](https://github.com/dvmarques/admin-design-system/pull/260). Antes dessa sincronização, a CI mediu `@admin-ds/components` em uma base **sem** o Combobox Popover de #254:

- [Execução inicial](https://github.com/dvmarques/admin-design-system/actions/runs/40948420869): distribuição **531.534 B**, limite da base antiga **513.370 B**, diferença **+18.164 B**.
- [Execução intermediária](https://github.com/dvmarques/admin-design-system/actions/runs/40950748996): JS/CSS publicados **232.180 B**, limite da base antiga **228.000 B**.
- [Execução de gzip](https://github.com/dvmarques/admin-design-system/actions/runs/40951320374): gzip de JS/CSS **69.654 B**, limite da base antiga **69.150 B**.

**Esses números são históricos e não devem ser comparados diretamente com a base atual.** A PR #254 já havia mudado `docs/bundle-baseline.json`, `docs/browser-budget.json` e `docs/scenario-budget.json`. Na sincronização, foram **restaurados os três arquivos integrais da `develop`**, descartando ajustes incrementais de budget feitos sobre a base antiga. Seus valores para `@admin-ds/components` são baseline de distribuição **516.000 B** (limite 567.600 B), JS/CSS **250.800 B** e gzip **76.300 B**.

O pacote `@admin-ds/components` agora inclui `LICENSE.md` e `THIRD_PARTY_NOTICES.md` com as licenças MIT/ISC dos ícones, além dos novos elementos SVG. Esses arquivos legais não devem ser retirados para atender ao budget. Os novos limites só devem ser alterados se uma **CI executada após a sincronização** demonstrar um excesso, devidamente atribuído à mudança de #257. Não elevar orçamentos sem medição, nem confundir aumento do pacote distribuído com custo de JS/CSS entregue ao consumidor.

## Registro de decisões e resultados passados

A cronologia de medições foi movida para comentários nas issues de origem de cada change (por exemplo [#135](https://github.com/dvmarques/admin-design-system/issues/135#issuecomment-6403057452), [#138](https://github.com/dvmarques/admin-design-system/issues/138#issuecomment-6403059227), [#136](https://github.com/dvmarques/admin-design-system/issues/136#issuecomment-6403059406), [#92](https://github.com/dvmarques/admin-design-system/issues/92#issuecomment-6403059645), [#93](https://github.com/dvmarques/admin-design-system/issues/93#issuecomment-6403059824), [#185](https://github.com/dvmarques/admin-design-system/issues/185#issuecomment-6403060029) e [#147](https://github.com/dvmarques/admin-design-system/issues/147#issuecomment-6403060274)); trechos sem issue única identificada estão na [#197](https://github.com/dvmarques/admin-design-system/issues/197#issuecomment-6403060491). Os comentários documentam aumentos históricos por change, revisões, commits e exceções de toolchain. Os números ali **não** são a medição do HEAD atual. Alguns registros foram medidos em Node 22.22.0/LF (por exemplo, AdsSmartTable), enquanto o fluxo atual usa Node 24/npm 11.19.1. Preserve diferenças, anotações e incertezas na evidência original; não as «corrija» retroativamente com um novo build.
