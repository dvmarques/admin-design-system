# admin-demo-application Specification

## ADDED Requirements

### Requirement: Demonstração interativa de código destacado

O admin-demo MUST oferecer uma rota de exemplos de `AdsHighlightedCodeSnippet` acessível pela navegação principal, sem substituir páginas existentes, com exemplos interativos que incluam Java, SQL e TSX e permitam alternar tema, linguagem, numeração de linhas e quebra de linha.

#### Scenario: Link na navegação

- **WHEN** a pessoa abre a navegação do demo
- **THEN** um item em exemplos de aplicação leva à rota da demonstração de código destacado

#### Scenario: Exemplos e controles

- **WHEN** a pessoa abre a rota da demonstração
- **THEN** pode alternar entre exemplos que incluem Java, SQL e TSX, mudar tema (`light`, `dark`, `auto`), linhas e wrap, e o snippet permanece utilizável em larguras de celular e desktop sem overflow horizontal da página
