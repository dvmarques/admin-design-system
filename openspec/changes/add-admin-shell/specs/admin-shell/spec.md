# Admin Shell

## ADDED Requirements

Os requisitos abaixo definem o MVP obrigatório desta change. Evoluções como dashboards, filtros complexos, tabelas inteligentes e outros padrões administrativos avançados permanecem fora deste incremento.

### Requirement: Estrutura administrativa reutilizável

O design system SHALL disponibilizar uma estrutura pública reutilizável para aplicações administrativas composta por regiões de header, navegação lateral e conteúdo principal.

#### Scenario: Composição do shell

- **WHEN** uma aplicação consumidora compõe o Admin Shell com conteúdo para header, sidebar e área principal
- **THEN** as três regiões são renderizadas em uma estrutura administrativa coerente
- **AND** o consumidor não precisa utilizar imports internos do pacote.

### Requirement: API pública consistente

Os componentes e tipos públicos do Admin Shell SHALL seguir as convenções públicas do Admin Design System e SHALL poder ser consumidos sem conhecimento da implementação interna de Tailwind.

#### Scenario: Consumo público

- **WHEN** uma aplicação importa o Admin Shell pelo ponto de entrada público do pacote
- **THEN** os componentes React e tipos expostos usam a convenção `Ads*`
- **AND** a aplicação não precisa importar módulos internos ou classes Tailwind internas.

### Requirement: Composição independente de regras de negócio

O Admin Shell SHALL aceitar conteúdo fornecido pela aplicação consumidora sem incorporar autenticação, autorização, roteamento ou regras de negócio específicas.

#### Scenario: Conteúdo fornecido pelo consumidor

- **WHEN** o consumidor fornece identidade, navegação, ações ou conteúdo próprios
- **THEN** o shell os apresenta nas regiões correspondentes
- **AND** não exige integração com um framework de roteamento específico.

### Requirement: Compatibilidade com Next.js App Router

O Admin Shell SHALL ser consumível em aplicações Next.js com App Router sem exigir integração direta com APIs de roteamento do Next.js e sem introduzir erros de hidratação.

#### Scenario: Uso em aplicação Next.js

- **WHEN** uma aplicação Next.js App Router utiliza o Admin Shell pelas APIs públicas
- **THEN** a estrutura é renderizada corretamente
- **AND** links e decisões de roteamento continuam sob responsabilidade da aplicação
- **AND** a aplicação não apresenta erro de hidratação causado pelo shell.

### Requirement: Navegação responsiva

O Admin Shell SHALL adaptar sua navegação lateral ao espaço disponível, mantendo-a utilizável em viewports amplas e reduzidas.

#### Scenario: Viewport ampla

- **WHEN** há espaço suficiente para a navegação persistente
- **THEN** a sidebar permanece utilizável junto ao conteúdo principal.

#### Scenario: Viewport reduzida

- **WHEN** a viewport não comporta a navegação persistente
- **THEN** a sidebar deixa de ocupar espaço permanente
- **AND** existe um controle acessível para exibir e ocultar a navegação.

### Requirement: Acessibilidade estrutural

O Admin Shell SHALL oferecer semântica e interação adequadas para tecnologias assistivas e navegação por teclado, buscando conformidade WCAG 2.2 AA.

#### Scenario: Uso por teclado

- **WHEN** uma pessoa opera o shell somente pelo teclado
- **THEN** o controle da navegação responsiva pode ser acionado
- **AND** a ordem de foco permanece coerente
- **AND** conteúdo oculto não permanece indevidamente interativo.

#### Scenario: Identificação das regiões

- **WHEN** uma tecnologia assistiva percorre a estrutura administrativa
- **THEN** as regiões relevantes possuem semântica e identificação acessíveis compatíveis com sua função.

### Requirement: Temas e integração visual

O Admin Shell SHALL utilizar os tokens, temas e estilos públicos do design system.

#### Scenario: Alternância de tema

- **WHEN** a aplicação utiliza tema claro ou escuro suportado pelo design system
- **THEN** header, sidebar e conteúdo preservam legibilidade, contraste e coerência visual.

### Requirement: Customização por design tokens

O Admin Shell SHALL refletir customizações suportadas realizadas por variáveis CSS públicas `--ads-*` sem exigir recompilação da biblioteca ou uso de Tailwind pela aplicação consumidora.

#### Scenario: Sobrescrita de token

- **WHEN** uma aplicação sobrescreve um token público suportado utilizado pelo shell
- **THEN** a apresentação correspondente reflete o novo valor
- **AND** a aplicação não precisa recompilar o design system.

### Requirement: CSS compilado distribuído

Os estilos necessários ao Admin Shell SHALL estar disponíveis na folha de estilos compilada da biblioteca e SHALL evitar dependência do scan de fontes internas pelo consumidor.

#### Scenario: Aplicação sem Tailwind

- **WHEN** uma aplicação consumidora carrega o CSS distribuído pelo design system sem configurar Tailwind
- **THEN** o Admin Shell mantém seus estilos e estados visuais suportados.

### Requirement: Documentação e consumo de referência

O Admin Shell SHALL possuir documentação, exemplos e validação de consumo através das APIs públicas do design system.

#### Scenario: Storybook

- **WHEN** um desenvolvedor consulta o Storybook
- **THEN** encontra exemplos do shell, responsividade, temas e customização por tokens.

#### Scenario: Admin demo

- **WHEN** o admin demo Next.js utiliza o Admin Shell
- **THEN** o exemplo utiliza apenas exports públicos e o CSS distribuído pelo pacote.
