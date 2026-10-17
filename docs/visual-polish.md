# Elevação, densidade e estados

Tokens e props para o polimento visual: sombras por tema, densidade de tabelas
e padrão único de skeleton e estado vazio. Tudo vem de
`@admin-ds/tokens/styles.css` e do CSS compilado dos pacotes; nenhuma
configuração de Tailwind é necessária.

## Elevação

`--ads-elevation-sm`, `-md` e `-lg` têm valor próprio em cada tema. No tema
escuro a sombra é mais opaca e inclui um anel de 1 px de baixa opacidade, porque
superfícies elevadas usam borda transparente e a sombra clara quase não aparece
sobre fundo escuro. Uso atual: `sm` em cards e item de navegação ativo, `md` em
`AdsSurface` elevada, dropdown e tooltip, `lg` em popover, diálogo e toast.
A elevação não carrega informação: estados continuam distinguíveis por borda,
cor e texto, e `forced-colors` remove as sombras.

```css
[data-theme='light'] {
	--ads-elevation-md: 0 2px 8px rgb(0 0 0 / 0.08);
}

[data-theme='dark'] {
	--ads-elevation-md: 0 4px 12px rgb(0 0 0 / 0.2);
}
```

## Densidade de tabela

`--ads-density-cell-padding-x` e `--ads-density-cell-padding-y` definem o
espaçamento de células e cabeçalhos. O padrão é confortável (`1rem` e `0.75rem`);
o compacto usa `0.75rem` e `0.375rem`. Há duas formas de aplicar:

```tsx
<AdsTable density="compact" aria-label="Clientes">…</AdsTable>
<AdsSmartTable density="compact" … />
```

ou, sem prop, por atributo em qualquer ancestral (por exemplo `<html>`):

```html
<main data-density="compact">…</main>
```

`data-density="comfortable"` aninhado restaura o padrão. Para ajustar os valores
sem recompilar, sobrescreva os tokens depois do `tokens.css`, por exemplo em
`[data-density='compact']`. A densidade afeta só o padding das células;
controles e formulários não mudam.

## Skeleton e estado vazio

- `AdsSkeleton` aceita `variant` (`text`, `value`, `block`), que define a altura
  pelos tokens `--ads-skeleton-height-text|value|block` (`1rem`, `2rem`,
  `2.5rem`). A largura continua vindo de `className`. A tabela, o card de
  métrica e o painel usam esses tokens.
- `AdsEmptyState` aceita `size="compact"` para cards e painéis.
  `AdsMetricCard` e `AdsDashboardPanel` renderizam um estado vazio compacto
  quando `empty` é texto ou número; nós React são renderizados como informados.
