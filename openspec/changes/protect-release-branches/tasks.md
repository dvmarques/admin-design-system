## 1. Documentação do processo

- [x] 1.1 Em `docs/release-process.md`, substituir a exigência de auto-delete desabilitado (seção "Metadados e estratégia de merge") pela proteção de `release/*` por ruleset, mantendo o auto-delete permitido para as demais branches. Concluída quando o texto não pedir mais a opção desabilitada.
- [x] 1.2 Descrever o ruleset esperado (alvo `release/*`, só "Restrict deletions", bypass mínimo) e a remoção manual da branch após back-merge e publicação, na seção de recuperação e no fechamento do documento. Concluída quando a remoção pós-publicação indicar quem pode fazê-la.
- [x] 1.3 Registrar a verificação na primeira release após a mudança e o plano de reversão. Concluída quando o documento disser como reverter se o auto-delete apagar a branch.

## 2. Spec

- [x] 2.1 Confirmar o delta `ADDED` em `specs/release-process/spec.md` contra o texto final de `docs/release-process.md`. Concluída quando requisito e documento não se contradisserem.

## 3. Validação

- [x] 3.1 Rodar `npx --yes @fission-ai/openspec@1.10.0 validate --all --strict` e `npm run test:release`. Concluída quando ambos passarem.
- [x] 3.2 Rodar `npx prettier --write` nos arquivos alterados e `npm run format`. Concluída quando `npm run format` passar.
- [x] 3.3 Rodar `npm run lint` e `npm run typecheck`. Concluída quando ambos passarem; sem código alterado, não se espera impacto.
- [x] 3.4 Rodar `npm run build` e `npm run test:e2e` e confirmar que nenhum E2E falha. Sem mudança de código nem de CSS, não há snapshots a atualizar. Validado no ambiente cloud com o Chromium da imagem e `--ignore-snapshots` (108 passaram); as comparações visuais, que só têm baseline win32, ficam para a CI.

## 4. Fora do repositório (manual, de quem administra o GitHub)

- [x] 4.1 Criar o ruleset de branch para `release/*` com "Restrict deletions" em Settings > Rules > Rulesets, e manter "Automatically delete head branches" habilitado. Criado em 2026-10-16: ruleset `Proteção de branches de release` (id 25274806), ativo, alvo `refs/heads/release/*`, sem bypass, só `deletion`.
- [ ] 4.2 Na próxima release, conferir que `release/X.Y.Z` sobrevive ao merge da PR para `master` e ao back-merge. Se for apagada, reverter para o auto-delete desabilitado e registrar na change.
