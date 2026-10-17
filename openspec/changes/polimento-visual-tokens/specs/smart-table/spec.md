## ADDED Requirements

### Requirement: Densidade e skeleton padronizados na tabela inteligente

`AdsSmartTable` MUST aceitar a prop opcional `density` e repassá-la à tabela subjacente, mantendo o comportamento atual sem a prop. Em carregamento, as linhas de placeholder MUST usar `AdsSkeleton` com a altura definida pelos tokens de skeleton, e o estado vazio MUST usar `AdsEmptyState`.

#### Scenario: Tabela inteligente compacta

- **WHEN** `density="compact"` é informado
- **THEN** a tabela exibe `data-density="compact"` e o espaçamento compacto, sem alterar ordenação, seleção ou paginação

#### Scenario: Carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** os placeholders ocupam a altura do token de skeleton de texto e o estado é anunciado por status acessível, sem animação com movimento reduzido

## MODIFIED Requirements

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
