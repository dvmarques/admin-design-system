# overlay-dialogs Specification

## Purpose

Disponibilizar modais e drawers acessíveis para fluxos administrativos que exigem atenção ou conteúdo contextual sem abandonar a página atual.

## Requirements

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

### Requirement: Overlays modais respeitam escala de camada e largura reduzida

AdsDialog e AdsDrawer MUST usar a escala semântica de elevação e camada para se separar do conteúdo de fundo. Em largura inferior a 768 px, o espaçamento interno e a composição de ações MUST se adaptar sem reduzir a legibilidade, a área de toque ou os contratos de foco.

#### Scenario: Diálogo é aberto em tela estreita

- **WHEN** um diálogo com ações é exibido em largura inferior a 768 px
- **THEN** conteúdo, ações e controle de fechar permanecem acessíveis sem colisão ou corte do conteúdo

### Requirement: Escape em overlays aninhados fecha apenas a camada superior

Quando mais de um overlay estiver aberto, o Escape MUST ser tratado apenas pela camada superior, definida pela ordem de abertura, e MUST NOT fechar uma camada inferior no mesmo pressionamento.

#### Scenario: Popover aberto dentro de um diálogo

- **WHEN** um popover aberto a partir de um diálogo recebe um Escape
- **THEN** apenas o popover solicita fechamento, o diálogo permanece aberto e o foco volta ao gatilho do popover dentro do diálogo

#### Scenario: Segundo Escape fecha o diálogo

- **WHEN** o popover já foi fechado e o usuário pressiona Escape novamente
- **THEN** o diálogo solicita fechamento e o foco volta ao elemento que o abriu

#### Scenario: Camada superior não fecha por Escape

- **WHEN** a camada superior tem o fechamento por Escape desabilitado e o usuário pressiona Escape
- **THEN** nenhuma camada solicita fechamento e a camada inferior permanece aberta

### Requirement: Drawer mantém o contrato modal nos dois posicionamentos

`AdsDrawer` MUST oferecer, à esquerda e à direita, a mesma semântica modal do diálogo: papel de diálogo com `aria-modal`, nome acessível, foco preso, fechamento por Escape quando habilitado e retorno do foco ao elemento que o abriu.

#### Scenario: Drawer à esquerda e à direita

- **WHEN** um drawer é aberto com posicionamento à esquerda ou à direita
- **THEN** ele expõe `role="dialog"` com `aria-modal="true"` e nome acessível, e o foco entra no seu conteúdo

#### Scenario: Escape e retorno de foco no drawer

- **WHEN** um drawer aberto recebe um Escape e permite esse fechamento
- **THEN** a aplicação recebe a solicitação de fechamento e, ao fechar, o foco volta ao elemento que o abriu

### Requirement: Conteúdo fora do modal fica inerte

Enquanto um `AdsDialog` ou `AdsDrawer` estiver aberto, o conteúdo da página fora do overlay MUST ficar inerte: sem receber foco, cliques ou ativação por teclado e fora da árvore de acessibilidade, nos navegadores com suporte ao atributo `inert`.

#### Scenario: Usuário tenta alcançar o fundo por teclado

- **WHEN** um modal está aberto e o usuário percorre a página com Tab e Shift+Tab
- **THEN** o foco permanece dentro do modal e nenhum controle do fundo o recebe

#### Scenario: Usuário clica no conteúdo de fundo

- **WHEN** um modal está aberto e o usuário clica em um controle do fundo
- **THEN** o controle não é acionado e o clique na área do backdrop segue as regras de fechamento por backdrop

#### Scenario: Tecnologia assistiva lê a página

- **WHEN** um modal está aberto
- **THEN** o conteúdo do fundo não é exposto na árvore de acessibilidade e o modal permanece acessível

### Requirement: Estado anterior do conteúdo é restaurado

Ao fechar ou desmontar o modal, o conteúdo da página MUST voltar ao estado anterior à abertura, preservando um `inert` que a aplicação já tivesse aplicado e sem deixar a página inerte.

#### Scenario: Modal é fechado

- **WHEN** o modal aberto é fechado ou desmontado
- **THEN** o fundo volta a receber foco e cliques e o foco retorna ao elemento que abriu o modal

#### Scenario: Aplicação altera o inert durante o modal

- **WHEN** a aplicação acrescenta `inert` a uma região coberta enquanto o modal está aberto
- **THEN** a região continua inerte depois do fechamento, e um `inert` que ela remova é aplicado de novo enquanto o modal está aberto

#### Scenario: Aplicação já tornou uma região inerte

- **WHEN** uma região já marcada como inerte pela aplicação existe quando o modal abre e depois fecha
- **THEN** a região continua inerte depois do fechamento

### Requirement: Modais aninhados restauram o fundo apenas no último fechamento

Com mais de um modal aberto, apenas o modal mais recente MUST ficar interativo, e a página MUST voltar a ser interativa somente quando o último modal fechar, em qualquer ordem de fechamento.

#### Scenario: Modal aberto a partir de outro modal

- **WHEN** um segundo modal é aberto a partir do primeiro
- **THEN** o primeiro modal fica inerte e apenas o segundo recebe foco e cliques

#### Scenario: Modais fechados fora de ordem

- **WHEN** o primeiro modal fecha enquanto o segundo continua aberto
- **THEN** o fundo continua inerte até o segundo modal fechar

### Requirement: Inerte sem suporte, em StrictMode e na renderização do servidor

Em navegadores sem suporte ao atributo `inert`, o modal MUST manter o comportamento de foco preso e `aria-modal` sem erro. O mesmo comportamento MUST valer em StrictMode, e a renderização no servidor e a hidratação MUST NOT ser alteradas.

#### Scenario: Aplicação em StrictMode

- **WHEN** um modal abre e fecha em StrictMode
- **THEN** o fundo fica inerte enquanto o modal está aberto e é restaurado ao fechar

#### Scenario: Aplicação Next.js com App Router

- **WHEN** uma página com um modal inicialmente fechado é renderizada no servidor e hidratada
- **THEN** o HTML do servidor não contém `inert` e a hidratação ocorre sem divergência

### Requirement: Conteúdo criado durante o modal também fica inerte

Enquanto um modal está aberto, um nó adicionado ou substituído como filho de `document.body` MUST ficar inerte, exceto toasts e popups nascidos dentro de um overlay interativo.

#### Scenario: Conteúdo da página é substituído com o modal aberto

- **WHEN** a aplicação ou um portal de terceiros insere ou substitui um nó de página enquanto o modal está aberto
- **THEN** o novo nó fica inerte e volta ao estado anterior quando o último modal fecha

#### Scenario: Popup aberto pelo fundo durante o modal

- **WHEN** um popover da página, e não do modal, é aberto enquanto o modal está aberto
- **THEN** o popover fica inerte até o modal fechar

### Requirement: Foco volta a um alvo utilizável com modais aninhados

Ao fechar um modal, o foco MUST voltar ao elemento que o abriu e, se esse elemento não estiver mais na página, ao elemento que abriu o modal ao redor.

#### Scenario: Modal de origem fecha antes do modal aninhado

- **WHEN** o modal A abre o modal B, A fecha enquanto B está aberto e depois B fecha
- **THEN** o foco volta ao elemento da página que abriu A
