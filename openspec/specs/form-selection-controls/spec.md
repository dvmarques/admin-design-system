# form-selection-controls Specification

## Purpose

Fornecer controles de seleção nativos e acessíveis para escolhas booleanas ou mutuamente exclusivas em aplicações administrativas.

## Requirements

### Requirement: Controles de seleção públicos

O sistema MUST exportar `AdsCheckbox`, `AdsRadio` e `AdsSwitch`, com tipos públicos prefixados por `Ads`, preservando os atributos e eventos HTML aplicáveis para uso controlado ou não controlado.

#### Scenario: Consumidor controla uma seleção

- **WHEN** uma aplicação fornece o estado e o callback de alteração a um controle de seleção
- **THEN** o controle comunica a alteração pelo contrato React esperado e reflete o estado informado pela aplicação

#### Scenario: Consumidor usa uma seleção não controlada

- **WHEN** uma aplicação fornece somente o valor inicial e atributos nativos aplicáveis
- **THEN** a pessoa pode alterar o valor pelo comportamento nativo do controle

### Requirement: Operação por teclado e tecnologias assistivas

Os controles de seleção MUST ser operáveis por teclado, ter um nome acessível associado e comunicar estados selecionado, desabilitado e inválido às tecnologias assistivas por semântica nativa ou atributos ARIA válidos.

#### Scenario: Pessoa alterna checkbox ou switch pelo teclado

- **WHEN** uma pessoa focaliza um checkbox ou switch habilitado e usa a tecla de ativação nativa
- **THEN** o estado selecionado é alterado e permanece perceptível visualmente e para tecnologias assistivas

#### Scenario: Pessoa navega entre opções de radio

- **WHEN** opções de radio relacionadas são apresentadas em um grupo nomeado
- **THEN** a pessoa consegue identificar o grupo e selecionar uma única opção conforme a navegação nativa por teclado

### Requirement: Estados e temas dos controles de seleção

Os controles de seleção MUST apresentar estados distinguíveis de foco, selecionado, desabilitado, inválido e sucesso nos temas claro e escuro, usando tokens semânticos personalizáveis pelo consumidor.

#### Scenario: Controle de seleção inválido é exibido em tema escuro

- **WHEN** um controle de seleção inválido é renderizado no tema escuro
- **THEN** seu estado, seu foco e seu texto associado permanecem legíveis e distinguíveis sem depender exclusivamente de cor
