# anchored-overlays Specification

## Purpose

Oferecer tooltips e popovers acessíveis para revelar contexto breve ou conteúdo complementar a partir de um elemento da interface.

## Requirements

### Requirement: Tooltips revelam descrição contextual

O sistema MUST exportar um tooltip público prefixado por `Ads` que associe uma descrição breve ao seu gatilho e seja revelado por foco ou apontamento. O tooltip MUST desaparecer quando o gatilho perde foco ou apontamento, exceto enquanto o apontamento estiver sobre o próprio tooltip quando esse comportamento for oferecido. Enquanto aberto, o tooltip MUST preservar o `aria-describedby` que o gatilho já possui, referenciando o id do consumidor e o do tooltip, nessa ordem, separados por espaço; ao fechar, o gatilho MUST voltar ao `aria-describedby` original, ou ficar sem o atributo se não havia.

#### Scenario: Usuário focaliza um gatilho com tooltip

- **WHEN** o usuário alcança pelo teclado um gatilho que possui tooltip
- **THEN** a descrição contextual é apresentada e fica associada ao gatilho para tecnologias assistivas

#### Scenario: Gatilho já possui aria-describedby

- **WHEN** o tooltip é aberto por foco ou apontamento em um gatilho com `aria-describedby="ajuda"`
- **THEN** o `aria-describedby` do gatilho referencia `ajuda` e o id do tooltip, nessa ordem, e a ajuda do consumidor continua associada

#### Scenario: Tooltip fecha em gatilho com aria-describedby

- **WHEN** o tooltip fecha, por perda de foco, fim do apontamento ou Escape
- **THEN** o `aria-describedby` do gatilho volta a ser apenas `ajuda`, e um gatilho sem o atributo original fica sem ele

### Requirement: Popovers oferecem conteúdo interativo sob demanda

O sistema MUST exportar um popover público prefixado por `Ads` que possa ser aberto de forma controlada por um gatilho e apresentar conteúdo complementar, inclusive elementos interativos. O popover MUST expor relação acessível entre gatilho e conteúdo. Ativar o gatilho MUST alternar a abertura, preservando seus handlers de consumidor. Interações dentro do conteúdo MUST manter o painel aberto, exceto quando o consumidor solicitar explicitamente seu fechamento, e MUST preservar os handlers e a propagação dos eventos do consumidor.

#### Scenario: Usuário abre um popover pelo teclado

- **WHEN** o usuário ativa pelo teclado o gatilho de um popover fechado
- **THEN** o popover é apresentado e seu conteúdo pode receber foco quando contiver elementos interativos

#### Scenario: Usuário interage dentro do conteúdo

- **WHEN** o usuário clica e digita num campo ou ativa um botão sem ação de fechamento dentro do painel
- **THEN** o painel permanece aberto e os handlers de conteúdo e do consumidor recebem os eventos normalmente

#### Scenario: Consumidor fecha o popover explicitamente

- **WHEN** uma ação no conteúdo altera o estado controlado de abertura para falso
- **THEN** o painel fecha sem que o clique solicite uma nova alternância

#### Scenario: Usuário alterna pelo gatilho

- **WHEN** o usuário ativa o gatilho ou um descendente dele com o painel aberto
- **THEN** o handler do gatilho é preservado e uma única solicitação de fechamento é emitida

#### Scenario: Integração pública nos temas e viewports suportados

- **WHEN** uma aplicação Next.js consome o pacote e seu CSS compilado nos temas claro e escuro, em tela estreita ou larga
- **THEN** o conteúdo interativo permanece utilizável, com relação ARIA preservada e painel dentro da viewport

#### Scenario: Calendário reutiliza o popover

- **WHEN** o usuário navega entre meses ou escolhe a primeira data de um intervalo em `AdsDatePicker`
- **THEN** o calendário permanece aberto até uma seleção final ou ação de fechamento existente

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

### Requirement: Overlays ancorados usam profundidade consistente

AdsTooltip e AdsPopover MUST usar tokens de superfície, elevação e camada apropriados ao seu contexto, mantendo o gatilho perceptível e o foco visível quando aplicável.

#### Scenario: Popover abre sobre conteúdo selecionado

- **WHEN** um popover é aberto a partir de um controle em superfície selecionada
- **THEN** o popover permanece visualmente distinto da seleção e preserva a associação com seu gatilho

### Requirement: Overlays ancorados respeitam a prioridade de notificações

