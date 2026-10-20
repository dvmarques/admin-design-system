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

### Requirement: Escala de marca

O sistema MUST disponibilizar uma escala de marca de dez degraus (`brand50` a `brand900`) como referência dos papéis de cor de ação, foco e seleção (`primary`, `primary-hover`, `focus`, `focus-ring`, `form-border-focus`, `surface-selected` e `on-surface-selected`), nos dois temas e em `prefers-contrast: more`. Os pares de contraste desses papéis MUST continuar atendendo 4,5:1 para texto e 3:1 para foco, bordas de controle e indicadores.

#### Scenario: Aparência preservada

- **WHEN** a aplicação importa `@admin-ds/tokens/styles.css` após a introdução da escala de marca
- **THEN** os valores renderizados desses papéis são os mesmos de antes, nos dois temas e com `prefers-contrast: more`

#### Scenario: Troca da cor de marca

- **WHEN** os valores da escala de marca mudam na fonte dos tokens
- **THEN** os papéis semânticos refletem a nova escala e os testes de contraste continuam verificando os pares

### Requirement: Famílias tipográficas

O sistema MUST disponibilizar `--ads-typography-font-family` (corpo, mantido por compatibilidade), `--ads-typography-font-family-heading` e `--ads-typography-font-family-mono`, também como metadados tipados, cada um com pilha de fallback para fontes do sistema. As variantes de título de `AdsTypography` MUST usar a família de títulos. A biblioteca MUST NOT exigir configuração de Tailwind nem requisição a CDN externa para usar os tokens.

#### Scenario: Aplicação carrega a fonte padrão

- **WHEN** a aplicação carrega a fonte `Inter` por seus próprios meios
- **THEN** corpo e títulos usam essa fonte sem alterar os componentes

#### Scenario: Fonte não carregada

- **WHEN** a fonte `Inter` não está disponível
- **THEN** o texto usa a primeira fonte disponível da pilha de fallback sem quebrar o layout

#### Scenario: Título sem fonte própria

- **WHEN** nenhuma fonte distinta é definida para títulos
- **THEN** a família de títulos acompanha a do corpo

#### Scenario: Aplicação personaliza só a fonte do corpo

- **WHEN** a aplicação sobrescreve `--ads-typography-font-family` e não define a família de títulos
- **THEN** os títulos de `AdsTypography` usam a fonte personalizada
