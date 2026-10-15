# data-collections Specification

## Purpose

Fornece listas e cards reutilizáveis para organizar coleções e agrupamentos de informação administrativa com semântica e hierarquia visual consistentes.

## Requirements

### Requirement: Listas representam coleções de forma semântica

O sistema MUST fornecer `AdsList` para apresentar coleções usando semântica de lista quando apropriado. Itens MUST aceitar conteúdo composicional, elementos interativos fornecidos pelo consumidor e estados visuais sem alterar a ordem natural de foco.

#### Scenario: Coleção simples é anunciada como lista

- **WHEN** o consumidor apresenta uma coleção de itens administrativos
- **THEN** tecnologias assistivas identificam a coleção e seus itens com semântica de lista adequada

#### Scenario: Item contém ação

- **WHEN** um item inclui link ou botão fornecido pelo consumidor
- **THEN** a ação permanece alcançável por teclado e mantém foco visível

### Requirement: Cards agrupam conteúdo sem impor domínio

O sistema MUST fornecer `AdsCard` para agrupar conteúdo relacionado com superfície, borda e espaçamento baseados em tokens públicos. A API MUST permitir composição de cabeçalho, conteúdo e ações sem exigir campos de domínio específicos.

#### Scenario: Card apresenta conteúdo e ações

- **WHEN** o consumidor compõe título, descrição, metadados e ações dentro de um card
- **THEN** o card mantém hierarquia visual consistente sem reinterpretar os dados fornecidos

### Requirement: Coleções respeitam temas e responsividade

`AdsList` e `AdsCard` MUST funcionar nos temas claro e escuro e MUST permanecer utilizáveis em viewports estreitas. Estilos MUST ser distribuídos pelo CSS público do design system e MUST NOT depender de classes Tailwind presentes na aplicação consumidora.

#### Scenario: Consumo sem Tailwind

- **WHEN** uma aplicação importa apenas o pacote e a folha de estilos pública
- **THEN** listas e cards preservam seus estilos e estados nos temas suportados
