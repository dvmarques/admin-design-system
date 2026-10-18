# Spec Delta

## ADDED Requirements

### Requirement: Cabeçalho do shell não provoca rolagem horizontal

O cabeçalho de `AdsAdminShell` MUST permanecer dentro da largura da viewport em larguras estreitas, de modo que o conteúdo composto pela aplicação, como marca, ações e controle de tema, não corte controles nem provoque rolagem horizontal da página.

#### Scenario: Ações do cabeçalho não cabem em uma linha

- **WHEN** a viewport tem 390px de largura e o conteúdo do cabeçalho excede a largura disponível em uma única linha
- **THEN** o conteúdo excedente passa para uma nova linha dentro do cabeçalho, nenhum controle fica cortado e a página não rola na horizontal

#### Scenario: Rótulos de controles do cabeçalho

- **WHEN** o cabeçalho é apresentado em 390px de largura com marca, ação de conta e controle de tema
- **THEN** os rótulos dos botões não são quebrados no meio de uma palavra

#### Scenario: Controle de tema no cabeçalho

- **WHEN** `ThemeToggle` é composto no cabeçalho em uma aplicação cujo `body` não define `font-family`
- **THEN** o botão usa a família tipográfica do design system e mantém o rótulo em uma única linha

#### Scenario: Larguras amplas

- **WHEN** a viewport tem 1280px de largura
- **THEN** o cabeçalho mantém a disposição em uma única linha, sem mudança visual
