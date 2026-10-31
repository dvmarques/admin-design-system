## ADDED Requirements

### Requirement: Nome acessível do avatar contém iniciais visíveis

O botão do `AdsAccountMenu` MUST incluir em seu nome acessível as iniciais do avatar, além do rótulo de conta e do nome informado, sem criar texto visual redundante nem alterar as propriedades públicas. As iniciais compõem o nome mesmo quando há foto, pois a falha de carregamento da imagem (inclusive antes da hidratação) passa a exibi-las, e o nome não deve depender desse estado.

#### Scenario: Avatar sem foto

- **WHEN** o consumidor informa o nome `Ana Souza`, sem imagem
- **THEN** o gatilho exibe `AS`, seu nome acessível contém `AS Ana Souza` e a auditoria WCAG 2.2 AA de `axe-core@4.14.0` não acusa `label-content-name-mismatch`

#### Scenario: Iniciais customizadas

- **WHEN** o consumidor define `user.initials`
- **THEN** o texto escolhido aparece no avatar e compõe o nome acessível do gatilho

#### Scenario: Avatar com foto

- **WHEN** o consumidor informa `user.avatarSrc` e o nome `Ana Souza`
- **THEN** o nome acessível do gatilho continua sendo `Menu da conta: AS Ana Souza`, independentemente de a imagem carregar ou falhar
