# smart-table Specification

## Purpose

Permite listar dados administrativos com ordenação por coluna, seleção de linhas, visibilidade de colunas e estados de carregamento, vazio e erro, com todo o estado controlado pela aplicação consumidora.

## Requirements

### Requirement: Composição controlada sobre AdsTable

O sistema MUST fornecer `AdsSmartTable` em `@admin-ds/admin`, que renderize `columns` e `rows` com `AdsTable`, exija uma legenda (`caption`) e um `getRowId`, e aceite `className`. A tabela MUST NOT buscar, ordenar, filtrar nem paginar dados, MUST NOT guardar estado de ordenação, seleção ou colunas e MUST NOT ler a URL nem importar o roteador do Next.js. Os componentes e tipos públicos MUST usar o prefixo `Ads`, sem expor Tailwind.

#### Scenario: Renderizar linhas e colunas

- **WHEN** o consumidor informa colunas, linhas e `caption`
- **THEN** a tabela exibe a legenda, um cabeçalho (`scope="col"`) por coluna visível e uma linha por item, na ordem recebida

#### Scenario: Estado não aplicado pelo consumidor

- **WHEN** o consumidor não atualiza `sort`, `selectedIds` ou `hiddenColumnIds` após um `onChange`
- **THEN** a tabela continua exibindo o estado anterior

#### Scenario: Compatibilidade de AdsTable

- **WHEN** `AdsTable` é usada diretamente, sem `AdsSmartTable` e sem `density`
- **THEN** seu comportamento permanece o mesmo: não há `data-density`, o espaçamento confortável equivale ao anterior e células e cabeçalhos usam as variáveis públicas de densidade em vez dos utilitários fixos de padding

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

### Requirement: Legenda alinhada ao conteúdo da tabela

Dentro do contêiner da `AdsSmartTable`, a legenda visível MUST ter espaçamento horizontal igual ao das células e espaçamento vertical da densidade, e MUST NOT encostar na borda do contêiner. A legenda oculta (`hideCaption`) MUST continuar oculta visualmente e presente no DOM como nome acessível da região. `AdsTable` usada isoladamente MUST NOT mudar.

#### Scenario: Legenda visível

- **WHEN** `AdsSmartTable` é renderizada com `caption` e sem `hideCaption`
- **THEN** o texto da legenda começa alinhado ao texto das células da primeira coluna, com espaço acima, e não encosta na borda do contêiner

#### Scenario: Legenda oculta

- **WHEN** `AdsSmartTable` é renderizada com `hideCaption`
- **THEN** a legenda não ocupa espaço visível e a região rolável mantém a legenda como nome acessível

#### Scenario: AdsTable isolada

- **WHEN** `AdsTable` é usada diretamente, com `AdsTableCaption`
- **THEN** a marcação e o espaçamento da legenda não mudam

### Requirement: Densidade e skeleton padronizados na tabela inteligente

`AdsSmartTable` MUST aceitar a prop opcional `density` e repassá-la à tabela subjacente, mantendo o comportamento atual sem a prop. Em carregamento, as linhas de placeholder MUST usar `AdsSkeleton` com a altura definida pelos tokens de skeleton, e o estado vazio MUST usar `AdsEmptyState`.

#### Scenario: Tabela inteligente compacta

- **WHEN** `density="compact"` é informado
- **THEN** a tabela exibe `data-density="compact"` e o espaçamento compacto, sem alterar ordenação, seleção ou paginação

#### Scenario: Carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** os placeholders ocupam a altura do token de skeleton de texto e o estado é anunciado por status acessível, sem animação com movimento reduzido

### Requirement: Escape do painel de colunas não fecha o overlay ao redor

Com o painel de colunas aberto dentro de um `AdsDialog` ou `AdsDrawer`, o primeiro Escape MUST fechar apenas o painel e devolver o foco ao botão "Colunas"; um segundo Escape MUST solicitar o fechamento do overlay.

#### Scenario: Painel de colunas dentro de um diálogo

- **WHEN** o painel de colunas está aberto dentro de um diálogo e o usuário pressiona Escape
- **THEN** o painel fecha, o foco volta ao botão "Colunas" e o diálogo permanece aberto

#### Scenario: Segundo Escape

- **WHEN** o painel já foi fechado e o usuário pressiona Escape novamente
- **THEN** o diálogo solicita o fechamento

### Requirement: Rodapé opcional de paginação

AdsSmartTable MUST permitir composição de AdsPagination com salto direto e MAY expor seletor controlado de tamanho de página e resumo de registros quando receber informações suficientes. MUST preservar o rodapé atual quando as opções não forem fornecidas, sem realizar buscas de dados.

#### Scenario: Resumo e seletor em contêiner estreito

