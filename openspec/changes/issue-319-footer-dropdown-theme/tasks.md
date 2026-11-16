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
