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

### Resultado histórico medido após sincronizar com #254

O job [Artefatos de distribuição — CI #40957590062](https://github.com/dvmarques/admin-design-system/actions/runs/40957590062) **passou** em 29/10/2026, em Linux/Node 24.22.1, com as seguintes métricas do pacote `@admin-ds/components` e cenários de consumo:

| Métrica                                      | Medição histórica | Limite da develop (#254) |         Limite adotado naquela execução |
| -------------------------------------------- | ----------------: | -----------------------: | --------------------------------------: |
| Distribuição completa `@admin-ds/components` |         584.641 B |                567.600 B | **585.200 B** (baseline 532.000 B +10%) |
| JS/CSS publicado `@admin-ds/components`      |         254.232 B |                250.800 B |                           **255.000 B** |
| JS/CSS gzip `@admin-ds/components`           |          76.243 B |                 76.300 B |               **76.300 B — inalterado** |
| JS minificado `components-public`            |          32.663 B |                 30.400 B |                            **33.000 B** |
| JS gzip `components-public`                  |          11.511 B |                 11.300 B |                            **11.700 B** |
| JS minificado `admin-public`                 |          70.669 B |                 70.000 B |                            **71.000 B** |

Naquela execução também passaram, **sem aumento de orçamento naquele momento**, os CSS dos cenários: `components-public` 57.742/58.000 B e gzip 9.568/9.650 B; `admin-public` 97.524/97.800 B e gzip 14.655/14.800 B; `admin-public` JS gzip 23.714/23.900 B, e os pacotes `tokens`, `highlighted-code` e `admin`. Os limites atuais constam dos JSONs e da medição posterior abaixo.

O merge da PR #254 havia medido 566.459 B de distribuição e 249.982 B de JS/CSS do components (conforme o changelog da #254). A PR #258 combinada mede +18.182 B e +4.250 B, respectivamente. **Essas diferenças incluem a troca da geometria SVG e a inclusão obrigatória de avisos MIT/ISC; não são uma decomposição byte a byte por arquivo**, e podem conter variação residual de toolchain/ambiente. Todos os cinco ajustes acima são restritos aos budgets com excesso demonstrado; os demais valores foram preservados do último `develop`.

## Nova sincronização de #257 com develop

Após integrar `origin/develop` em `1361fc3`, o build local em Windows, Node 24.21.0 e npm 12.2.1 mediu os artefatos abaixo (dependências instaladas com npm 11.19.1). Para obter todas as métricas, a inspeção usou cópias temporárias dos budgets com limites ampliados. Os seis limites excedidos foram ajustados; a confirmação em Linux permanece pendente.

| Métrica                 |   Medição | Limite develop | Limite ajustado |
| ----------------------- | --------: | -------------: | --------------: |
| Distribuição components | 588.948 B |      568.260 B |       589.050 B |
| JS/CSS components       | 255.966 B |      251.150 B |       256.000 B |
| JS/CSS gzip components  |  77.248 B |       76.300 B |        77.300 B |
| components-public       |  33.027 B |       30.500 B |        33.100 B |
| components-public gzip  |  11.707 B |       11.330 B |        11.800 B |
| admin-public            |  71.030 B |       70.000 B |        71.100 B |

O valor local inclui a modularização, os avisos de licença e as mudanças mais recentes de develop. Não é uma comparação equivalente com a medição histórica Linux acima, nem isola o custo da modularização. Os demais limites passaram sem aumento; a inspeção completa também passou com os limites ajustados.

## Sincronização posterior com #231

Após integrar `develop` em `c46359f` (AdsMaskedInput), o build local Windows com Node 24.21.0 e npm 12.2.1 mediu `@admin-ds/components` em 610.014 B de distribuição, 263.282 B de JS/CSS e 79.417 B gzip. Os limites de `develop` eram, respectivamente, 589.380 B, 258.500 B e 78.400 B; foram ajustados para 610.060 B (baseline 554.600 B), 263.300 B e 79.500 B. A inspeção passou, inclusive para o novo cenário `masked-input-public` (67.490 B e 18.971 B gzip). Os cenários públicos já ajustados para os ícones não exigiram novos aumentos. A [CI Linux #40979835315](https://github.com/dvmarques/admin-design-system/actions/runs/40979835315) confirmou as mesmas medições e aprovou a inspeção na base combinada.

## Registro de decisões e resultados passados

A cronologia de medições foi movida para comentários nas issues de origem de cada change (por exemplo [#135](https://github.com/dvmarques/admin-design-system/issues/135#issuecomment-6403057452), [#138](https://github.com/dvmarques/admin-design-system/issues/138#issuecomment-6403059227), [#136](https://github.com/dvmarques/admin-design-system/issues/136#issuecomment-6403059406), [#92](https://github.com/dvmarques/admin-design-system/issues/92#issuecomment-6403059645), [#93](https://github.com/dvmarques/admin-design-system/issues/93#issuecomment-6403059824), [#185](https://github.com/dvmarques/admin-design-system/issues/185#issuecomment-6403060029) e [#147](https://github.com/dvmarques/admin-design-system/issues/147#issuecomment-6403060274)); trechos sem issue única identificada estão na [#197](https://github.com/dvmarques/admin-design-system/issues/197#issuecomment-6403060491). Os comentários documentam aumentos históricos por change, revisões, commits e exceções de toolchain. Os números ali **não** são a medição do HEAD atual. Alguns registros foram medidos em Node 22.22.0/LF (por exemplo, AdsSmartTable), enquanto o fluxo atual usa Node 24/npm 11.19.1. Preserve diferenças, anotações e incertezas na evidência original; não as «corrija» retroativamente com um novo build.
