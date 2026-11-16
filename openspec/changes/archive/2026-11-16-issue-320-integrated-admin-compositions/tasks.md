# Tarefas verificáveis — #320

- [x] 1. Ler issue #320, épico #315, entregas #316–#319 e padrões/rotas em develop; identificar reuso e lacunas.
- [x] 2. Criar branch a partir de develop e change OpenSpec Critical com proposal/design/spec/tasks; revisar contratos e limites antes de implementar.
- [x] 3. Acrescentar índice integrado na Demo, links de navegação e rastreabilidade no catálogo/Storybook.
- [x] 4. Completar estados e ações de consulta, paginação e formulário desabilitado, sem novas APIs nem serviços.
- [x] 5. Criar testes de integração Playwright/axe para cenários, teclado, foco, temas, larguras e SSR/hidratação; revisar regressões e snapshots.
- [x] 6. Documentar matriz de cenários, escolhas de uso, CSS/exports públicos, bundle com SHA, métricas e limites reais; atualizar changelog.
- [x] 7. Revisar diff e formatação; executar `npm run format`, lint, build, typecheck, test:quality, test:e2e, inspect:packages e `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`; registrar qualquer execução impossível como pendente.
- [x] 8. Abrir PR para develop, solicitar revisão, verificar CI/Security/Pages no SHA atual, corrigir falhas e relatar evidências sem declarar jobs pulados como aprovados.

**Evidência histórica dos primeiros gates (substituída pela validação da revisão abaixo):** CI [#43875243920](https://github.com/dvmarques/admin-design-system/actions/runs/43875243920), Security [#43875243630](https://github.com/dvmarques/admin-design-system/actions/runs/43875243630) e Pages [#43875243625](https://github.com/dvmarques/admin-design-system/actions/runs/43875243625), todos verdes no SHA `0e4e57e`. Medições em `docs/integrated-admin-compositions.md`. As limitações de zoom nativo, leitor de tela e revisão visual estão documentadas.

**Fora das tasks:** merge, archive/sync e fechamento administrativo exigem autorização posterior.

## Retorno da revisão da PR #335 — 16/11/2026

- [x] 9. Alinhar o rótulo do código desabilitado com a propriedade `disabled` e atualizar a asserção E2E.
- [x] 10. Limpar a ação de linha ao mudar para carregando, erro, dados ou tentar novamente; cobrir todas as transições em E2E.
- [x] 11. Registrar a justificativa para ausência de comparativo paritário Next.js/Storybook, sem atribuir diferenças históricas à #320 nem mudar budgets.
- [x] 12. Conferir os checks do SHA funcional `a6069fea04d6217bfa931f10bb8e855dda745bed` e registrar evidências na PR: **CI, Security e Pages aprovados** (build do site; publicação efetiva de Pages pulada por política de PR). [CI #43898557490](https://github.com/dvmarques/admin-design-system/actions/runs/43898557490), [Security #43898557286](https://github.com/dvmarques/admin-design-system/actions/runs/43898557286), [Pages #43898557258](https://github.com/dvmarques/admin-design-system/actions/runs/43898557258). Inclui Playwright Chromium 1/2 e 2/2, Firefox, WebKit, testes de qualidade, formatação, lint, types e distribuição.
- [x] 13. Concluir e registrar comparação reproduzível de bundles Next.js e Storybook base/HEAD, incluindo chunks dinâmicos e investigação de regressões, conforme `docs/integrated-admin-compositions.md`.

A comparação de bundles está documentada com relatórios e script reproduzível; o escopo e as limitações das interações medidas são explícitos. A antiga task 12 foi removida por decisão expressa do solicitante; zoom nativo e leitor de tela não foram testados, e isso não constitui aprovação desses cenários.
