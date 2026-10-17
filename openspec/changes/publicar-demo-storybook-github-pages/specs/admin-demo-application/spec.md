# Spec Delta

## ADDED Requirements

### Requirement: Demo gerável como site estático

O admin-demo MUST poder ser gerado como site estático servido sob um subcaminho, sem alterar o comportamento do build normal nem exigir servidor para nenhuma de suas rotas.

#### Scenario: Todas as rotas administrativas no build estático

- **WHEN** o demo é gerado como site estático
- **THEN** todas as rotas administrativas existem como páginas estáticas e abrem sem servidor

#### Scenario: Build normal inalterado

- **WHEN** o demo é construído e iniciado sem a configuração do site estático
- **THEN** o tema continua sendo aplicado a partir da preferência salva e o comportamento é o mesmo de antes

### Requirement: Preferência de tema no site estático

No site estático, o admin-demo MUST aplicar a preferência de tema salva pela pessoa antes da primeira pintura e manter os controles de tema sincronizados.

#### Scenario: Troca de tema

- **WHEN** a pessoa alterna o tema no cabeçalho ou na página de preferências do site estático
- **THEN** o tema muda, os dois controles refletem o mesmo valor e a escolha é mantida ao recarregar

### Requirement: Link opcional para o Storybook

O admin-demo MUST exibir no cabeçalho um link para o Storybook somente quando o endereço do catálogo for configurado no build.

#### Scenario: Endereço configurado

- **WHEN** o demo é construído com o endereço do Storybook configurado
- **THEN** o cabeçalho exibe um link acessível para o catálogo e a navegação principal permanece inalterada

#### Scenario: Endereço ausente

- **WHEN** o demo é construído sem o endereço do Storybook
- **THEN** o cabeçalho não exibe o link
