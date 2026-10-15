## ADDED Requirements

### Requirement: Atributos no contêiner de rolagem

`AdsTable` MUST aceitar `containerProps` opcional com atributos HTML aplicados ao contêiner de rolagem, para que composições possam torná-lo uma região nomeada e focável. A ausência de `containerProps` MUST NOT alterar a marcação existente.

#### Scenario: Região rolável nomeada

- **WHEN** o consumidor informa `containerProps` com `role="region"`, `tabIndex={0}` e `aria-label`
- **THEN** o contêiner exibe esses atributos e mantém as classes `ads-table-container`

#### Scenario: Sem containerProps

- **WHEN** `AdsTable` é renderizada sem `containerProps`
- **THEN** a marcação do contêiner é a mesma de antes

### Requirement: Realce de hover em linhas interativas

`AdsTableRow` MUST aceitar `interactive` opcional (padrão `true`). Com `interactive={true}`, a linha MUST aplicar o realce de hover (`hover:bg-surface-hover`). Com `interactive={false}`, MUST NOT aplicar esse realce, mantendo as demais classes da linha.

#### Scenario: Linha interativa

- **WHEN** `AdsTableRow` é renderizada sem `interactive` ou com `interactive={true}`
- **THEN** a linha inclui a classe de hover de fundo

#### Scenario: Linha estática

- **WHEN** `AdsTableRow` é renderizada com `interactive={false}`
- **THEN** a linha não inclui a classe de hover de fundo