AdsTooltip e AdsPopover MUST usar uma camada de overlay inferior à camada de
notificações, preservando a visibilidade de toasts durante a interação com
conteúdo contextual.

#### Scenario: Notificação é apresentada sobre um popover

- **WHEN** um popover ou tooltip está aberto e uma notificação é exibida
- **THEN** a notificação permanece visualmente acima do overlay ancorado

### Requirement: Overlays ancorados usam a tipografia do design system sem depender de ancestrais

O conteúdo de `AdsTooltip` e `AdsPopover`, e de componentes construídos sobre eles como `AdsDatePicker`, MUST usar a família tipográfica pública do design system, mesmo quando renderizado fora do elemento que define a fonte da aplicação. Os controles dentro do conteúdo que herdam a família tipográfica MUST refletir essa fonte.

#### Scenario: Popover abre em uma aplicação sem fonte definida no body

- **WHEN** um `AdsPopover` com um botão no conteúdo é aberto em uma aplicação cujo `body` não define `font-family`
- **THEN** o painel e o botão usam a família tipográfica do design system, e não a fonte padrão do navegador

#### Scenario: Calendário do date picker usa a mesma fonte

- **WHEN** o calendário de um `AdsDatePicker` é aberto nas mesmas condições
- **THEN** o título do mês, os dias e os controles de navegação usam a família tipográfica do design system

#### Scenario: Personalização por tokens

- **WHEN** o consumidor sobrescreve o token público de família tipográfica em um escopo de tema
- **THEN** o popover e o calendário refletem o novo valor sem recompilar a biblioteca

### Requirement: Overlays ancorados aninhados respeitam a ordem das camadas

Um popover, o calendário do `AdsDatePicker` ou o menu do `AdsDropdown` aberto dentro de outro overlay MUST ser a camada superior para o Escape: o primeiro Escape fecha apenas essa camada e devolve o foco ao seu gatilho, e o overlay que o contém permanece aberto.

#### Scenario: Calendário aberto dentro de um diálogo

- **WHEN** o calendário de um `AdsDatePicker` aberto dentro de um diálogo recebe um Escape
- **THEN** o calendário fecha, o diálogo permanece aberto e o foco volta ao gatilho do calendário

#### Scenario: Dropdown aberto dentro de um diálogo

- **WHEN** um menu de `AdsDropdown` aberto dentro de um diálogo recebe um Escape
- **THEN** o menu fecha, o diálogo permanece aberto e o foco volta ao gatilho do menu

### Requirement: Escape dispensa o tooltip aberto

Um `AdsTooltip` aberto, por foco ou por apontamento, MUST fechar quando o usuário pressiona Escape, sem capturar nem deslocar o foco e sem exigir que o foco esteja no gatilho. O tooltip MUST ser tratado como camada para o Escape: com ele aberto, o Escape fecha apenas o tooltip e não fecha o overlay que contém o gatilho.

#### Scenario: Tooltip aberto por foco

- **WHEN** o gatilho de um tooltip tem o foco e o usuário pressiona Escape
- **THEN** o tooltip fecha, o foco permanece no gatilho e o gatilho deixa de referenciar o tooltip em `aria-describedby`

#### Scenario: Tooltip aberto apenas por apontamento

- **WHEN** o ponteiro está sobre o gatilho, que não tem o foco, e o usuário pressiona Escape
- **THEN** o tooltip fecha e o foco permanece onde estava

#### Scenario: Tooltip dentro de um diálogo

- **WHEN** um tooltip aberto cujo gatilho está dentro de um diálogo recebe um Escape
- **THEN** apenas o tooltip fecha e o diálogo permanece aberto; um segundo Escape solicita o fechamento do diálogo

### Requirement: Tooltip dispensado reabre apenas por novo gatilho

Depois de dispensado por Escape, o tooltip MUST permanecer fechado enquanto o foco ou o ponteiro continuarem no gatilho e MUST reabrir quando o gatilho receber um novo foco ou um novo apontamento. A associação por `aria-describedby` MUST existir apenas enquanto o tooltip está aberto.

#### Scenario: Reabertura por novo apontamento

- **WHEN** o tooltip foi dispensado por Escape, o ponteiro sai do gatilho e entra novamente
- **THEN** o tooltip volta a ser apresentado e associado ao gatilho

#### Scenario: Foco e ponteiro permanecem no gatilho

- **WHEN** o tooltip foi dispensado por Escape e o foco continua no gatilho
- **THEN** o tooltip permanece fechado
