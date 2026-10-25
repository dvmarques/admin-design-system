## Why

A PR #200 (issue #196) foi integrada sem revisão. A revisão retroativa encontrou
imprecisões na documentação e no processo OpenSpec: `theme-control` foi descrito
sobre as rotas do smoke, embora rode sobre `/catalogo/theme-control`; a matriz de
CI não explicitava que o Pages ignora o escopo por impacto nem o nome do job
`release-check`; e o `tasks.md` arquivado marcava como concluídas verificações que
não foram executadas.

## What Changes

- Corrigir o requisito de smoke em Firefox/WebKit em `quality-assurance` (delta nesta change).
- Ajustar `docs/quality.md`, `docs/limitations.md` e `docs/ci-impact-validation.md`.
- Desmarcar 3.2 e 3.3 do `tasks.md` arquivado da #196 com nota explicativa.
- Registrar em `CHANGELOG.md`.

## Exceção registrada

As edições da #200 em `impact-aware-validation`, `admin-demo-application` e
`nextjs-consumption` foram feitas diretamente nas specs principais, sem delta. Elas
permanecem vigentes e não são reescritas aqui, para não duplicar texto sem mudança de
conteúdo; esta nota é o registro da exceção.

## Scope

Documentação e OpenSpec apenas. Sem mudanças de APIs públicas, runtime, workflows,
snapshots PNG ou dependências.
