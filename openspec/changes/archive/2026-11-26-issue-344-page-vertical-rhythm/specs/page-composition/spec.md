## ADDED Requirements

### Requirement: Ritmo vertical padrão de página

O pacote MUST oferecer a classe opt-in `ads-layout-page` com espaçamento de 24px entre blocos de página e MUST aplicar 8px entre eyebrow, título e descrição do `AdsPageHeader`, ambos ajustáveis por variáveis CSS públicas.

#### Scenario: Página só com componentes do pacote

- **WHEN** uma página usa `ads-layout-page` com `AdsPageHeader` e `<section>`
- **THEN** há 24px entre cabeçalho e seção e 8px dentro do cabeçalho, sem CSS adicional no consumidor

#### Scenario: Ajuste pelo consumidor

- **WHEN** o consumidor define `--ads-layout-page-gap` ou `--ads-page-header-gap`
- **THEN** o espaçamento correspondente muda sem sobrescrever classes
