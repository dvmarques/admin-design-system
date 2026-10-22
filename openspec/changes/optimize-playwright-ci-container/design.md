## Contexto

O lockfile fixa `@playwright/test`, `playwright` e `playwright-core` em 1.62.0. A imagem oficial inclui os três browsers e bibliotecas Linux, mas não instala o pacote npm do projeto. A distribuição `noble` é Ubuntu 24.04, sujeita à validação visual na CI.

## Decisions

1. Usar `container.image: mcr.microsoft.com/playwright:v1.62.0-noble` na matrix E2E e `options: --ipc=host` para reduzir riscos de memória compartilhada insuficiente no Chromium. A imagem roda como root nos testes confiáveis do projeto.
2. Manter `runs-on: ubuntu-latest`, `actions/setup-node@v6` com Node 24 e npm 11.19.1, e `npm ci --ignore-scripts` antes de build/teste. Os gates `docs_only` e `draft` permanecem.
3. Remover cache de `~/.cache/ms-playwright`, comandos `install --with-deps` / `install-deps` e limpeza de fontes apt; a imagem já fornece browsers e bibliotecas.
4. Verificar versões de todos os pacotes Playwright e executáveis de Chromium, Firefox e WebKit. Uma atualização futura exige alinhar a tag da imagem ao lockfile e validar snapshots.
5. Manter `PLAYWRIGHT_BROWSERS_PATH` padrão da imagem e servidor Next.js em `127.0.0.1:3000`. O Firefox precisa de `HOME=/root` no processo de testes porque o runner define `/github/home` com outro proprietário.

## Risks and alternatives

- **Pull da imagem:** pode superar o custo do apt em runners sem cache. Medir desde o início do job, incluindo a inicialização do container.
- **Fontes/snapshots:** Ubuntu 24.04 pode produzir rasterização diferente. Não elevar tolerância nem atualizar baselines sem revisão visual.
- **Digest:** fixar somente após verificar o manifest oficial para a plataforma efetiva.
- **Mirror apt alternativo:** considerar caso a imagem não melhore o tempo total em condições comparáveis.

## Verification

Validar OpenSpec strict, formatação, lint, build, typecheck, quality e E2E; conferir logs dos três browsers e comparar execuções antes/depois com cache e condições equivalentes.
