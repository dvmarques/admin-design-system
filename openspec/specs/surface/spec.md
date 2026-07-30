# surface Specification

## Purpose

Oferecer superfícies neutras e elevadas para composição de conteúdo administrativo sem acoplar estrutura visual a regras de negócio.

## Requirements

### Requirement: Superfícies composicionais

O sistema MUST fornecer `AdsSurface`, uma superfície com variantes documentadas de nível visual e área de conteúdo composicionável.

#### Scenario: Conteúdo é agrupado

- **WHEN** uma aplicação envolve conteúdo em uma superfície elevada
- **THEN** o agrupamento é visualmente distinguível do plano de fundo nos dois temas

### Requirement: Temas e personalização por tokens

As superfícies MUST utilizar tokens semânticos públicos de cor, borda, raio e elevação.

#### Scenario: Consumidor personaliza a elevação

- **WHEN** a aplicação sobrescreve um token de elevação suportado
- **THEN** a superfície usa o valor personalizado sem recompilar seus estilos

### Requirement: Layout responsivo seguro

A superfície MUST acomodar o conteúdo fornecido sem impor largura fixa ou alterar globalmente elementos externos ao design system.

#### Scenario: Superfície é exibida em tela estreita

- **WHEN** seu contêiner diminui de largura
- **THEN** a superfície permanece dentro dos limites disponíveis
