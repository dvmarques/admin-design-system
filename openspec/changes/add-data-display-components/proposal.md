## Why

As famílias básicas de navegação, formulários e overlays já estão disponíveis, mas aplicações administrativas ainda precisam reconstruir padrões recorrentes para exibir coleções, métricas, progresso e ausência de dados. Esta change cria uma camada pública e reutilizável para apresentação de dados, mantendo consistência visual, acessibilidade, temas e consumo independente de implementação interna.

## What Changes

- Adicionar `AdsTable` para dados tabulares administrativos com estrutura semântica, cabeçalhos acessíveis, estados de linha e composição segura de conteúdo.
- Adicionar `AdsList` e `AdsCard` para coleções e agrupamentos de informação com hierarquia visual consistente.
- Adicionar `AdsProgress` para progresso determinado e indeterminado com semântica acessível.
- Adicionar `AdsEmptyState` para ausência de dados, resultados ou conteúdo, com suporte a ação principal e conteúdo auxiliar.
- Definir padrões públicos de apresentação de dados que funcionem nos temas claro e escuro e possam ser consumidos sem Tailwind na aplicação final.
- Documentar todos os componentes no Storybook, integrar exemplos ao admin demo e cobrir comportamento, acessibilidade, consumo público e snapshots visuais.

Fora do escopo: ordenação e filtragem de dados, virtualização, paginação acoplada à tabela, busca, seleção massiva, edição inline, tabelas inteligentes e dashboards compostos. Esses recursos pertencem a `add-advanced-admin-patterns`.

## Capabilities

### New Capabilities

- `data-tables`: tabelas acessíveis e tematizáveis para apresentação de dados administrativos.
- `data-collections`: listas e cards reutilizáveis para coleções e agrupamentos de informação.
- `data-feedback`: progresso e estados vazios para comunicar carregamento, avanço e ausência de dados.

### Modified Capabilities

Nenhuma.

## Impact

- Pacote `@admin-ds/components`: novos componentes React, tipos, exports públicos e CSS compilado para `AdsTable`, `AdsList`, `AdsCard`, `AdsProgress` e `AdsEmptyState`.
- Pacote de tokens: possível adição de tokens semânticos para superfícies de dados, linhas, divisores, progresso e estados vazios, apenas quando os tokens existentes não forem suficientes.
- Aplicação `apps/docs`: histórias e exemplos visuais de cada API pública.
- Aplicação `apps/admin-demo`: demonstrações integradas de apresentação de dados usando exclusivamente APIs e CSS públicos.
- Qualidade: testes Vitest/React Testing Library, axe, Playwright, consumo público e snapshots visuais nos temas claro e escuro; nenhuma dependência de runtime é prevista inicialmente.
