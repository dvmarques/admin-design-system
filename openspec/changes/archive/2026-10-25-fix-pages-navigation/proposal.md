# Proposal

## Why

A publicação Pages falhou após #188 porque o teste de marca encontra as variantes desktop e móvel simultaneamente. O acesso ao Storybook deve acompanhar os demais destinos na navegação, conforme solicitado na issue #189.

## What Changes

- Corrigir a validação do logo visível no site estático em desktop e celular.
- Mover o link opcional Storybook do cabeçalho para junto de Catálogo, preservando acesso no menu recolhido e móvel.
- Validar Pages em PRs no Linux, sem deploy; publicar somente develop.
- Perfil Standard: comportamento interno da demo e teste de publicação, sem API pública, tokens ou CSS distribuído alterados.
- Fora do escopo: redesenhar o shell, alterar pacotes reutilizáveis ou o processo de publicação.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-demo-application`: acesso opcional ao Storybook na navegação principal.
- `site-publishing`: link na navegação, marca responsiva e validação Linux pré-merge sem deploy.

## Impact

`apps/admin-demo`, testes Pages, workflow de publicação e documentação. A biblioteca reutilizável permanece intacta; consumidores têm uma referência de composição com as APIs públicas existentes. Sem dependências novas.
