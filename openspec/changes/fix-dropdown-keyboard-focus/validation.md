# Validação da issue #125

## Resultado

O foco inicial agora é solicitado explicitamente pelo gatilho e aplicado quando o nó do menu é anexado ao portal. APIs públicas, estilos, tokens e dependências permanecem compatíveis.

- Regressão antes da correção: 9 falhas e 3 sucessos; as falhas mantinham foco no gatilho.
- Regressão após a correção: 12 testes passaram, incluindo StrictMode, estado controlado/não controlado e abertura controlada adiada.
- `npm run build`: passou para os três pacotes, Next.js e Storybook.
- `npm run typecheck`: passou.
- `npm run test:quiet`: passou; 536 testes Vitest em 44 arquivos, além dos testes Node dos workspaces.
- `npm run test:e2e -- --project=chromium e2e/dropdown-focus.spec.ts`: 4 passaram; temas claro/escuro, larguras 390/1280, foco real, três teclas de abertura, reabertura, setas/Home/End, desabilitados, Escape, mouse e ativação nativa de ação/link.
- `npm run test:e2e -- --project=chromium --ignore-snapshots`: 142 passaram, sem falhas.
- `npm run dev --workspace @admin-ds/docs -- --port 6007 --ci` e `npm run dev --workspace @admin-ds/admin-demo -- --port 3007`: iniciados; index.json do Storybook e /componentes do demo responderam HTTP 200. Servidores encerrados após verificação.
- `npm run lint`, `npm run format` e `openspec.cmd validate --all --strict`: passaram na confirmação final; OpenSpec validou 42 itens, sem falhas.

## Limitações e observações

- Snapshots são exclusivos de Linux e não foram atualizados. Uma tentativa com filtro por título ainda executou três testes de screenshots fora daquele grupo; os PNGs Windows criados automaticamente nessa tentativa foram removidos. A execução final usa `--ignore-snapshots`.
- A execução com todos os projetos constatou Firefox e WebKit ausentes neste ambiente; os oito smokes desses motores não puderam iniciar. A CI deve executar esses motores e os snapshots Linux.
- O lint passou inicialmente no worktree isolado; a falha de worktrees aninhados da issue #128 não foi alterada. A auditoria final também verifica o novo arquivo E2E.
- O destaque de foco existente usa o fundo semântico de hover. O contorno permanece sem renderização porque `outline-none` define o estilo como none; não houve alteração de CSS nesta correção.
- Axe no menu aberto passou para WCAG 2 A/AA, WCAG 2.1 AA e WCAG 2.2 AA. Uma auditoria de página inteira com o menu aberto apontou a boa prática `region`, pois o portal fica fora de landmarks; isso permanece fora desta correção. As auditorias existentes de rotas permanecem na suíte.
- Sem novos subagentes. Implementação e validação isoladas no worktree `fix-dropdown-keyboard-focus`, branch `codex/fix-dropdown-keyboard-focus`.
