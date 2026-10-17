## ADDED Requirements

### Requirement: Densidade da tabela

`AdsTable` MUST aceitar a prop opcional `density` (`"comfortable"` ou `"compact"`), que define `data-density` na tabela, e MUST usar os tokens públicos de densidade no espaçamento de células e cabeçalhos. A tabela MUST também respeitar `data-density` definido em um ancestral. Sem a prop e sem atributo, a aparência e a marcação MUST permanecer as atuais.

#### Scenario: Tabela compacta por prop

- **WHEN** `density="compact"` é informado
- **THEN** a tabela exibe `data-density="compact"` e células e cabeçalhos usam o espaçamento compacto, preservando a semântica tabular

#### Scenario: Densidade herdada de um ancestral

- **WHEN** um ancestral define `data-density="compact"` e a tabela não informa `density`
- **THEN** a tabela usa o espaçamento compacto

#### Scenario: Sem densidade

- **WHEN** nenhuma densidade é informada
- **THEN** a marcação e o espaçamento são os mesmos de antes
