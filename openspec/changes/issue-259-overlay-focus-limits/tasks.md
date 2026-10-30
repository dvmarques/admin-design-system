## 1. Reprodução

- [x] 1.1 Testes JSDOM que falham no runtime atual: StrictMode com `open` inicial `true`, grupo de rádio numa ponta (Tab e Shift+Tab) e `tabindex` positivo nas pontas.
- [x] 1.2 Teste real de teclado em Chromium (Playwright) para rádio e `tabindex` positivo.

## 2. Implementação

- [x] 2.1 Foco inicial independente de `previousOpen` em `useOverlayFocus`, sem mudar a API pública.
- [x] 2.2 Ordenar candidatos pela ordem real de tabulação e reduzir grupos de rádio a uma parada por direção.
- [x] 2.3 Regressões: rádio marcado, sem marcado, `name` diferentes, formulários distintos, rádio sem `name`, rádio desabilitado, modais aninhados e popup em portal.

## 3. Documentação e evidências

- [x] 3.1 Atualizar `docs/limitations.md` (remover rádio e `tabindex`; manter `iframe`) e `docs/integration.md` se houver comportamento observável.
- [x] 3.2 Registrar entrada em CHANGELOG `[0.1.1]`.
- [x] 3.3 Medir `components-public` e pacotes; elevar orçamentos somente ao medido com folga mínima e justificar.

## 4. Gates

- [x] 4.1 `npx.cmd prettier --write` nos arquivos alterados e `npm run format`.
- [ ] 4.2 Lint, build, typecheck, `npm run test:quality`, E2E pertinente e `openspec.cmd validate --all --strict`.
- [x] 4.3 Revisão de acessibilidade e de API pública sem bloqueantes.
