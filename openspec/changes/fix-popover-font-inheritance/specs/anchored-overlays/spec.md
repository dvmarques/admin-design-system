# Spec Delta

## ADDED Requirements

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
