# Tasks — issue #145

## Especificação

- [x] Conferir issue e padrões do projeto e registrar proposta, design e cenários OpenSpec
- [x] Revisar OpenSpec e executar `openspec.cmd validate --all --strict`

## Biblioteca

- [x] Implementar `AdsAlert` e tipos/export público, sem dependências novas
- [x] Implementar semântica e fechamento controlado/não controlado
- [x] Cobrir temas, responsividade e CSS compilado (build e E2E aprovados)
- [x] Validar o comportamento em `forced-colors` (CSS distribuído e E2E com emulação ativa; severidade distinguida por estilo de borda)

## Consumidores

- [x] Incluir story executável no Storybook
- [x] Criar exemplos navegáveis/interativos no Admin Demo (variantes, ações, formulário e operação)
- [x] Atualizar documentação de integração e CHANGELOG 0.1.1

## Validação

- [x] Testar comportamento, semântica ARIA e acessibilidade automatizada (Vitest/axe e Playwright/axe)
- [x] Validar navegação por teclado do botão fechar (E2E: foco + Enter) e botão sem submissão de formulário
- [ ] Validação manual com leitor de tela (não executável neste ambiente)
- [x] Executar format, lint, build, typecheck, test:quality, E2E Chromium/Firefox/WebKit e OpenSpec strict (CI #40709162220)
- [ ] Executar `npm run validate` como comando agregado, se exigido adicionalmente
- [x] Revisar diff e CI no SHA final, corrigindo falhas e mantendo evidências

## Evidências

- CI aprovado no SHA `324e042045a897e0846b919e2a108c829b0dc194`: https://github.com/dvmarques/admin-design-system/actions/runs/40709162220
- Storybook: `apps/docs/src/alert.stories.tsx`; demonstração: `/catalogo/alert`.
- Testes: `packages/components/tests/alert.test.tsx` e `e2e/alert.spec.ts`.
- A evidência de CI acima refere-se ao SHA anterior aos commits de revisão; confirmar a CI no SHA final antes do merge.
- Validações manuais e comando agregado foram mantidos pendentes, pois não há evidência direta de execução.
