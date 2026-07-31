## Purpose

Oferecer tooltips e popovers acessíveis para revelar contexto breve ou conteúdo complementar a partir de um elemento da interface.

## ADDED Requirements

### Requirement: Tooltips revelam descrição contextual

O sistema MUST exportar um tooltip público prefixado por `Ads` que associe uma descrição breve ao seu gatilho e seja revelado por foco ou apontamento. O tooltip MUST desaparecer quando o gatilho perde foco ou apontamento, exceto enquanto o apontamento estiver sobre o próprio tooltip quando esse comportamento for oferecido.

#### Scenario: Usuário focaliza um gatilho com tooltip

- **WHEN** o usuário alcança pelo teclado um gatilho que possui tooltip
- **THEN** a descrição contextual é apresentada e fica associada ao gatilho para tecnologias assistivas

### Requirement: Popovers oferecem conteúdo interativo sob demanda

O sistema MUST exportar um popover público prefixado por `Ads` que possa ser aberto de forma controlada por um gatilho e apresentar conteúdo complementar, inclusive elementos interativos. O popover MUST expor relação acessível entre gatilho e conteúdo.

#### Scenario: Usuário abre um popover pelo teclado

- **WHEN** o usuário ativa pelo teclado o gatilho de um popover fechado
- **THEN** o popover é apresentado e seu conteúdo pode receber foco quando contiver elementos interativos

### Requirement: Fechamento e foco de overlays ancorados

Um popover aberto MUST solicitar fechamento por Escape e quando ocorre interação fora dele; ao fechar, o foco MUST retornar ao gatilho quando o fechamento foi iniciado por teclado. Um tooltip MUST não capturar foco nem bloquear a interação com a página.

#### Scenario: Usuário fecha um popover com Escape

- **WHEN** o usuário pressiona Escape com foco dentro de um popover aberto
- **THEN** a aplicação recebe a solicitação de fechamento e o foco retorna ao gatilho quando ele continua disponível

### Requirement: Posicionamento responsivo e tematização

Tooltips e popovers MUST ser visualmente associados ao gatilho sem ultrapassar os limites disponíveis da tela e MUST usar tokens semânticos públicos que preservem contraste nos temas claro e escuro.

#### Scenario: Gatilho está próximo à borda da tela

- **WHEN** uma aplicação abre um overlay ancorado com pouco espaço na direção preferida
- **THEN** o conteúdo permanece visível dentro da área disponível sem ocultar o gatilho
