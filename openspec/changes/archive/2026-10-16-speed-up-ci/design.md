## Context

`.github/workflows/ci.yml` encadeia `quality` → `build` → `e2e`. Medições da CI
atual: `quality` ~60-75 s, `build` ~35 s, `e2e` ~75 s a 2 min, mais ~15-25 s de
setup por job. Os três jobs já instalam dependências e constroem o que usam; as
dependências entre eles servem só ao fail-fast.

Não há componentes, CSS, tokens, Tailwind ou acessibilidade de interface
envolvidos, nem Client/Server Components.

## Goals / Non-Goals

**Goals:**

- Reduzir o tempo de relógio da CI de PR para o do job mais lento.
- Evitar trabalho em commits já superados na mesma PR.
- Manter nomes e semântica dos required checks.

**Non-Goals:**

- Reduzir minutos faturáveis, filtrar por path, shard do E2E ou tratar a
  instabilidade do E2E.

## Decisions

1. **Remover `needs` de `build` e `e2e`.** Os jobs são independentes na
   prática. Trade-off: perde o fail-fast, e o E2E roda mesmo quando `quality`
   falha. Aceito, pois o objetivo é tempo, e o resultado final da PR continua o
   mesmo. Alternativa descartada: reaproveitar artefatos do `build` no `e2e`,
   que exigiria upload/download de artefatos e acoplaria os jobs.

2. **Cache do Chromium em `~/.cache/ms-playwright`**, chave pela versão
   resolvida do Playwright (`package-lock.json`). Com cache hit, roda só
   `playwright install-deps chromium` para as dependências do sistema; sem
   hit, mantém `playwright install --with-deps chromium`. Ganho esperado menor
   que os ~22 s atuais, pois as dependências de apt continuam instaladas.
   A remoção da fonte apt do Google Chrome continua antes de qualquer
   instalação.

3. **`concurrency` por PR ou ref, com cancelamento só em `pull_request`.**
   Grupo `ci-${{ github.event.pull_request.number || github.ref }}` e
   `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. Pushes em
   `develop` e `master` nunca cancelam uns aos outros, preservando a execução
   de cada commit integrado.

## Risks / Trade-offs

- Sem fail-fast, uma PR com falha de `quality` ainda consome o E2E. Sem custo
  em repositório público.
- Cancelamento deixa checks `cancelled` em commits superados; só o commit
  corrente da PR conta para o merge.
- Não verificado: o ganho real de relógio. Mitigação: comparar a duração das
  execuções antes e depois na própria PR e registrar o resultado.
- Sem impacto em bundle, dependências, API pública ou CSS distribuído.
