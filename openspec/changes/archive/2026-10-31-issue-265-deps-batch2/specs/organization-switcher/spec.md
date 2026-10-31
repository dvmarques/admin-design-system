## ADDED Requirements

### Requirement: Nome acessível do seletor contém suas iniciais visíveis

O gatilho do `AdsOrganizationSwitcher` MUST incluir no nome acessível as iniciais visíveis do logo/avatar, além do nome e descrição da organização, com a mesma regra de fallback e sem alterar a API de seleção ou o layout.

#### Scenario: Logo ausente ou falho

- **WHEN** a organização atual é `Acme Brasil` e o logo está ausente
- **THEN** o gatilho exibe `AB` e `Acme Brasil`, seu nome acessível contém esses textos, e a auditoria WCAG 2.2 AA de `axe-core@4.14.0` não acusa `label-content-name-mismatch`

#### Scenario: Sidebar recolhida

- **WHEN** a sidebar é recolhida e o gatilho mostra apenas o avatar
- **THEN** o nome acessível ainda identifica a organização, com iniciais, e permite seleção por teclado
