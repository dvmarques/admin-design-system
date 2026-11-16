# Tarefas verificáveis — #319

- [x] 1. Ler issue #319, épico #315, #316/#317/#318, develop e estruturas existentes, identificando sobreposições e limitações.
- [x] 2. Criar proposta, design, specs e tasks e revisar alternativas e compatibilidade antes de código.
- [x] 3. OpenSpec revisado antes da implementação e validado estritamente pelo workflow de política da PR após implementação (CLI local indisponível; diferença temporal registrada).
- [x] 4. Implementar somente AdsAdminShell.Footer, CSS/exports/tipos e testes de semântica/SSR, layout e responsividade.
- [x] 5. Implementar Dropdown.Header/Divider, retorno em Tab/Shift+Tab e testes de teclado, leitores de tela e portal.
- [x] 6. Validar contratos de tema/tokens e overlays, corrigir integração comprovada, documentar SSR/CSP/ordem de CSS e criar demonstração pública dos três modos e tokens.
- [x] 7. Publicar Admin Demo/Storybook funcionais para os três temas, footer presente/ausente e agrupamentos de menu; acrescentar E2E em 320/390/768/1440 e regressão visual.
- [x] 7a. Integrar Footer opcional e Dropdown agrupado ao conteúdo da rota de consulta do Admin Demo existente, sem duplicar shell, e acrescentar E2E para navegação real e exportação do GitHub Pages com basePath/trailingSlash.
- [x] 8. Revisar todo o diff, atualizar changelog/docs, medir dependências/bundle, executar format, lint, typecheck, build, testes quality, E2E e OpenSpec strict, sem atualizar snapshots sem inspeção.
- [x] 9. Publicar PR em develop e atualizar issue; acompanhar CI, Security, Pages e corrigir falhas de logs no SHA atual.
- [x] 10. Registrar como pendentes zoom nativo 200%, leitores de tela e validação visual humana até avaliação humana real.

**Não autorizar nesta change:** archive, merge, fechamento de issue ou épico.

## Revalidação após sincronização com develop — 16/11/2026

- As 11 tarefas acima registram a entrega histórica; a revisão atual incorpora `develop` em `83e68698b26e032291c3b04da7c42bb987bf3f44`, via merge sem conflitos.
- Corrigidos Tab/Shift+Tab com foco no gatilho e acesso por teclado à tabela da consulta a 320 px; testes de regressão adicionados sem novos mecanismos ou dependências.
- Validações locais: format, lint, build, typecheck, quality (88 arquivos Vitest / 1.595 testes), inspeção de pacotes, peer opcional, saída Storybook e OpenSpec strict (72 itens) aprovados. Build repetido após a correção do Demo; E2E focalizado: 13 aprovados. WebKit revalidado com bibliotecas isoladas: 25 aprovados e 1 skip previsto pela suíte.
- Suíte E2E completa local: 546 aprovados, 9 diferenças de screenshots e 26 falhas iniciais de carregamento WebKit. Estas últimas foram resolvidas no ambiente e revalidadas acima; snapshots permanecem intactos. Diferenças locais de rasterização de texto exigem confirmação no ambiente oficial de CI, sem aceitação automática.
- Matriz complementar no Demo real: capturas de 320/390/768/1440 px, claro/escuro, menu, foco e sidebar móvel/recolhida; axe WCAG sem violações nas oito combinações após a correção da tabela, sem erro de página ou overflow em escala normal. CSS zoom 200% sem overflow em 768/1440; em 320/390 produz overflow (largura efetiva abaixo de 320 px), registrado como limite da simulação. Zoom nativo, leitor de tela real e aprovação visual humana não realizados.
- Resultados de Pages e checks do SHA publicado nesta revisão serão registrados na PR #328, sem substituir as evidências históricas abaixo. A execução histórica não comprova o SHA atual.
- `npm run build:pages` e `npm run test:e2e:pages`: aprovados localmente, 34 testes incluindo footer/dropdown sob `basePath` e `trailingSlash`.

## Evidências da PR #328

- OpenSpec strict e suíte de qualidade rápida (format, lint, typecheck, build e 88 arquivos Vitest) passaram no SHA `e5addaf`; WebKit, Firefox e os dois shards Chromium passaram no mesmo código da entrega; Security e Pages também passaram.
- O orçamento de distribuição permaneceu como última falha após ajustes medidos de JS/CSS de `components` e `admin`; foi atualizado o teto CSS de `admin-public`, com novo check oficial pendente.
- Não foram realizados zoom nativo de 200%, auditoria manual de leitor de tela nem aprovação visual humana. `tasks 8/9` dependem de checks completos e atualização final; sem merge/archive.

## Integração final do Admin Demo — 16/11/2026

- Na rota existente de consulta, `AdsDropdown.Header`/`Divider` oferecem agrupamento e ações de navegação. `DemoFooter` ativa o slot opt-in de footer apenas nessa página, por meio do shell compartilhado; não foram duplicados header, sidebar ou main.
- O E2E no Admin Demo cobre 320/390/768/1440 px, teclado, foco, roteamento, ausência/presença do footer e light/dark; o teste no Pages cobre `basePath` e `trailingSlash`. Sem atualização de snapshots.
- [CI #43795434109](https://github.com/dvmarques/admin-design-system/actions/runs/43795434109): **success** no SHA `6a2d7a7e141ad0e8c239b744ccf45a571fcc79e7`. Aprovados OpenSpec strict, formato, lint, tipos, builds, testes/quality, distribuição, Chromium (1/2 e 2/2), Firefox, WebKit e agregador E2E.
- [Security #43795434049](https://github.com/dvmarques/admin-design-system/actions/runs/43795434049) e [Pages #43795434083](https://github.com/dvmarques/admin-design-system/actions/runs/43795434083): **success** no mesmo SHA. Pages verificou o site estático com o novo E2E.
- Revisão do diff adicional: sem alterações de API pública, dependências, orçamento de bundle ou identidade visual; o consumo do CSS público e inspeção de pacotes ficaram aprovados.
- Validações manuais de zoom nativo 200%, NVDA/VoiceOver e aparência não foram realizadas; continuam explicitamente pendentes. A validação final de checks acima refere-se ao SHA da implementação, anterior a este commit documental de evidência.
