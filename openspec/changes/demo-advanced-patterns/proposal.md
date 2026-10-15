# Proposal

## Why

A issue #17 adicionou `AdsDatePicker`, `AdsFilterBar`, `AdsSmartTable` e os
padrões de dashboard, mas o `admin-demo` ainda usa `AdsTable` simples em
`/clientes` e cards genéricos na visão geral. O demo deve consumir os novos
padrões como uma aplicação externa, apenas por caminhos públicos (issue #62).

## What Changes

**Aplicações de demonstração (`apps/admin-demo`)**

- `/clientes`: `AdsFilterBar` (busca, status, planos e período de "cliente
  desde" com `AdsDatePicker` interno) e `AdsSmartTable` (ordenação, seleção e
  colunas). Filtros, ordenação e página vivem em `searchParams` e são tratados no
  servidor de forma determinística; a paginação segue por `renderPageLink`,
  preservando os demais parâmetros. `?estado=` continua existindo.
- `/` (visão geral): indicadores com `AdsMetricCard` e progresso e atividade
  recente em `AdsDashboardGrid` com `AdsDashboardPanel`.
- Testes de unidade, de consumo público e E2E em contratos estáveis (funções
  ARIA e nomes acessíveis), com axe nos dois temas.
- `docs/integration.md` e `CHANGELOG.md`.

## Dependência pendente

- **Fluxos compostos (#61, `add-admin-flows`)**: ainda sem branch nem PR. O
  exemplo de listagem com barra de ações em massa e de formulário em etapas
  **não** entra nesta change e fica pendente até #61 chegar em `develop`. A
  seleção de linhas do `AdsSmartTable` é demonstrada sem barra de ações.
- **`AdsSmartTable` (#67)**: ainda é PR em Draft e não está em `develop`. A
  branch parte de `origin/feat/smart-table`; esta change só pode ser integrada
  depois da #67.

## Objetivos e fora do escopo

Objetivos: demo por caminhos públicos, estado na URL e sem erros de hidratação
ou de acessibilidade.

Fora do escopo: qualquer mudança em `packages/*`, persistência e backend (dados
estáticos e determinísticos), baselines visuais (só existem para `win32`).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `nextjs-consumption`: o requisito "Aplicação de referência" passa a exigir os
  padrões avançados com estado na URL.

## Impact

- **Pacotes e APIs públicas**: nenhum pacote nem API pública é alterado.
- **Dependências**: nenhuma. **Bundle**: sem impacto nas bibliotecas.
- **Consumidores**: ganham exemplos funcionais de filtros, tabela inteligente e dashboards.
