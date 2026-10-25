# Baseline inicial de distribuição

Na primeira medição da change `fix-135-smart-overlay-position`, o pacote `@admin-ds/components`
passou de 345608 para 355657 bytes (+10049, 2,91%), com 145 arquivos nos dois
casos. A comparação usa o mesmo compilador e Tailwind, em LF, com o código
anterior à issue em uma cópia isolada e `dist/` sem os testes antigos gerados.
O módulo `overlay-utils` minificado com esbuild e React/React DOM externos
passou de 5268 para 6759 bytes; em gzip, de 2257 para 2876 (+619 bytes).
Não foi adicionada dependência. O valor final permanece dentro da tolerância
de 10% do baseline versionado de 330033 bytes, que não foi elevado.
Os testes de posicionamento foram movidos de `src/` para `tests/` para não
entrarem no pacote distribuído. Resultados e limites da validação estão em
`openspec/changes/fix-135-smart-overlay-position/validation.md`.

No retorno da revisão, a origem geométrica para pinch zoom/pan levou o dist
para **356722 bytes / 145 arquivos** (+1065 bytes sobre a primeira medição).
No mesmo esbuild, `overlay-utils` passou de 6759 para 7077 bytes minificados e
de 2876 para 3009 bytes gzip (+133). O limite versionado e as dependências
permanecem inalterados; `npm run inspect:packages` passou.

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

O baseline de `@admin-ds/components` foi ajustado na revisão R1 de
`polimento-visual-tokens` de 276595 para 276803 bytes (+208), medido em LF com
`dist/` limpo, por restaurar a ordem original das classes de `AdsEmptyState` no
tamanho padrão. Sem novas dependências de runtime.

O baseline de `@admin-ds/admin` foi ajustado na revisão R2 de
`polimento-visual-tokens` de 167071 para 168617 bytes (+1546), medido em LF com
`dist/` limpo, por `hasDashboardEmpty` em módulo interno (`dashboard-empty`) e
build do pacote. Sem novas dependências de runtime.

O baseline de `@admin-ds/tokens` foi atualizado na change `add-visual-identity` de
31756 para 36342 bytes (+4586, +14,4%, acima da tolerância de 10%), medido em LF com
`dist/` limpo (`rm -rf packages/*/dist`), `generate`/`check:generated` e build de
tokens, components e admin (`inspect:packages`). O incremento vem só de tokens e metadados
novos, emitidos nos três blocos de tema do CSS: `tokens.css` +1848 (`chart1`…`chart8` nos dois
temas, `spacing` 5/10/12/16, `surfaceMuted` e `surfaceHover` e as famílias
`font-family-heading` e `-mono`), `tokens.meta.json` +1050 (escala `brand50`…`brand900`, novas
referências `slate650` e `slate850` e os mesmos papéis) e +1688 em `generated.*` (valores
tipados, declarações e source maps; o módulo gerado cresceu 592 bytes de fonte). Os contratos
exigidos pela change não permitem reduzir sem remover tokens públicos, então o crescimento foi
aceito. `@admin-ds/components` (280657) e `@admin-ds/admin` (168757) ficaram dentro da
tolerância e não foram alterados. Sem novas dependências de runtime nos pacotes (o
`@fontsource/inter` é dependência só de `admin-demo` e `docs`).

O baseline foi atualizado na change `add-metric-sparkline`, medido em LF após o build de
tokens, components e admin e `inspect:packages`: `@admin-ds/components` de 280657 para
289874 bytes (+9217) por `AdsSparkline` (módulo JavaScript, source maps e declarações) e
o CSS `ads-sparkline*`; `@admin-ds/admin` de 168757 para 170121 bytes (+1364) pela prop
`sparkline` do `AdsMetricCard` e pelo skeleton do sparkline. Os valores do JSON antes
desta change (276803 e 168617) já divergiam dos 280657 e 168757 citados acima; as
diferenças acima usam esses últimos. Sem novas dependências de runtime.

O baseline de `@admin-ds/components` foi atualizado na change
`tabs-breadcrumb-accordion` de 289874 para 330033 bytes (+40159), já com o AdsDropdown da develop, medido em LF após o
build de components e `inspect:packages`. O incremento vem dos módulos novos `accordion`,
`breadcrumb-collapse` e `component-ids` e da separação do `AdsTabs` em `tabs` (cada um com
JavaScript, source maps e declarações; `accordion` e `tabs` somam cerca de 32 KB de `dist/`),
das props novas de `AdsTabs` e `AdsBreadcrumb` e das utilidades de CSS do accordion e do
Tabs vertical em `styles.css`. A divisão em módulos separados permite que
`navigation.js` continue sem `'use client'`. O crescimento passa de 10% do valor anterior
e foi aceito porque a change entrega um componente novo. `@admin-ds/admin` e
`@admin-ds/tokens` ficaram dentro da tolerância e não foram alterados. Sem novas
dependências de runtime.

## Paginação responsiva e controles opcionais (#138)

Build limpo da develop `91d47c9`, com o mesmo TypeScript/Tailwind e LF, em
cópia isolada: components **356809 bytes / 145 arquivos**. Após a #138:
**382334 bytes / 145 arquivos** (+25525, 7,15%). Admin: **176484 bytes / 57
arquivos**, dentro da tolerância anterior; tokens permanece 36342 bytes.

A expansão funcional de AdsPagination (medição por contêiner, salto por link,
labels, loading, correção controlada e foco) aumenta o módulo compilado de
2944 para 13803 bytes; gzip do JavaScript emitido pelo mesmo TypeScript:
1092 → 3956 bytes (+2864). Esta medição do módulo não é bundle minificado nem
inclui React. O restante do dist inclui CSS, declarações e mapas. Sem novos
arquivos publicados nem dependência de runtime; testes permanecem fora do dist.

