## 1. Análise e planejamento

- [x] 1.1 Conferir issue #312, #303, regras do repositório, perfil Critical e quatro workflows aplicáveis.
- [x] 1.2 Verificar versão 1.65.1 e digest de índice OCI no registro oficial Microsoft.
- [x] 1.3 Revisar artefatos OpenSpec e validar a change em modo estrito (CI #43789963408, job Política de develop).

## 2. Atualização coordenada

- [x] 2.1 Fixar versões e hashes íntegros em `package.json` e `package-lock.json`.
- [x] 2.2 Atualizar digest e tag nos quatro workflows, incluindo `visual-audit.yml`.
- [x] 2.3 Alinhar checks de versão e supply chain, preservando o fail-fast.
- [x] 2.4 Documentar versão, proveniência do digest e procedimento seguro de snapshots.
- [x] 2.5 Avaliar CHANGELOG e registrar motivo para não adicionar nota de consumidor.

## 3. Testes, revisão e entrega

- [x] 3.1 Validar supply chain e todas as etapas equivalentes a `npm run validate` pela CI, além de OpenSpec `--all --strict`; comando único local não executado (CI #43789963408 e Pages #43789963471).
- [x] 3.2 Confirmar E2E Chromium (2 shards), Firefox e WebKit na CI e E2E Pages no SHA de implementação `6d66fc08` (CI #43789963408 e Pages #43789963471).
- [x] 3.3 Conferir resultados dos snapshots: Chromium passou sem diferenças; nenhuma atualização de baseline ou tolerância necessária.
- [x] 3.4 Validar formatação dos arquivos alterados com `npm run format` aprovado no job Qualidade rápida (CI #43789963408).
- [x] 3.5 Revisar diff, abrir PR #331 contra `develop`, verificar CI/Pages/Security verdes no SHA de implementação; sem falhas a corrigir.

Não incluir archive, merge ou fechamento administrativo como tarefas.

## Evidências e limite da validação

- Implementação no commit `6d66fc08fd3d3e6a5db70f051ca04fd9185a70a8`:
  [CI](https://github.com/dvmarques/admin-design-system/actions/runs/43789963408),
  [Pages](https://github.com/dvmarques/admin-design-system/actions/runs/43789963471) e
  [Security](https://github.com/dvmarques/admin-design-system/actions/runs/43789963463), todos com conclusão `success`.
- O workflow não invoca literalmente `npm run validate` como comando único. Sua cobertura foi comprovada nos jobs: `format`, `lint`, builds completos, `test:output`, `verify:optional-peer`, `typecheck`, testes Node/Vitest/release/CI, geração/checagens e E2E Chromium/Firefox/WebKit; Pages validou o site com `test:e2e:pages`.
- OpenSpec `@fission-ai/openspec@1.15.0 validate --all --strict` executado no job Política de develop.
- Snapshots de Chromium passaram com os baselines existentes; não houve alteração visual aceita automaticamente.
- A atualização deste arquivo cria um novo SHA da PR, cujo check de CI deve ser novamente confirmado. A change permanece ativa, sem archive; PR sem merge e issue aberta aguardando revisão humana.
