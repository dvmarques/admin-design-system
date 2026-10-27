# Tasks

## 1. Licença e documentação

- [x] 1.1 Adicionar LICENSE.md com texto MIT integral e copyright correto; conferir com a fonte e preservar avisos de terceiros.
- [x] 1.2 Declarar MIT nos sete manifests e nas entradas locais do lockfile; verificar consistência sem alterações de dependências.
- [x] 1.3 Atualizar README, docs/licensing.md e CHANGELOG; revisar links e delimitação de materiais externos.

## 2. Verificação integrada

- [x] 2.1 Obter revisão independente do diff e dos contratos dos pacotes; registrar achados e correções.
- [x] 2.2 Executar npm run validate, incluindo E2E antes do commit, e openspec.cmd validate --all --strict; registrar evidências reais e limitações. Não atualizar snapshots sem mudança visual intencional.
- [x] 2.3 Formatar arquivos alterados com npx.cmd prettier --write e confirmar npm run format após atualizar evidências.

Diagnóstico: npm run test:verbose e npm run test:e2e:verbose. Acessibilidade, temas, exemplos e CSS não recebem alterações; os gates de integração verificam os consumidores existentes.
