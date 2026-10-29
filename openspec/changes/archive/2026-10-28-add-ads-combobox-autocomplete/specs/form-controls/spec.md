## ADDED Requirements

### Requirement: Indicador de abertura do AdsSelect

O `AdsSelect` MUST apresentar indicador de abertura com espaço reservado para o texto e recuo consistente, preservando a interação e semântica nativas.

#### Scenario: Tamanhos e temas

- **WHEN** um consumidor renderiza o select em sm, md ou lg nos temas claro ou escuro
- **THEN** o indicador fica centralizado verticalmente e afastado da borda, sem sobrepor o texto

#### Scenario: Interação e acessibilidade

- **WHEN** a pessoa usa o select por ponteiro ou teclado
- **THEN** o controle mantém comportamento nativo e o indicador decorativo não recebe foco

#### Scenario: Alto contraste

- **WHEN** o sistema usa forced-colors
- **THEN** o indicador nativo permanece visível
