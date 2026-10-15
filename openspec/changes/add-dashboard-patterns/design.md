## Context

`@admin-ds/admin` já contém o `AdsAdminShell` com CSS próprio (sem Tailwind). Os padrões de dashboard seguem a mesma estratégia e reutilizam componentes públicos de `@admin-ds/components` (peer dependency já declarada).

## Goals / Non-Goals

### Goals

- Card de métrica e grid de painéis reutilizáveis, sem regras de negócio e sem dependência do roteamento.
- Tendência comunicada por ícone e texto; contraste suficiente nos dois temas via tokens.
- Ordem de leitura igual à ordem visual; estados de carregamento, vazio e erro por painel.

### Non-Goals

- Gráficos, busca de dados, tempo real, regras de negócio, alterações no `admin-demo`.

## Decisions

### 1. Composição em `@admin-ds/admin`, CSS próprio

Novos componentes em `packages/admin/src/dashboard.tsx`; estilos em `styles.css` sob `@layer components`, com classes `ads-metric-card*`, `ads-dashboard-grid`, `ads-dashboard-panel*` e variáveis `--ads-dashboard-*`. Nenhuma classe Tailwind em `className` literal.

### 2. API

- `AdsMetricCard`: `title`, `value`, `change?`, `trend?` (`'up' | 'down' | 'neutral'`), `trendLabel?` (texto para tecnologias assistivas; padrão em pt-BR), `sentiment?` (`'positive' | 'negative' | 'neutral'`, derivado de `trend` por padrão), `description?`, `progress?` (props de `AdsProgress`), `loading?`, `error?`, `empty?`. `trend` define o ícone/direção e `sentiment` define a cor, pois uma alta pode ser negativa (ex.: cancelamentos).
- `AdsDashboardGrid`: contêiner de layout (`div`, com um `div` interno que é o grid) sem papel ARIA próprio; os painéis são `section` nomeadas.
- `AdsDashboardPanel`: `title`, `headingLevel?` (2–6, padrão 2), `description?`, `actions?`, `span?` (1–4 colunas), `loading?`, `loadingLabel?`, `empty?` (nó), `error?` (nó), `errorActions?` e `children`.
- `empty` é um nó nos dois componentes, como `error`, `description` e `actions` em toda a lib. No painel, o recomendado é passar um `AdsEmptyState`, que mantém todas as suas props (inclusive `visual`) sem um tipo paralelo; no card, um texto curto.

### 3. Tendência acessível

O ícone SVG é decorativo (`aria-hidden`). O texto `trendLabel` ("Em alta", "Em queda", "Estável") fica visível para leitores de tela via classe visualmente oculta e é seguido do texto de `change`. Assim a informação não depende de cor nem de ícone. Cores usam `--ads-color-success`, `--ads-color-danger` e `--ads-color-text-muted`, já validados em ambos os temas.

### 4. Grid responsivo sem reordenação

O elemento externo do `AdsDashboardGrid` é um container (`container: ads-dashboard-grid / inline-size`) e o interno é o CSS Grid, com 1 coluna (< 40rem), 2 colunas (≥ 40rem) e 4 colunas (≥ 64rem) medidas pela largura disponível do grid via `@container`, não pela viewport. Assim, ao lado de uma sidebar, o grid usa menos colunas. `span` vira `data-span` e `grid-column: span N`, limitado pelo número de colunas ativas. Não se usa `order` nem `grid-auto-flow: dense`, de modo que a ordem do DOM é a ordem visual e de foco.

### 5. Estados por painel

Prioridade: `loading` > `error` > `empty` > `children`. Carregamento usa `AdsSkeleton` com `role="status"` e rótulo, e `aria-busy` no painel. Erro usa `role="alert"`. Vazio renderiza o nó informado, em geral um `AdsEmptyState`. O painel nunca busca dados: o consumidor decide o estado.

### 6. Dependências

Nenhuma dependência de runtime nova. Sem gráficos.

## Risks / Trade-offs

- Os snapshots visuais só existem para `win32` e são pulados no Linux: o layout é coberto por testes de comportamento e axe; uma revisão visual no Windows fica a cargo da issue #62 (demo).
