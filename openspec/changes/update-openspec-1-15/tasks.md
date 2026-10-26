# Tarefas

## 1. Atualização

- [x] 1.1 Regenerar as skills das três ferramentas com OpenSpec 1.15.0 e revisar o diff.
- [x] 1.2 Alinhar ambas as validações da CI, guia e changelog com 1.15.0.

## 2. Verificação

- [x] 2.1 Confirmar versão, ausência de mudanças pendentes no dry-run, sincronia das skills próprias e `openspec.cmd validate --all --strict`.
- [x] 2.2 Formatar arquivos alterados com `npx.cmd prettier --write` e executar `npm run format`.
- [x] 2.3 Executar lint, build, tipos, test:quality e test:e2e localmente e registrar resultados e impedimentos: E2E Windows limitado por nove baselines ausentes, conforme `validation.md`.
- [x] 2.4 Confirmar CI Linux no SHA da PR, incluindo E2E e snapshots existentes; nenhum snapshot deve ser atualizado.

## 3. Configurações compartilhadas

- [x] 3.1 Adicionar `.editorconfig` alinhado ao Prettier e exclusões genéricas no `.gitignore`, sem substituir `.gitattributes`.
- [x] 3.2 Verificar configurações resolvidas, regras de ignore, formatação e validação estrita OpenSpec.
