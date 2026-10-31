## 1. Planejamento

- [x] 1.1 Conferir #191, #192, #193, #194, #198, #267, #268, manifests e o workflow existente; preservar aprovação humana e publicação direta.
- [x] 1.2 Criar branch própria e change OpenSpec antes da implementação.
- [x] 1.3 Validar a change com OpenSpec estrito e reconciliar qualquer regra divergente.

## 2. Implementação

- [x] 2.1 Persistir os mesmos quatro tarballs do smoke externo, validar inventário, manifests e hashes.
- [x] 2.2 Implementar registro npm, pré-verificação de identidade, publicação OIDC, reconsulta e recuperação idempotente.
- [x] 2.3 Separar jobs: preflight/empacotamento (read-only), publicação npm (id-token), tag/release (contents write).
- [x] 2.4 Atualizar contrato OpenSpec e CHANGELOG; documentar npm Trusted Publisher, bootstrap e recuperação.

## 2.1 Consolidação editorial de release

- [x] 2.5 Adicionar comando de prévia editorial sem escritas (grupos por issue, duplicidades e textos longos).
- [x] 2.6 Exigir confirmação humana vinculada ao hash do changelog corrente, com invalidação após edições e validação no preparo e CI da release.
- [x] 2.7 Excluir marca de revisão das GitHub Release Notes e preservar seções fechadas inalteradas; cobrir em testes.
- [x] 2.8 Atualizar documentação e processo de PR de release com passos de revisão e aprovação.

## 3. Testes e entrega

- [x] 3.1 Cobrir pacote privado/ausente, versão divergente, hash divergente, OIDC, dependência indisponível, publicação parcial e reexecução.
- [x] 3.2 Conferir CI Ready no SHA final: formatação, lint, build, types, testes, cobertura, E2E Chromium/Firefox/WebKit, distribuição, segurança e OpenSpec estrito (Node/npm fixados); registrar as evidências e os checks skipped.
- [x] 3.2a Validar o conjunto equivalente a `npm run validate` com Node 24.22.2/npm 11.19.1: format, lint, build, typecheck e test:quality passaram localmente; o E2E foi comprovado pela CI no SHA `422b30a` (Chromium, Firefox e WebKit). O E2E local não foi executado por bloqueio de rede do ambiente (download do Chromium 1248 negado); o comando agregado não rodou como invocação única.
- [x] 3.3 Abrir PR #281 Ready em `develop`, revisar controles de segurança e acompanhar CI/Security Gate até sucesso no SHA final.
- [x] 3.3a Revisão humana informada pelo mantenedor em 31/10/2026; nenhuma aprovação formal de review via GitHub foi registrada.
- [x] 3.3b Checks do commit `422b30a` da PR concluídos com sucesso (CI, Security Gate, Pages; `Publicar` e `Validação de release` skipped por não ser PR de release) e merge em `develop` por squash autorizado pelo mantenedor, sem fechar a issue #195. A CI do SHA final, após o archive, é reconferida antes do merge.

## Trabalho operacional posterior (issue #195)

A antiga task 3.4 foi retirada deste checklist por depender da **primeira release real**, que ocorrerá somente após integração e autorização próprias. Permanece aberta na [issue #195](https://github.com/dvmarques/admin-design-system/issues/195), incluindo configurar e validar Trusted Publishers, publicar os quatro pacotes, confirmar provenance e instalação externa no Next.js, e atualizar os avisos pré-publicação **somente após a confirmação no registry**. A remoção do checklist não significa que essas ações foram concluídas.

## Não executado nesta change

- Nenhum `npm publish`, tag, GitHub Release ou seleção de versão inicial.

## Evidências de validação (31/10/2026)

- PR [#281](https://github.com/dvmarques/admin-design-system/pull/281) em `develop`, commit `d75480e3186554887a5bb862e66d8b840f1626d5` (aberta, não integrada).
- [CI #41244167665](https://github.com/dvmarques/admin-design-system/actions/runs/41244167665): sucesso, incluindo OpenSpec estrito, Node, testes, E2E Chromium/Firefox/WebKit e artefatos. `Validação de release` skipped porque esta PR não é `release/X.Y.Z -> master`.
- [Security Gate #41244167645](https://github.com/dvmarques/admin-design-system/actions/runs/41244167645): sucesso (CodeQL, npm audit, Gitleaks).
- [Pages #41244167679](https://github.com/dvmarques/admin-design-system/actions/runs/41244167679): sucesso.
- Nenhum `npm publish`, release/tag ou teste de registry executado; `npm run validate` não foi chamado como comando integrado nesta sessão.

- Em 31/10/2026, o mantenedor confirmou a revisão; o commit mais recente da PR passou a ser `d0e598484852b6b2e76cb6d4d00409c4a47c18bd` (`fix(release): retry do smoke no registry e changelog da #195 mais curto`). Nova CI/Security Gate/Pages desse SHA ainda estavam em andamento na consulta; não confundir com os checks verdes do SHA anterior.
