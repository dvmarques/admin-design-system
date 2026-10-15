## Context

`AdsTable`, `AdsPagination`, `AdsCheckbox`, `AdsRadio`, `AdsSkeleton`, `AdsEmptyState` e `AdsButton` já existem em `@admin-ds/components`. `AdsTable` não ordena, seleciona nem pagina por conta própria (spec `data-tables`). `@admin-ds/admin` hospeda composições administrativas sem regras de negócio, com CSS simples (`styles.css`, sem Tailwind) que consome tokens `--ads-*`, como o dashboard e a barra de filtros.

## Goals / Non-Goals

### Goals

- Ordenação, seleção e visibilidade de colunas controladas pelo consumidor, acessíveis por teclado e leitor de tela.
- Estados de carregamento, vazio e erro; rolagem horizontal acessível; paginação e filtros opcionais.
- Sem acoplamento a URL, roteador, Tailwind ou dependências novas.

### Non-Goals

- Dados (busca, ordenação, paginação), edição em linha, redimensionamento e reordenação de colunas, virtualização, exportação e demonstração em `apps/admin-demo`.

## Decisions

### 1. Pacote `@admin-ds/admin`

É uma composição administrativa sobre primitivos existentes, sem primitivo novo, como `AdsFilterBar` e o dashboard (AGENTS.md e `docs/architecture.md`: `components` guarda primitivos genéricos; `admin` guarda composições). Em `admin` ela usa `styles.css` próprio e importa só caminhos públicos de `@admin-ds/components`. Trade-off: quem usa só `components` não a recebe e continua podendo compor `AdsTable` manualmente. `AdsTable` não muda de comportamento.

### 2. API declarativa e genérica

`AdsSmartTable<Row>` recebe `columns: AdsSmartTableColumn<Row>[]` (`id`, `label` em texto, `cell(row, index)`, `align`, `sortable`, `hideable`, `headerClassName`, `cellClassName`), `rows` e `getRowId(row)`. O `label` é texto porque nomeia o botão de ordenação, o checkbox do seletor de colunas e os anúncios. Alternativa descartada: composição por filhos (`AdsTable*` do consumidor com ganchos); o consumidor perderia ordenação, seleção e visibilidade consistentes, e a lista declarativa mantém uma fonte única para cabeçalhos, células e seletor de colunas. Trade-off: menos liberdade de marcação, compensada por `cell`, classes por coluna e `className`.

### 3. Estado controlado, sem modo interno

Nada é guardado internamente (exceto a abertura do seletor de colunas):

- `sort`: `{ columnId, direction: 'asc' | 'desc' } | null` e `onSortChange(next)`. O clique cicla ascendente → descendente → nenhuma (`null`). Só colunas com `sortable` e com `onSortChange` definido têm botão; as demais são cabeçalhos comuns.
- `selectionMode` (`'multiple'` padrão ou `'single'`), `selectedIds` e `onSelectionChange(ids)`. A coluna de seleção só existe se `onSelectionChange` for informado. `onSelectionChange` recebe a lista completa; ids de outras páginas presentes em `selectedIds` são preservados ao marcar ou desmarcar "todas na página". `isRowSelectable(row)` desabilita linhas.
- `hiddenColumnIds` (ocultas; padrão vazio, para colunas novas aparecerem) e `onHiddenColumnsChange(ids)`. O seletor só aparece se `onHiddenColumnsChange` for informado. Ao menos uma coluna permanece visível: a opção da última visível fica desabilitada. `hideable: false` fixa uma coluna.

Como em `AdsFilterBar`, cada emissão parte do valor atual; o consumidor deve aplicar mudanças em sequência.

### 4. Ordenação e `aria-sort`

Dentro do `<th>` fica um `<button>` com o `label` e um indicador `aria-hidden`; o `<th>` recebe `aria-sort` (`ascending`, `descending` ou `none`) apenas nas colunas ordenáveis, e `none` quando não é a coluna ativa. O nome do botão é o próprio rótulo; a mudança é anunciada por uma região `aria-live="polite"` visualmente oculta (`labels.sortedBy`/`labels.sortCleared`). A tabela não reordena `rows`: só apresenta a ordem recebida.

### 5. Seleção, estado indeterminado e foco

