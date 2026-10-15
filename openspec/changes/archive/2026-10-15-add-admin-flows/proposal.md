## Why

Com `AdsFilterBar` e `AdsSmartTable`, falta compor os fluxos administrativos recorrentes: a listagem com ações em massa, o formulário em etapas e a confirmação de ações destrutivas. Esta change (sub-item da issue #17, issue #61) adiciona essas composições, sem regras de negócio, para que as aplicações não reconstruam foco, anúncios e acessibilidade a cada fluxo.

## What Changes

- Adicionar a `@admin-ds/admin`, compostos sobre componentes públicos existentes:
  - `AdsBulkActionBar`: barra de ações em massa que anuncia a quantidade de itens selecionados e não é renderizada sem seleção.
  - `AdsListFlow`: fluxo de listagem que compõe `AdsFilterBar`, `AdsBulkActionBar`, `AdsSmartTable` e `AdsPagination`.
  - `AdsStepForm`: formulário em etapas com indicador de progresso, validação por etapa, foco e anúncio da etapa atual, preservação dos dados ao voltar e confirmação final; a etapa ativa é controlada pelo consumidor.
  - `AdsConfirmDialog`: confirmação de ações destrutivas sobre `AdsDialog`.
- Story no Storybook, testes de comportamento, SSR e acessibilidade, e documentação.

Fora do escopo: persistência, envio de dados e regras de negócio; dependência do roteamento do Next.js (a navegação entre etapas é do consumidor); fluxos de um domínio específico (clientes, pedidos etc.); navegação por clique no indicador de etapas, etapas condicionais e validação assíncrona; a demonstração em `apps/admin-demo` (issue #62).

## Capabilities

### New Capabilities

- `admin-flows`: composições de fluxo administrativo (listagem com ações em massa, formulário em etapas e confirmação destrutiva).

### Modified Capabilities

Nenhuma. `AdsSmartTable`, `AdsFilterBar`, `AdsPagination` e `AdsDialog` são apenas consumidos.

## Impact

- Pacote `@admin-ds/admin`: novos exports públicos `AdsBulkActionBar`, `AdsListFlow`, `AdsStepForm`, `AdsConfirmDialog` e seus tipos (`Ads*Props`, `AdsBulkActionBarLabels`, `AdsStepFormLabels`, `AdsStepDefinition`); classes públicas `ads-bulk-action-bar*`, `ads-list-flow*`, `ads-step-form*`. Nenhuma API existente muda.
- Pacote `@admin-ds/components` e tokens: sem alterações (reuso de `--ads-*` existentes).
- `apps/docs`: stories dos fluxos. `apps/admin-demo`: sem alterações.
- Dependências: nenhuma dependência de runtime adicionada.
- Base: parte de `feat/smart-table` (PR #67, ainda não mergeada em `develop`), porque `AdsListFlow` depende de `AdsSmartTable`.
- Documentação: `docs/integration.md`, `docs/architecture.md`, `docs/limitations.md` e `CHANGELOG.md`; baseline de bundle se necessário.
