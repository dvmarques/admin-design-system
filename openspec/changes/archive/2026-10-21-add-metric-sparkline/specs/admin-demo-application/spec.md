## ADDED Requirements

### Requirement: Visão geral exibe a evolução dos indicadores

A visão geral da demo MUST exibir, nos indicadores, a variação com `sentiment` coerente com o significado de cada métrica e uma série de evolução com alternativa textual, usando `AdsMetricCard` pelos exports públicos, sem regras de negócio nem dados reais.

#### Scenario: Indicadores com série

- **WHEN** a pessoa abre a visão geral
- **THEN** cada indicador com série exibe uma imagem com nome acessível que resume a evolução, e uma métrica em que a queda é boa mostra a queda com cor positiva

#### Scenario: Temas claro e escuro

- **WHEN** a visão geral é exibida nos temas claro e escuro
- **THEN** os traços são visíveis e a informação não depende só de cor

### Requirement: Página de exibição de dados mostra o sparkline avulso

A página `/data-display` da demo MUST exibir uma seção "Sparkline" com `AdsSparkline` importado do export público de `@admin-ds/components`, cobrindo os tons, uma série com lacunas e rótulos e um ponto único, cada um com nome acessível.

#### Scenario: Seção de sparkline

- **WHEN** a pessoa abre `/data-display`
- **THEN** a seção "Sparkline" exibe cada gráfico como imagem com nome acessível que resume a série, sem violações de acessibilidade nos temas claro e escuro
