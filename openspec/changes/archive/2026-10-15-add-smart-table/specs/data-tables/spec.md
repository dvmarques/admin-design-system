## ADDED Requirements

### Requirement: Atributos no contêiner de rolagem

`AdsTable` MUST aceitar `containerProps` opcional com atributos HTML aplicados ao contêiner de rolagem, para que composições possam torná-lo uma região nomeada e focável. A ausência de `containerProps` MUST NOT alterar a marcação existente.

#### Scenario: Região rolável nomeada

- **WHEN** o consumidor informa `containerProps` com `role="region"`, `tabIndex={0}` e `aria-label`
- **THEN** o contêiner exibe esses atributos e mantém as classes `ads-table-container`

#### Scenario: Sem containerProps

- **WHEN** `AdsTable` é renderizada sem `containerProps`
- **THEN** a marcação do contêiner é a mesma de antes
