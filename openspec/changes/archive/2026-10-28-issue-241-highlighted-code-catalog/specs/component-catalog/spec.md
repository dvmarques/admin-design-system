# Catálogo de componentes — delta da issue #241

## ADDED Requirements

### Requirement: Descoberta de componentes de pacotes opcionais

O catálogo MUST incluir componentes públicos visuais distribuídos em pacotes opcionais explicitamente suportados, sem exigir que sejam reexportados pelo pacote principal. O índice, a sidebar, a documentação e o teste de cobertura MUST distinguir componentes de utilitários e tipos sem interface.

#### Scenario: Busca por HighlightedCodeSnippet

- **WHEN** a pessoa pesquisa AdsHighlightedCodeSnippet, HighlightedCode, CodeSnippet ou Código destacado no catálogo
- **THEN** encontra o componente visual AdsHighlightedCodeSnippet na categoria Dados com acesso à página /catalogo/highlighted-code-snippet

#### Scenario: Pacote opcional não entra no bundle principal

- **WHEN** uma aplicação consome apenas @admin-ds/components e seu CSS público
- **THEN** Shiki e @admin-ds/highlighted-code não são carregados em decorrência do registro no catálogo

#### Scenario: Export opcional fica sem exemplo

- **WHEN** um novo export visual do pacote opcional explicitamente incluído na cobertura não tem página e demo executável
- **THEN** a verificação de cobertura do catálogo falha com identificação do export ausente

### Requirement: Documentação e demonstração do código destacado

A página canônica de AdsHighlightedCodeSnippet MUST documentar instalação do pacote opcional, API e props reais e MUST fornecer exemplos interativos de highlighting, temas, linhas, wrap, copiar e fallback, preservando a página preexistente de exemplo de aplicação.

#### Scenario: Pessoa experimenta variantes

- **WHEN** a pessoa altera linguagem, tema, exibição de linhas ou wrap nos exemplos
- **THEN** a demonstração atualiza o snippet, preservando código original copiável e feedback acessível nos temas claro e escuro

#### Scenario: Linguagem desconhecida

- **WHEN** a pessoa seleciona uma linguagem não suportada no exemplo
- **THEN** o código permanece legível e copiável em plain, sem erro fatal ou execução de markup

#### Scenario: Retorno ao exemplo antigo

- **WHEN** a pessoa abre /exemplos/codigo-destacado no site estático
- **THEN** o exemplo existente continua funcional e oferece navegação para a nova documentação oficial

#### Scenario: Uso em viewport estreita

- **WHEN** a demonstração é acessada em largura de celular ou por teclado
- **THEN** o código longo dispõe de rolagem local ou wrap, os controles e a ação de copiar continuam utilizáveis e a página não apresenta overflow horizontal
