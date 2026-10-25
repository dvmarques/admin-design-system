## 1. Reconciliar documentação

- [x] 1.1 Atualizar matriz CI/Pages, diferenças entre skipped e executado, snapshots Linux e checklist pré-PR.
- [x] 1.2 Atualizar cobertura Firefox/WebKit e inventário E2E.
- [x] 1.3 Reconciliar contrato SSR/export estático e propósito do demo.

## 2. Reconciliar especificações

- [x] 2.1 Harmonizar quality-assurance, impact-aware-validation, admin-demo-application e nextjs-consumption.
- [x] 2.2 Revisar AGENTS.md, openspec/config.yaml, limitações, release e changelog.

## 3. Verificação

- [x] 3.1 Revisar diffs e garantir apenas documentação, sem PNGs ou workflows alterados.
- [x] 3.2 Confirmar checks `Qualidade rápida` e `Política de develop` (OpenSpec estrito) na CI, bem como o workflow Pages. Confirmado na PR #200 (todos `success`; os jobs de build e E2E dispensaram etapas por `docs_only`) e no push para `develop` (CI run #730, completa e verde).
- [x] 3.3 Executar `npm run validate` e `openspec.cmd validate --all --strict`. Reexecutado em Linux após a integração: `format`, `lint`, `build`, `typecheck`, `test:quality` (91 testes Node, saída 0) e OpenSpec estrito passaram. A falha de `scripts/ci-impact.test.mjs` registrada na #200 foi de caminho Windows e não se repete em Linux. O E2E não roda neste ambiente (browser do Playwright ausente); ele foi validado pela CI completa no push para `develop` (runs #730 e #747, Chromium, Firefox e WebKit).
