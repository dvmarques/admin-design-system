# Spec Delta

## ADDED Requirements

### Requirement: Links do consumidor na aplicação de referência

A aplicação de referência MUST usar `renderLink` em `AdsNav` e `AdsBreadcrumb` e `renderPageLink` em `AdsPagination` com `next/link` quando os itens navegam, sem conteúdo interativo aninhado, e MUST consumir a biblioteca apenas por caminhos públicos.

#### Scenario: Paginação de clientes por links

- **WHEN** a página `/clientes` é exibida
- **THEN** cada página da paginação é um link com nome acessível "Página N", a página atual expõe `aria-current="page"` e acionar uma página navega para `/clientes?pagina=N`

#### Scenario: Navegação e breadcrumb por links

- **WHEN** o catálogo de componentes exibe `AdsNav` e `AdsBreadcrumb` com destinos
- **THEN** cada destino é um único link do `next/link`, sem elemento interativo aninhado
