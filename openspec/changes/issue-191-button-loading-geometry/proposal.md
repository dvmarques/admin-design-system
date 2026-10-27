## Why

A spec do botão exige que o estado de carregamento mantenha a largura da ação e não desloque o rótulo. Hoje `AdsLoadingIndicator` entra no fluxo antes de `children` em um `inline-flex` com `gap`, sem espaço reservado no estado normal; alternar `isLoading` alarga o botão e empurra o rótulo. A hipótese da inspeção estática foi confirmada por medição em navegador real: +24 px de largura no botão `sm` com "Ok" (issue #191, relacionada à auditoria #152).

## What Changes

- O rótulo (`children`) passa a ficar sempre montado em um contêiner interno e, durante o carregamento, apenas invisível; o indicador ocupa a mesma célula de grid, centralizado, sem ocupar espaço no fluxo nem usar `position`, para não competir com o `className` do consumidor.
- Largura, altura e posição do rótulo permanecem idênticas ao alternar `isLoading` em `sm`/`md`/`lg`, com rótulos curtos e longos e composições com ícone.
- Regressão de geometria em navegador (Playwright, CSS distribuído) nos temas claro e escuro, story `LoadingTransition` e exemplo no catálogo do demo.
- Medição antes/depois registrada em `validation.md`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `button`: estabilidade geométrica do estado de carregamento.

## Impact

Perfil **Critical**: altera a estrutura DOM e o CSS distribuído de um componente público. Pacotes afetados: `@admin-ds/components` (`AdsButton`), `apps/docs` (story) e `apps/admin-demo` (catálogo). Sem nova prop, token ou dependência; `isLoading`, `loadingLabel`, `aria-busy` e o bloqueio de acionamento são preservados. Evolução compatível: `children` passa a estar dentro de um `span` interno em grid; seletores de consumidores que dependiam de filhos diretos do `button` devem ser revisados. Fora do escopo: auditoria visual geral (#152), foco de diálogos, publicação npm.
