# Design

## Decisão

O espaçamento fica em `packages/admin/src/styles.css`, escopado a
`.ads-smart-table-scroll .ads-table-caption`, e não em `AdsTableCaption`: a
borda e o raio pertencem ao contêiner da `AdsSmartTable`, e `AdsTable` isolada
não tem borda, então a legenda deve continuar alinhada à tabela ali.

O padding usa `--ads-density-cell-padding-x` e `--ads-density-cell-padding-y`,
os mesmos tokens das células, para acompanhar a densidade. A margem inferior
(`mb-3`) da legenda permanece.

## Legenda oculta

A regra usa `:where()` para ter a mesma especificidade de
`.ads-smart-table-visually-hidden` e fica antes dela no arquivo; assim, a
legenda oculta mantém `padding: 0` e continua oculta.
