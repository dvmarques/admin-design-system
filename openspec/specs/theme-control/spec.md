# theme-control Specification

## Purpose

Definir o controle público de preferência de tema (Claro, Escuro e Sistema), que apresenta e emite a escolha sem impor persistência, provider ou acesso ao DOM global à aplicação consumidora.

## Requirements

### Requirement: Seleção exclusiva entre Claro, Escuro e Sistema

`AdsThemeControl` MUST permitir escolher diretamente qualquer uma das preferências `light`, `dark` e `system`, sem ciclo obrigatório, e MUST indicar de forma inequívoca a opção ativa, sem depender apenas de cor. O componente MUST emitir a preferência escolhida e MUST NOT persistir, aplicar o tema ao documento, ler a preferência do sistema operacional, exigir provider, roteador ou acesso ao DOM global.

#### Scenario: Escolha direta de qualquer modo

- **WHEN** a pessoa está em Claro e escolhe Sistema
- **THEN** `onValueChange` é chamado com `system`, sem passar por Escuro, e a opção Sistema passa a ser a ativa

#### Scenario: Indicação além da cor

- **WHEN** uma opção está ativa
- **THEN** ela é exposta como marcada (`aria-checked`) e exibe uma marca visual de seleção além da diferença de cor

#### Scenario: Componente não gerencia o tema

- **WHEN** a pessoa escolhe uma preferência
- **THEN** a biblioteca apenas chama `onValueChange`; nenhum atributo do documento ou armazenamento é alterado pelo componente

### Requirement: Estado controlado e não controlado

`AdsThemeControl` MUST suportar `value` com `onValueChange` (controlado) e `defaultValue` (não controlado, padrão `system`). Em modo controlado MUST refletir `value` sem sobrescrevê-lo e MUST sincronizar mudanças externas sem remontar elementos nem perder o foco.

#### Scenario: Valor inicial não controlado

- **WHEN** o componente é renderizado sem `value` e sem `defaultValue`
- **THEN** a opção Sistema está ativa

#### Scenario: Valor controlado não muda sozinho

- **WHEN** o consumidor fornece `value="light"` e a pessoa escolhe Escuro sem atualizar `value`
- **THEN** `onValueChange` recebe `dark` e a opção Claro continua ativa

#### Scenario: Mudança externa preserva o foco

- **WHEN** o foco está em uma opção e o consumidor altera `value`
- **THEN** o mesmo elemento permanece no documento, mantém o foco e passa a refletir o novo valor

#### Scenario: Atualização no gatilho do menu

- **WHEN** `value` muda externamente
- **THEN** o gatilho do menu troca o ícone e o nome acessível para a nova preferência sem ser remontado

### Requirement: Apresentação compacta por ícones

A variante `menu` (padrão) MUST apresentar um botão compacto somente com ícone que abre a escolha entre os três modos. O ícone do gatilho MUST representar a **preferência** selecionada: sol para Claro, lua para Escuro e monitor para Sistema, e o monitor MUST permanecer em Sistema independentemente do tema efetivo. As opções MUST aparecer somente com ícones por padrão; `optionDisplay="icon-text"` MAY apresentar ícone e texto.

#### Scenario: Gatilho em Sistema

- **WHEN** a preferência é Sistema e o tema efetivo do sistema muda de claro para escuro
- **THEN** o gatilho continua exibindo o ícone de monitor

#### Scenario: Abertura do menu

- **WHEN** a pessoa ativa o gatilho
- **THEN** o menu abre com as opções Claro, Escuro e Sistema, cada uma com ícone e nome acessível

#### Scenario: Apresentação opcional com texto

- **WHEN** `optionDisplay="icon-text"` é usado
- **THEN** cada opção exibe ícone e o texto visível correspondente

### Requirement: Variante em grupo

A variante `group` MUST apresentar as três opções inline como um grupo de seleção exclusiva com os mesmos ícones, rótulos, tooltips e estados da variante `menu`.

#### Scenario: Grupo inline

