## MODIFIED Requirements

### Requirement: Exemplos interativos

Cada demonstração SHALL fornecer descrição, exemplos funcionais e variações pertinentes, incluindo código TSX copiável quando viável. O bloco de código do preview MUST usar `AdsHighlightedCodeSnippet` do pacote `@dvmarques/admin-ds-highlighted-code`, preservando a geração automática de snippets e a ação de copiar o código original. Demonstrações isoladas em iframe MUST refletir o tema efetivo selecionado no catálogo, e grupos de ações de demonstração MUST manter espaçamento perceptível em viewport estreita.

#### Scenario: Interação

- **WHEN** a pessoa interage por teclado com um controle demonstrado
- **THEN** seu estado é atualizado e a indicação de foco permanece perceptível

#### Scenario: Código destacado no catálogo

- **WHEN** a pessoa abre uma página de demonstração no catálogo
- **THEN** o snippet TSX gerado automaticamente é exibido com highlighting assíncrono e permanece copiável integralmente

#### Scenario: Tema dos exemplos isolados em iframe

- **WHEN** a pessoa escolhe claro/escuro ou alterna o tema efetivo do catálogo
- **THEN** os dois exemplos com/sem seletor de organização no iframe refletem o tema selecionado, inclusive em viewport móvel e desktop, sem exigir recarregar manualmente a página

#### Scenario: Ações do exemplo de upload em tela estreita

- **WHEN** o exemplo de `AdsFileUpload` é exibido em viewport estreita
- **THEN** o botão de limpar dados e o link de importação simulada conservam separação visual, podem quebrar linha e continuam acessíveis por teclado
