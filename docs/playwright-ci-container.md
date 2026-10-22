# Playwright em container na CI (issue #171)

## Imagem e versões

A matrix E2E em `.github/workflows/ci.yml` usa a imagem oficial
`mcr.microsoft.com/playwright:v1.62.0-noble` (Ubuntu 24.04). O
`package-lock.json` fixa `@playwright/test`, `playwright` e `playwright-core` em
**1.62.0**. A CI verifica as versões instaladas e do lockfile dos três pacotes
Playwright, Node 24, npm 11.19.1 e os executáveis dos três navegadores antes do
build. Não altere o lockfile apenas para migrar a imagem.

Para atualizar Playwright no futuro: atualizar dependências e lockfile,
selecionar a tag **exatamente igual** no workflow, confirmar disponibilidade da
imagem oficial, executar todos os browsers e revisar snapshots visualmente. Um
digest pode ser fixado após consulta ao manifest oficial da plataforma; não
utilizar digest estimado. `npm ci --ignore-scripts`, Node 24 e npm 11.19.1
permanecem obrigatórios.

## Execução local compatível

O fluxo local nativo segue documentado em `docs/quality.md`. Para reproduzir a
distribuição da CI com Docker, a partir da raiz e com Docker disponível:

```bash
docker run --rm --init --ipc=host -v "$(pwd):/work" -w /work \
  mcr.microsoft.com/playwright:v1.62.0-noble \
  bash -lc 'npm install --global npm@11.19.1 && npm ci --ignore-scripts && npm run build && npx playwright test'
```

Este comando monta a working tree e pode criar arquivos como root no host.
Prefira checkout limpo descartável ou adapte UID/GID para seu ambiente. A imagem
contém browsers e bibliotecas, mas **não** o pacote npm Playwright. A aplicação
Next.js é iniciada por `playwright.config.ts` no próprio container, via
`127.0.0.1:3000`.

## Diagnóstico e rollback

- Se faltar browser, conferir versão do lockfile, tag da imagem e logs do job;
  - não instalar via apt para mascarar divergência.
- Se o Chromium falhar por memória, verificar `--ipc=host` e recursos do runner.
  - Se houver erro de permissão, inspecionar UID do container e diretórios do
  - checkout/cache antes de alterar permissões.
- Se snapshots Chromium divergirem, comparar rasterização e fontes entre
  - `ubuntu-latest` e Ubuntu Noble. O workflow de atualização de baselines ainda
  - usa o host `ubuntu-latest`; não atualizar PNGs automaticamente, nem elevar
  - tolerâncias. Qualquer baseline novo requer justificativa e revisão visual.
- Se o pull da imagem for mais lento que o apt, comparar medianas e considerar
  - retorno ao runner nativo ou otimização de mirror, sem reduzir testes.

## Benchmark antes/depois

Os valores abaixo são calculados a partir do primeiro e último timestamp de cada log de job no GitHub Actions. Incluem a preparação do runner/container, checkout, dependências, builds e testes, mas não o tempo de espera em fila. O cache de imagem e npm não pode ser classificado com segurança como frio ou quente pelos dados disponíveis.

### Jobs anteriores à migração (host `ubuntu-latest`)

- [Run 39768760228](https://github.com/dvmarques/admin-design-system/actions/runs/39768760228): Chromium 4min23s (181 testes), Firefox 11min49s (10 testes), WebKit 20min24s (10 testes).
- [Run 39771583007](https://github.com/dvmarques/admin-design-system/actions/runs/39771583007): Chromium 1min57s (181 testes), Firefox 1min26s (10 testes), WebKit 32min58s (10 testes).

### Jobs após migração (container oficial Playwright)

- [Run 39787750701](https://github.com/dvmarques/admin-design-system/actions/runs/39787750701): Chromium 2min35s (167 testes, passou), WebKit 1min42s (10 testes, passou), Firefox 1min31s (falhou por `HOME`).
- [Run 39789421161](https://github.com/dvmarques/admin-design-system/actions/runs/39789421161): Chromium 2min12s (167 testes, passou), WebKit 1min18s (10 testes, passou), Firefox 1min16s (falhou por `HOME`).
- [Run 39790016962](https://github.com/dvmarques/admin-design-system/actions/runs/39790016962): Chromium 2min14s (167 testes, passou), Firefox 1min18s (10 testes, passou), WebKit 1min20s (10 testes, passou).

- [Run 39791463329](https://github.com/dvmarques/admin-design-system/actions/runs/39791463329): Chromium 2min02s (167 testes, passou), Firefox 1min23s (10 testes, passou), WebKit 1min18s (10 testes, passou).

### Medianas observadas e limites

- **Chromium:** mediana host ~3min10s (2 jobs) e container ~2min13s (4 jobs). A quantidade de testes mudou de 181 para 167, então a diferença não pode ser atribuída exclusivamente ao container.
- **WebKit:** mediana host ~26min41s (2 jobs) e container ~1min19s (4 jobs). A amostra é pequena, e a instalação via apt apresentou grande variação no host.
- **Firefox:** mediana host ~6min38s (2 jobs). Container: mediana ~1min21s (2 jobs aprovados, após correção do `HOME`).

O pull da imagem não aparece como etapa independente: a medição usa a duração total do job. Sem instrumentação adicional não é possível separar com precisão download da imagem, inicialização e cache. As execuções são de commits diferentes e não controlam carga do runner. A amostragem mínima de duas execuções aprovadas por browser foi atingida. As condições de cache permanecem não classificáveis com precisão pelos logs disponíveis; esta é uma limitação explícita do benchmark, não uma medição de cache frio/quente. Não extrapolar percentuais de economia como prova causal.
