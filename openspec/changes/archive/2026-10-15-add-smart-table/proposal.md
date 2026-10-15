## Why

Listagens administrativas precisam de ordenação, seleção de linhas e controle de colunas, além da exibição básica de `AdsTable` e `AdsPagination`. Esta change (sub-item da issue #17, issue #59) adiciona `AdsSmartTable`, controlada pelo consumidor e sem lógica de dados, para que as aplicações não reconstruam acessibilidade e estados a cada listagem.

## What Changes

- Adicionar `AdsSmartTable` ao pacote `@admin-ds/admin`, composta sobre `AdsTable`, `AdsPagination`, `AdsCheckbox`/`AdsRadio`, `AdsSkeleton`, `AdsEmptyState` e `AdsButton` de `@admin-ds/components`.
- Colunas declarativas (`columns`) e linhas já processadas pelo consumidor (`rows`, `getRowId`).
- Ordenação por coluna (ascendente, descendente e nenhuma) controlada por `sort`/`onSortChange`, com `aria-sort` no cabeçalho e botão acessível.
- Seleção de linhas (uma, várias e todas na página) controlada por `selectedIds`/`onSelectionChange`, com checkbox acessível e estado indeterminado.
- Visibilidade de colunas controlada por `hiddenColumnIds`/`onHiddenColumnsChange`, com seletor acessível.
- Estados de carregamento (`AdsSkeleton`), vazio e erro (`AdsEmptyState`).
- Paginação opcional por `pagination` (props de `AdsPagination`, inclusive `renderPageLink`) e barra de filtros opcional por um slot `filters`; ambos opcionais e sem acoplamento.
- Rolagem horizontal acessível: região rolável rotulada e focável por teclado. Para isso, `AdsTable` ganha `containerProps` (adição opcional e retrocompatível).
- Story no Storybook, testes de comportamento, SSR e acessibilidade, e documentação.

Fora do escopo: busca, ordenação e paginação de dados no cliente ou no servidor (o consumidor fornece as linhas já processadas), edição em linha, redimensionamento e reordenação de colunas, virtualização, exportação de dados, persistência do estado e a demonstração em `apps/admin-demo` (issue #62).

## Capabilities

### New Capabilities

- `smart-table`: tabela administrativa controlada com ordenação, seleção, visibilidade de colunas, estados e rolagem acessível.

### Modified Capabilities

- `data-tables`: `AdsTable` passa a aceitar atributos HTML no contêiner de rolagem (`containerProps`), sem alterar o comportamento existente.

## Impact

- Pacote `@admin-ds/admin`: novos exports públicos `AdsSmartTable`, `AdsSmartTableProps`, `AdsSmartTableColumn`, `AdsSmartTableLabels`, `AdsSmartTableSort`, `AdsSmartTableSortDirection` e `AdsSmartTableSelectionMode`; classes públicas `ads-smart-table*`. Nenhuma API existente é alterada.
- Pacote `@admin-ds/components`: `AdsTableProps` ganha `containerProps` opcional (compatível retroativamente). Sem componentes novos.
- Pacote de tokens: sem novos tokens; reuso de `--ads-*` existentes.
- `apps/docs`: story `AdsSmartTable`. `apps/admin-demo`: sem alterações.
- Dependências: nenhuma dependência de runtime adicionada.
- Documentação: `docs/integration.md`, `docs/architecture.md` e `docs/limitations.md`.
