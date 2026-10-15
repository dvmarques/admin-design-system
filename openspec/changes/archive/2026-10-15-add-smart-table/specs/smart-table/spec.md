## Purpose

Permite listar dados administrativos com ordenação por coluna, seleção de linhas, visibilidade de colunas e estados de carregamento, vazio e erro, com todo o estado controlado pela aplicação consumidora.

## ADDED Requirements

### Requirement: Composição controlada sobre AdsTable

O sistema MUST fornecer `AdsSmartTable` em `@admin-ds/admin`, que renderize `columns` e `rows` com `AdsTable`, exija uma legenda (`caption`) e um `getRowId`, e aceite `className`. A tabela MUST NOT buscar, ordenar, filtrar nem paginar dados, MUST NOT guardar estado de ordenação, seleção ou colunas e MUST NOT ler a URL nem importar o roteador do Next.js. Os componentes e tipos públicos MUST usar o prefixo `Ads`, sem expor Tailwind.

#### Scenario: Renderizar linhas e colunas

- **WHEN** o consumidor informa colunas, linhas e `caption`
- **THEN** a tabela exibe a legenda, um cabeçalho (`scope="col"`) por coluna visível e uma linha por item, na ordem recebida

#### Scenario: Estado não aplicado pelo consumidor

- **WHEN** o consumidor não atualiza `sort`, `selectedIds` ou `hiddenColumnIds` após um `onChange`
- **THEN** a tabela continua exibindo o estado anterior

#### Scenario: Compatibilidade de AdsTable

- **WHEN** `AdsTable` é usada diretamente, sem `AdsSmartTable`
- **THEN** seu comportamento e sua marcação não mudam

### Requirement: Ordenação por coluna

Colunas com `sortable`, quando `onSortChange` é informado, MUST exibir um botão no cabeçalho com o rótulo da coluna, e o `<th>` MUST ter `aria-sort` (`ascending`, `descending` ou `none`). Ativar o botão MUST ciclar ascendente, descendente e nenhuma, chamando `onSortChange` com `{ columnId, direction }` ou `null`. Colunas não ordenáveis MUST NOT ter botão nem `aria-sort`.

#### Scenario: Ciclo de ordenação

- **WHEN** a pessoa ativa repetidamente o botão de uma coluna ordenável
- **THEN** `onSortChange` recebe `asc`, depois `desc` e depois `null`

#### Scenario: Trocar de coluna

- **WHEN** a coluna A está ordenada e a pessoa ativa o botão da coluna B
- **THEN** `onSortChange` recebe a coluna B em ordem ascendente, e `aria-sort` reflete apenas a coluna informada em `sort`

#### Scenario: Estado exposto

- **WHEN** `sort` indica uma coluna descendente
- **THEN** o `<th>` dessa coluna tem `aria-sort="descending"` e as demais colunas ordenáveis têm `aria-sort="none"`

#### Scenario: Teclado e anúncio

- **WHEN** a pessoa foca o botão com `Tab` e aciona com `Enter` ou `Space`
- **THEN** a ordenação muda, o foco permanece no botão e uma região `aria-live="polite"` anuncia a coluna e o sentido

#### Scenario: Anúncio não repetido

- **WHEN** a ordenação já foi anunciada e uma carga posterior termina sem mudar `sort` (por exemplo, ao paginar)
- **THEN** o anúncio da ordenação não se repete, porque o carregamento é anunciado em uma região separada

### Requirement: Seleção de linhas

Com `onSelectionChange`, `AdsSmartTable` MUST oferecer uma coluna de seleção controlada por `selectedIds`. Em `selectionMode="multiple"` (padrão), cada linha MUST ter um checkbox com nome acessível `labels.selectRow` e o cabeçalho MUST ter um checkbox "selecionar todas as linhas da página". `onSelectionChange` MUST receber a lista completa de ids, preservando ids de outras páginas, e `isRowSelectable` MUST desabilitar linhas.

