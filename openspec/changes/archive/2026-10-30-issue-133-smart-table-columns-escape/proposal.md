## Why

Issue #133: o painel de colunas do `AdsSmartTable` trata o Escape por conta própria (`closeColumns`, em `packages/admin/src/smart-table.tsx`), em paralelo à pilha de camadas de `useEscapeKey` (#127, #134). Hoje o fluxo correto (um diálogo ao redor não fecha junto) depende apenas de `stopPropagation()` impedir que o evento chegue ao listener de `document` da pilha. Se a propagação deixar de ser interrompida, ou se o painel for movido para um portal, o mesmo Escape passaria a fechar painel e diálogo. O comportamento já está especificado e testado (Escape dentro de `AdsDialog`/`AdsDrawer`), mas o contrato de coexistência com a pilha não está registrado, e a garantia tem um único ponto de falha.

## What Changes

- **Decisão:** manter o tratamento local do Escape no painel (direção 2 da issue). O painel é inline, não é um overlay, não captura foco nem é portalled; expor uma API pública para registrar camadas de Escape aumentaria a superfície pública, e `@admin-ds/admin` só pode consumir `exports` públicos de `@admin-ds/components`. Alternativas em `design.md`.
- Endurecer o handler: além de `stopPropagation()`, chamar `preventDefault()`, o marcador que a pilha de camadas já respeita (`event.defaultPrevented`). Assim o Escape tratado pelo painel continua sem fechar a camada ao redor mesmo que a propagação chegue ao `document`.
- Registrar o contrato na spec `smart-table` e cobrir com testes de regressão: o Escape do painel não chega ao `document`, é marcado como tratado, e com o painel fechado o Escape não é absorvido.
- Registrar no `CHANGELOG.md` (`[0.1.1] - Em andamento`).

## Perfil

**Standard.** Comportamento interno de uma composição, sem mudança de API pública, export, token, CSS ou dependência. Promover para Critical se a implementação exigir API pública nova (rejeitada em `design.md`).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `smart-table`: o Escape tratado pelo painel de colunas é marcado como tratado e não alcança a pilha de camadas.

## Impact

- Biblioteca: `@admin-ds/admin` (`smart-table.tsx`) e testes em `packages/admin/tests/smart-table.test.tsx`. `@admin-ds/components` não muda.
- Demonstração/Storybook: sem alteração; o fluxo não tem delta visual.
- APIs públicas afetadas: nenhuma. Sem novas props, tokens ou dependências; orçamento de bundle inalterado.

## Fora do escopo

- API pública de camada de Escape; mudanças em `overlay-utils.tsx`, `overlay-anchored.tsx` (#126) e na #91.
- Mover o painel de colunas para um portal.

Referências: issue #133, #127 (PR #131), #134 (PR #178).
