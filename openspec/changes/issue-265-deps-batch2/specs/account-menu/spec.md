## ADDED Requirements

### Requirement: Nome acessível do avatar contém iniciais visíveis

O botão do `AdsAccountMenu` MUST incluir em seu nome acessível as iniciais visíveis do avatar quando exibidas, além do rótulo de conta e do nome informado, sem criar texto visual redundante nem alterar as propriedades públicas.

#### Scenario: Avatar sem foto

- **WHEN** o consumidor informa o nome `Ana Souza`, sem imagem
- **THEN** o gatilho exibe `AS`, seu nome acessível contém `AS Ana Souza` e a auditoria WCAG 2.2 AA de `axe-core@4.14.0` não acusa `label-content-name-mismatch`

#### Scenario: Iniciais customizadas

- **WHEN** o consumidor define `user.initials`
- **THEN** o texto escolhido aparece no avatar e compõe o nome acessível do gatilho
