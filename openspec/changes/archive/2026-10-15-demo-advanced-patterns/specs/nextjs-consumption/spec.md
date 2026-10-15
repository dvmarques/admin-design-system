# Spec Delta

## MODIFIED Requirements

### Requirement: Aplicação de referência

O projeto MUST manter uma aplicação Next.js de referência que consuma os artefatos distribuíveis como uma aplicação externa, organizada em múltiplas rotas com layout compartilhado e validada quanto a renderização no servidor e hidratação em cada rota. Quando os itens navegam, a aplicação MUST usar `renderLink` em `AdsNav` e `AdsBreadcrumb` e `renderPageLink` em `AdsPagination` com `next/link`, sem conteúdo interativo aninhado, consumindo a biblioteca apenas por caminhos públicos. A aplicação MUST demonstrar os padrões avançados de administração já disponíveis (`AdsFilterBar`, `AdsSmartTable`, `AdsMetricCard`, `AdsDashboardGrid` e `AdsDashboardPanel`), mantendo filtros, ordenação e página de `/clientes` em `searchParams`, tratados de forma determinística no servidor, com dados estáticos.

#### Scenario: Contrato público é verificado

- **WHEN** o pipeline valida a aplicação de referência
- **THEN** imports internos ou dependências implícitas do workspace fazem a validação falhar

#### Scenario: Rotas são renderizadas e hidratadas

- **WHEN** cada rota da aplicação de referência é renderizada no servidor e hidratada no navegador
- **THEN** nenhuma divergência de hidratação atribuível ao design system é reportada em nenhuma rota

#### Scenario: Paginação de clientes por links

- **WHEN** a página `/clientes` é exibida
- **THEN** cada página da paginação é um link com nome acessível "Página N", a página atual expõe `aria-current="page"` e acionar uma página navega para `/clientes?pagina=N`, preservando os filtros e a ordenação ativos

#### Scenario: Navegação e breadcrumb por links

- **WHEN** o catálogo de componentes exibe `AdsNav` e `AdsBreadcrumb` com destinos
- **THEN** cada destino é um único link do `next/link`, sem elemento interativo aninhado

#### Scenario: Filtros e ordenação de clientes na URL

- **WHEN** a página `/clientes` é aberta com `?q=`, `?status=`, `?plano=`, `?de=`, `?ate=` ou `?ordem=`
- **THEN** o servidor exibe somente os clientes correspondentes, na ordem pedida, e abrir a mesma URL de novo produz o mesmo resultado

#### Scenario: Parâmetros inválidos são normalizados

- **WHEN** a URL contém filtro desconhecido, data inválida, ordenação por coluna inexistente ou página fora do intervalo
- **THEN** o parâmetro inválido é ignorado ou normalizado e a página não falha

#### Scenario: Alterar filtro ou ordenação

- **WHEN** a pessoa altera um filtro ou a ordenação em `/clientes`
- **THEN** a URL é atualizada, a lista é recalculada no servidor e a paginação volta para a página 1

#### Scenario: Filtros sem resultado

- **WHEN** os filtros não correspondem a nenhum cliente
- **THEN** a tabela exibe um estado vazio com a ação "Limpar filtros" e a barra de filtros continua utilizável

#### Scenario: Visão geral com padrões de dashboard

- **WHEN** a página `/` é exibida
- **THEN** os indicadores usam `AdsMetricCard` e o progresso e a atividade recente ficam em painéis de `AdsDashboardGrid`, com títulos e nomes acessíveis estáveis

#### Scenario: Fluxos compostos pendentes

- **WHEN** os fluxos compostos da issue #61 ainda não estão disponíveis na biblioteca
- **THEN** a demonstração de ações em massa e de formulário em etapas permanece pendente e registrada nesta change, sem implementação própria no demo