#### Scenario: Selecionar uma e várias linhas

- **WHEN** a pessoa marca checkboxes de linhas
- **THEN** `onSelectionChange` recebe a lista com os ids marcados, e linhas selecionadas recebem `data-selected`

#### Scenario: Selecionar todas na página

- **WHEN** a pessoa marca o checkbox do cabeçalho
- **THEN** `onSelectionChange` recebe os ids de todas as linhas selecionáveis da página, mais os já selecionados em outras páginas, e desmarcá-lo remove só os da página

#### Scenario: Estado indeterminado

- **WHEN** apenas parte das linhas selecionáveis da página está selecionada
- **THEN** o checkbox do cabeçalho está indeterminado (propriedade `indeterminate`, exposta como "misto" pelo navegador); com todas selecionadas está marcado e sem nenhuma está desmarcado

#### Scenario: Linha não selecionável

- **WHEN** `isRowSelectable` retorna falso para uma linha
- **THEN** o controle da linha fica desabilitado e a linha não entra em "selecionar todas"

#### Scenario: Anúncio da seleção

- **WHEN** a quantidade de linhas selecionadas muda
- **THEN** uma região `aria-live="polite"` anuncia a quantidade, e a mesma contagem é visível na barra de ferramentas

#### Scenario: Seleção em outras páginas

- **WHEN** `selectedIds` contém ids que não estão na página exibida
- **THEN** a contagem informa o total e quantas linhas selecionadas estão na página (por exemplo, "4 linhas selecionadas, 0 nesta página"), por `labels.selectedCount(total, naPagina)`

### Requirement: Seleção única

Em `selectionMode="single"`, cada linha MUST ter um botão de opção (`radio`) do mesmo grupo, `onSelectionChange` MUST receber no máximo um id e o cabeçalho da coluna de seleção MUST NOT ter checkbox, mantendo um nome acessível.

#### Scenario: Escolher uma linha

- **WHEN** `selectionMode="single"` e a pessoa escolhe uma linha
- **THEN** `onSelectionChange` recebe somente o id dessa linha, e o cabeçalho de seleção não tem checkbox

### Requirement: Visibilidade de colunas

Com `onHiddenColumnsChange`, `AdsSmartTable` MUST exibir um botão "Colunas" com `aria-expanded` e `aria-controls`, que abre um painel inline com um grupo de checkboxes (um por coluna, com as colunas fixas desabilitadas) controlado por `hiddenColumnIds`. O painel MUST NOT sobrepor a tabela. Colunas ocultas MUST NOT ser renderizadas no cabeçalho nem nas linhas. Ao menos uma coluna MUST permanecer visível, e colunas com `hideable: false` MUST NOT ser ocultáveis.

#### Scenario: Ocultar uma coluna

- **WHEN** a pessoa desmarca uma coluna no seletor
- **THEN** `onHiddenColumnsChange` recebe os ids ocultos incluindo essa coluna e, após o consumidor aplicar, ela some do cabeçalho e das linhas

#### Scenario: Última coluna visível

- **WHEN** resta uma única coluna visível
- **THEN** o checkbox dela fica desabilitado

#### Scenario: Teclado

- **WHEN** o seletor está aberto e a pessoa pressiona `Escape`
- **THEN** o painel fecha e o foco volta ao botão "Colunas"

#### Scenario: Painel inline

- **WHEN** o seletor está aberto
- **THEN** o painel aparece entre a barra de ferramentas e a tabela, empurrando-a para baixo, sem cobrir o cabeçalho nem as linhas, e colunas com `hideable: false` aparecem desabilitadas

### Requirement: Estados de carregamento, vazio e erro

`AdsSmartTable` MUST suportar `loading`, `error` e ausência de linhas, com precedência `error`, `loading` e vazio. Com `loading`, MUST exibir linhas de `AdsSkeleton`, definir `aria-busy="true"` na tabela e anunciar `labels.loading`. Com `error`, MUST exibir um `AdsEmptyState` com `role="alert"` e, quando `onRetry` existe, um botão de nova tentativa. Sem linhas, MUST exibir `emptyState` ou um `AdsEmptyState` padrão. O cabeçalho MUST permanecer em todos os estados.

