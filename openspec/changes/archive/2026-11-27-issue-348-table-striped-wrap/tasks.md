## 1. Implementação

- [x] 1.1 Publicar token de listra nos dois temas e verificar contraste e geração.
- [x] 1.2 Implementar opções em AdsTable com CSS em camada, preservando padrão e hover.
- [x] 1.3 Integrar AdsSmartTable, incluindo seleção, virtualização e larguras controladas.

## 2. Testes e documentação

- [x] 2.1 Cobrir props, compatibilidade, estilos e estados em testes.
- [x] 2.2 Documentar opções e limitações; adicionar stories de ambas as tabelas e changelog.
- [x] 2.3 Validar consumo Next.js, responsividade, temas e acessibilidade em navegador.

## 3. Validação

- [x] 3.1 Formatar arquivos e executar `npm run format`.
- [x] 3.2 Validar as etapas de `npm run validate` e `npm run test:e2e` sem falhas (execução equivalente na CI); usar modo verbose para diagnóstico quando necessário. Atualizar snapshots apenas se intencionais e revisados pelo workflow Linux.
- [x] 3.3 Executar `openspec.cmd validate --all --strict` (Linux: CLI 1.15.0) e revisar diff e riscos.

## Evidências

- Clone e CLI OpenSpec locais ficaram bloqueados por DNS; a evidência de validação são as etapas equivalentes executadas na CI.
- [CI integral](https://github.com/dvmarques/admin-design-system/actions/runs/45911715336) aprovada: format, lint, builds, typecheck, testes de qualidade e de tokens, matriz E2E (Chromium, Firefox, WebKit), distribuição com consumo Next.js e OpenSpec estrito. A task 3.2 é cumprida por essas etapas; não se afirma execução local dos comandos agregadores.
- Baselines visuais: o [workflow Linux oficial](https://github.com/dvmarques/admin-design-system/actions/runs/45909585588) alterou apenas os snapshots claro e escuro de `/componentes` (contador de tokens de 104 para 105), revisados visualmente.