- **WHEN** `variant="group"` é usado
- **THEN** as três opções ficam visíveis simultaneamente e escolher uma delas emite a preferência

### Requirement: Semântica de seleção exclusiva

O gatilho do menu MUST ter nome acessível com o rótulo do grupo e a opção atual, `aria-haspopup="menu"` e `aria-expanded`. As opções do menu MUST usar `role="menuitemradio"` com `aria-checked`; as do grupo MUST usar `role="radio"` em um `role="radiogroup"` nomeado, com um único item tabulável.

#### Scenario: Gatilho nomeado

- **WHEN** a preferência é Sistema
- **THEN** o gatilho tem nome acessível equivalente a "Tema: Sistema"

### Requirement: Teclado, ícones e tooltips acessíveis

Ícones MUST ser ocultos da árvore de acessibilidade e controles somente com ícone MUST ter nome acessível independente de tooltip. Tooltips do gatilho e do grupo MUST abrir também por foco e poder ser dispensados com Escape; nas opções do menu o tooltip MAY abrir somente por apontamento, desde que o nome acessível anuncie a opção focada.

#### Scenario: Navegação por teclado no menu

- **WHEN** o foco está no gatilho e a pessoa pressiona Enter, Espaço ou seta para baixo
- **THEN** o menu abre com o foco na opção ativa, as setas, Home e End movem o foco e Enter escolhe a opção, fecha o menu e devolve o foco ao gatilho

#### Scenario: Escape retorna o foco

- **WHEN** o menu está aberto e a pessoa pressiona Escape
- **THEN** o menu fecha, nenhuma preferência é emitida e o foco volta ao gatilho

#### Scenario: Navegação no grupo

- **WHEN** o foco está na opção ativa do grupo e a pessoa pressiona seta para a direita
- **THEN** o foco e a seleção passam para a próxima opção, com retorno circular nas extremidades

#### Scenario: Rótulos acessíveis e tooltips

- **WHEN** a pessoa foca ou aponta uma opção somente com ícone
- **THEN** o tooltip "Claro", "Escuro" ou "Sistema" é exibido e o nome acessível já existe sem ele

#### Scenario: Rótulos personalizados

- **WHEN** o consumidor fornece `labels`
- **THEN** nomes acessíveis, tooltips e textos usam os rótulos fornecidos

#### Scenario: Sem violações detectáveis

- **WHEN** o componente é verificado com axe, aberto ou fechado, em qualquer variante
- **THEN** não há violações

### Requirement: Estado desabilitado e personalização

`AdsThemeControl` com `disabled` MUST impedir interação e abertura do menu e MUST expor o estado a tecnologias assistivas. `className` e atributos do elemento raiz MUST ser aplicados ao elemento público. O controle MUST renderizar legível e com foco visível nos temas claro e escuro, em viewport estreita e dentro de modais, com alvos de toque de pelo menos 2,5 rem (40 px).

#### Scenario: Desabilitado

- **WHEN** `disabled` é verdadeiro
- **THEN** o gatilho (ou as opções do grupo) não é ativável e `onValueChange` não é chamado

#### Scenario: Temas

- **WHEN** o controle é renderizado em `data-theme="light"` e `data-theme="dark"`
- **THEN** ele é visível, com foco perceptível, usando apenas tokens semânticos

#### Scenario: Menu dentro de modal

- **WHEN** o controle está dentro de um diálogo modal e o menu é aberto
- **THEN** as opções permanecem acessíveis e operáveis por teclado

### Requirement: Compatibilidade de ThemeToggle

`ThemeToggle`, `ThemeToggleProps`, `initialTheme` e `onThemeChange` MUST continuar exportados e com o comportamento binário atual. A migração para `AdsThemeControl` MUST estar documentada.

#### Scenario: Uso existente preservado

- **WHEN** um consumidor usa `ThemeToggle` com `initialTheme` e `onThemeChange`
- **THEN** o botão alterna entre claro e escuro e emite apenas `light` ou `dark`
