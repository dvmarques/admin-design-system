# Tarefas — achados da primeira varredura #152

- [ ] Reproduzir e classificar os três achados com as capturas e as fontes: tema do iframe confirmado na demo, espaçamento do upload confirmado e alerta do shell a verificar como falso positivo.
- [ ] Corrigir propagação do tema efetivo do catálogo para os dois iframes de `AdsOrganizationSwitcher`, respeitando light/dark/Sistema e `basePath`.
- [ ] Ajustar somente a composição `FileUploadDemo` para espaçamento e quebra responsiva, mantendo botão, link e acessibilidade.
- [ ] Refinar a heurística de truncamento para não marcar overflow CSS visível como clipping, sem desativar as demais verificações.
- [ ] Incluir testes de regressão automatizados para iframes, responsividade do upload e distinção clipping real/ícone visível.
- [ ] Registrar resultados e limitações no documento de auditoria e no acompanhamento da #152.
- [ ] Executar testes focalizados, format, lint, build, typecheck, test:quality e auditor visual opt-in; registrar evidências reais.
- [ ] Executar `npm run test:e2e`, `npm run validate`, OpenSpec estrito e verificação final de formatação, revisar diff/snapshots; registrar limitações reais.
