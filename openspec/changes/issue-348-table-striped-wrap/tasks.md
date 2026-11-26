## 1. Implementação

- [x] 1.1 Publicar token de listra nos dois temas e verificar contraste e geração.
- [ ] 1.2 Implementar opções em AdsTable com CSS em camada, preservando padrão e hover.
- [ ] 1.3 Integrar AdsSmartTable, incluindo seleção, virtualização e larguras controladas.

## 2. Testes e documentação

- [x] 2.1 Cobrir props, compatibilidade, estilos e estados em testes.
- [x] 2.2 Documentar opções e limitações; adicionar stories de ambas as tabelas e changelog.
- [ ] 2.3 Validar consumo Next.js, responsividade, temas e acessibilidade em navegador.

## 3. Validação

- [x] 3.1 Formatar arquivos e executar `npm run format`.
- [ ] 3.2 Executar `npm run validate` (incluindo lint, build, tipos, quality e E2E) e confirmar `npm run test:e2e` sem falhas; usar modo verbose para diagnóstico. Atualizar snapshots apenas se intencionais e revisados pelo workflow Linux.
- [x] 3.3 Executar `openspec.cmd validate --all --strict` (Linux: CLI 1.15.0) e revisar diff e riscos.

## Evidências

- SHA `a78e73f`: [CI](https://github.com/dvmarques/admin-design-system/actions/runs/45897648077) confirmou format, lint, build, typecheck, testes Node (incluindo contraste), geração e check de tokens, e OpenSpec estrito. A inspeção de pacote falhou por orçamento de JS/CSS; ajuste pontual documentado no design. Validação completa e testes de navegador permanecem pendentes de confirmação no HEAD.
- Clone local e CLI OpenSpec local bloqueados por DNS; os comandos efetivamente executados na CI são a evidência disponível.
