## 1. Contenção do fluxo

- [x] 1.1 Corrigir altura, SVG e espaçamentos locais, cobrir dimensões de referência e fallback com E2E nos dois temas.
- [x] 1.2 Atualizar docs/demo-auth-flow.md e CHANGELOG.md, conferindo limites e preservação das APIs públicas; exemplo visual permanece nas rotas do demo, sem novo componente Storybook.

## 2. Integração

- [x] 2.1 Executar npm run validate e openspec.cmd validate --all --strict; registrar limitações reais de plataforma. Confirmar E2E sem falhas antes do commit; snapshots somente pelo workflow Linux se necessário. Diagnóstico: npm run test:e2e:verbose.
- [x] 2.2 Formatar arquivos alterados com npx.cmd prettier --write e confirmar npm run format.
