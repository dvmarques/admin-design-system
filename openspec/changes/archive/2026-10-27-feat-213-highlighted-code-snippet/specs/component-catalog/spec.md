# component-catalog Specification

## MODIFIED Requirements

### Requirement: Exemplos interativos

Cada demonstração SHALL fornecer descrição, exemplos funcionais e variações pertinentes, incluindo código TSX copiável quando viável. O bloco de código do preview MUST usar `AdsHighlightedCodeSnippet` do pacote `@admin-ds/highlighted-code`, preservando a geração automática de snippets e a ação de copiar o código original.

#### Scenario: Interação

- **WHEN** a pessoa interage por teclado com um controle demonstrado
- **THEN** seu estado é atualizado e a indicação de foco permanece perceptível

#### Scenario: Código destacado no catálogo

- **WHEN** a pessoa abre uma página de demonstração no catálogo
- **THEN** o snippet TSX gerado automaticamente é exibido com highlighting assíncrono e permanece copiável integralmente
