## Context

O `ci.yml` roda `quality`, `build` e `e2e` em paralelo (change `speed-up-ci`).
Filtros por path no nível do workflow (`paths-ignore`) deixariam os required
checks pendentes em PRs só de documentação e bloqueariam o merge. Há testes que
leem arquivos de documentação: `token-override-docs.test.ts` lê
`docs/integration.md` e `packages/tokens/README.md`; `inspect-packages.mjs` lê
`docs/bundle-baseline.json`; `release-workflows.test.mjs` verifica o texto do
`ci.yml`. Não há componentes, CSS, tokens, Tailwind ou acessibilidade de
interface envolvidos, nem Client/Server Components.

## Goals / Non-Goals

**Goals:**

- Pular build e E2E quando a PR só altera documentação sem consumidores em
  teste.
- Manter nomes e semântica dos required checks.
- Falhar para o lado seguro: na dúvida, rodar o fluxo completo.

**Non-Goals:**

- Cobrir outros tipos de mudança, shard do E2E, ou alterar os fluxos de
  release.

## Decisions

1. **Filtro dentro dos jobs, com steps condicionais.** Um primeiro step
   calcula `docs_only` e os demais steps pesados usam `if`. O job conclui com
   sucesso, e o check mantém o nome. Alternativas descartadas: `paths-ignore`
   (checks pendentes) e `if` no job (aceito pelo GitHub como sucesso, mas
   esconde o motivo e dificulta o log).

2. **Classificação em um script versionado**, `scripts/ci-changed-paths.mjs`,
   com teste em `scripts/`. A regra fica testável fora do YAML: lista de
   documentação, lista de exceções e a decisão por arquivo. O script lê os
   caminhos de `git diff --name-only base...head` e imprime `docs_only=true|false`
   em `GITHUB_OUTPUT`.

3. **Falha segura.** `docs_only=false` quando: o evento não é `pull_request`; a
   base é `master`; o diff não pode ser calculado; a lista de arquivos está
   vazia; ou qualquer arquivo está fora da lista de documentação ou na lista de
   exceções. Só `true` pula trabalho.

4. **`quality` não é filtrado.** `format` valida os `.md` e é barato; a
   política de develop e a validação do OpenSpec têm jobs próprios e não mudam.

5. **Sem action de terceiros.** `actions/checkout` com histórico suficiente
   (`fetch-depth: 0` só nos jobs que classificam, ou `git fetch` da base) e
   `git diff` com a SHA da base do evento.

## Risks / Trade-offs

- Uma documentação que passe a ser lida por teste e não esteja na lista de
  exceções pularia um teste que deveria rodar. Mitigação: a lista de exceções é
  versionada e testada, e pushes em `develop` rodam o fluxo completo.
- Checkout com histórico completo aumenta alguns segundos nos jobs que
  classificam. Mitigação: buscar só a base com profundidade 1 quando possível.
- Não verificado: o comportamento do `git diff base...head` em PRs de forks.
  Mitigação: o repositório exige PRs same-repo para release; falha de cálculo
  cai em `docs_only=false`.
- Sem impacto em bundle, dependências, API pública ou CSS distribuído.
