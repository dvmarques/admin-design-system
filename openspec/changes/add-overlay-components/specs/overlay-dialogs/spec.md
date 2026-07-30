## Purpose

Disponibilizar modais e drawers acessíveis para fluxos administrativos que exigem atenção ou conteúdo contextual sem abandonar a página atual.

## ADDED Requirements

### Requirement: Diálogos e drawers públicos e composicionáveis
O sistema MUST exportar componentes públicos prefixados por `Ads` para apresentar um diálogo modal e um drawer/offcanvas, aceitando conteúdo fornecido pela aplicação, estado aberto controlado e `className` onde a personalização for segura.

#### Scenario: Aplicação abre um diálogo controlado
- **WHEN** uma aplicação altera o estado controlado do diálogo para aberto
- **THEN** o conteúdo do diálogo é apresentado sobre a página sem exigir integração com roteamento ou estado global

#### Scenario: Aplicação apresenta um drawer lateral
- **WHEN** uma aplicação abre um drawer com conteúdo fornecido
- **THEN** o drawer é distinguível visualmente da página e permanece utilizável dentro da largura disponível em telas estreitas

### Requirement: Interação modal acessível
Enquanto aberto, um diálogo modal ou drawer MUST expor semântica acessível de diálogo, possuir nome acessível e manter a navegação por teclado dentro do conteúdo ativo. Ao fechar, o foco MUST retornar ao gatilho que abriu o overlay quando esse elemento ainda estiver disponível.

#### Scenario: Usuário navega por teclado em um modal
- **WHEN** o usuário usa Tab ou Shift+Tab com um modal aberto
- **THEN** o foco circula pelos elementos focalizáveis do modal e não alcança o conteúdo inativo da página

#### Scenario: Modal é fechado
- **WHEN** um modal aberto é fechado por uma ação suportada
- **THEN** o foco volta ao elemento que o abriu, se esse elemento ainda existir e puder receber foco

### Requirement: Fechamento previsível e configurável
Os diálogos e drawers MUST fornecer uma solicitação de fechamento para a aplicação e MUST permitir fechamento por Escape, controle de fechar e interação com o backdrop quando essas formas estiverem habilitadas. A aplicação MUST poder desabilitar as formas de fechamento que não forem adequadas ao fluxo.

#### Scenario: Usuário pressiona Escape
- **WHEN** um overlay permite fechamento por Escape e o usuário pressiona Escape
- **THEN** a aplicação recebe a solicitação de fechamento

#### Scenario: Fluxo crítico bloqueia fechamento pelo backdrop
- **WHEN** a aplicação desabilita o fechamento por backdrop
- **THEN** interagir com a área fora do conteúdo não solicita o fechamento do overlay

### Requirement: Temas e personalização por tokens
Os diálogos e drawers MUST usar tokens semânticos públicos de cor, borda, raio, elevação e backdrop e MUST manter contraste e distinção visual nos temas claro e escuro.

#### Scenario: Consumidor personaliza a superfície do overlay
- **WHEN** uma aplicação sobrescreve um token público usado pelo overlay
- **THEN** o diálogo ou drawer usa o valor personalizado sem recompilar os estilos da biblioteca

