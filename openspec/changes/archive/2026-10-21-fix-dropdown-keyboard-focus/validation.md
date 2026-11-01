# Validação da issue #125

## Resultado

O foco inicial é solicitado explicitamente pelo gatilho e aplicado quando o nó do menu é anexado ao portal. A intenção expira ao sair do gatilho; o conteúdo verifica o elemento ativo e aplica foco com preventScroll. APIs públicas, estilos, tokens e dependências permanecem compatíveis.

- Regressão original: 9 falhas e 3 sucessos antes da correção; as falhas mantinham foco no gatilho.
- Regressão da revisão: dois testes novos reproduziram a captura de foco em abertura controlada abandonada; ambos passaram após o ajuste. São 14 testes de foco passando, incluindo StrictMode, estado controlado/não controlado, abertura adiada válida, saída/retorno ao gatilho e preservação do onBlur do consumidor.
- `npm run build`: passou para os três pacotes, Next.js e Storybook após os ajustes.
- `npm run typecheck`: passou.
- `npm run test:quiet`: passou; 538 testes Vitest em 44 arquivos, além dos testes Node dos workspaces.
- `npm run test:e2e -- e2e/dropdown-focus.spec.ts`: 12 passaram nos três motores; temas claro/escuro, larguras 390/1280, foco real, três teclas de abertura, rolagem preservada, reabertura, setas/Home/End, desabilitados, Escape, mouse e ativação nativa de ação/link.
- `npm run test:e2e -- --ignore-snapshots`: 158 passaram, sem falhas, em Chromium, Firefox e WebKit.
- `npm run dev --workspace @admin-ds/docs -- --port 6007 --ci` e `npm run dev --workspace @admin-ds/admin-demo -- --port 3007`: iniciados na validação inicial; index.json do Storybook e /componentes do demo responderam HTTP 200. Servidores encerrados após verificação.
- `npm run lint`, `npm run format` e `openspec.cmd validate --all --strict`: passaram; OpenSpec validou 42 itens, sem falhas.

## Revisão pelo Claude CLI

Revisão somente de leitura solicitada pelo usuário. O Claude identificou intenção obsoleta em abertura controlada recusada/abandonada e sugeriu evitar rolagem antes do posicionamento. Ambos foram corrigidos e cobertos por regressões.

Na segunda revisão, o Claude confirmou que os achados anteriores foram tratados e não identificou bug concreto novo no componente. Os apontamentos restantes de acompanhamento/documentação foram tratados: tarefas atualizadas, arquivo next-env.d.ts gerado restaurado, descrição de testes movida para a seção Playwright e limitações de Firefox/WebKit alinhadas à configuração.

## Limitações e observações

- Snapshots são exclusivos de Linux e não foram atualizados. A execução final usa `--ignore-snapshots`; os baselines devem ser verificados pela CI.
- Firefox e WebKit, ausentes na validação inicial, foram instalados nesta revisão. O teste do dropdown agora faz parte dos projetos desses motores, além dos smokes existentes.
- O teste coloca o gatilho na viewport sem animação antes de medir a rolagem; a medição acontece após confirmar o foco no primeiro item. A abertura por mouse preserva o comportamento nativo do navegador: WebKit não necessariamente mantém foco no botão clicado, mas o menu não captura foco.
- O lint passa no worktree isolado; a falha de worktrees aninhados da issue #128 não foi alterada.
- O destaque de foco existente usa o fundo semântico de hover. O contorno permanece sem renderização porque `outline-none` define o estilo como none; não houve alteração de CSS nesta correção.
- Axe no menu aberto passou para WCAG 2 A/AA, WCAG 2.1 AA e WCAG 2.2 AA. Uma auditoria de página inteira com o menu aberto apontou a boa prática `region`, pois o portal fica fora de landmarks; isso permanece fora desta correção. As auditorias existentes de rotas permanecem na suíte.
- Implementação e validação isoladas no worktree `fix-dropdown-keyboard-focus`, branch `codex/fix-dropdown-keyboard-focus`. O revisor Claude CLI só leu arquivos; as alterações foram aplicadas neste worktree.
