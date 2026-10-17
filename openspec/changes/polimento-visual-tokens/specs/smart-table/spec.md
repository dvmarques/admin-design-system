## ADDED Requirements

### Requirement: Densidade e skeleton padronizados na tabela inteligente

`AdsSmartTable` MUST aceitar a prop opcional `density` e repassá-la à tabela subjacente, mantendo o comportamento atual sem a prop. Em carregamento, as linhas de placeholder MUST usar `AdsSkeleton` com a altura definida pelos tokens de skeleton, e o estado vazio MUST usar `AdsEmptyState`.

#### Scenario: Tabela inteligente compacta

- **WHEN** `density="compact"` é informado
- **THEN** a tabela exibe `data-density="compact"` e o espaçamento compacto, sem alterar ordenação, seleção ou paginação

#### Scenario: Carregamento

- **WHEN** `loading` é verdadeiro
- **THEN** os placeholders ocupam a altura do token de skeleton de texto e o estado é anunciado por status acessível, sem animação com movimento reduzido
