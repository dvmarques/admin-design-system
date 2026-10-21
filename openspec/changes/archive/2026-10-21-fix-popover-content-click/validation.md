# Validação da issue #126

Executada em 21/10/2026 no Windows, no worktree gerenciado `fix-popover-content-click`, branch `codex/fix-popover-content-click`, sobre `develop` em `27fb6a9`.

## Resultado

- A regressão de componente falhou antes da correção: clicar no input desmontava o painel.
- `npm.cmd run build`: pacotes, verificação de exports/CSS compilado, Next.js e Storybook aprovados.
- `npm.cmd run typecheck` e `npm.cmd run lint`: aprovados no worktree isolado.
- `npm.cmd run test:quality`: aprovado, com 634 testes Vitest em 47 arquivos, testes Node dos workspaces, 28 testes de release, 6 de CI e verificações de skills/tokens gerados.
- `npm.cmd run test:e2e -- --project=chromium --grep-invert 'snapshots visuais|mantém a apresentação'`: 153 aprovados, incluindo oito regressões novas nos temas claro/escuro e larguras 375/1280px.
- `npm.cmd run test:e2e -- --project=firefox --project=webkit`: 16 aprovados (smoke e foco do Dropdown já configurados).
- Regressões verificam teclado, foco visível, relação ARIA, axe com painel/calendário abertos, cliques internos, edição, ação interna sem fechamento, gatilho, Escape, clique externo, fechamento explícito, navegação de mês e seleção única/intervalo.
- `npm.cmd run dev --workspace @admin-ds/docs -- --ci`: iniciado; iframe do Popover respondeu HTTP 200.
- `npm.cmd run dev --workspace @admin-ds/admin-demo -- --port 3001`: iniciado; `/componentes/datas` respondeu HTTP 200. Servidores encerrados após a conferência.
- Arquivos alterados formatados com `npx.cmd prettier --write`; `npm.cmd run format` e `openspec.cmd validate --all --strict` aprovados (43 itens).

## Limitações e escopo

Os sete cenários de screenshots exigem baselines Linux e foram excluídos da execução funcional final. Uma execução anterior usou um filtro incompleto e chegou a dois testes visuais; os seis PNGs Windows gerados automaticamente foram removidos. Nenhum baseline versionado foi alterado. A CI completa, incluindo snapshots, deve rodar ao marcar a PR Draft como Ready for review.

O lint no checkout principal reproduziu a #128 (múltiplos tsconfigRootDir por worktrees aninhados). O lint global passou no worktree isolado, sem alterar configuração nem remover worktrees. Escape em overlays aninhados (#127) permanece fora do escopo.

O demo usa APIs públicas e CSS distribuído, sem contornos locais: Popover interativo em `/componentes` e seleção única/intervalo em `/componentes/datas`. A story existente de DatePicker permanece disponível; a story de Popover agora documenta e demonstra a interação interna. Sem alteração de API pública, tokens ou estilos da biblioteca.

## Revisão e integração

- Claude Code CLI 2.1.304, sessão `4aa480cb-620a-493a-9938-201ebe8bee6d`, revisão do commit `a607e2ab4bb12af12fd59e6d446a43deebc031b4`: **APROVADO**, sem problemas bloqueantes. Nenhuma alteração de implementação solicitada. Observações de baixa prioridade sobre propagação no DatePicker (já descrita no changelog), inclusão futura da página de datas na matriz global de rotas e execução da regressão nova em outros motores. O revisor declarou 38 testes de componente aprovados; as demais evidências foram lidas do relatório.
- CI completa aprovada em [Actions, execução 39653032382](https://github.com/dvmarques/admin-design-system/actions/runs/39653032382): qualidade, distribuição, política de develop e fluxos Chromium/Firefox/WebKit. Os snapshots Linux passaram, encerrando a pendência da validação local Windows. O check de release foi skipped por não ser PR de release.
- Após aprovação, o requisito modificado foi sincronizado com a spec principal `anchored-overlays`, preservando Purpose e os demais requisitos. Change arquivada em `2026-10-21-fix-popover-content-click`, com 6/6 tarefas concluídas. O commit de arquivamento deve passar pela CI antes do merge por squash da PR #132, conforme autorização do usuário.

Após a aprovação, develop recebeu a PR #131 (20fd66f), referente à #127. A branch incorporou esse commit e resolveu o conflito de declarações de estado do demo preservando name e detailsOpen. A implementação desta correção não mudou; a correção de Escape é herdada da base. O novo HEAD deve passar pela CI completa antes do squash.
