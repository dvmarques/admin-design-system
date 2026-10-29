## MODIFIED Requirements

### Requirement: Ícones de conta, notificações e seleção

`AdsIconName` MUST incluir `bell`, `building`, `chevronDown`, `chevronsUpDown`, `logOut`, `settings` e `user`, decorativos por padrão e informativos quando `label` for informado, sem alterar os ícones existentes. O identificador `building` MUST apresentar o desenho licenciado `Building06Icon` de Hugeicons Free com cor herdada via `currentColor` e sem alterar o contrato público do componente.

#### Scenario: Ícone decorativo

- **WHEN** `AdsIcon` renderiza `bell` sem `label`
- **THEN** o SVG é ocultado de tecnologias assistivas

#### Scenario: Ícone building mantém contrato público

- **WHEN** uma aplicação renderiza `AdsIcon name="building"` com um tamanho público e `label` opcional
- **THEN** o SVG renderiza o desenho oficial com quatro paths sem dependência de pacote de ícones externa
- **AND** mantém semântica acessível, tamanho e cor herdada

#### Scenario: Compatibilidade

- **WHEN** `AdsIcon` renderiza um ícone anterior diferente de `building`
- **THEN** o resultado permanece igual
