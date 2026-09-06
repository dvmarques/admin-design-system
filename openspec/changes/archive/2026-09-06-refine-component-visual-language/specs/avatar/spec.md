## ADDED Requirements

### Requirement: Avatar proporcional à linguagem de componentes

`AdsAvatar` MUST alinhar forma, borda, fallback e tamanhos aos tokens revisados, mantendo a diferenciação de identidade e a legibilidade do fallback nos dois temas.

#### Scenario: Avatar sem imagem aparece em uma linha densa

- **WHEN** uma aplicação renderiza um avatar pequeno com fallback textual
- **THEN** o fallback permanece centrado, identificável e proporcional aos controles adjacentes
