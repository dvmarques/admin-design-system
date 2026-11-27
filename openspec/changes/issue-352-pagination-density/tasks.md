## 1. Implementação

- [x] 1.1 Adicionar prop pública e estilos escopados, mantendo compatibilidade de botões e links.
- [x] 1.2 Reavaliar capacidade ao alterar densidade; preservar foco e estados.

## 2. Testes e documentação

- [x] 2.1 Adicionar testes unitários de padrão, compact, links e estados.
- [x] 2.2 Adicionar comparação Storybook com tabela compacta, documentação de acessibilidade e changelog.
- [x] 2.3 Validar consumo Next.js em navegador, geometria, responsividade, teclado e temas.

## 3. Validação

- [x] 3.1 Formatar e executar `npm run format`.
- [ ] 3.2 Executar `npm run validate` e `npm run test:e2e` sem falhas; usar modo verbose para diagnóstico. Atualizar snapshots apenas se intencionais e revisados pelo workflow Linux.
- [x] 3.3 Executar `openspec.cmd validate --all --strict` (Linux: CLI 1.15.0) e revisar diff e riscos.

## Evidências

- Implementação e testes adicionados; revisão estática realizada. Execução local bloqueada por DNS do GitHub; validação de navegador e CLI executada pela CI, conforme evidências abaixo.

- [CI 46010344478](https://github.com/dvmarques/admin-design-system/actions/runs/46010344478), SHA `b1c576a`: matriz E2E completa (Chromium 1/2 e 2/2, Firefox, WebKit) e política develop/OpenSpec estrito aprovadas. Security Gate e Pages também aprovados. Formatação e distribuição ainda falharam; corrigidas no próximo commit, aguardando confirmação.

- [CI 46011315678](https://github.com/dvmarques/admin-design-system/actions/runs/46011315678), SHA `45805c2`: format, lint, typecheck, builds das bibliotecas e OpenSpec estrito aprovados. A cobertura Node e a inspeção de pacotes identificaram limite CSS de cenário; ajuste restrito aos cenários que consomem o CSS de components. Validação integral ainda pendente.
