# badge Specification

## Purpose

Disponibilizar rótulos concisos e consistentes para comunicar status e classificações em interfaces administrativas.

## Requirements

### Requirement: Badge semântico com variantes

O sistema MUST fornecer `AdsBadge`, um badge com conteúdo textual e variantes semânticas documentadas para status.

#### Scenario: Status é apresentado

- **WHEN** uma aplicação apresenta um badge de status
- **THEN** seu texto e sua variante permanecem legíveis nos temas claro e escuro

### Requirement: Badge acessível e responsivo

O badge MUST preservar o conteúdo textual acessível, ajustar-se ao conteúdo e não depender exclusivamente de cor para comunicar seu significado.

#### Scenario: Tela tem espaço reduzido

- **WHEN** o badge é renderizado em um contêiner estreito
- **THEN** seu conteúdo permanece identificável sem transbordamento não controlado

### Requirement: Personalização por tokens

O badge MUST consumir os tokens semânticos públicos para que o consumidor possa personalizá-lo sem recompilar o pacote.

#### Scenario: Tema da aplicação muda

- **WHEN** o seletor público de tema é alternado
- **THEN** o badge passa a utilizar as cores correspondentes ao novo tema
