## Why

O posicionamento atual dos overlays usa clamp sem flip e não acompanha mudanças de dimensão, causando clipping e metadados incorretos na viewport.

## What Changes

- Calcular placement efetivo com flip e shift, mantendo a preferência original quando houver espaço.
- Atualizar posição ao alterar âncora, conteúdo, scroll, viewport e zoom.
- Alinhar seta e data-placement do Tooltip ao placement efetivo.
- Adicionar regressões, stories e exemplos de borda.

## Impact

- Biblioteca: @admin-ds/components (Tooltip, Popover, Dropdown e utilitário interno).
- Consumidores: admin-demo e Storybook.
- API pública: sem alterações; CSS público preservado.

## Out of Scope

- Gestão de foco, Escape, clique externo, modalidade e infraestrutura de overlays aninhados (issue #91).
- Redesenho de componentes e alterações de tokens.

## Perfil de execução

Critical: a correção afeta CSS distribuído, geometria e compatibilidade de três componentes públicos e acessibilidade nos consumidores. Preservar APIs, tokens e a infraestrutura da issue #91; comparar alternativas e bundle, revisar consumidores e exigir validação no navegador. Rollback: reverter a correção de posicionamento e seus exemplos/testes em conjunto, preservando changes não relacionadas.
