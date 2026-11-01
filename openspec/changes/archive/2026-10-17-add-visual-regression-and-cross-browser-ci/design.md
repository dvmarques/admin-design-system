## Context

Ver proposal.md. Hoje o Playwright tem um único projeto (`chromium`) em
`playwright.config.ts`, servindo o build de produção do admin demo. Os três
specs com snapshot (`admin-demo`, `admin-demo-routes`, `data-display`)
chamam `test.skip(Boolean(process.env.CI), …)`. O job `e2e` da CI roda em
`ubuntu-latest`, com cache de `~/.cache/ms-playwright`, e é pulado em PRs
somente de documentação via `scripts/ci-changed-paths.mjs`. Não há acesso a
máquina local: toda geração e validação passa pela CI.

## Goals / Non-Goals

**Goals:**

- Snapshots verificados em toda PR, com baselines gerados no mesmo ambiente da CI.
- Smoke em Firefox e WebKit isolado por navegador.
- Fluxo de atualização de baselines totalmente remoto.

**Non-Goals:**

- Snapshots fora de Chromium e fora do Linux.
- Container Docker do Playwright.
- Alterar o conteúdo dos testes de comportamento existentes.

## Decisions

1. **Baselines gerados em `ubuntu-latest` por `workflow_dispatch`.** O workflow
   recebe a branch, roda `playwright test --update-snapshots` apenas no projeto
   `chromium` e faz commit dos `*-linux.png` na própria branch. Alternativa:
   container `mcr.microsoft.com/playwright`; descartada por exigir Docker para
   quem queira reproduzir e por divergir do runner da CI. Trade-off: mudanças
   do runner (fontes) podem alterar pixels; mitiga-se fixando a versão do
   Playwright e regenerando pelo mesmo fluxo.
2. **Linux como única fonte; remover `win32`.** Manter dois conjuntos exigiria
   atualização no Windows, impossível no fluxo remoto, e deixaria o conjunto
   defasado. Os nomes `*-chromium-linux.png` já resultam do padrão do
   Playwright; nenhum `snapshotPathTemplate` customizado.
3. **Tolerância zero.** Sem `maxDiffPixelRatio`, para que qualquer diferença
   seja revista. Se houver flakiness real nas primeiras execuções, ajustar em
   follow-up justificado, não por padrão.
4. **Smoke separado por projeto e por arquivo.** Novo spec de smoke com
   `testMatch` dedicado; os projetos `firefox` e `webkit` só o executam, e o
   `chromium` continua executando todos os specs. Reaproveita `routes.ts` e
   `waitForHydration`. Evita rodar toda a suíte (e snapshots) em motores sem
   baseline.
5. **Matrix paralela de um job por navegador.** O job atual `Fluxos no
navegador` vira matrix `chromium | firefox | webkit` com `fail-fast: false`.
   Cada instância instala apenas seu navegador (`playwright install --with-deps
<browser>`) e usa o cache por versão do Playwright e navegador. O nome do
   check de Chromium é preservado; os novos checks por navegador entram na
   proteção de `develop` como ação administrativa fora do código.
6. **Duas PRs, uma change.** PR 1: remoção de `win32`, workflow de baselines,
   remoção dos skips e docs correspondentes. PR 2: projetos Firefox e WebKit,
   smoke, matrix e docs restantes. A change só é arquivada após a PR 2.

## Risks / Trade-offs

- [Flakiness dos snapshots no runner] → fixar versão do Playwright, regenerar
  pelo workflow, adicionar espera de hidratação/fontes se a primeira execução
  falhar, sem aumentar tolerância.
- [Primeira execução gera diff enorme de PNGs] → revisar o diff das imagens na
  PR antes de aceitar; não aceitar só para eliminar a falha.
- [WebKit no Linux difere do Safari] → o smoke detecta quebras de motor, não
  garante paridade com Safari; registrado em `limitations.md`.
- [Tempo de CI maior] → matrix em paralelo mantém o relógio próximo ao atual;
  o custo total em minutos cresce e será medido e documentado.
- [`workflow_dispatch` só é registrado depois que o workflow está na branch
  padrão] → na PR 1, um gatilho `push` temporário restrito à branch gerou os
  baselines e foi removido antes do merge; depois do merge, o disparo manual
  funciona para qualquer branch.
- [Commits do workflow com `GITHUB_TOKEN` não disparam a CI da PR] → documentar
  que é preciso um push adicional ou alternar Draft/Ready for review para
  executar a verificação completa.
- [Workflow que faz commit exige `contents: write`] → restrito ao workflow
  manual, sem acionar em PRs de forks.

## Migration Plan

1. PR 1: gerar baselines Linux pelo workflow, remover `win32`, tirar skips,
   atualizar docs. Reverter restaura os `win32` e os skips.
2. PR 2: adicionar os projetos e a matrix; configurar os novos required checks
   após o primeiro run verde.