- **WHEN** o consumidor fornece total, tamanho e callback e o contêiner diminui
- **THEN** resumo e seletor permanecem acessíveis, sem números inventados nem recorte vertical

#### Scenario: Total desconhecido ou vazio

- **WHEN** o total é desconhecido ou zero
- **THEN** o resumo não inventa intervalo de registros e os controles continuam consistentes

#### Scenario: Página incompleta ou dados ainda indisponíveis

- **WHEN** a última página contém menos linhas que pageSize, está vazia ou ainda carrega
- **THEN** o resumo limita-se às linhas verificáveis e não anuncia intervalos inexistentes ou dados antigos durante loading

#### Scenario: Controle de tamanho e internacionalização

- **WHEN** o consumidor habilita o seletor ou personaliza seus rótulos e o resumo
- **THEN** o callback recebe apenas tamanho válido e diferente, sem buscar dados ou alterar página implicitamente; carregamento bloqueia ações

#### Scenario: Rodapé padrão preservado

- **WHEN** a tabela recebe somente as props de paginação já existentes
- **THEN** mantém a paginação alinhada à direita, sem resumo ou seletor, com adaptação ao espaço e folga para foco

### Requirement: Virtualização opcional de linhas

`AdsSmartTable` MUST aceitar `virtualization` (`rowHeight`, `height`, `overscan` opcional) e, com valores válidos, renderizar só as linhas visíveis mais o overscan em uma região rolável de altura máxima `height`, com cabeçalho fixo e altura total equivalente à de todas as linhas. Sem a prop, ou com valores inválidos, MUST renderizar todas as linhas como antes. A renderização inicial MUST ser igual no servidor e no cliente.

#### Scenario: Muitas linhas

- **WHEN** a tabela recebe milhares de linhas com `virtualization`
- **THEN** apenas as linhas da janela visível e do overscan existem no DOM, e `aria-rowcount` informa o total real mais o cabeçalho

#### Scenario: Rolagem

- **WHEN** a região rolável é rolada
- **THEN** a janela acompanha a posição, `aria-rowindex` das linhas montadas reflete a posição real e as linhas fora da janela deixam de existir

#### Scenario: Configuração ausente ou inválida

- **WHEN** `virtualization` é omitida, ou `rowHeight` ou `height` não são números positivos
- **THEN** todas as linhas são renderizadas e `aria-rowcount` não é definido

#### Scenario: Acessibilidade da tabela virtualizada

- **WHEN** a tabela virtualizada é verificada com `axe` nos temas claro e escuro
- **THEN** não há violações

### Requirement: Redimensionamento de colunas acessível

Com `onColumnWidthsChange`, `AdsSmartTable` MUST exibir uma alça por coluna, exceto com `resizable: false`, exposta como `role="separator"` focável, com nome acessível (`labels.resizeColumn`), `aria-orientation="vertical"`, `aria-valuenow`, `aria-valuemin` e `aria-valuemax`. Sem `onColumnWidthsChange`, nenhuma alça MUST ser exibida.

#### Scenario: Recurso desativado

- **WHEN** `onColumnWidthsChange` é omitido, ou a coluna tem `resizable: false`
- **THEN** a coluna não tem alça de redimensionamento

#### Scenario: Acessibilidade das alças

- **WHEN** a tabela com redimensionamento é verificada com `axe` nos temas claro e escuro
- **THEN** não há violações, e a alça tem foco visível e alvo de ponteiro de ao menos 24 px

### Requirement: Gancho de exportação

Com `onExport`, `AdsSmartTable` MUST exibir um botão (`labels.export`) que chama `onExport` com as colunas visíveis (na ordem exibida, sem as de `exportable: false`), as linhas recebidas, os valores por coluna, os ids selecionados e as linhas selecionadas recebidas. O botão MUST ficar desabilitado em carregamento, erro e sem linhas. A tabela MUST NOT gerar arquivos nem buscar dados.

#### Scenario: Colunas visíveis

- **WHEN** há colunas ocultas ou com `exportable: false` e a pessoa aciona "Exportar"
- **THEN** `onExport` recebe apenas as demais colunas, na ordem exibida, e os valores de cada linha recebida

#### Scenario: Botão bloqueado

- **WHEN** a tabela está carregando, em erro ou sem linhas
- **THEN** o botão "Exportar" está desabilitado

#### Scenario: Recurso desativado

- **WHEN** `onExport` é omitido
- **THEN** nenhum botão de exportação é exibido

### Requirement: Recursos avançados opt-in e compatíveis

Virtualização, redimensionamento e exportação MUST ser independentes, opcionais e combináveis entre si e com seleção, ordenação, colunas, paginação e filtros. Props e campos novos MUST ser opcionais, a marcação sem eles MUST permanecer igual, e a tabela MUST NOT adicionar dependências de runtime nem exigir Tailwind das aplicações consumidoras.

