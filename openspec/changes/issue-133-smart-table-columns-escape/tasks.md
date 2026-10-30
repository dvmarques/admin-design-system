## 1. Teste de regressão primeiro

- [x] 1.1 Adicionar testes em `packages/admin/tests/smart-table.test.tsx`: Escape do painel não chega a listener de `document`; evento chega marcado como `defaultPrevented`; Escape com painel fechado não é tratado pelo painel. Confirmar que o primeiro falha antes da correção.
      Evidência: o teste novo falhou (`keyDown` retornava `true`) antes da correção e passa depois; 40/40 em `smart-table.test.tsx`.

## 2. Implementação

- [x] 2.1 Em `closeColumns` (`packages/admin/src/smart-table.tsx`), chamar `event.preventDefault()` além de `stopPropagation()`, sem mudar API pública, exports ou `@admin-ds/components`.

## 3. Documentação e registro

- [x] 3.1 Atualizar o `CHANGELOG.md` (`[0.1.1] - Em andamento`, `Changed`) com a decisão e a change; registrar que não há delta em Storybook/demo.

## 4. Validação

- [ ] 4.1 Executar `npx prettier --write` nos arquivos alterados e `npm run format`, `npm run lint`, `npm run typecheck`, `npm run build` e os testes do `@admin-ds/admin`; registrar o que não puder ser executado.
- [ ] 4.2 Validar com `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` e `npm run test:e2e`/CI, registrando evidência e jobs pulados.
