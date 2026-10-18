# Spec Delta

## ADDED Requirements

### Requirement: Controle de tema do cabeçalho usa a tipografia do design system

`ThemeToggle`, quando composto no cabeçalho de `AdsAdminShell`, MUST usar a família tipográfica pública do design system, mesmo em uma aplicação cujo `body` não define `font-family`, e MUST manter o rótulo em uma única linha.

#### Scenario: Aplicação sem fonte definida no body

- **WHEN** `ThemeToggle` é composto no cabeçalho em uma aplicação cujo `body` não define `font-family`
- **THEN** o botão usa a família tipográfica do design system e mantém o rótulo em uma única linha

#### Scenario: Largura reduzida

- **WHEN** a viewport tem 390px de largura
- **THEN** o rótulo do `ThemeToggle` não é quebrado em várias linhas

### Requirement: Cabeçalho composto com conteúdo responsivo cabe em larguras estreitas

Um cabeçalho de `AdsAdminShell` composto com conteúdo capaz de quebrar linha MUST permanecer dentro da largura da viewport em 390px, sem cortar controles nem provocar rolagem horizontal da página, e MUST manter em telas largas a disposição em uma única linha.

#### Scenario: Ações do cabeçalho em tela estreita

- **WHEN** a viewport tem 390px de largura e o cabeçalho contém marca, controle de tema e ações em um grupo que pode quebrar linha
- **THEN** nenhum controle fica cortado, nenhum rótulo é quebrado no meio de uma palavra e a página não rola na horizontal

#### Scenario: Larguras amplas

- **WHEN** a viewport tem 1280px de largura
- **THEN** o cabeçalho mantém a disposição em uma única linha e a mesma altura de antes
