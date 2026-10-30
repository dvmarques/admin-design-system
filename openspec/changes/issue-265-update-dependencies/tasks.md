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

- [ ] 4.1 Registrar auditoria npm JSON do lockfile original e do lockfile final (Node/npm, data, comandos e resultado, incluindo produção vs desenvolvimento).
- [ ] 4.2 Documentar advisory, severidade, cadeia e exposição dos achados altos/críticos; separar bibliotecas, demo, Storybook e tooling.
- [ ] 4.3 Corrigir achados high/critical com solução compatível; registrar risco residual, mitigação, responsável e acompanhamento dos não corrigíveis.
- [ ] 4.4 Preservar responsabilidades das issues #267 (gate recorrente) e #268 (hardening workflows e imagens Playwright).
- [ ] 4.5 Reexecutar validação apropriada após qualquer ajuste de segurança; registrar evidência no relatório e na PR.

## 5. Revisão e integração

- [x] 5.1 Abrir PR vinculada à #265 com versões antes/depois, evidências, riscos e limitações.
- [ ] 5.2 Confirmar CI no SHA final e revisão antes de considerar merge (não autorizado nesta tarefa).
