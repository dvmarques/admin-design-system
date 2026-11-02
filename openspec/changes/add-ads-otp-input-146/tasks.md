# Tasks — AdsOTPInput (#146)

## Planejamento e API

- [x] Ler issue, contratos dos inputs, catálogos e políticas; definir perfil Critical e API.
- [x] Criar proposta, design, especificação e tarefas OpenSpec; revisar cenários de compatibilidade e acessibilidade.

## Biblioteca

- [x] Implementar AdsOTPInput com código numérico, 4/6+ dígitos, colagem/autofill e navegação nativa.
- [x] Implementar valores controlado/não controlado, callbacks e tratamento de mutações externas/completude.
- [x] Integrar AdsField, estados, ref e classes de tema; export público e compilação CSS validados no CI.

## Demonstração e documentação

- [x] Adicionar página navegável no catálogo do Admin Demo com estados funcionais.
- [x] Adicionar stories Storybook com uso básico, interações, controles e estados.
- [x] Atualizar guia do componente e CHANGELOG da versão em andamento.

## Verificação

- [x] Adicionar e executar testes unitários, interação, formulário e acessibilidade (incluindo regressões).
- [ ] Adicionar e executar E2E no Admin Demo com verificação de teclado, responsividade e temas.
- [x] Executar build, typecheck, lint, testes de qualidade, consumo Next.js e avaliação de CSS distribuído.
- [ ] Executar `npm run test:e2e` completo sem falhas no ambiente de validação.
- [x] Revisar código, formatar arquivos alterados e executar `npm run format`.
- [x] Executar `openspec validate --all --strict` (job Política de develop); registrar evidência real.
- [ ] Executar `npm run validate` completo no ambiente de validação.

## Evidências verificadas em 2026-11-02

- PR #299: https://github.com/dvmarques/admin-design-system/pull/299. O SHA funcional `6b5f4723` passou em Qualidade rápida (Prettier, lint, builds, typecheck, testes Node, Vitest com cobertura), Artefatos de distribuição (incluindo CSS dentro do orçamento) e Política de develop (OpenSpec estrito): https://github.com/dvmarques/admin-design-system/actions/runs/41517727084.
- No mesmo SHA, os testes Playwright de Firefox, WebKit e Chromium shard 1/2 passaram. O shard Chromium 2/2 encontrou um seletor estrito ambíguo no teste OTP (`getByText` correspondia também ao snippet); o seletor foi corrigido na sequência, e o rerun precisa ser confirmado.
- Security Gate (CodeQL, Gitleaks, npm audit) aprovado: https://github.com/dvmarques/admin-design-system/actions/runs/41517727077.
- GitHub Pages com build aprovado e publicação ignorada para PR (comportamento esperado): https://github.com/dvmarques/admin-design-system/actions/runs/41517727031.
- Os testes foram executados no GitHub Actions, **não localmente**. A execução literal de `npm run validate` e a aprovação da matriz Playwright após o ajuste de seletor continuam pendentes de evidência; não marcar antes disso.
