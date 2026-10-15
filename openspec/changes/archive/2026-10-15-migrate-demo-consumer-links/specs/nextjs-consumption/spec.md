# Spec Delta

## MODIFIED Requirements

### Requirement: Aplicação de referência

O projeto MUST manter uma aplicação Next.js de referência que consuma os artefatos distribuíveis como uma aplicação externa, organizada em múltiplas rotas com layout compartilhado e validada quanto a renderização no servidor e hidratação em cada rota. Quando os itens navegam, a aplicação MUST usar `renderLink` em `AdsNav` e `AdsBreadcrumb` e `renderPageLink` em `AdsPagination` com `next/link`, sem conteúdo interativo aninhado, consumindo a biblioteca apenas por caminhos públicos.

#### Scenario: Contrato público é verificado

- **WHEN** o pipeline valida a aplicação de referência
- **THEN** imports internos ou dependências implícitas do workspace fazem a validação falhar

#### Scenario: Rotas são renderizadas e hidratadas

- **WHEN** cada rota da aplicação de referência é renderizada no servidor e hidratada no navegador
- **THEN** nenhuma divergência de hidratação atribuível ao design system é reportada em nenhuma rota

#### Scenario: Paginação de clientes por links

- **WHEN** a página `/clientes` é exibida
- **THEN** cada página da paginação é um link com nome acessível "Página N", a página atual expõe `aria-current="page"` e acionar uma página navega para `/clientes?pagina=N`

#### Scenario: Navegação e breadcrumb por links

- **WHEN** o catálogo de componentes exibe `AdsNav` e `AdsBreadcrumb` com destinos
- **THEN** cada destino é um único link do `next/link`, sem elemento interativo aninhado
