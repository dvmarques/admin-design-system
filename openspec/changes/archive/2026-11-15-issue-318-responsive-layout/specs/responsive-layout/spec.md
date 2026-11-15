## ADDED Requirements

### Requirement: Layout responsivo portátil e opcional

O ADS MUST disponibilizar padrões de composição via classes CSS prefixadas distribuídas pelo pacote components, sem exigir Tailwind, componentes React, JavaScript de responsividade ou novas dependências no consumidor.

#### Scenario: Consumidor sem Tailwind

- **WHEN** um consumidor importa o CSS público e aplica classes `ads-layout-*` a HTML nativo
- **THEN** container, stack, grid e cluster funcionam somente com CSS compilado e sem criar landmarks adicionais

#### Scenario: Adoção retrocompatível

- **WHEN** um consumidor não aplica as classes novas
- **THEN** a estrutura e a aparência dos componentes existentes permanecem inalteradas

### Requirement: Container, espaços e grid adaptativos

Os padrões MUST oferecer largura máxima, padding inline, gaps e colunas refluindo conforme espaço disponível, sem quebrar a ordem do DOM nem depender da largura global da viewport.

#### Scenario: Larguras e aninhamento

- **WHEN** a composição contém grids aninhados em áreas estreitas de 320px, 390px, 768px ou 1440px
- **THEN** os itens empilham quando não cabem e respeitam o espaço local, sem overflow horizontal não intencional

#### Scenario: Conteúdo longo e ações opcionais

- **WHEN** há texto longo, filtros, ações presentes ou ausentes e tabela larga
- **THEN** os textos têm oportunidade de quebra, as ações permanecem operáveis e a tabela pode rolar localmente sem cortar a página

### Requirement: Composição com semântica nativa e componentes existentes

Os padrões MUST permitir seções HTML semânticas, `AdsPageHeader`, `AdsSurface`, `AdsCard`, `AdsTable` e métricas, sem tornar card, wrapper React ou nova região `main` obrigatórios.

#### Scenario: Consulta, formulário e dashboard

- **WHEN** uma pessoa visita as demonstrações de consulta, formulário e dashboard
- **THEN** encontra título, seções, campos, controles e dados organizados responsivamente, com semântica e interações existentes preservadas

#### Scenario: RTL e temas

- **WHEN** o consumidor usa `dir=rtl` ou alterna entre temas claro e escuro
- **THEN** padding/margem lógicos funcionam e os layouts não impõem cores nem mudam a ordem de foco

### Requirement: Exemplos, testes e evidências verificáveis

A entrega MUST documentar a escolha de CSS nativo, classes e alternativas React descartadas e apresentar exemplos funcionais no Storybook e Admin Demo, além de testes do CSS compilado e regressão de consumo.

#### Scenario: Publicação e regressão

- **WHEN** os pacotes e aplicações são compilados e os testes de responsividade executados
- **THEN** o CSS publicado contém as classes e exemplos funcionam sem imports internos, com resultados e limitações de E2E, zoom real, acessibilidade e bundle explicitados
