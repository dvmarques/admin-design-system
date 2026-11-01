## Context

`elevation` é uma categoria compartilhada: o gerador emite os mesmos valores nos dois temas. O padding das células de `AdsTable` é `px-4 py-3` fixo. Skeleton e vazio têm dimensões definidas em CSS por consumidor (`.ads-smart-table-skeleton`, `.ads-metric-card-skeleton-*`, `.ads-dashboard-panel-skeleton`), e só a tabela usa `AdsEmptyState`.

## Decisions

**Elevação por tema, sem novos níveis.** `elevation` (claro) e `elevationDark` (escuro) têm as mesmas chaves `sm|md|lg`; o gerador valida a igualdade das chaves e emite as sobrescritas junto dos blocos de tema escuro (`[data-theme="dark"]` e `:root:not([data-theme])` sob `prefers-color-scheme: dark`). Nomes e usos atuais não mudam, então não há quebra. No escuro, a sombra é mais opaca e inclui um anel de 1 px de baixa opacidade, porque `AdsSurface` elevado usa borda transparente e a sombra sozinha não delimita o contorno sobre fundo escuro. Alternativas descartadas: novos níveis (`none`, `xl`) e aliases semânticos (`-card`, `-menu`) por ampliarem a API pública sem necessidade.

**Densidade por token herdado + atributo.** `density` (confortável) e `densityCompact` definem `cellPaddingX` e `cellPaddingY`. O CSS emite `:root, [data-density="comfortable"]` e, depois, `[data-density="compact"]`, ambos de mesma especificidade, de modo que o atributo vale no próprio elemento ou em qualquer ancestral (inclusive `<html>`), e `comfortable` aninhado restaura o padrão. As classes de `AdsTableHeader` e `AdsTableCell` passam a usar `px-[var(--ads-density-cell-padding-x)] py-[var(--ads-density-cell-padding-y)]` (valores estáticos, sem classes dinâmicas). A prop `density` em `AdsTable` e `AdsSmartTable` só define `data-density` (atalho do atributo); sem ela nada muda. Os tokens de densidade ficam fora do bloco compartilhado para não serem re-emitidos pelos blocos de tema, que venceriam o atributo por especificidade. Escopo: só padding das células; extensão a controles fica para depois.

**Skeleton por token e variante.** `skeleton.heightText|heightValue|heightBlock` (1rem, 2rem, 2.5rem). `AdsSkeleton` aceita `variant` opcional, que define `data-variant` e a altura via CSS (`.ads-skeleton[data-variant]`), e continua aceitando `className` para dimensões próprias. As alturas literais do admin passam a referenciar os tokens. Não há componente novo.

**Vazio padronizado sem quebrar `empty`.** `AdsEmptyState` ganha `size="compact"` (menos padding e título menor); `size` ausente mantém o DOM e as classes atuais. `AdsMetricCard` e `AdsDashboardPanel` continuam aceitando nós React em `empty` (renderizados como antes); quando `empty` é `string` ou `number`, passam a renderizar `AdsEmptyState size="compact"` com o texto como título. Essa é a única mudança de DOM não aditiva, restrita ao caso de texto simples, e foi aceita para obter um padrão único de vazio.

**Cliente x servidor.** Nenhum componente novo precisa de `"use client"`; as alterações são de classes, atributos e CSS.

**Acessibilidade.** Densidade compacta mantém alvos de interação nativos dentro das células; o skeleton continua `aria-hidden` ou `role="status"` com rótulo e sem animação com movimento reduzido; o vazio compacto mantém semântica sem `role="alert"`. A elevação não carrega informação: estados continuam distinguíveis por borda, cor e texto.

**Estilos e distribuição.** Tailwind permanece interno; os novos tokens têm prefixo `--ads-` e são distribuídos em `@admin-ds/tokens/styles.css` e nos metadados tipados (somente valores padrão claro/confortável). Aplicações sobrescrevem os tokens sem recompilar. Conflitos de CSS são evitados pelo prefixo `ads-` e por `data-density` não ser estilizado fora dos tokens.

**Bundle.** Poucas linhas de CSS e tokens; nenhuma dependência. Esperado dentro de 10% do baseline.

## Risks / Trade-offs

- Sombras escuras mais fortes e o vazio compacto alteram os baselines: o diff deve ser revisado antes de aceitar.
- `AdsMetricCard` e `AdsDashboardPanel` com `empty` textual mudam de DOM: testes que dependiam do texto solto são atualizados.
