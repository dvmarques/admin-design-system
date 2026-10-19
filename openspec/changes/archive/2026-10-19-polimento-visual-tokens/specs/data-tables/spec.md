## ADDED Requirements

### Requirement: Densidade da tabela

`AdsTable` MUST aceitar a prop opcional `density` (`"comfortable"` ou `"compact"`), que define `data-density` na tabela, e MUST usar os tokens públicos de densidade no espaçamento de células e cabeçalhos. A tabela MUST também respeitar `data-density` definido em um ancestral. Sem a prop e sem `data-density` em ancestral, a tabela MUST NOT expor `data-density`; o espaçamento MUST equivaler ao confortável anterior (`1rem` por `0.75rem`), com classes de padding referenciando `--ads-density-cell-padding-x` e `--ads-density-cell-padding-y` em vez dos utilitários fixos anteriores.

#### Scenario: Tabela compacta por prop

- **WHEN** `density="compact"` é informado
- **THEN** a tabela exibe `data-density="compact"` e células e cabeçalhos usam o espaçamento compacto, preservando a semântica tabular

#### Scenario: Densidade herdada de um ancestral

- **WHEN** um ancestral define `data-density="compact"` e a tabela não informa `density`
- **THEN** a tabela usa o espaçamento compacto

#### Scenario: Sem densidade

- **WHEN** nenhuma densidade é informada na tabela nem em um ancestral
- **THEN** a tabela não tem `data-density`, o padding resolve para os tokens confortáveis equivalentes ao `1rem` e `0.75rem` anteriores e células e cabeçalhos usam as variáveis públicas de densidade
