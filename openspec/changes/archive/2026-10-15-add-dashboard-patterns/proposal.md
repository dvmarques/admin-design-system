## Why

O `admin-demo` monta a visão geral com `AdsCard`, `AdsProgress` e `AdsList`, mas não existe um padrão reutilizável de dashboard. Cada aplicação reconstruiria o card de métrica (KPI), o grid de painéis e os estados de carregamento, vazio e erro. Esta change (Issue #60, sub-item da #17) cria essas composições em `@admin-ds/admin`, sem regras de negócio.

## What Changes

- Adicionar `AdsMetricCard`: título, valor, variação, indicador de tendência (ícone + texto, nunca só cor), descrição e progresso opcional.
- Adicionar `AdsDashboardGrid`: grid responsivo em que a ordem de leitura (DOM) coincide com a ordem visual.
- Adicionar `AdsDashboardPanel`: painel com título, ações, largura variável (`span`) e estados de carregamento, vazio e erro.
- Estilos próprios em `@admin-ds/admin/styles.css` (CSS simples, sem Tailwind, classes `ads-` e variáveis `--ads-`), reutilizando `AdsCard`, `AdsProgress`, `AdsSkeleton` e `AdsEmptyState` de `@admin-ds/components`.
- Documentar em Storybook e em `docs/integration.md`; atualizar `docs/limitations.md` e `docs/architecture.md`.

Fora do escopo: gráficos e bibliotecas de visualização (exigiriam dependência de runtime; ficam para uma change futura), busca de dados, atualização em tempo real, regras de negócio, dependência do roteamento do Next.js e alterações em `apps/admin-demo` (a demonstração é a Issue #62).

## Capabilities

### New Capabilities

- `dashboard-metric-card`: card de métrica com valor, variação e tendência acessível.
- `dashboard-panel-grid`: grid responsivo de painéis de largura variável.
- `dashboard-panel-states`: estados de carregamento, vazio e erro por painel e por card de métrica.

### Modified Capabilities

Nenhuma.

## Impact

- Pacote `@admin-ds/admin`: novos componentes e tipos públicos `AdsMetricCard`, `AdsDashboardGrid`, `AdsDashboardPanel`; estilos adicionais em `styles.css`. Sem nova dependência de runtime; `@admin-ds/components` já é peer dependency.
- `@admin-ds/components`, tokens e `apps/admin-demo`: sem alterações.
- `apps/docs`: nova story `Layout/Dashboard`.
- Qualidade: testes de comportamento e acessibilidade (axe), verificação de pacote/CSS. Os snapshots visuais só têm baseline `win32` e são pulados fora do Windows; esta change não adiciona snapshots e valida o layout de forma programática e manual.
