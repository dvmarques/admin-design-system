# Delta de especificação: AdsSmartTable

## ADDED Requirements

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
