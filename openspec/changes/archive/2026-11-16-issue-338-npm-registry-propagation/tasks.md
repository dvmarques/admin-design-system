# Tasks

## 1. Planejamento e riscos

- [x] 1.1 Analisar issue, normas do repositório, spec atual e fluxo release; definir perfil Critical, riscos, alternativas e rollback.
- [x] 1.2 Planejar deadline, tentativas, backoff e limite do job sem alterar os controles de supply chain.

## 2. Implementação

- [x] 2.1 Implementar confirmação temporalmente limitada com backoff, timeout HTTP pelo saldo e diagnóstico explícito.
- [x] 2.2 Limitar o job npm sem alterar OIDC, provenance, permissões ou concorrência.
- [x] 2.3 Testar propagação após >30 s, esgotamento da janela, integridade divergente e idempotência sem sleeps reais.
- [x] 2.4 Atualizar procedimento de release e spec, avaliando inclusão no changelog pela política editorial.
- [x] 2.5 Revisar código, testes, diffs, compatibilidade e riscos.

## 3. Verificação

- [x] 3.1 Formatar o código e confirmar `npm run format`, lint, build dos pacotes e typecheck na [CI #43982732237](https://github.com/dvmarques/admin-design-system/actions/runs/43982732237).
- [x] 3.2 Confirmar `npm run test:release` e os testes de qualidade equivalentes na CI (testes Node, geração, testes de CI e cobertura Vitest); a CI executa etapas separadas, não o comando agregado `npm run test:quality`.
- [x] 3.3 Confirmar os testes E2E do Playwright na CI: Firefox, WebKit, Chromium 1/2 e 2/2 e job agregador, todos com sucesso.
- [x] 3.4 Confirmar OpenSpec strict (`npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`) no job de política de develop, além de [CI](https://github.com/dvmarques/admin-design-system/actions/runs/43982732237), [Security](https://github.com/dvmarques/admin-design-system/actions/runs/43982732201) e [Pages](https://github.com/dvmarques/admin-design-system/actions/runs/43982732180) verdes no SHA `6bc3d72e90e08a3f6d7426d57070b7166e0961f1`.

## 4. Revisão da PR #341 — resiliência de leituras (P2)

- [x] 4.1 Reutilizar o polling na confirmação inicial e na verificação final read-only, com limites de 60 s/12 leituras na fase final.
- [x] 4.2 Tratar timeouts, falhas transitórias de rede, HTTP 429/5xx sem retry de erros permanentes ou divergência de integridade.
- [x] 4.3 Cobrir testes determinísticos de 200→404→200, falhas transitórias recuperadas, erros fatais, exaustão, limites e idempotência.
- [x] 4.4 Atualizar OpenSpec, documentação, revisar diff e manter invariantes de OIDC, provenance e fila.
- [x] 4.5 Confirmar testes de release, format, lint, build, typecheck, quality, E2E e OpenSpec estrito na [CI #43986721379](https://github.com/dvmarques/admin-design-system/actions/runs/43986721379) verde no SHA de implementação `37901dfd09d2854c2d5cc314daff701d740e4bae`; os comandos agregados locais não foram executados literalmente.
- [x] 4.6 Confirmar [Security #43986721348](https://github.com/dvmarques/admin-design-system/actions/runs/43986721348) e [Pages #43986721360](https://github.com/dvmarques/admin-design-system/actions/runs/43986721360) verdes no SHA de implementação, revisar findings e atualizar a [PR #341](https://github.com/dvmarques/admin-design-system/pull/341) sem merge/archive/publicação.
