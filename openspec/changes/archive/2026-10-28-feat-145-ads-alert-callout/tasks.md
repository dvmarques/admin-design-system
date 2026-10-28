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
- [x] Preservar o foco do teclado ao fechar (`returnFocusRef` ou vizinho focável), com testes
- [x] Validação manual com leitor de tela realizada pelo responsável (dvmarques) em 28/10/2026; leitor e navegador não informados
- [x] Confirmar format, lint, build, typecheck, test:quality, E2E Chromium/Firefox/WebKit e OpenSpec strict na CI do SHA final (`aa90ab6`, run 40717933611, todos os jobs obrigatórios verdes)
- [x] Validação agregada: a sequência equivalente de `npm run validate` foi executada pela CI no SHA final (o comando único não foi rodado localmente: Firefox/WebKit indisponíveis neste ambiente)
- [x] Revisar diff e CI no SHA final, corrigindo falhas e mantendo evidências

## Evidências

- CI aprovado no SHA `324e042045a897e0846b919e2a108c829b0dc194`: https://github.com/dvmarques/admin-design-system/actions/runs/40709162220
- Storybook: `apps/docs/src/alert.stories.tsx`; demonstração: `/catalogo/alert`.
- Testes: `packages/components/tests/alert.test.tsx` e `e2e/alert.spec.ts`.
- CI aprovada no SHA `aa90ab69ca14ecf9ccf57e65d4445f56c36d61e4`: https://github.com/dvmarques/admin-design-system/actions/runs/40717933611
- OpenSpec `validate --all --strict` (1.15.0): 59 itens aprovados localmente antes do archive.
