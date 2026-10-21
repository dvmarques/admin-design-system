## MODIFIED Requirements

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
