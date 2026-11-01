# anchored-overlays Specification

## Purpose

Oferecer tooltips e popovers acessíveis para revelar contexto breve ou conteúdo complementar a partir de um elemento da interface.

## Requirements

### Requirement: Tooltips revelam descrição contextual

O sistema MUST exportar um tooltip público prefixado por `Ads` que associe uma descrição breve ao seu gatilho e seja revelado por foco ou apontamento. O tooltip MUST desaparecer quando o gatilho perde foco ou apontamento, exceto sobre o próprio tooltip quando esse comportamento for oferecido. Enquanto aberto, MUST preservar o `aria-describedby` do gatilho, acrescentando o id do tooltip, e ao fechar o gatilho MUST voltar ao valor original.

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

O sistema MUST exportar um popover público prefixado por `Ads`, aberto de forma controlada por um gatilho, que apresente conteúdo complementar, inclusive interativo, e exponha relação acessível entre gatilho e conteúdo. Ativar o gatilho MUST alternar a abertura preservando seus handlers de consumidor. Interações dentro do conteúdo MUST manter o painel aberto, salvo fechamento explícito do consumidor, e preservar handlers e propagação dos eventos.

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

### Requirement: Overlays ancorados abertos dentro de um modal permanecem interativos

Um popover, tooltip, menu do `AdsDropdown` ou calendário do `AdsDatePicker` aberto enquanto um modal está aberto MUST continuar interativo e acessível, e o fundo MUST continuar inerte.

#### Scenario: Popover aberto dentro de um diálogo

- **WHEN** um popover é aberto a partir de um diálogo aberto
- **THEN** o conteúdo do popover recebe foco e cliques e a página de fundo continua inerte

#### Scenario: Popover aberto antes do modal

- **WHEN** um popover está aberto e um modal é aberto a partir dele
- **THEN** o popover deixa de receber foco e cliques até o modal fechar

#### Scenario: Popup originado na página enquanto o modal está aberto

- **WHEN** código da página fora do modal abre um popover ou tooltip enquanto o modal está aberto
- **THEN** o popup fica inerte até o modal fechar

### Requirement: Posicionamento efetivo dos overlays

Tooltip, Popover e Dropdown SHALL preferir o placement solicitado, escolher o oposto quando não houver espaço suficiente no eixo principal e ajustar o posicionamento à área visível sempre que geometricamente possível.

#### Scenario: Flip próximo à borda inferior

- **WHEN** um overlay solicitado em bottom não cabe abaixo da âncora e cabe acima
- **THEN** ele aparece acima e usa placement efetivo top

#### Scenario: Flip nos demais lados

- **WHEN** top, left ou right não comporta o painel e o lado oposto comporta
- **THEN** o overlay usa respectivamente bottom, right ou left

#### Scenario: Nenhum lado oposto comporta o painel

- **WHEN** ambos os lados do eixo solicitado são insuficientes
- **THEN** o overlay escolhe o lado com maior espaço, preserva a preferência em empate e ajusta ambos os eixos aos limites visíveis

#### Scenario: Margem e alinhamento

- **WHEN** existe espaço para o painel inteiro na viewport
- **THEN** o painel respeita uma margem de 8px e preserva o alinhamento solicitado quando não há colisão

#### Scenario: Shift na borda lateral

- **WHEN** o painel excederia a borda lateral e existe espaço para deslocamento
- **THEN** ele é deslocado para dentro da viewport sem alterar desnecessariamente o lado

#### Scenario: Conteúdo maior que a viewport

- **WHEN** o painel é maior que a área visível
- **THEN** o posicionamento evita coordenadas inválidas e não promete visibilidade integral impossível

### Requirement: Metadados e seta consistentes

O Tooltip SHALL refletir o placement efetivo em data-placement e manter a seta apontando para a âncora após flip e shift.

#### Scenario: Metadados dos painéis

- **WHEN** Tooltip, Popover ou Dropdown muda de lado
- **THEN** seu data-placement informa o lado efetivo

#### Scenario: Seta após flip e shift

- **WHEN** um Tooltip muda de lado ou é deslocado transversalmente
- **THEN** data-placement corresponde ao lado renderizado e a seta permanece alinhada à âncora dentro dos limites do painel

### Requirement: Reposicionamento responsivo

Overlays abertos SHALL recalcular a posição após alterações geométricas da âncora, painel, scroll, resize e zoom, sem listeners ou observers persistentes após desmontagem.

#### Scenario: Conteúdo dinâmico

- **WHEN** o conteúdo aberto muda de tamanho
- **THEN** a posição é recalculada sem reabrir o overlay

#### Scenario: Montagem tardia do portal

- **WHEN** o painel é anexado após a primeira renderização ou substituído enquanto aberto
- **THEN** ele é medido antes de ficar visível e suas mudanças de tamanho são acompanhadas

#### Scenario: Scroll e resize

- **WHEN** a viewport ou um ancestral rolável se move ou muda de tamanho
- **THEN** o painel acompanha a âncora e permanece visível quando possível

#### Scenario: Zoom

- **WHEN** o viewport visual muda por zoom ou deslocamento
- **THEN** o posicionamento usa a área visual atual e é recalculado

