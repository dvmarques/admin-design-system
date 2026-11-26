# Proposal

## Why

O espaçamento entre `AdsPageHeader` e seções não tinha valor padrão nem classe: a demo usava CSS próprio (8px no cabeçalho, 24px até a primeira seção) e cada consumidor precisava sobrescrever `--ads-layout-stack-gap` (#344).

## What Changes

- Nova classe opt-in `ads-layout-page` (coluna flex, gap `--ads-spacing-6`, ajustável por `--ads-layout-page-gap`).
- Espaçamento interno do `AdsPageHeader` tokenizado em 8px (`--ads-page-header-gap`, padrão `--ads-spacing-2`), sem alteração visual.
- Admin Demo e Storybook usam `ads-layout-page`; o CSS próprio de ritmo é removido.
- `docs/page-composition.md` e `docs/responsive-layout.md` documentam valores e uso.

## Capabilities

### Modified Capabilities

- `page-composition`: ritmo vertical padrão.
- `admin-demo-application`: demo usa a classe do pacote.

## Impact

Perfil **Standard**: CSS distribuído de `components` (aditivo, sem mudança de API React; o `gap-y-2` utilitário do header passa a ser regra equivalente em CSS). Consumidores: `apps/admin-demo`, `apps/docs`. Rollback: reverter o commit.
