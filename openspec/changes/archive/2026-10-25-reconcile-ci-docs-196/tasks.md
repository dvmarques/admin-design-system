## 1. Reconciliar documentação

- [x] 1.1 Atualizar matriz CI/Pages, diferenças entre skipped e executado, snapshots Linux e checklist pré-PR.
- [x] 1.2 Atualizar cobertura Firefox/WebKit e inventário E2E.
- [x] 1.3 Reconciliar contrato SSR/export estático e propósito do demo.

## 2. Reconciliar especificações

- [x] 2.1 Harmonizar quality-assurance, impact-aware-validation, admin-demo-application e nextjs-consumption.
- [x] 2.2 Revisar AGENTS.md, openspec/config.yaml, limitações, release e changelog.

## 3. Verificação

- [x] 3.1 Revisar diffs e garantir apenas documentação, sem PNGs ou workflows alterados.
- [x] 3.2 Confirmar checks `Qualidade rápida` e `Política de develop` (OpenSpec estrito) na CI, bem como o workflow Pages.
- [x] 3.3 Executar localmente `npm run validate` e `openspec.cmd validate --all --strict`. Limitações reais: `format`, `lint`, `build`, `typecheck` e OpenSpec estrito passaram; `test:quality` teve 1 falha de caminho Windows em `scripts/ci-impact.test.mjs` (alheia à PR) e o E2E não foi executado localmente (snapshots Linux, validados na CI).
