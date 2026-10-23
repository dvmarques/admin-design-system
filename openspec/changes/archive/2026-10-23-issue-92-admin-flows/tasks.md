# Tarefas

- [x] 1. Expor `role` em `AdsDialogProps` e usar `alertdialog` em `AdsConfirmDialog` destrutivo, com testes de componente, SSR e `axe`. Concluída quando os cenários de papel passam e foco, `Escape` e `pending` seguem inalterados.
- [x] 2. Implementar validação assíncrona em `AdsStepForm` (estado, anúncio, descarte de resultado obsoleto, rejeição), preservando a validação síncrona. Concluída quando os cenários de validação assíncrona passam.
- [x] 3. Implementar a navegação pelo indicador de etapas válidas e os estilos `ads-`/`--ads-`, inclusive `forced-colors`. Concluída quando os cenários de navegação passam por teclado.
- [x] 4. Atualizar stories (confirmação destrutiva e não destrutiva, StepForm com validação assíncrona e indicador navegável), e catálogo da demonstração (o consumo do CSS compilado segue coberto pelo teste de consumo público existente).
- [x] 5. Atualizar `docs/limitations.md` e `CHANGELOG.md` (`[0.1.1] - Em andamento`).
- [x] 6. Executar `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quiet`, `npm run test:e2e` e `openspec validate --all --strict`; revisar o diff e registrar em `validation.md`. Evidência: CI verde no head `a78dfba` (Chromium, Firefox, WebKit, qualidade e artefatos); ver `validation.md`.

## Evidências

Resultados e limitações em `validation.md`. Não arquivar nem integrar sem aprovação humana.
