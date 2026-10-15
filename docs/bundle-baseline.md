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
51658 para 83046 bytes (+31388) para incluir `AdsFilterBar`: módulo JavaScript,
source maps e declarações (+27345), CSS da barra (+3.9 mil) e exports, sem
novas dependências de runtime. O valor é medido com LF, como na CI.
