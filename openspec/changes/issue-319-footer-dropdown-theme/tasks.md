# Tarefas verificáveis — #319

- [x] 1. Ler issue #319, épico #315, #316/#317/#318, develop e estruturas existentes, identificando sobreposições e limitações.
- [x] 2. Criar proposta, design, specs e tasks e revisar alternativas e compatibilidade antes de código.
- [x] 3. OpenSpec revisado antes da implementação e validado estritamente pelo workflow de política da PR após implementação (CLI local indisponível; diferença temporal registrada).
- [x] 4. Implementar somente AdsAdminShell.Footer, CSS/exports/tipos e testes de semântica/SSR, layout e responsividade.
- [x] 5. Implementar Dropdown.Header/Divider, retorno em Tab/Shift+Tab e testes de teclado, leitores de tela e portal.
- [x] 6. Validar contratos de tema/tokens e overlays, corrigir integração comprovada, documentar SSR/CSP/ordem de CSS e criar demonstração pública dos três modos e tokens.
- [x] 7. Publicar Admin Demo/Storybook funcionais para os três temas, footer presente/ausente e agrupamentos de menu; acrescentar E2E em 320/390/768/1440 e regressão visual.
- [ ] 8. Revisar todo o diff, atualizar changelog/docs, medir dependências/bundle, executar format, lint, typecheck, build, testes quality, E2E e OpenSpec strict, sem atualizar snapshots sem inspeção.
- [ ] 9. Publicar PR em develop e atualizar issue; acompanhar CI, Security, Pages e corrigir falhas de logs no SHA atual.
- [x] 10. Registrar como pendentes zoom nativo 200%, leitores de tela e validação visual humana até avaliação humana real.

**Não autorizar nesta change:** archive, merge, fechamento de issue ou épico.

## Evidências parciais da PR #328

- OpenSpec strict e suíte de qualidade rápida (format, lint, typecheck, build e 88 arquivos Vitest) passaram no SHA `e5addaf`; WebKit, Firefox e os dois shards Chromium passaram no mesmo código da entrega; Security e Pages também passaram.
- O orçamento de distribuição permaneceu como última falha após ajustes medidos de JS/CSS de `components` e `admin`; foi atualizado o teto CSS de `admin-public`, com novo check oficial pendente.
- Não foram realizados zoom nativo de 200%, auditoria manual de leitor de tela nem aprovação visual humana. `tasks 8/9` dependem de checks completos e atualização final; sem merge/archive.
