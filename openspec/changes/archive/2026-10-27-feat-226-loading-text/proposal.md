# Change: AdsLoadingText (issue #226)

## Why

O Back Admin já usa texto com brilho deslizante para indicar atualização de jobs. Aplicações consumidoras precisam desse padrão sem copiar CSS e lógica locais, com tema e acessibilidade consistentes.

## What Changes

- Adicionar atom público `AdsLoadingText` e tipos em `@admin-ds/components`, exportados pelo entrypoint.
- Implementar shimmer em CSS compilado e distribuído, com tokens semânticos e redução de movimento.
- Cobrir comportamento com testes de unidade, story Storybook, demonstração e documentação de integração.
- Registrar a evolução no CHANGELOG e validar consumo Next.js.

## Scope

`packages/components`, `apps/docs`, `apps/admin-demo` e documentação/testes pertinentes. API nova aditiva: `AdsLoadingText`, `AdsLoadingTextProps`, `AdsLoadingTextSpeed`.

## Out of Scope

Não modificar `abril-leaf/back-admin`, orquestrar jobs, executar polling, anunciar status automaticamente nem substituir Spinner/Skeleton.

## Value

Unifica a representação de textos temporariamente mutáveis em interfaces administrativas, sem novas dependências e preservando conteúdo.

## Risks

Legibilidade e contraste de texto com background-clip, efeitos em forced-colors e reduced-motion, CSS em consumidores externos, prop polimórfica `as` e custo de bundle. A revisão técnica deve confirmar esses pontos.
