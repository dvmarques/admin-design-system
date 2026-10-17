# Baseline inicial de distribuição

O baseline versionado está em `docs/bundle-baseline.json`. O comando
`npm run inspect:packages` verifica os exports, arquivos publicados,
peer dependencies e o tamanho total de `dist/`, permitindo crescimento de
até 10% antes de exigir uma atualização explícita do baseline.

Dependências de runtime devem ser justificadas na change que as introduzir.
React e React DOM são peer dependencies dos pacotes de renderização e não
devem ser incluídos nos artefatos distribuídos.

O baseline de `@admin-ds/components` foi atualizado na change
`add-data-display-components` para incluir os módulos e estilos distribuídos
de tabela, coleções, progresso e estado vazio, sem novas dependências de runtime.

O baseline de `@admin-ds/components` foi atualizado na change `add-date-picker`
para incluir os módulos distribuídos do seletor de data (`date-picker` e
`date-utils`, com declarações e source maps), sem novas dependências de runtime.

O baseline de `@admin-ds/admin` foi atualizado na change
`add-dashboard-patterns` de 30975 para 51658 bytes (+18411 sobre a `develop`,
que media 33247) para incluir `AdsMetricCard`, `AdsDashboardGrid` e
`AdsDashboardPanel`: módulo JavaScript, source maps e declarações (+13973), CSS
do dashboard (+3817) e exports (+621), sem novas dependências de runtime. O
valor é medido com LF, como na CI; num checkout com CRLF o `styles.css` copiado
para `dist/` soma 1 byte por linha.

O baseline de `@admin-ds/admin` foi atualizado na change `add-filter-bar` de
51658 para 89246 bytes (+37588) para incluir `AdsFilterBar`: módulo JavaScript,
source maps e declarações (+32812), CSS da barra em `styles.css` (+4197) e
exports (+579), sem novas dependências de runtime. As revisões somaram 6200
bytes ao valor inicial de 83046: 1692 na R1 (foco com os campos recolhidos e
descrição e erro ligados ao grupo da seleção múltipla), 975 nas sugestões
(indicador de carregamento e ids sanitizados), 1973 na R3 (foco pendente com
`value` assíncrono e documentação do `id`) e 1560 na R4 (foco reposto só
quando o botão acionado sai da página). O valor é medido com LF, como na CI.

O baseline de `@admin-ds/admin` foi atualizado na change `add-smart-table` de
89246 para 122324 bytes (+33078) para incluir `AdsSmartTable`: módulo JavaScript,
source maps e declarações (+29520), CSS da tabela em `styles.css` (+3083) e
exports (+475), sem novas dependências de runtime. A R1 somou 1862 bytes ao
valor de 120462 (célula de seleção sem largura percentual, painel de colunas
inline, regiões de anúncio separadas, contador por página e linhas sem hover).
O valor é medido com LF, como na CI.

O baseline de `@admin-ds/components` foi atualizado na change `add-smart-table`
de 272527 para 272938 bytes (+411) por causa do `containerProps` opcional de
`AdsTable` (`data-table.*`, com declarações e source maps): 346 da prop e 65 do
tipo que exclui `children` e `dangerouslySetInnerHTML`. O valor é medido com
LF, como na CI.

O baseline de `@admin-ds/components` foi atualizado na R2 de `add-smart-table`
de 272938 para 273237 bytes (+299) por causa da prop `interactive` em
`AdsTableRow`, usada nas linhas estáticas de `AdsSmartTable`. O valor é medido
com LF, como na CI.

O baseline de `@admin-ds/admin` foi ajustado na R2 de `add-smart-table` para
122232 bytes (−92), medido em LF após `AdsTableRow` com `interactive={false}`
no lugar da marcação manual das linhas estáticas.

O baseline de `@admin-ds/tokens` foi ajustado de 26673 para 27039 bytes (+366) na
medição em LF com `dist/` limpo; não houve mudança de código nos tokens.

O baseline de `@admin-ds/admin` foi atualizado na change `add-admin-flows` de
122232 para 165809 bytes (+43577), medido em LF com `dist/` limpo após
`git clean -xfd packages/*/dist`, `npm ci`, `generate`/`check:generated` dos
tokens e build de tokens, components e admin (`inspect:packages`). O incremento
se divide em +33670 para `AdsBulkActionBar`, `AdsConfirmDialog`, `AdsListFlow` e
`AdsStepForm` (JS, maps e declarações +30521, CSS dos fluxos +3149, exports
+1000; `AdsStepForm` é a maior parte do JS) e +9907 na revisão R1 (I3–I6,
S1/S3): `confirm-dialog` +3584, módulo interno `selection-focus` ~+2061 (não
exportado em `index`), `step-form` +1864, `bulk-action-bar` +1418, `list-flow`
+772, CSS +208. Não há testes, exemplos nem pacotes extras no `dist/`. Sem novas
dependências de runtime.

O baseline foi atualizado na change `acessibilidade-visual-estilos`, medido em LF
com `dist/` limpo (`git clean -xfd packages/*/dist`), build de tokens, components
e admin e `inspect:packages`: `@admin-ds/tokens` de 27039 para 29610 bytes
(+2571) por `borderControl`, `semanticContrast`, blocos `prefers-contrast: more`
e `prefers-reduced-motion: reduce`; `@admin-ds/components` de 273237 para
274766 bytes (+1529) por `forced-colors`, `border-border-control`, movimento por
token e ajustes de formulário; `@admin-ds/admin` de 165809 para 166033 bytes
(+224) por `forced-colors` na tabela inteligente e na barra de filtros. Sem novas
dependências de runtime.

O baseline foi atualizado na change `polimento-visual-tokens`, medido em LF com
`dist/` limpo (`rm -rf packages/*/dist`), build de tokens, components e admin e
`inspect:packages`: `@admin-ds/tokens` de 29610 para 31756 bytes (+2146) por
`elevationDark`, blocos de densidade e tokens de skeleton; `@admin-ds/components`
de 274766 para 276595 bytes (+1829) por props de densidade, variantes de skeleton
e tamanho de estado vazio; `@admin-ds/admin` de 166033 para 167071 bytes (+1038)
por densidade em `AdsSmartTable`, skeleton por token e `AdsEmptyState` compacto.
Sem novas dependências de runtime.
