## 1. Preparação

- [x] 1.1 Conferir baseline do lockfile e manifests na branch develop e vínculo com a issue #265.
- [x] 1.2 Definir lote inicial, estratégia de compatibilidade e manter Node >=24.0.0 sem teto.
- [x] 1.3 Validar a change com o OpenSpec 1.15.0.

## 2. Atualização

- [x] 2.1 Aplicar versões do lote 1 em todos os manifests atingidos.
- [x] 2.2 Regenerar package-lock.json via npm 11.19.1 em Node 24, sem lockfile manual.
- [x] 2.3 Verificar npm ci, npm ls e peers; anotar conflitos reais.
- [x] 2.4 Registrar mudança na seção [0.1.1] - Em andamento do CHANGELOG.

## 3. Verificações

- [x] 3.1 Executar format, lint e typecheck.
- [x] 3.2 Executar build completo, incluindo Storybook e Next Demo; checar distribuição/exports.
- [x] 3.3 Executar test:quality, cobertura e validações da distribuição.
- [x] 3.4 Executar E2E principal e Pages em Chromium, Firefox e WebKit na CI; não atualizar snapshots sem revisão.
- [x] 3.5 Rodar npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive.

## 4. Segurança pontual — complemento de 30/10/2026

- [x] 4.1 Registrar auditoria npm JSON do lockfile original e do lockfile final (Node/npm, data, comandos e resultado, incluindo produção vs desenvolvimento).
- [x] 4.2 Documentar advisory, severidade, cadeia e exposição dos achados altos/críticos; separar bibliotecas, demo, Storybook e tooling.
- [x] 4.3 Corrigir achados high/critical com solução compatível; registrar risco residual, mitigação, responsável e acompanhamento dos não corrigíveis.
- [x] 4.4 Preservar responsabilidades das issues #267 (gate recorrente) e #268 (hardening workflows e imagens Playwright).
- [x] 4.5 Reexecutar validação apropriada após qualquer ajuste de segurança; registrar evidência no relatório e na PR.

## 5. Sincronização com a develop e revisão de segurança

- [x] 5.1 Integrar a develop no histórico existente por merge, preservando a mudança #194 dos workspaces públicos `@dvmarques/admin-ds-*` e os commits anteriores.
- [x] 5.2 Regenerar o lockfile com npm 11.19.1 em Node 24 e validar `npm ci`/`npm ls` no grafo combinado.
- [x] 5.3 Reauditar baseline original, develop atual e branch mesclada (completo e `--omit=dev`); comparar evidências e documentar advisories moderados herdados.
- [x] 5.4 Registrar decisões sobre riscos de `glob`/`minimatch`, sem `npm audit fix --force`, preservando as responsabilidades #267/#268.
- [x] 5.5 Confirmar a CI oficial no SHA final depois da atualização de documentação; não concluir sem evidência de qualidade, E2E e Pages.

## 6. Revisão e integração

- [x] 6.1 Abrir PR vinculada à #265 com versões antes/depois, evidências, riscos e limitações.
- [x] 6.2 Confirmar CI no SHA final após os ajustes da revisão antes de considerar merge (não autorizado nesta tarefa).

Evidência da auditoria: registrada na issue #265 e no artefato da execução Actions 41145513851. A auditoria histórica de 30/10 retornou zero advisories. A reauditoria de 31/10 (Actions 41151568595) identificou 14 avisos moderados idênticos no baseline original, na develop e na branch sincronizada, 0 em produção e nenhum high/critical. Não foram aplicados downgrades ou correções incompatíveis. Ver o registro na issue #265.

Validação final do lote 1 (código e lockfile): commit `43387fceb6009480068877ed50737f8d64b22009`. [CI 41152064432](https://github.com/dvmarques/admin-design-system/actions/runs/41152064432) aprovada — qualidade, cobertura Vitest, distribuição, política OpenSpec, E2E Chromium/Firefox/WebKit — e [Pages 41152064512](https://github.com/dvmarques/admin-design-system/actions/runs/41152064512) aprovado. A atualização deste checklist é documental e posterior à execução; verificar os checks do novo SHA separadamente. Os commits posteriores a `43387fc` alteram apenas documentação e metadados; a CI do SHA `54fdc08535d48c347ca92f3987224657dc735fe4` foi aprovada e registrada em comentário da PR #266 (tarefas 5.5 e 6.2). A PR não fecha a issue #265. Esta conclusão refere-se somente ao lote 1 da issue #265; não autoriza merge nem encerra os lotes seguintes.
