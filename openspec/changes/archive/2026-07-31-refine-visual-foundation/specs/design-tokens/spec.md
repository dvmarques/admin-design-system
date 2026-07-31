## ADDED Requirements

### Requirement: Tokens visuais globais coerentes

O sistema MUST disponibilizar tokens semânticos públicos que expressem a fundação visual revisada para tipografia, paleta de temas, estados e foco, com nomes estáveis e equivalentes nos formatos CSS e TypeScript.

#### Scenario: Componente consome a fundação global

- **WHEN** um componente existente é renderizado usando os estilos públicos da biblioteca
- **THEN** sua tipografia, cores e estados visuais usam tokens globais semânticos em vez de valores específicos do componente

#### Scenario: Consumidor personaliza um papel visual

- **WHEN** uma aplicação sobrescreve um token semântico suportado para um tema
- **THEN** os componentes existentes que consomem esse papel refletem o novo valor sem recompilação da biblioteca

### Requirement: Densidade e forma compartilhadas

O sistema MUST disponibilizar tokens reutilizáveis para controles pequenos, médios e grandes de `32 px`, `36 px` e `40 px`, respectivamente; também MUST disponibilizar raio de `6 px` para controles e de `8 px` para superfícies e overlays.

#### Scenario: Componente existente expõe um tamanho

- **WHEN** um componente interativo existente renderiza uma variante pequena, média ou grande
- **THEN** ele consome a dimensão compartilhada correspondente em vez de definir uma altura local

### Requirement: Controle de fechar usa papéis semânticos de cor

O sistema MUST disponibilizar tokens semânticos de fundo, conteúdo e fundo de hover para os controles de fechar de overlays, com valores específicos para os temas claro e escuro e equivalência entre CSS e TypeScript.

#### Scenario: Controle de fechar é renderizado em um overlay

- **WHEN** dialog, drawer ou toast apresenta seu controle de fechar
- **THEN** o fundo e o ícone são resolvidos pelos papéis semânticos do tema ativo, sem valores cromáticos locais no componente
