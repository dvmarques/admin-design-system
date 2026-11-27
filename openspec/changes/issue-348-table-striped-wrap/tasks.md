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

- SHA `a78e73f`: [CI](https://github.com/dvmarques/admin-design-system/actions/runs/45897648077) confirmou format, lint, build, typecheck, testes Node (incluindo contraste), geração e check de tokens, e OpenSpec estrito. A inspeção de pacote falhou por orçamento de JS/CSS; ajuste pontual documentado no design. Validação completa e testes de navegador permanecem pendentes de confirmação no HEAD.
- Clone local e CLI OpenSpec local bloqueados por DNS; os comandos efetivamente executados na CI são a evidência disponível.

- Implementação de ambas as tabelas concluída e revisada estaticamente; testes em navegador permanecem em 2.3 e validação integral em 3.2. A [CI de diagnóstico](https://github.com/dvmarques/admin-design-system/actions/runs/45898273973) confirmou medições de distribuição; os limites afetados foram calibrados sem remover verificações.

- [CI anterior](https://github.com/dvmarques/admin-design-system/actions/runs/45898482866): qualidade, distribuição (incluindo consumo Next.js), Firefox e WebKit aprovados; Chromium falhou apenas no snapshot de `/componentes`, cujo contador de tokens passou de 104 para 105.
- [Workflow oficial Linux](https://github.com/dvmarques/admin-design-system/actions/runs/45909585588) aprovado: 563 testes Chromium na geração e 563 na revalidação sem atualização. Commit `82dcc80` altera exclusivamente os snapshots claro e escuro de `/componentes`; comparação visual antes/depois revisada, com alteração esperada do contador e sem outras diferenças visíveis. A CI integral do novo HEAD permanece pendente; execuções acionadas pelo bot registraram `action_required`.

- [CI integral](https://github.com/dvmarques/admin-design-system/actions/runs/45911715336) aprovada no SHA `222dab2`: format, lint, builds dos seis workspaces, output de docs, peer opcional, typecheck, testes de qualidade e geração de tokens, matriz E2E completa (Chromium 1/2 e 2/2, Firefox, WebKit e gate agregado), distribuição e OpenSpec estrito. Security Gate e GitHub Pages também aprovados. A task 3.2 está cumprida pelas etapas equivalentes executadas na CI; não se afirma execução local dos comandos agregadores.
