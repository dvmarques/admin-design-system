## ADDED Requirements

### Requirement: AdsCombobox oferece apresentação popover genérica

`AdsCombobox` MUST oferecer `presentation="popover"` como extensão opt-in ao modo input, com gatilho customizável `renderTrigger`, conteúdo `footer` separado da lista e refs distintas para gatilho e campo de pesquisa. O modo input padrão MUST preservar o contrato anterior, inclusive `AdsAutocomplete`.

#### Scenario: Gatilho com conteúdo customizado

- **WHEN** o consumidor fornece `presentation="popover"` e `renderTrigger` com avatar, título, descrição e indicador
- **THEN** um botão acessível exibe a seleção atual e abre um painel portalled com busca e opções, sem exigir conteúdo de organizações

#### Scenario: Modo input legado

- **WHEN** o consumidor não informa `presentation` ou usa `input`
- **THEN** as props, callbacks, ref do input, teclado, foco, formulário e semântica `combobox/listbox` existentes não mudam

#### Scenario: Footer com ação

- **WHEN** o consumidor fornece link ou botão no `footer`
- **THEN** a ação fica fora da `listbox`, alcançável por teclado e sem opção interativa aninhada

### Requirement: Seleção e consulta independentes no modo popover

A apresentação popover MUST preservar `value`/`defaultValue` controlados ou não, `onValueChange`, `open`/`defaultOpen`, opções desabilitadas, renderização customizada, filtragem, empty/loading/error e valor de formulário independente do label e da consulta.

#### Scenario: Pesquisa sem confirmar outra seleção

- **WHEN** a pessoa digita no campo de busca separado com uma opção previamente selecionada
- **THEN** apenas a consulta e o filtro mudam; o `value` confirmado e o valor enviado ao formulário continuam inalterados

#### Scenario: Seleção não otimista e fechamento controlado

- **WHEN** um consumidor controlado usa `closeOnSelect={false}` e o usuário solicita outra opção
- **THEN** o callback é emitido, mas seleção visual e abertura seguem as props até o consumidor confirmá-las; não há atualização otimista

#### Scenario: Formulário, reset e disabled

- **WHEN** um formulário usa `name` e `required` na apresentação popover
- **THEN** somente o valor confirmado é serializado, ausência participa corretamente da validação e `disabled` segue semântica de formulário; nenhum rótulo nem consulta é submetido

#### Scenario: Estados e opções

- **WHEN** opções estão desabilitadas, há erro remoto, carregamento ou nenhuma correspondência
- **THEN** seleção por teclado ignora indisponíveis e o painel comunica estados com mensagens e ação de retry acessíveis

### Requirement: Popover de seleção usa semântica e foco de diálogo apropriados

No modo popover, o gatilho MUST ser um botão com `aria-haspopup="dialog"`, `aria-expanded` e relação com painel rotulado; o painel MUST usar semântica de diálogo não modal com campo de pesquisa e lista de opções adequados. O sistema MUST preservar foco, Escape hierárquico, click outside e posicionamento em portal.

#### Scenario: Teclado com busca

- **WHEN** o usuário abre o popover com teclado, digita, percorre opções com setas e pressiona Enter
- **THEN** foco, destaque e seleção seguem o contrato documentado; Escape fecha apenas o popover e devolve foco ao gatilho

#### Scenario: Sem campo de busca

- **WHEN** o consumidor oculta o campo de busca
- **THEN** a lista continua operável por setas e Enter com alvo inicial de foco perceptível

#### Scenario: Footer e Tab

- **WHEN** o painel possui footer e o usuário pressiona Tab ou Shift+Tab
- **THEN** é possível alcançar os controles interativos do painel e sair dele de forma previsível, sem prender foco num diálogo não modal nem perder o foco

#### Scenario: Modal aninhado, overflow e mobile

- **WHEN** o popover é aberto dentro de `AdsDialog` ou drawer mobile, em área com scroll/overflow
- **THEN** fica acima do modal lógico, responde a Escape/clique externo sem fechar camada ancestral, respeita rolagem/viewport e restaura foco ao gatilho

#### Scenario: Acessibilidade visual e Next.js

- **WHEN** a apresentação é usada nos temas claro/escuro, zoom de 200%, viewport 390px, alto contraste ou SSR/hidratação Next.js
- **THEN** os controles, nomes e estados permanecem acessíveis, sem overflow ou IDs inconsistentes

### Requirement: Apresentações do AdsCombobox são demonstráveis na mesma entrega

O sistema MUST oferecer no Admin Demo e Storybook exemplos funcionais de modo input versus popover, gatilho visual, filtro, seleção, formulário, controlado/não controlado, loading, vazio, erro, disabled e footer.

#### Scenario: Catálogo navegável

- **WHEN** a pessoa abre o catálogo
- **THEN** consegue exercitar as duas apresentações e observar seus contratos de foco, teclado e envio de valor
