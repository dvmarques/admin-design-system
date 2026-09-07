## 1. Alinhamento de metadados

- [x] 1.1 Atualizar todos os manifests de workspace e as dependências internas das aplicações para `0.0.1` e verificar que não restam declarações internas em `0.0.0`.
- [x] 1.2 Regenerar `package-lock.json` sem atualizar dependências externas e verificar que os metadados dos workspaces refletem `0.0.1`.

## 2. Validação

- [x] 2.1 Executar a verificação de formatação e a validação estrita do OpenSpec, confirmando que os artefatos e os manifests permanecem consistentes.
- [ ] 2.2 Executar `npm run typecheck`, `npm run build` e `npm run test:e2e`, confirmando que nenhum teste E2E falha; não atualizar snapshots, pois não há alteração visual.
