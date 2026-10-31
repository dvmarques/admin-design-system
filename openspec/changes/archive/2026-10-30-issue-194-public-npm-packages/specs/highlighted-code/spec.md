## MODIFIED Requirements

### Requirement: Pacote opcional independente

O design system MUST disponibilizar `AdsHighlightedCodeSnippet` somente no pacote independente `@dvmarques/admin-ds-highlighted-code`, com export explícito e sem reexport pelo entrypoint de `@dvmarques/admin-ds-components` ou `@dvmarques/admin-ds-admin`. A publicação real deste pacote será coordenada com os outros três no processo de release, não na preparação de tarballs da issue #194.

#### Scenario: Consumidor importa o componente avançado

- **WHEN** uma aplicação importa `AdsHighlightedCodeSnippet` de `@dvmarques/admin-ds-highlighted-code`
- **THEN** o módulo resolve sem exigir import do pacote principal de componentes

#### Scenario: Bundle principal permanece sem Shiki

- **WHEN** uma aplicação importa apenas `@dvmarques/admin-ds-components`
- **THEN** o cenário de bundle público de componentes não inclui dependências de Shiki
