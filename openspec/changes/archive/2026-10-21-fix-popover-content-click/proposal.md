## Why

Cliques no conteúdo de `AdsPopover` atravessam o portal React e alternam a abertura indevidamente (#126). Aplicações consumidoras precisam editar campos e acionar controles sem perder o painel.

## What Changes

- Restringir a alternância aos eventos originados no gatilho, preservando handlers e propagação do consumidor.
- Remover a proteção local redundante do calendário de `AdsDatePicker` e comprovar a integração.
- Acrescentar regressões de componente e navegador e exemplos interativos no Storybook e no demo.
- Fora do escopo: Escape em overlays aninhados (#127), lint de worktrees (#128), mudanças visuais e novas APIs.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `anchored-overlays`: interação no conteúdo mantém a abertura e preserva handlers do consumidor.

## Impact

- Biblioteca: `@admin-ds/components`, APIs `AdsPopover` e `AdsDatePicker`, sem alterações de tipos ou exports.
- Consumidores: exemplos em `apps/docs` e `apps/admin-demo` usam apenas APIs públicas; a correção pertence à biblioteca.
- Sem dependências novas, alterações de tokens ou CSS. Testes cobrem teclado, acessibilidade, temas, viewport e consumo do CSS compilado em Next.js.
