## ADDED Requirements

### Requirement: Camadas de overlay hierárquicas

Quando houver mais de um overlay aberto, o sistema MUST tratar foco por teclado, fechamento por clique externo e fechamento por backdrop segundo a hierarquia lógica das camadas, incluindo overlays renderizados em portais, e MUST NOT alterar as APIs públicas dos componentes.

#### Scenario: Modais empilhados

- **WHEN** um diálogo é aberto sobre outro diálogo e o usuário usa Tab ou Shift+Tab
- **THEN** somente o diálogo superior controla o foco, e o foco não alcança o diálogo inferior nem a página

#### Scenario: Fechar o modal superior

- **WHEN** o diálogo superior é fechado
- **THEN** o diálogo inferior volta a controlar o foco, Escape e o scroll, e o foco retorna ao elemento que abriu o superior

#### Scenario: Popup dentro de um modal

- **WHEN** um popover ou menu aberto dentro de um modal recebe foco ou clique
- **THEN** o modal não interrompe a navegação do popup e o clique no popup não fecha o modal nem popups pais

#### Scenario: Popup aninhado em popup

- **WHEN** o usuário interage com um popover aberto a partir de outro popover
- **THEN** o popover pai permanece aberto

#### Scenario: Backdrop com popup aberto

- **WHEN** o usuário clica no backdrop com um popup aberto sobre o modal
- **THEN** somente o popup fecha e o modal permanece aberto

### Requirement: Isolamento e scroll do fundo durante modais

Enquanto houver um modal aberto, a página de fundo MUST estar isolada da interação e MUST NOT rolar; ao fechar o último modal, o isolamento e o scroll MUST ser restaurados aos valores anteriores.

#### Scenario: Scroll bloqueado

- **WHEN** um diálogo ou drawer é aberto
- **THEN** a rolagem do documento é bloqueada sem deslocar o conteúdo por perda da barra de rolagem

#### Scenario: Modais empilhados e fechamento

- **WHEN** dois modais estão abertos e o superior é fechado
- **THEN** o scroll permanece bloqueado até o fechamento do último, quando os valores originais retornam

#### Scenario: Desmontagem com modal aberto

- **WHEN** um modal aberto é desmontado sem ser fechado
- **THEN** o scroll, o isolamento e os listeners globais são liberados

#### Scenario: Renderização no servidor e StrictMode

- **WHEN** os componentes são renderizados no servidor ou sob React StrictMode
- **THEN** não há acesso ao DOM durante a renderização e não restam listeners ou estilos residuais
