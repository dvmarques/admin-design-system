# Tarefas

- [x] 1. Classificar o risco (Critical), ler `AdsSmartTable`, specs, stories, demonstração e baseline, e registrar proposta, design e delta de spec.
- [x] 2. Implementar o cálculo puro da janela de virtualização com espaçadores e linha focada, com testes unitários.
- [x] 3. Integrar a virtualização ao `AdsSmartTable` (região rolável, cabeçalho fixo, `aria-rowcount`/`aria-rowindex`, foco, seleção, estados e SSR).
- [x] 4. Implementar a alça de redimensionamento (separador, ponteiro, teclado, limites, RTL, reset) e o controle de larguras.
- [x] 5. Implementar `onExport`, `exportValue`/`exportable` e o helper `getAdsSmartTableCsv`, com exports e tipos públicos.
- [x] 6. Estilos `ads-smart-table-*` distribuídos em `@admin-ds/admin/styles.css`, sem Tailwind no consumidor.
- [x] 7. Testes de componente, SSR/hidratação e `axe` para os três recursos e para a compatibilidade sem as props.
- [x] 8. Stories (Virtualized, ResizableColumns, ExportHook) e página `/componentes/tabela-avancada` na demonstração, com E2E (virtualização, foco, teclado, ponteiro, exportação, `axe` claro/escuro, hidratação).
- [x] 9. Atualizar `docs/limitations.md`, `docs/integration.md`, `docs/admin-demo-catalog.md`, `docs/bundle-baseline.*` e `CHANGELOG.md`.
- [ ] 10. Executar format, lint, build, typecheck, quality, E2E completo e `openspec validate --all --strict`; registrar em `validation.md`.

## Evidências

Resultados e limitações em [validation.md](validation.md). Não arquivar nem integrar sem aprovação humana.
