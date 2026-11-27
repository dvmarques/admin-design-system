## 1. Implementação

- [x] 1.1 Adicionar prop pública e estilos escopados, mantendo compatibilidade de botões e links.
- [x] 1.2 Reavaliar capacidade ao alterar densidade; preservar foco e estados.

## 2. Testes e documentação

- [x] 2.1 Adicionar testes unitários de padrão, compact, links e estados.
- [x] 2.2 Adicionar comparação Storybook com tabela compacta, documentação de acessibilidade e changelog.
- [ ] 2.3 Validar consumo Next.js em navegador, geometria, responsividade, teclado e temas.

## 3. Validação

- [ ] 3.1 Formatar e executar `npm run format`.
- [ ] 3.2 Executar `npm run validate` e `npm run test:e2e` sem falhas; usar modo verbose para diagnóstico. Atualizar snapshots apenas se intencionais e revisados pelo workflow Linux.
- [ ] 3.3 Executar `openspec.cmd validate --all --strict` (Linux: CLI 1.15.0) e revisar diff e riscos.

## Evidências

- Implementação e testes adicionados; revisão estática realizada. Execução local bloqueada por DNS do GitHub; validação de navegador e CLI ainda pendente na CI.
