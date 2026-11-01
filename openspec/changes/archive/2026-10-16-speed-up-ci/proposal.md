## Why

A CI de Pull Request leva ~3 a 4 min de relógio porque `quality`, `build` e
`e2e` rodam em fila (`needs`), e cada job refaz checkout, setup-node, instalação
do npm e `npm ci`. O `e2e` já reconstrói tokens, components, admin e admin-demo
por conta própria, então só espera pelo `build` sem aproveitá-lo. Pushes novos
em uma PR também não cancelam execuções obsoletas. O objetivo é reduzir o tempo
de espera por feedback (issue #75).

## What Changes

- Executar `quality`, `build` e `e2e` em paralelo, removendo os `needs` entre
  eles.
- Cachear o Chromium do Playwright, com chave pela versão do Playwright.
- Cancelar execuções obsoletas de uma mesma PR com `concurrency`, sem cancelar
  execuções de push em `develop` e `master`.
- Registrar a mudança em `docs/release-process.md` (seção de CI) e formalizar o
  comportamento esperado na capability `quality-assurance`.

Sem **BREAKING**: os nomes dos jobs e dos required checks não mudam.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `quality-assurance`: adiciona o requisito de execução independente e
  cancelável das verificações de CI.

## Impact

- **Pacotes e APIs públicas:** nenhum. Não afeta `@admin-ds/tokens`,
  `@admin-ds/components`, `@admin-ds/admin`, o `admin-demo` nem o Storybook.
- **Arquivos:** `.github/workflows/ci.yml`, `docs/release-process.md` e o delta
  de spec em `openspec/specs/quality-assurance`.
- **Required checks:** "Qualidade rápida", "Artefatos de distribuição",
  "Fluxos no navegador", "Política de develop" e "Validação de release"
  mantêm nome e semântica.
- **Valor para consumidores:** nenhum direto; reduz o tempo de espera dos
  mantenedores. Como o repositório é público, não há ganho de custo; os minutos
  somados por run não diminuem.

### Fora do escopo

- Pular build/E2E por tipo de arquivo alterado.
- Shard do E2E.
- `retries` no Playwright e a instabilidade de
  `e2e/admin-demo-routes.spec.ts:237` (issue #76).
- Alterar `develop-policy`, `release-check`, scripts ou workflows de release.
