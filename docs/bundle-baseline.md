# Baseline inicial de distribuição

O baseline versionado está em `docs/bundle-baseline.json`. O comando
`npm run inspect:packages` verifica os exports, arquivos publicados,
peer dependencies e o tamanho total de `dist/`, permitindo crescimento de
até 10% antes de exigir uma atualização explícita do baseline.

Dependências de runtime devem ser justificadas na change que as introduzir.
React e React DOM são peer dependencies dos pacotes de renderização e não
devem ser incluídos nos artefatos distribuídos.
