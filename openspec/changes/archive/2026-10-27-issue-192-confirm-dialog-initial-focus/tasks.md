## 1. Testes e implementação

- [x] 1.1 Testes de foco inicial de `AdsConfirmDialog`: composição padrão, primeiro controle elegível e controles desabilitados, ocultos e inertes (os quatro últimos falhavam antes da correção).
- [x] 1.2 Filtro de elegibilidade no foco inicial de `useOverlayFocus`, sem nova prop.

## 2. Documentação e exemplos

- [x] 2.1 Spec, `docs/integration.md` e comentário público com a mesma regra e a exceção.
- [x] 2.2 Story `ConfirmWithInteractiveContent` e `ConfirmDialogDemo` do catálogo com conteúdo interativo; regenerar catalog-snippets.json.
- [x] 2.3 Registrar a entrada em CHANGELOG.md.

## 3. Integração

- [x] 3.1 Executar validações e openspec validate --all --strict e registrar limitações reais (E2E pendente para a CI; ver validation.md).
- [x] 3.2 Formatar arquivos alterados com npx.cmd prettier --write e confirmar npm run format.
