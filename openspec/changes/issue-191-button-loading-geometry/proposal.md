## Why

A spec do botão exige que o estado de carregamento mantenha a largura da ação e não desloque o rótulo. Hoje `AdsLoadingIndicator` entra no fluxo antes de `children` em um `inline-flex` com `gap`, sem espaço reservado no estado normal; por inspeção estática, alternar `isLoading` tende a alargar o botão e empurrar o rótulo. A hipótese ainda precisa ser medida em navegador real (issue #191, relacionada à auditoria #152).

## What Changes

- O rótulo (`children`) passa a ficar sempre montado em um contêiner interno e, durante o carregamento, apenas invisível; o indicador é sobreposto e centralizado sem ocupar espaço no fluxo.
- Largura, altura e posição do rótulo permanecem idênticas ao alternar `isLoading` em `sm`/`md`/`lg`, com rótulos curtos e longos e composições com ícone.
- Regressão de geometria em navegador (Playwright, CSS distribuído) nos temas claro e escuro, story `LoadingTransition` e exemplo no catálogo do demo.
- Medição antes/depois registrada em `validation.md`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `button`: estabilidade geométrica do estado de carregamento.

## Impact

Perfil **Critical**: altera a estrutura DOM e o CSS distribuído de um componente público. Pacotes afetados: `@admin-ds/components` (`AdsButton`), `apps/docs` (story) e `apps/admin-demo` (catálogo). Sem nova prop, token ou dependência; `isLoading`, `loadingLabel`, `aria-busy` e o bloqueio de acionamento são preservados. Evolução compatível: `children` passa a estar dentro de `span.ads-button-content`; seletores de consumidores que dependiam de filhos diretos do `button` devem ser revisados. Fora do escopo: auditoria visual geral (#152), foco de diálogos, publicação npm.
