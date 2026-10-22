# Playwright em container na CI (issue #171)

## Imagem e versões

A matrix E2E em `.github/workflows/ci.yml` usa a imagem oficial
`mcr.microsoft.com/playwright:v1.62.0-noble` (Ubuntu 24.04). O
`package-lock.json` fixa `@playwright/test`, `playwright` e
`playwright-core` em **1.62.0**. A CI verifica as versões instaladas e do
lockfile dos três pacotes Playwright, Node 24, npm 11.19.1 e os executáveis
dos três navegadores antes do build. Não altere o lockfile apenas para migrar a imagem.

Para atualizar Playwright no futuro: atualizar dependências e lockfile,
selecionar a tag **exatamente igual** no workflow, confirmar disponibilidade
da imagem oficial, executar todos os browsers e revisar snapshots visualmente.
Um digest pode ser fixado após consulta ao manifest oficial da plataforma;
não utilizar digest estimado. `npm ci --ignore-scripts`, Node 24 e npm 11.19.1
permanecem obrigatórios.

## Execução local compatível

O fluxo local nativo segue documentado em `docs/quality.md`. Para reproduzir
a distribuição da CI com Docker, a partir da raiz e com Docker disponível:

```bash
docker run --rm --init --ipc=host -v "$(pwd):/work" -w /work \
  mcr.microsoft.com/playwright:v1.62.0-noble \
  bash -lc 'npm install --global npm@11.19.1 && npm ci --ignore-scripts && npm run build && npx playwright test'
```

Este comando monta a working tree e pode criar arquivos como root no host.
Prefira checkout limpo descartável ou adapte UID/GID para seu ambiente. A
imagem contém browsers e bibliotecas, mas **não** o pacote npm Playwright.
A aplicação Next.js é iniciada por `playwright.config.ts` no próprio
container, via `127.0.0.1:3000`.

## Diagnóstico e rollback

- Se faltar browser, conferir versão do lockfile, tag da imagem e logs do job;
  não instalar via apt para mascarar divergência.
- Se o Chromium falhar por memória, verificar `--ipc=host` e recursos do
  runner. Se houver erro de permissão, inspecionar UID do container e diretórios
  do checkout/cache antes de alterar permissões.
- Se snapshots Chromium divergirem, comparar rasterização e fontes entre
  `ubuntu-latest` e Ubuntu Noble. O workflow de atualização de baselines ainda
  usa o host `ubuntu-latest`; não atualizar PNGs automaticamente, nem elevar
  tolerâncias. Qualquer baseline novo requer justificativa e revisão visual.
- Se o pull da imagem for mais lento que o apt, comparar medianas e considerar
  retorno ao runner nativo ou otimização de mirror, sem reduzir testes.

## Benchmark antes/depois

O container é inicializado **antes** do checkout e da detecção `docs_only`:
portanto, uma PR apenas documental ainda pode pagar o custo de pull da imagem,
mesmo quando os passos E2E são pulados. Esse custo precisa entrar na medição.

O tempo de pull/start do container **não aparece como um step**. Usar os
horários de início/fim do job no GitHub Actions e medir também etapas internas.
Comparar pelo menos duas execuções por cenário em runners equivalentes,
separando condições de cache frio/quente quando observáveis.

| Execução | Ambiente | Pull/start + checkout | Instalação npm | Dependências apt | Builds | Testes | Total job | Resultado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 39768760228 / Firefox | Host ubuntu-latest | não medido | não medido | ~10min47s (entre marcos) | não medido | 12,5s | não medido | Passou |
| 39768760228 / WebKit | Host ubuntu-latest | não medido | não medido | ~19min32s (entre marcos) | não medido | 11,9s | não medido | Passou |
| 39771583007 / WebKit | Host ubuntu-latest | não medido | não medido | download apt 31min18s | não medido | 17,9s | não medido | Passou |
| PR #172 / Chromium | Container Noble | pendente | pendente | não aplicável | pendente | pendente | pendente | pendente |
| PR #172 / Firefox | Container Noble | pendente | pendente | não aplicável | pendente | pendente | pendente | pendente |
| PR #172 / WebKit | Container Noble | pendente | pendente | não aplicável | pendente | pendente | pendente | pendente |

As amostras anteriores são parciais, de commits diferentes e não permitem
inferir economia total. Registrar medianas, número de runs, timestamps e links
dos jobs após a CI; comparar execução com cache equivalente e separar
mudanças de duração causadas por concorrência e variabilidade do runner.
