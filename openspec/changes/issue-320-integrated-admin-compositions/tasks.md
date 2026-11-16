# Tarefas verificáveis — #320

- [x] 1. Ler issue #320, épico #315, entregas #316–#319 e padrões/rotas em develop; identificar reuso e lacunas.
- [x] 2. Criar branch a partir de develop e change OpenSpec Critical com proposal/design/spec/tasks; revisar contratos e limites antes de implementar.
- [x] 3. Acrescentar índice integrado na Demo, links de navegação e rastreabilidade no catálogo/Storybook.
- [x] 4. Completar estados e ações de consulta, paginação e formulário desabilitado, sem novas APIs nem serviços.
- [x] 5. Criar testes de integração Playwright/axe para cenários, teclado, foco, temas, larguras e SSR/hidratação; revisar regressões e snapshots.
- [x] 6. Documentar matriz de cenários, escolhas de uso, CSS/exports públicos, bundle com SHA, métricas e limites reais; atualizar changelog.
- [x] 7. Revisar diff e formatação; executar `npm run format`, lint, build, typecheck, test:quality, test:e2e, inspect:packages e `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`; registrar qualquer execução impossível como pendente.
- [x] 8. Abrir PR para develop, solicitar revisão, verificar CI/Security/Pages no SHA atual, corrigir falhas e relatar evidências sem declarar jobs pulados como aprovados.

**Evidência dos gates concluídos:** CI [#43875243920](https://github.com/dvmarques/admin-design-system/actions/runs/43875243920), Security [#43875243630](https://github.com/dvmarques/admin-design-system/actions/runs/43875243630) e Pages [#43875243625](https://github.com/dvmarques/admin-design-system/actions/runs/43875243625), todos verdes no SHA `0e4e57e`. Medições em `docs/integrated-admin-compositions.md`. Revisão humana de zoom nativo 200%, leitor de tela e capturas continua pendente.

**Fora das tasks:** merge, archive/sync e fechamento administrativo exigem autorização posterior.