#### Scenario: Carregando

- **WHEN** `loading` é verdadeiro
- **THEN** a tabela exibe linhas de esqueleto, tem `aria-busy="true"`, o carregamento é anunciado e "selecionar todas" fica desabilitado

#### Scenario: Erro

- **WHEN** `error` é informado
- **THEN** a mensagem é anunciada com `role="alert"` e o botão de nova tentativa chama `onRetry`

#### Scenario: Vazio

- **WHEN** não há linhas, nem erro, nem carregamento
- **THEN** o estado vazio é exibido em uma célula que ocupa todas as colunas

### Requirement: Rolagem horizontal acessível

`AdsSmartTable` MUST envolver a tabela em uma região rolável com nome acessível (a legenda) e focável por teclado, sem ocultar colunas automaticamente, e MUST manter a barra de ferramentas e a paginação fora da região rolável.

#### Scenario: Tela estreita

- **WHEN** as colunas excedem a largura disponível
- **THEN** a região recebe foco por `Tab`, rola horizontalmente com as setas e mantém todas as colunas acessíveis, com foco visível, e a página em si não rola na horizontal (a paginação rola dentro do próprio contêiner)

#### Scenario: Colunas que cabem

- **WHEN** as colunas cabem na largura disponível, com ou sem a coluna de seleção
- **THEN** a região não rola na horizontal, e a coluna de seleção ocupa só a largura do controle

### Requirement: Paginação e filtros opcionais

`AdsSmartTable` MUST aceitar `pagination` (props de `AdsPagination`, inclusive `renderPageLink`) e `filters` (conteúdo acima da tabela), ambos opcionais e independentes entre si e do estado da tabela.

#### Scenario: Paginação por links

- **WHEN** `pagination` informa `renderPageLink`
- **THEN** as páginas são renderizadas como os links do consumidor, sem botões aninhados

#### Scenario: Sem paginação nem filtros

- **WHEN** `pagination` e `filters` são omitidos
- **THEN** nenhum deles é renderizado

#### Scenario: Barra de filtros

- **WHEN** o consumidor passa um `AdsFilterBar` em `filters`
- **THEN** ele aparece acima da tabela e continua controlado pelo consumidor

### Requirement: Textos, temas e distribuição

Os textos MUST ser configuráveis por `labels`, com padrão em pt-BR. `AdsSmartTable` MUST usar classes `ads-smart-table*` e variáveis `--ads-*`, funcionar nos temas claro e escuro, ser personalizável por sobrescrita de tokens e MUST NOT exigir Tailwind das aplicações consumidoras nem adicionar dependências de runtime. O CSS MUST ser distribuído em `@admin-ds/admin/styles.css`. A renderização inicial MUST ser igual no servidor e no cliente.

#### Scenario: Tema escuro

- **WHEN** a tabela é renderizada em `data-theme="dark"`
- **THEN** superfícies, bordas, seleção e foco usam os tokens do tema com contraste legível

#### Scenario: Realce de hover

- **WHEN** o ponteiro passa sobre o cabeçalho ou sobre as linhas de vazio, erro e carregamento
- **THEN** essas linhas não mudam de fundo; só as linhas de dados têm realce de hover

#### Scenario: Consumo em Next.js

- **WHEN** uma aplicação Next.js importa `@admin-ds/admin` e `@admin-ds/admin/styles.css` em um Client Component
- **THEN** a tabela é estilizada sem configurar Tailwind, sem importar caminhos internos e sem erro de hidratação

#### Scenario: Acessibilidade

- **WHEN** a tabela é verificada com `axe` em estados padrão, carregando, vazio, erro, com seleção e com colunas ocultas
- **THEN** não há violações
