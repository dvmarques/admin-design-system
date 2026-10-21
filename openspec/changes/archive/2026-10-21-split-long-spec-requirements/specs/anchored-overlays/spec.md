# Spec Delta

## MODIFIED Requirements

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
