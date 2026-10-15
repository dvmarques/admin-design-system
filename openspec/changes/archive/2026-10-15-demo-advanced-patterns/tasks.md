# Tasks

## 1. Dados e consulta (servidor)

- [x] 1.1 Estender `lib/customers-query.ts` com leitura e aplicação de `q`, `status`, `plano`, `de`, `ate`, `ordem` e `pagina`, funções puras e determinísticas, com `since` convertido para ISO; ignorar valores inválidos.
- [x] 1.2 Testes de unidade da consulta (filtros, intervalo, ordenação, normalização, determinismo).

## 2. `/clientes`

- [x] 2.1 `page.tsx` lê `searchParams` e repassa linhas, totais, filtros e ordenação.
- [x] 2.2 `customers-listing.tsx` (Client Component) com `AdsFilterBar` e `AdsSmartTable`: estado local dos filtros, `router.replace`, seleção e colunas locais, `renderPageLink` preservando parâmetros e estados `?estado=`.
- [x] 2.3 Substituir `customers-content.tsx`/`customers-pagination.tsx` e atualizar os testes de unidade.

## 3. Visão geral

- [x] 3.1 `AdsMetricCard` nos indicadores e `AdsDashboardGrid`/`AdsDashboardPanel` para progresso e atividade; ajustar dados e testes mantendo os contratos ARIA.

## 4. E2E e acessibilidade

- [x] 4.1 E2E em funções ARIA e nomes acessíveis: filtrar, ordenar, paginar, selecionar, ocultar colunas, URLs inválidas, estado vazio, 375 px; axe nos temas claro e escuro.
- [ ] 4.2 Snapshots afetados: revisar e regerar no Windows. **Pendente**: só existem baselines `win32`; no ambiente cloud (Linux) foram pulados e nenhuma baseline foi criada ou alterada.

## 5. Documentação

- [x] 5.1 `docs/integration.md` com o exemplo do demo; `docs/limitations.md` se aplicável; `CHANGELOG.md`.

## 6. Pendências por dependência

- [ ] 6.1 Exemplo de listagem com ações em massa e de formulário em etapas. **Pendente** da issue #61 (sem branch nem PR). A integração desta change depende da PR #67.

## 7. Validação final

- [x] 7.1 `npx prettier --write` nos arquivos alterados.
- [x] 7.2 `npm run lint`, `npm run build`, `npm run typecheck` (todos os workspaces) e `npm run test:quiet`.
- [x] 7.3 `CI=1 npm run test:e2e` sem falhas (96 passaram, 7 pulados); snapshots visuais só no Windows.
- [x] 7.4 `openspec validate --all --strict` e `inspect:packages` dentro do baseline.
- [x] 7.5 Arquivar a change e rodar `npm run format`.

## 8. Achado da biblioteca

- [x] 8.1 Registrar em `docs/limitations.md` que a prop `pagination` do `AdsSmartTable` estoura a largura em 375 px; o demo usa `AdsPagination` abaixo da tabela. Correção na biblioteca fica para issue própria.
