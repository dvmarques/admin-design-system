## ADDED Requirements

### Requirement: Superfícies do tema escuro distinguíveis

No tema escuro, os papéis `surface-muted`, `surface-raised` e `surface-hover` MUST ter valores distintos entre si e distintos de `background` e `surface`, de modo que um item em hover sobre uma superfície elevada seja visualmente distinto dela. `text` e `text-muted` MUST manter contraste de no mínimo 4,5:1 sobre todas essas superfícies, e `border-control` MUST manter no mínimo 3:1 sobre elas, com e sem `prefers-contrast: more`.

#### Scenario: Hover sobre superfície elevada

- **WHEN** o tema escuro está ativo e um item recebe hover dentro de um diálogo, popover ou lista
- **THEN** o fundo do item em hover é diferente do fundo da superfície elevada

#### Scenario: Texto sobre as superfícies

- **WHEN** o tema escuro está ativo, com ou sem `prefers-contrast: more`
- **THEN** `text` e `text-muted` têm ao menos 4,5:1 de contraste sobre cada uma das superfícies

### Requirement: Escala de espaçamento ampliada

O sistema MUST disponibilizar os tokens `--ads-spacing-5`, `--ads-spacing-10`, `--ads-spacing-12` e `--ads-spacing-16` (`1.25rem`, `2.5rem`, `3rem` e `4rem`), preservando os valores dos tokens de espaçamento existentes.

#### Scenario: Aplicação usa um espaçamento novo

- **WHEN** a aplicação importa `@admin-ds/tokens/styles.css` e usa `--ads-spacing-16`
- **THEN** a variável vale `4rem` nos dois temas e os espaçamentos anteriores mantêm seus valores

### Requirement: Cores categóricas para gráficos

O sistema MUST disponibilizar oito papéis de cor categórica (`--ads-color-chart-1` a `--ads-color-chart-8`) nos temas claro e escuro, também como metadados tipados. Cada cor MUST ter contraste de no mínimo 3:1 contra a superfície do respectivo tema, e as oito cores MUST permanecer distinguíveis entre si sob simulação de deuteranopia, protanopia e tritanopia. A documentação MUST informar que gráficos não podem depender apenas de cor.

#### Scenario: Aplicação desenha uma série de gráfico

- **WHEN** uma aplicação usa `--ads-color-chart-1` a `--ads-color-chart-8` sobre `--ads-color-surface`
- **THEN** cada cor tem ao menos 3:1 de contraste contra a superfície, no tema claro e no escuro

#### Scenario: Usuário com deficiência de visão de cor

- **WHEN** as oito cores são avaliadas sob simulação de deuteranopia, protanopia ou tritanopia
- **THEN** quaisquer duas cores mantêm distância perceptual mínima definida e verificada por teste

#### Scenario: Personalização por tema

- **WHEN** a aplicação sobrescreve um token de cor de gráfico no escopo de um tema
- **THEN** o novo valor é usado sem recompilar a biblioteca
