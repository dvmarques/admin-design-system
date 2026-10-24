# icon Specification

## Purpose

Oferecer uma forma tipada e consistente de apresentar ícones decorativos ou informativos nas APIs públicas do design system.

## Requirements

### Requirement: Ícones nomeados e dimensionáveis

O sistema MUST fornecer `AdsIcon`, com identificadores públicos tipados e tamanhos documentados.

#### Scenario: Consumidor seleciona um ícone público

- **WHEN** uma aplicação informa um identificador documentado
- **THEN** o ícone correspondente é renderizado no tamanho solicitado

### Requirement: Semântica acessível de ícones

Ícones decorativos MUST ser ocultos de tecnologias assistivas; ícones que comunicam informação MUST aceitar um nome acessível.

#### Scenario: Ícone informa uma ação sem texto adjacente

- **WHEN** o consumidor fornece um nome acessível ao ícone
- **THEN** tecnologias assistivas recebem essa descrição

### Requirement: Tema e personalização visual

O ícone MUST herdar cor de forma compatível com os tokens e com classes adicionais do consumidor nos dois temas.

#### Scenario: Cor de texto muda com o tema

- **WHEN** o tema é alternado
- **THEN** o ícone decorativo acompanha a cor de conteúdo aplicável

### Requirement: Ícones de modo de cor

`AdsIcon` MUST oferecer os nomes `sun`, `moon` e `monitor`, representando respectivamente os modos Claro, Escuro e Sistema, com as mesmas regras de tamanho, `currentColor` e semântica dos demais ícones.

#### Scenario: Ícones de modo de cor decorativos

- **WHEN** `AdsIcon` é renderizado com `name="sun"`, `moon` ou `monitor` sem `label`
- **THEN** o SVG é ocultado da árvore de acessibilidade e herda a cor do texto