#### Scenario: Pan após pinch zoom sem duplicação de deslocamento

- **WHEN** um overlay aberto é acompanhado durante pinch zoom e pan com offsets visuais não nulos
- **THEN** painel e âncora permanecem alinhados no mesmo sistema de coordenadas, independentemente de aliases CSS suportados pelo navegador

#### Scenario: Desmontagem

- **WHEN** o overlay fecha ou desmonta
- **THEN** listeners, observers e atualizações agendadas são removidos

### Requirement: Compatibilidade e acessibilidade

A correção SHALL preservar as props públicas, renderização segura em SSR, foco, Escape, clique externo, modalidade, overlays aninhados, temas e integração Next.js.

#### Scenario: Renderização no servidor

- **WHEN** um consumidor renderiza a árvore no servidor e hidrata no cliente
- **THEN** nenhuma API do navegador é acessada durante renderização do servidor e não há divergência de hidratação causada pelo posicionamento

#### Scenario: Interações existentes

- **WHEN** o usuário navega por teclado, fecha pelo Escape ou interage com overlays aninhados
- **THEN** as regras de foco, fechamento e modalidade permanecem inalteradas

#### Scenario: Temas e estilos distribuídos

- **WHEN** uma aplicação Next.js consome somente os exports públicos e o CSS compilado em tema claro ou escuro
- **THEN** painel e seta mantêm seus estilos, o posicionamento e as associações acessíveis sem Tailwind no consumidor

### Requirement: Tooltip pode abrir somente por apontamento

`AdsTooltip` MUST aceitar `showOnFocus` (padrão `true`). Com `false`, o foco MUST NOT abrir o tooltip, e o apontamento continua abrindo-o; o padrão MUST preservar o comportamento por foco e apontamento.

#### Scenario: Foco não abre o tooltip

- **WHEN** `showOnFocus` é `false` e o gatilho recebe foco
- **THEN** o tooltip não abre; ao apontar o gatilho, ele abre

#### Scenario: Padrão preservado

- **WHEN** `showOnFocus` não é informado
- **THEN** o tooltip abre por foco e por apontamento, como antes

### Requirement: Tooltip pode não descrever o gatilho

`AdsTooltip` MUST aceitar `describeTrigger` (padrão `true`). Com `false`, o tooltip aberto MUST NOT acrescentar `aria-describedby` ao gatilho; o padrão MUST preservar a associação atual.

#### Scenario: Tooltip que repete o nome

- **WHEN** `describeTrigger` é `false` e o tooltip abre
- **THEN** o gatilho não recebe `aria-describedby`

#### Scenario: Descrição preservada por padrão

- **WHEN** `describeTrigger` não é informado e o tooltip abre
- **THEN** o gatilho referencia o id do tooltip em `aria-describedby`

### Requirement: Posicionamento ancorado no gatilho real em layouts flexíveis

AdsTooltip MUST posicionar o painel em relação à geometria visível do seu gatilho, e não ao espaço extra ocupado por um wrapper esticado pelo layout pai. AdsPopover MUST ter o mesmo comportamento quando usar wrapper de âncora. Os componentes MUST preservar posicionamento, seta, temas e eventos de teclado/ponteiro já documentados em layouts flex, grid e bloco.

#### Scenario: Tooltip dentro de coluna flex com stretch

- **WHEN** um AdsTooltip com botão compacto é exibido numa coluna flex com align-items:stretch e espaço livre acima
- **THEN** o painel solicitado em top aparece imediatamente acima do botão, centralizado em relação à geometria dele, e não no centro do contêiner

#### Scenario: Popover em layout com item esticado

- **WHEN** um AdsPopover envolve gatilho compacto dentro de grid ou flex que estica seus filhos
- **THEN** o conteúdo se ancora ao gatilho real, sem deslocamento decorrente da largura extra do wrapper

#### Scenario: Gatilho ocupa toda a largura por intenção

- **WHEN** o gatilho tem largura explicitamente igual à largura disponível
- **THEN** o painel se posiciona em relação ao gatilho visualmente largo sem alterar suas dimensões por causa da lógica de âncora

#### Scenario: Collision avoidance

- **WHEN** um tooltip abre perto de uma borda e seu posicionamento preferido excederia a viewport
- **THEN** o painel usa flip ou shift existente, data-placement informa o lado efetivo e a seta continua apontando para o gatilho dentro dos limites possíveis

#### Scenario: Layout muda após abertura

- **WHEN** o contêiner rola ou o tamanho do gatilho/painel muda com resize ou zoom
- **THEN** o painel acompanha a geometria real atual do gatilho sem perder alinhamento ou deixar listeners ativos depois do fechamento

#### Scenario: Foco, ARIA e tema preservados

- **WHEN** o tooltip é aberto por foco ou hover, associado a descrição ARIA pré-existente, em claro ou escuro ou dentro de modal
- **THEN** continua acessível, dispensável por Escape e com descrição restaurada ao fechar, preservando fonte, cores e foco existentes

#### Scenario: Clique na área esticada do wrapper do Popover

- **WHEN** o wrapper do AdsPopover é maior que o gatilho e o usuário clica na área vazia dele
- **THEN** o popover não alterna por esse clique e, se estiver aberto, é fechado como clique externo