Múltipla: `AdsCheckbox` por linha com nome `labels.selectRow(rótulo)`, onde o rótulo vem de `getRowLabel(row)` (padrão: o id) e um checkbox de cabeçalho `labels.selectAll`, com a página como escopo. O cabeçalho fica marcado se todas as linhas selecionáveis da página estão selecionadas, desmarcado se nenhuma e indeterminado (propriedade `indeterminate` do input mais `aria-checked="mixed"`) se parcial. Única: `AdsRadio` por linha com o mesmo `name`, e cabeçalho vazio com nome `labels.selectionColumn`. Linhas selecionadas recebem `data-selected` e a cor de seleção; `aria-selected` não é usado porque a tabela não é `grid`, e o estado é exposto pelo controle (checkbox/radio). Uma região `aria-live="polite"` anuncia `labels.selectedCount(n)` e a mesma contagem aparece na barra de ferramentas. O `indeterminate` é aplicado em um efeito sobre o `input` do cabeçalho (o `AdsCheckbox` não expõe `ref`); a renderização inicial não depende disso.

### 6. Visibilidade de colunas

Botão "Colunas" com `aria-expanded` e `aria-controls` que abre um painel inline (não um popover posicionado, para não depender de portais nem de posicionamento) com um `AdsSelectionGroup` de `AdsCheckbox`. `Escape` fecha e devolve o foco ao botão. Alternativa descartada: `AdsDropdown`/`AdsPopover`, cujo comportamento de menu/diálogo não combina com várias caixas de seleção marcáveis. O estado de abertura é o único estado interno e é igual no servidor e no cliente (fechado).

### 7. Estados

Precedência: `error` > `loading` > linhas vazias. `loading` renderiza `loadingRows` (padrão 5) linhas de `AdsSkeleton` nas colunas visíveis, define `aria-busy="true"` na tabela e anuncia `labels.loading` em região `aria-live="polite"`. `error` (ReactNode) renderiza um `AdsEmptyState` com `role="alert"`, título `labels.errorTitle`, descrição e, se `onRetry` existir, um botão `labels.retry`. Sem linhas, `emptyState` (ReactNode) ou um `AdsEmptyState` padrão. Os três ocupam uma célula `colSpan` em `<tbody>`, mantendo cabeçalho, ordenação e seletor de colunas utilizáveis; durante carregamento e erro, a seleção de todas e a paginação ficam desabilitadas.

### 8. Rolagem horizontal acessível

`AdsTable` já tem um contêiner `overflow-x-auto`, mas não aceita atributos nele. Adiciona-se `containerProps` (atributos HTML do `div`, exceto `className`, que já tem `containerClassName`) em `AdsTable`, adição opcional e retrocompatível. `AdsSmartTable` o usa para `role="region"`, `tabIndex={0}` e `aria-labelledby` apontando para a legenda, de modo que o teclado role a região e o leitor de tela a identifique, com foco visível em CSS. O `min-w-max` da tabela é preservado, e a barra de ferramentas e a paginação ficam fora da região rolável.

### 9. Legenda

`caption` (obrigatória) é renderizada em `AdsTableCaption`; `hideCaption` a oculta visualmente (permanece no DOM).

### 10. Paginação e filtros opcionais

`pagination` repassa as props de `AdsPagination`, inclusive `renderPageLink`, abaixo da tabela; omitida, nada é renderizado. `filters` é um slot (ReactNode) acima da tabela para `AdsFilterBar` ou outro conteúdo. Nenhum dos dois é acoplado ao estado da tabela: o consumidor decide, por exemplo, limpar a seleção ao mudar de página. Não importa `next/*` nem lê a URL.

### 11. Estilos e tokens

CSS simples em `packages/admin/src/styles.css`, classes `ads-smart-table*` na camada `components`, tokens `--ads-color-*` existentes, temas claro e escuro herdados das variáveis, sem Tailwind nem classes dinâmicas. Linha selecionada usa `--ads-color-surface-muted`/`--ads-color-primary` (borda), sem tokens novos. Personalização por sobrescrita de tokens, sem recompilar; conflitos evitados pelo prefixo e por `@layer components`. Os controles internos mantêm as classes dos componentes de `@admin-ds/components`.

### 12. Client Component e hidratação

`AdsSmartTable` é Client Component (`"use client"`): usa estado, efeito, foco e eventos. Os ids vêm de `useId`. Funções (`cell`, `getRowId`) vindas de um Server Component não atravessam a fronteira; a documentação mostra o uso dentro de um Client Component. A renderização inicial depende só das props.

## Risks / Trade-offs

- Sem baseline visual (`win32`): os snapshots só têm baseline `win32` e são pulados/falham fora do Windows; o comportamento é coberto por testes de componente, SSR e `axe`. Registrado nas tasks e em `docs/limitations.md`.
- Impacto no bundle: `@admin-ds/admin` cresce; se passar da margem de 10% de `inspect:packages`, o baseline em `docs/bundle-baseline.json` é atualizado e justificado em `docs/bundle-baseline.md`. Nenhuma dependência de runtime.
- A seleção por página exige que o consumidor decida o que fazer com ids de outras páginas; a documentação explica.
