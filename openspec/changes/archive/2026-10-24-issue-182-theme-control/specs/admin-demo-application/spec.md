## ADDED Requirements

### Requirement: Preferência de tema Claro, Escuro e Sistema

O admin-demo MUST oferecer Claro, Escuro e Sistema no cabeçalho (menu compacto por ícones) e na página de preferências (grupo), ambos lendo e alterando a mesma preferência, sem remontar controles nem perder o foco. Sem preferência salva, MUST usar Sistema. A preferência explícita MUST ser persistida e restaurada, e preferências `light`/`dark` salvas anteriormente MUST continuar válidas. O tema efetivo (`light`/`dark`) MUST ser aplicado ao documento compatível com os tokens atuais.

#### Scenario: Controles sincronizados

- **WHEN** a pessoa escolhe Escuro no cabeçalho
- **THEN** o grupo nas preferências reflete Escuro e vice-versa, sem remontagem

#### Scenario: Foco preservado

- **WHEN** a pessoa escolhe um modo no grupo das preferências pelo teclado
- **THEN** o foco permanece na opção escolhida

#### Scenario: Sem preferência salva

- **WHEN** a página é aberta sem preferência salva
- **THEN** a preferência ativa é Sistema e o tema efetivo segue o sistema operacional

#### Scenario: Preferência restaurada

- **WHEN** a pessoa escolhe Escuro, Claro ou Sistema e recarrega
- **THEN** a mesma preferência é restaurada e Sistema volta a seguir o sistema operacional

#### Scenario: Preferência anterior migrada

- **WHEN** existe o cookie `ads-theme` com `light` ou `dark` de versões anteriores
- **THEN** essa preferência explícita é mantida

### Requirement: Sistema acompanha o sistema operacional

Enquanto a preferência for Sistema, o admin-demo MUST acompanhar mudanças de `prefers-color-scheme` e atualizar o tema efetivo. Em Claro ou Escuro explícitos, mudanças do sistema MUST NOT alterar o tema. Os listeners MUST ser removidos quando a preferência deixa de ser Sistema ou o componente é desmontado.

#### Scenario: Sistema muda com Sistema selecionado

- **WHEN** a preferência é Sistema e o sistema passa de claro para escuro
- **THEN** o tema efetivo passa a escuro e o ícone do gatilho continua sendo o monitor

#### Scenario: Preferência explícita estável

- **WHEN** a preferência é Claro e o sistema passa a escuro
- **THEN** o tema efetivo permanece claro

#### Scenario: Limpeza de listeners

- **WHEN** a pessoa troca de Sistema para um modo explícito
- **THEN** o listener de `prefers-color-scheme` é removido

### Requirement: Aplicação inicial sem flash e armazenamento resiliente

O admin-demo MUST aplicar a preferência antes da primeira pintura em todos os builds, sem divergência de hidratação. Quando o servidor não conhece a preferência do sistema (Sistema ou ausente), MUST renderizar o fallback `light` e corrigi-lo antes da primeira pintura. A indisponibilidade de armazenamento ou de cookies MUST NOT quebrar a interface: a escolha continua valendo na sessão.

#### Scenario: Cookie explícito renderizado no servidor

- **WHEN** o cookie `ads-theme` é `dark`
- **THEN** a resposta do servidor já traz `data-theme="dark"` e `data-theme-preference="dark"`

#### Scenario: Sistema escuro antes da pintura

- **WHEN** a preferência é Sistema e o sistema está escuro
- **THEN** o script inicial define `data-theme="dark"` antes da hidratação, sem alternância visível

#### Scenario: Armazenamento indisponível

- **WHEN** a escrita do cookie falha
- **THEN** a escolha é aplicada na sessão atual e a interface continua funcional
