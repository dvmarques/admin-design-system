## 1. Medição e implementação

- [x] 1.1 Medir largura, altura e posição do rótulo antes da correção em navegador real e registrar em validation.md (hipótese da issue #191).
- [x] 1.2 Sobrepor o indicador e manter o rótulo montado em `AdsButton`; testes unitários de semântica.
- [x] 1.3 Regressão de geometria em Playwright (sm/md/lg, rótulos curtos/longos, temas claro/escuro).

## 2. Documentação e exemplos

- [x] 2.1 Story `LoadingTransition` e alternância no catálogo do demo; regenerar catalog-snippets.json.
- [x] 2.2 Registrar a entrada em CHANGELOG.md.

## 3. Integração

- [x] 3.1 Executar npm run validate e openspec.cmd validate --all --strict; confirmar E2E sem falhas e registrar limitações reais. Snapshots somente pelo workflow Linux, se necessário.
- [x] 3.2 Formatar arquivos alterados com npx.cmd prettier --write e confirmar npm run format.
