## Purpose

Disponibilizar ações reutilizáveis e acessíveis para fluxos administrativos sem que cada aplicação recrie seus próprios controles de botão.

## ADDED Requirements

### Requirement: Botão com variantes e tamanhos públicos

O sistema MUST fornecer `AdsButton`, um botão que aceite conteúdo, variantes visuais e tamanhos documentados, preservando seu comportamento nativo de botão.

#### Scenario: Consumidor renderiza uma ação primária

- **WHEN** uma aplicação renderiza o botão com a variante primária
- **THEN** ela obtém uma ação visualmente distinguível nos temas claro e escuro

### Requirement: Estados operáveis do botão

O botão MUST suportar estados desabilitado e de carregamento, impedindo o acionamento enquanto qualquer um deles estiver ativo.

#### Scenario: Botão está carregando

- **WHEN** o consumidor informa que a ação está carregando
- **THEN** o botão comunica o estado de espera e não executa sua ação

#### Scenario: Botão é operado por teclado

- **WHEN** uma pessoa focaliza o botão e o aciona pelo teclado
- **THEN** a ação é executada da mesma forma que por dispositivo apontador e o foco permanece visível

### Requirement: Personalização e consumo externo

O botão MUST responder aos tokens semânticos de tema e permitir personalização segura por classe adicional sem exigir Tailwind no consumidor.

#### Scenario: Consumidor sobrescreve um token de cor

- **WHEN** a aplicação altera o token suportado no escopo de seu tema
- **THEN** o botão reflete a personalização no CSS público distribuído