O baseline de components foi atualizado de 330033 para **382334**, refletindo
a nova API e comportamentos opt-in exigidos pela issue, além do crescimento
já absorvido na develop. A tolerância de 10% e as verificações de pacotes não
foram alteradas. Como nos incrementos públicos anteriores registrados neste
documento, o custo explícito deve ser considerado na revisão desta PR; não
representa uma correção de tamanho sem custo nem um bundle menor.

## Sidebar desktop fixa no `AdsAdminShell` (#136)

O baseline de `@admin-ds/admin` foi atualizado na change
`issue-136-admin-shell-fixed-sidebar` de 170121 para **187690 bytes** (+17569),
medido em LF após o build de tokens, components e admin e
`inspect:packages`. O valor anterior já estava defasado: a `develop` (`5919f77`,
catálogo e navegação hierárquica do shell, #151) mede **186447 bytes / 61
arquivos**, ainda dentro da tolerância de 10% (187133). A change soma **+1243
bytes** (CSS do layout desktop em `styles.css`, `tabIndex` padrão em
`AdsAdminShell.Main`, com JavaScript, declarações e source maps), o que passa o
limite de 187133 e exige a atualização explícita. Sem novas dependências de
runtime nem novos arquivos publicados.

## Fluxos administrativos: alertdialog, indicador navegável e validação assíncrona (#92)

Medição do commit base `5919f77` (antes do #136), em cópia isolada com o mesmo
TypeScript/Tailwind e LF: admin **186447 bytes / 61 arquivos**, components
**388846 bytes**. Após a #92: admin **+12033 bytes** (+6,5%) e components
**389188 bytes** (+342, `role` em `AdsDialogProps`); tokens permanece 36342 bytes.
Com a `develop` já atualizada pelo #136 (baseline de admin 187690), o build
integrado desta PR mede admin **199723 bytes / 61 arquivos**.

O incremento do admin vem de `AdsStepForm` (validação assíncrona com estado de
carregamento, descarte de resultado obsoleto, navegação pelo indicador e marcação
de etapas validadas) e dos estilos do botão do indicador, contados com
declarações e mapas. Sem novos arquivos publicados nem dependência de runtime.

O baseline de `@admin-ds/admin` foi atualizado de 187690 para **199723**. O de
components (382334) não foi alterado: 389188 está dentro da tolerância de 10%.
A tolerância e as verificações de pacotes não mudaram. O custo é explícito para a
revisão desta PR.

## Evolução do AdsSmartTable (#93)

Medido com `npm run build` e `inspect:packages` (Node 22.22.0, LF). Na `develop`
`6dc0e96` (com as #136 e #92), `@admin-ds/admin` tem baseline **199723 bytes**. Após a #93:
**236799 bytes** (+37076, +18,6%); components (388846) e tokens (36342) não mudaram.

O incremento vem de três módulos novos (`smart-table-virtual`,
`smart-table-resizer` e `smart-table-export`, cada um com JavaScript, source maps e
declarações, cerca de 19 KB), do crescimento de `smart-table` (props, renderização
da janela e botão de exportação) e do CSS `ads-smart-table-*` das alças e da região
virtualizada. Os recursos são opt-in, mas vivem no mesmo pacote; não há dependência
de runtime nova nem virtualização de terceiros. O baseline de `@admin-ds/admin` foi
atualizado de 199723 para **236799**, aprovado explicitamente para esta PR.

## Conta, notificações e organização (#185)

Medido com `npm run build` e `inspect:packages` (Node 22.22.0, LF). Na `develop`
`b1d4695`, `@admin-ds/admin` tem baseline **236799 bytes**. Após a #185: **332978
bytes** (+96179, +40,6%, 89 arquivos); components mede 410178 (baseline 382334, dentro
da tolerância de 10%, só os sete ícones novos e o `AdsAvatar`) e tokens não mudou.

O incremento vem de três composições novas (`AdsAccountMenu`, `AdsNotificationCenter` e
`AdsOrganizationSwitcher`) e de `panel-utils`, cada um com JavaScript, source maps e
declarações, e do CSS `ads-account-menu-*`, `ads-notification-center-*` e
`ads-organization-switcher-*` (cerca de 600 linhas). Os componentes são exports nomeados
(sem efeito colateral na importação), então só custam a quem os importa; não há dependência
de runtime nova.

Orçamentos atualizados, cada um com cerca de 10% de folga sobre o build medido:
baseline de distribuição de admin 236799 → **332978**; JS/CSS publicados de admin
118900 → **171400** (medido 155790) e gzip 34900 → **47100** (medido 42779); cenário
`admin-public` com CSS minificado 76600 → **91600** (medido 83285) e CSS gzip 12300 →
**13800** (medido 12581). Os orçamentos de JS do cenário (65125 de 70000; gzip 22244 de 23900) não mudaram. O custo é explícito para a revisão desta PR.

O baseline de `@admin-ds/components` foi atualizado na change `add-ads-password-input`
(issue #147) de 382334 para 427155 bytes (+44821 no `dist/` completo, medido em LF) por
causa do novo `AdsPasswordInput` (JavaScript, source maps e declarações) e de
`AdsInput` com `forwardRef`. O gzip por arquivo de JS/CSS publicados do pacote passou de
um valor abaixo de 56900 para 57137 bytes, então o limite de `docs/browser-budget.json` foi
recalibrado com cerca de 10% de folga: 56900 → **62700**. Os orçamentos de bytes de JS/CSS e
dos cenários não mudaram. O componente é um export nomeado sem efeito colateral na importação,
então só custa a quem o importa; não há dependência de runtime nova.
