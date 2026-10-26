# Tasks

## 1. Planejamento e especificação

- [x] 1.1 Revisar demo, assets de marca, componentes (`AdsPasswordInput`) e navegação; registrar decisões no design.
- [x] 1.2 Validar a change com `npx @fission-ai/openspec@1.10.0 validate feat-212-demo-auth-flow --strict`.

## 2. Composição e rotas

- [x] 2.1 Implementar layout de autenticação compartilhado (chrome, painel SVG, estilos `demo-auth-*`).
- [x] 2.2 Implementar `/login` com validação e login simulado.
- [x] 2.3 Implementar `/esqueci-senha` com confirmação simulada.
- [x] 2.4 Implementar `/redefinir-senha` com regras, força e sucesso simulado.
- [x] 2.5 Adicionar link **Login (exemplo)** na navegação do demo.

## 3. Testes e documentação

- [x] 3.1 Testes Vitest (validação, navegação, contrato).
- [x] 3.2 Testes Playwright E2E do fluxo completo, temas, responsividade, histórico e ausência de credenciais persistidas.
- [x] 3.3 Atualizar `CHANGELOG.md` e marcar checkboxes da issue #212 conforme entregue.
- [x] 3.4 Documentar rotas, fluxo simulado, limitações, componentes Ads* e testes em `docs/demo-auth-flow.md`, com link no `README.md`.

## 4. Validação final

- [x] 4.1 `npm run format`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:quiet`.
- [x] 4.2 `npx @fission-ai/openspec@1.10.0 validate --all --strict --no-interactive`.
- [x] 4.3 `CI=1 npm run test:e2e` (fluxo de auth e regressão).
