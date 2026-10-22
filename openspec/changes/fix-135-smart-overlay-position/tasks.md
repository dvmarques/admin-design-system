## 1. Preparação e especificação

- [x] 1.1 Ler issue #135, comentários, AGENTS.md, README.md e configuração OpenSpec.
- [x] 1.2 Criar branch exclusiva baseada em develop.
- [x] 1.3 Inspecionar implementação atual de Tooltip, Popover, Dropdown e hook compartilhado.
- [x] 1.4 Inspecionar testes existentes, changes ativas, stories, admin-demo e regras de worktree.
- [x] 1.5 Revisar criticamente proposal, design e delta specs; executar validação OpenSpec estrita.

## 2. Biblioteca

- [x] 2.1 Implementar cálculo puro de placement efetivo, flip e shift com margens de viewport.
- [x] 2.2 Expor internamente estilo, placement efetivo e deslocamento da seta sem mudar API pública.
- [x] 2.3 Recalcular em resize de âncora/painel, scroll, viewport e zoom; limpar listeners, observers e frames.
- [x] 2.4 Integrar Tooltip, Popover e Dropdown e alinhar seta e data-placement.
- [x] 2.5 Garantir SSR/hidratação, foco, Escape, clique externo, modalidade e overlays aninhados.

## 3. Regressões e documentação

- [x] 3.1 Cobrir geometria, bordas, flip, shift, viewport estreita, conteúdo maior que viewport e seta.
- [x] 3.2 Cobrir conteúdo dinâmico, resize, scroll, zoom, teardown e ausência de loops.
- [x] 3.3 Atualizar stories e exemplos do admin-demo com posições extremas.
- [x] 3.4 Atualizar documentação e changelog da versão em andamento.
- [x] 3.5 Testar E2E, acessibilidade e integração Next.js com CSS compilado.

## 4. Revisão e entrega

- [x] 4.1 Revisar diff completo, contratos públicos, compatibilidade e tamanho do bundle.
- [x] 4.2 Executar Prettier, npm run format, lint, build, typecheck, test:quiet, test:e2e e openspec.cmd validate --all --strict.
- [x] 4.3 Corrigir falhas reais sem desativar testes nem elevar tolerâncias.
- [x] 4.4 Publicar uma única PR para develop com bug, dvmarques e Closes #135; acompanhar CI até concluir.
- [x] 4.5 Entregar para code review sem merge nem arquivamento da change.

## Evidências de conclusão

Consulte [validation.md](validation.md). O run
[39768760228](https://github.com/dvmarques/admin-design-system/actions/runs/39768760228)
aprovou os gates do commit `f5bb8a7`: qualidade, distribuição, política/OpenSpec
e os 201 E2E (181 Chromium, 10 Firefox e 10 WebKit). As falhas locais descritas
no histórico não se reproduziram na CI; nenhum snapshot ou tolerância mudou.
As 20 tarefas estão concluídas. PR Ready for review por autorização do
responsável, aguardando revisão humana; sem merge ou arquivamento.
