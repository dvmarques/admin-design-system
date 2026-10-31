## 1. Preparação

- [x] 1.1 Ler a #265, #268, AGENTS.md e validar o lote 1 integrado na develop.
- [x] 1.2 Criar branch própria baseada na develop e OpenSpec do lote 2.

## 2. Atualização das dependências

- [ ] 2.1 Alinhar Storybook/addon-docs/react-vite em 10.6.5, validar API Docs e stories.
- [ ] 2.2 Alinhar Playwright 1.64.1 em pacote, lockfile, imagens CI/Pages/baselines e verificações de imagem.
- [ ] 2.3 Atualizar axe-core a 4.14.0 e corrigir accessible labels de conta e organização, sem suprimir axe.
- [ ] 2.4 Regenerar lockfile com Node 24/npm 11; conferir `npm ci`, `npm ls`, peers, Node engines.
- [ ] 2.5 Acrescentar changelog 0.1.1 e preservar contratos públicos, CSS e boundaries de pacotes.

## 3. Testes e segurança

- [ ] 3.1 Cobrir nomes acessíveis em testes e confirmar axe 4.14.0 com menu/organização abertos.
- [ ] 3.2 Validar format, lint, build completo, typecheck, Storybook/API/output, test:quality e cobertura.
- [ ] 3.3 Testar E2E Chromium, Firefox, WebKit e Pages; conferir imagens/lockfile e consumo externo npm.
- [ ] 3.4 Comparar npm audit JSON completo e --omit=dev antes/depois, documentar diferenças e risco residual.
- [ ] 3.5 Validar OpenSpec estrito, sem alterações ou snapshots não relacionados.

## 4. Integração

- [ ] 4.1 Abrir PR parcial vinculada à #265; não fechar a issue nem fazer merge.
- [ ] 4.2 Revisar diff, confirmar CI e Pages no SHA final; marcar somente tasks comprovadamente concluídas.
