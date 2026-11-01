## Why

Em PRs que só alteram documentação ou specs, `build` e `e2e` repetem trabalho
sem risco, ocupando runners e atrasando o feedback. O repositório é público,
então o ganho é tempo e carga de runners; se virar privado, passa a ser também
custo (issue #81, seguimento do item 4 da #75).

## What Changes

- `build` e `e2e` passam a decidir, dentro do próprio job, se executam o
  trabalho pesado, com base nos arquivos alterados pela PR.
- Uma PR é "somente de documentação" quando todos os arquivos alterados estão
  na lista de documentação (`openspec/**`, `CHANGELOG.md`, `AGENTS.md`,
  `CLAUDE.md`, `README.md`, `docs/*.md`) e nenhum está na lista de exceções
  (`docs/integration.md`, `docs/bundle-baseline.*`, `packages/tokens/README.md`,
  `.github/**`).
- `quality` continua rodando sempre. Execuções de `push` e PRs para `master`
  sempre rodam o fluxo completo.
- A detecção usa `git diff` entre base e head, sem action de terceiros.
- Atualizar `docs/release-process.md` (seção de CI) e a capability
  `quality-assurance`.

Sem **BREAKING**: os nomes dos jobs e dos required checks não mudam, e os jobs
sempre reportam sucesso ou falha, nunca ficam pendentes.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `quality-assurance`: adiciona o requisito de execução reduzida da CI em PRs
  somente de documentação.

## Impact

- **Pacotes e APIs públicas:** nenhum. Não afeta `@admin-ds/tokens`,
  `@admin-ds/components`, `@admin-ds/admin`, o `admin-demo` nem o Storybook.
- **Arquivos:** `.github/workflows/ci.yml`, `docs/release-process.md`, um teste
  em `scripts/` para a classificação de caminhos e o delta de spec em
  `openspec/specs/quality-assurance`.
- **Required checks:** "Qualidade rápida", "Artefatos de distribuição",
  "Fluxos no navegador", "Política de develop" e "Validação de release"
  mantêm nome e semântica.
- **Valor para consumidores:** nenhum direto; reduz tempo de espera e carga de
  runners nas PRs de documentação.

### Fora do escopo

- Shard do E2E e cache adicional.
- Filtro para outros tipos de mudança (por exemplo, só testes ou só Storybook).
- A instabilidade tratada na issue #76.
- Alterar `develop-policy`, `release-check`, scripts ou workflows de release.