#### Scenario: Uso existente preservado

- **WHEN** a tabela é usada sem as novas props
- **THEN** não há alça, botão de exportação, `aria-rowcount` nem estilos de virtualização, e os testes existentes continuam passando

#### Scenario: Recursos combinados

- **WHEN** virtualização, redimensionamento, exportação, seleção e ordenação são usados juntos
- **THEN** cada recurso funciona sem alterar o estado dos demais

#### Scenario: Consumo em Next.js

- **WHEN** uma página Next.js usa os recursos com `@admin-ds/admin` e `@admin-ds/admin/styles.css`
- **THEN** a página hidrata sem erros, sem configurar Tailwind e sem rolagem horizontal da página

### Requirement: Semântica, foco e seleção com virtualização

Com virtualização, a tabela MUST expor `aria-rowcount` (linhas recebidas mais o cabeçalho) e `aria-rowindex` em cada linha montada. A linha que contém o foco MUST permanecer montada ao rolar. "Selecionar todas", a contagem de selecionadas e `isRowSelectable` MUST considerar todas as linhas recebidas, e os estados de carregamento, vazio e erro MUST manter a precedência e o conteúdo atuais.

#### Scenario: Semântica de linhas

- **WHEN** a tabela virtualizada renderiza a janela visível
- **THEN** `aria-rowcount` informa o total real mais o cabeçalho e cada linha montada tem `aria-rowindex` igual à sua posição real

#### Scenario: Foco e seleção com virtualização

- **WHEN** a pessoa foca o controle de uma linha e rola a região para longe dela, ou seleciona linhas fora da janela
- **THEN** a linha focada continua montada e focada, "selecionar todas" seleciona todas as linhas recebidas e a contagem inclui as linhas não montadas

#### Scenario: Estados de carregamento, vazio e erro

- **WHEN** a tabela virtualizada está carregando, vazia ou com erro
- **THEN** os estados seguem a precedência atual, sem espaçadores nem `aria-rowcount`

### Requirement: Controle de larguras e limites

`columnWidths` MUST ser a fonte da verdade das larguras: a tabela MUST NOT guardá-las e `onColumnWidthsChange` MUST receber a lista completa, respeitando `minWidth` e `maxWidth` da coluna. Por teclado, as setas horizontais MUST alterar a largura em 10 px (50 px com Shift), Home e End MUST ir ao mínimo e ao máximo e Enter MUST restaurar a largura automática; por ponteiro, arrastar a alça MUST alterar a largura.

#### Scenario: Redimensionar pelo teclado

- **WHEN** a pessoa foca a alça e pressiona seta direita, Shift com seta esquerda, End, Home e Enter
- **THEN** `onColumnWidthsChange` recebe a largura ajustada em cada passo, limitada ao mínimo e ao máximo, e Enter remove a largura da coluna

#### Scenario: Redimensionar com o ponteiro

- **WHEN** a pessoa arrasta a alça
- **THEN** `onColumnWidthsChange` recebe larguras limitadas ao mínimo e ao máximo e deixa de ser chamado ao soltar o ponteiro

#### Scenario: Larguras controladas

- **WHEN** o consumidor não aplica a largura recebida em `columnWidths`
- **THEN** a coluna mantém a largura anterior, e as larguras informadas são aplicadas ao cabeçalho e às células da coluna

### Requirement: Valores e formato da exportação

O valor de cada célula exportada MUST vir de `exportValue` ou, na falta, do retorno de `cell` quando for texto ou número, e `null` nos demais casos. O formato MUST ficar a cargo do consumidor, que MAY usar `getAdsSmartTableCsv`, helper que MUST gerar CSV válido (aspas, separador, quebras de linha), MAY filtrar as linhas selecionadas e MUST neutralizar por padrão textos iniciados por `=`, `+`, `-` ou `@`.

#### Scenario: Valor da célula

- **WHEN** uma coluna tem `exportValue`, ou apenas `cell` com texto, número ou conteúdo React
- **THEN** o valor exportado é o de `exportValue`, o texto ou número retornado por `cell`, ou `null`, respectivamente

#### Scenario: Seleção na exportação

- **WHEN** `selectedIds` inclui ids dentro e fora das linhas recebidas
- **THEN** `selectedIds` é emitido por inteiro e `selectedRows` contém só as linhas recebidas selecionadas

#### Scenario: CSV seguro

- **WHEN** `getAdsSmartTableCsv` recebe valores com aspas, separadores, quebras de linha, datas e textos iniciados por `=`
- **THEN** o CSV escapa os campos, usa `\r\n` entre linhas e prefixa o texto de fórmula com `'`, a menos que `neutralizeFormulas` seja `false`
