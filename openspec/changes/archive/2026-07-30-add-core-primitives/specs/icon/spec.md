## Purpose

Oferecer uma forma tipada e consistente de apresentar ícones decorativos ou informativos nas APIs públicas do design system.

## ADDED Requirements

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
