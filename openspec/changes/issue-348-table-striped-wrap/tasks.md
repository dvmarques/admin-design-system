## 1. Implementação

- [ ] 1.1 Publicar token de listra nos dois temas e verificar contraste e geração.
- [ ] 1.2 Implementar opções em AdsTable com CSS em camada, preservando padrão e hover.
- [ ] 1.3 Integrar AdsSmartTable, incluindo seleção, virtualização e larguras controladas.

## 2. Testes e documentação

- [x] 2.1 Cobrir props, compatibilidade, estilos e estados em testes.
- [x] 2.2 Documentar opções e limitações; adicionar stories de ambas as tabelas e changelog.
- [ ] 2.3 Validar consumo Next.js, responsividade, temas e acessibilidade em navegador.

## 3. Validação

- [ ] 3.1 Formatar arquivos e executar `npm run format`.
- [ ] 3.2 Executar `npm run validate` (incluindo lint, build, tipos, quality e E2E) e confirmar `npm run test:e2e` sem falhas; usar modo verbose para diagnóstico. Atualizar snapshots apenas se intencionais e revisados pelo workflow Linux.
- [ ] 3.3 Executar `openspec.cmd validate --all --strict` (Linux: CLI 1.15.0) e revisar diff e riscos.
