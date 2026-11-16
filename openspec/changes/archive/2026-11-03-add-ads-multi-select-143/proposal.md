## Why

A issue [#143](https://github.com/dvmarques/admin-design-system/issues/143), filha do épico #141, requer um seletor múltiplo reutilizável. O `AdsSelect` nativo não oferece chips pesquisáveis, remoção individual, limite de escolhas nem filtragem com interação consistente. O `AdsFilterBar` já contém uma composição interna de filtros múltiplos, porém não deve ser a dependência do novo controle.

## What Changes

- Criar `AdsMultiSelect` em `@dvmarques/admin-ds-components`, com API pública tipada (`options`, `value`/`defaultValue`, `onValueChange`, `maxSelections`, `name`, `disabled`, `readOnly`, `required`, `loading`, `error`, textos configuráveis).
- Exibir escolhas como chips removíveis, campo com pesquisa e listbox filtrável, controles para limpar, teclado e semântica ARIA estável; integrar sem adaptações com `AdsField`.
- Publicar CSS baseado em tokens existentes, sem nova dependência; validar temas, responsividade, foco e uso em formulário, inclusive reset e dados serializados.
- Adicionar exemplos **funcionais** e navegáveis no Admin Demo, Storybook, testes unitários/integração/E2E, documentação e CHANGELOG na **mesma PR**.

## Capabilities

### New Capabilities

- `multi-select`: seleção múltipla acessível, pesquisável, controlável e sem backend.

### Modified Capabilities

- `component-catalog`: documentar e demonstrar novo export no Admin Demo e no Storybook.

## Impact

Perfil **Critical**: novo contrato público, CSS compilado, validação em React/Next.js e acessibilidade interativa. Afeta `packages/components`, `apps/admin-demo`, `apps/docs`, `e2e`, documentação e OpenSpec. Deve preservar `AdsCombobox`, `AdsSelect`, `AdsFilterBar` e importações públicas anteriores. Sem dependência obrigatória de backend, sem modificação da #91, sem acoplamento de `components` a `admin`.

Fora do MVP: virtualização de listas, criação remota de opções, integração com API externa, seleção em árvore, restrições de domínio e alteração do comportamento do `AdsFilterBar`.
