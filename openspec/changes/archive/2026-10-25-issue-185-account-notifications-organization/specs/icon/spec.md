## ADDED Requirements

### Requirement: Ícones de conta, notificações e seleção

`AdsIconName` MUST incluir `bell`, `building`, `chevronDown`, `chevronsUpDown`, `logOut`, `settings` e `user`, decorativos por padrão e informativos quando `label` for informado, sem alterar os ícones existentes.

#### Scenario: Ícone decorativo

- **WHEN** `AdsIcon` renderiza `bell` sem `label`
- **THEN** o SVG é ocultado de tecnologias assistivas

#### Scenario: Compatibilidade

- **WHEN** `AdsIcon` renderiza um ícone anterior
- **THEN** o resultado permanece igual
