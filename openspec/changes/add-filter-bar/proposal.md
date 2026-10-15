## Why

Listagens administrativas precisam de filtros compostos (texto, seleção, seleção múltipla e data) com filtros ativos visíveis e removíveis. Esta change (sub-item da issue #17, issue #58) adiciona `AdsFilterBar`, controlada pelo consumidor, para que as aplicações não reconstruam o layout, a acessibilidade e a exibição dos filtros ativos a cada listagem.

## What Changes

- Adicionar `AdsFilterBar` ao pacote `@admin-ds/admin`, compondo `AdsField`, `AdsInput`, `AdsSelect`, `AdsCheckbox`, `AdsSelectionGroup`, `AdsDatePicker` e `AdsButton` de `@admin-ds/components`.
- Descrever os filtros de forma declarativa (`filters`) com os tipos `text`, `select`, `multiselect`, `date` e `date-range`.
- API controlada: `value` (objeto por `id` de filtro) e `onChange`. A barra não lê nem escreve URL e não acessa o roteador; o consumidor persiste o estado (por exemplo, `searchParams`).
- Exibir os filtros ativos como chips removíveis e a ação "Limpar filtros", com nomes acessíveis.
- Layout responsivo: em telas estreitas os filtros ficam recolhidos atrás de um botão de alternância (`aria-expanded`), que mostra a quantidade de filtros ativos.
- Estados desabilitado, carregando e sem filtros ativos.
- Story no Storybook, testes de comportamento, SSR e acessibilidade, e documentação com exemplo em Next.js usando `searchParams`.

Fora do escopo: consulta e filtragem de dados (a biblioteca só emite o estado do filtro), filtros salvos, construtor de consultas com operadores lógicos, dependência do roteamento do Next.js, componentes novos em `@admin-ds/components` e a demonstração em `apps/admin-demo` (issue #62).

## Capabilities

### New Capabilities

- `filter-bar`: barra de filtros administrativos controlada, com filtros ativos removíveis, layout responsivo e estados.

### Modified Capabilities

Nenhuma.

## Impact

- Pacote `@admin-ds/admin`: novos exports públicos `AdsFilterBar`, `AdsFilterBarProps`, `AdsFilterBarLabels`, `AdsFilterDefinition` (união de `AdsTextFilter`, `AdsSelectFilter`, `AdsMultiSelectFilter`, `AdsDateFilter` e `AdsDateRangeFilter`), `AdsFilterOption`, `AdsFilterValue` e `AdsFilterValues`; classes públicas `ads-filter-bar*`. Nenhuma API existente é alterada (compatível retroativamente).
- Pacote `@admin-ds/components`: sem alterações. `@admin-ds/admin` já o declara como peer.
- Pacote de tokens: sem novos tokens; reuso de `--ads-*` existentes.
- `apps/docs`: story `AdsFilterBar`. `apps/admin-demo`: sem alterações.
- Dependências: nenhuma dependência de runtime adicionada.
- Documentação: `docs/integration.md`, `docs/architecture.md` e `docs/limitations.md`.
