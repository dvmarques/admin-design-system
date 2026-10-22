## Contexto

O lockfile fixa `@playwright/test`, `playwright` e `playwright-core` em 1.62.0.
A imagem oficial inclui os três browsers e bibliotecas Linux, mas não instala o
pacote npm do projeto. A distribuição `noble` é Ubuntu 24.04, compatível com o
baseline Linux atual em princípio, sujeito à validação visual na CI.

## Decisions

1. Usar `container.image: mcr.microsoft.com/playwright:v1.62.0-noble` na matrix
   1. E2E e `options: --ipc=host` para reduzir riscos de falta de memória
   1. compartilhada do Chromium. A imagem roda como root por padrão nos testes
   1. confiáveis do próprio projeto; não introduzir `sudo` no job.
2. Manter `runs-on: ubuntu-latest`, `actions/setup-node@v6` com Node 24 e npm
   2. 11.19.1, e `npm ci --ignore-scripts` antes de build/teste. A configuração
   2. `docs_only` e `draft` permanece inalterada.
3. Remover `actions/cache` de `~/.cache/ms-playwright`, comandos `install
   3. --with-deps` / `install-deps` e limpeza de apt sources; a imagem já fornece
   3. binários e libs.
4. Adicionar verificação de compatibilidade entre versão da imagem e versão
   4. instalada de `playwright-core` no lockfile. Uma atualização futura do
   4. Playwright exige atualizar tag e validação de snapshots; não atualizar
   4. lockfile nesta change.
5. Manter `PLAYWRIGHT_BROWSERS_PATH` padrão da imagem e servidor Next.js em
   5. `127.0.0.1:3000` dentro do mesmo container. Validar permissões e network na
   5. CI.

## Risks and alternatives

- **Pull da imagem:** pode superar custo do apt em runners sem cache. Medir
  - desde início do job, incluindo inicialização, e não apenas steps.
- **Fontes/snapshots:** Ubuntu 24.04 pode ter fontes ou rasterização distintas
  - do host anterior. Não elevar tolerância ou atualizar baselines sem revisão
  - visual explícita.
- **Digest:** pin de versão exata é obrigatório nesta primeira etapa. Digest só
  - após verificar o manifest oficial para a plataforma efetiva; não inventar
  - digest.
- **Mirror apt alternativo:** manter como alternativa se pull da imagem não
  - melhorar a mediana em condições comparáveis.

## Verification

Validar OpenSpec strict, formatação, lint, build, typecheck, quality e E2E;
conferir logs de três jobs reais, com execução completa de Chromium e smoke
Firefox/WebKit. Comparar pelo menos duas execuções antes/depois com cache
frio/quente quando possível e registrar limites.
