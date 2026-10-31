## 1. Preparação

- [x] 1.1 Ler a #265, #268, AGENTS.md e validar o lote 1 integrado na develop.
- [x] 1.2 Criar branch própria baseada na develop e OpenSpec do lote 2.

## 2. Atualização das dependências

- [x] 2.1 Alinhar Storybook/addon-docs/react-vite em 10.6.5, validar API Docs e stories.
- [x] 2.2 Alinhar Playwright 1.64.1 em pacote, lockfile, imagens CI/Pages/baselines e verificações de imagem.
- [x] 2.3 Atualizar axe-core a 4.14.0 e corrigir accessible labels de conta e organização, sem suprimir axe.
- [x] 2.4 Regenerar lockfile com Node 24/npm 11; conferir `npm ci`, `npm ls`, peers, Node engines.
- [x] 2.5 Acrescentar changelog 0.1.1 e preservar contratos públicos, CSS e boundaries de pacotes.

## 3. Testes e segurança

- [ ] 3.1 Cobrir nomes acessíveis em testes e confirmar axe 4.14.0 com menu/organização abertos.
- [ ] 3.2 Validar format, lint, build completo, typecheck, Storybook/API/output, test:quality e cobertura.
- [ ] 3.3 Testar E2E Chromium, Firefox, WebKit e Pages; conferir imagens/lockfile e consumo externo npm.
- [x] 3.4 Comparar npm audit JSON completo e --omit=dev antes/depois, documentar diferenças e risco residual.
- [x] 3.5 Validar OpenSpec estrito, sem alterações ou snapshots não relacionados.

## 4. Integração

- [x] 4.1 Abrir PR parcial vinculada à #265; não fechar a issue nem fazer merge.
- [ ] 4.2 Revisar diff, confirmar CI e Pages no SHA final; marcar somente tasks comprovadamente concluídas.

Evidências parciais do lote 2: [PR #270](https://github.com/dvmarques/admin-design-system/pull/270), [bootstrap de versões e auditoria 41157964299](https://github.com/dvmarques/admin-design-system/actions/runs/41157964299), [relatório permanente](../../../docs/security/issue-265-batch2-audit-2026-10-31.md). A CI e o Pages da PR passaram no SHA `b71617c` (Chromium 455/455, Firefox, WebKit, qualidade, cobertura, distribuição e política OpenSpec), antes da sincronização com a `develop` e dos ajustes de revisão. As tarefas 3.1 a 3.3 e 4.2 permanecem abertas até a confirmação de CI e Pages no SHA final, registrada em comentário da PR.
