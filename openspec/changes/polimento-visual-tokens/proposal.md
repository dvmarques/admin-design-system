## Why

A fundação visual ainda tem três lacunas: as sombras (`--ads-elevation-*`) têm um único valor e quase não aparecem no tema escuro; não existe controle de densidade, e o padding das células de tabela é fixo; e os estados de carregamento e vazio de tabela, lista e dashboard usam dimensões e componentes diferentes (a tabela usa `AdsEmptyState`, o card de métrica usa texto solto e cada consumidor define a altura do skeleton). Isso gera aparência inconsistente e obriga as aplicações a repetir ajustes de CSS (issue #88, filha do épico #85).

## What Changes

- Elevação com versão para o tema escuro: `--ads-elevation-sm|md|lg` mantêm nome e uso, mas passam a ter valor próprio no tema escuro (sombra mais forte com contorno sutil). Os 3 níveis atuais são mantidos.
- Tokens de densidade `--ads-density-cell-padding-x` e `--ads-density-cell-padding-y`, com valores "confortável" (padrão, igual ao atual) e "compacto", aplicados por `data-density` no elemento ou em qualquer ancestral.
- `AdsTable` e `AdsSmartTable` ganham a prop opcional `density` (`"comfortable"` | `"compact"`), que apenas define `data-density`; sem a prop, o resultado é idêntico ao atual.
- Tokens de skeleton `--ads-skeleton-height-text|value|block`, e `AdsSkeleton` ganha a prop opcional `variant` (`"text"` | `"value"` | `"block"`). Tabela, card de métrica e painel passam a usar esses tokens em vez de alturas literais.
- `AdsEmptyState` ganha a prop opcional `size` (`"md"` padrão, `"compact"`). `AdsMetricCard` e `AdsDashboardPanel` passam a renderizar `AdsEmptyState` compacto quando `empty` é texto ou número; nós React continuam sendo renderizados como estão.
- Stories atualizadas, uma cena E2E de tabela compacta nos temas claro e escuro e baselines regenerados pelo workflow "Atualizar baselines visuais", com diff revisado.
- Documentação em `docs/`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `design-tokens`: elevação por tema, tokens de densidade e tokens de skeleton.
- `data-tables`: densidade de `AdsTable`.
- `smart-table`: densidade de `AdsSmartTable` e skeleton padronizado.
- `skeleton-loading`: variantes de `AdsSkeleton` com altura por token.
- `data-feedback`: tamanho compacto de `AdsEmptyState`.
- `dashboard-panel-states`: estado vazio textual de painel e card de métrica usa `AdsEmptyState`.

## Impact

- **Pacotes e APIs públicas:** `@admin-ds/tokens` (novas categorias em `tokens.css` e metadados; nomes existentes preservados), `@admin-ds/components` (`AdsTable`, `AdsSkeleton`, `AdsEmptyState`: props opcionais novas) e `@admin-ds/admin` (`AdsSmartTable`, `AdsMetricCard`, `AdsDashboardPanel`). Nenhuma prop removida ou alterada; sem as novas props o comportamento é o atual, exceto o estado vazio textual de métrica e painel (ver design).
- **Aplicação de demonstração:** ajuste dos exemplos e uma cena E2E; nenhuma regra de negócio.
- **Visual:** sombras do tema escuro e o estado vazio textual mudam; os baselines só são atualizados pelo workflow "Atualizar baselines visuais", com diff revisado.
- **Dependências:** nenhuma nova. O CSS distribuído deve ficar dentro da margem de 10% do baseline de tamanho.
- **Valor para consumidores:** profundidade legível no tema escuro, tabelas densas sem CSS próprio e estados de carregamento e vazio previsíveis, sem exigir Tailwind nas aplicações.

### Fora do escopo

- Novos componentes ou novos níveis de elevação; aliases semânticos de elevação.
- Densidade em controles, formulários, listas de cards e demais componentes.
- Estado vazio ou skeleton próprio em `AdsListFlow` (a consistência vem da `AdsSmartTable` e do `AdsFilterBar`).
- Contraste mínimo do skeleton, `forced-colors` das superfícies elevadas e mudanças nas preferências de acessibilidade já entregues em #87.
- Alterar o DOM de `AdsEmptyState` com a prop `size` ausente.
