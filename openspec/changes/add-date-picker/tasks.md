## 1. API e utilitários

- [x] 1.1 Definir tipos públicos (`AdsDatePickerProps`, `AdsDateRange`, `AdsDatePickerLabels`) e utilitários de data internos (parse, formato, comparação, limites) sem dependência de runtime.
- [x] 1.2 Implementar locale configurável com padrão `pt-BR`: nomes, formato, placeholder e primeiro dia da semana.

## 2. Componente

- [x] 2.1 Implementar entrada digitada e calendário em `AdsPopover` para data única, controlado e não controlado.
- [x] 2.2 Implementar modo intervalo com duas entradas.
- [x] 2.3 Implementar `min`/`max`, `isDateDisabled` e estados desabilitado, erro e vazio.
- [x] 2.4 Implementar grade de calendário com ARIA e navegação por teclado.
- [x] 2.5 Garantir integração com `AdsField` e campos ocultos para formulários (`name`).
- [x] 2.6 Adicionar estilos `ads-date-picker*` com tokens, temas claro e escuro e telas estreitas.
- [x] 2.7 Exportar a API pelo ponto de entrada do pacote.

## 3. Testes e documentação

- [x] 3.1 Testes de comportamento: seleção, digitação, limites, teclado, controlado/não controlado, locale, hidratação (SSR) e `axe`.
- [x] 3.2 Story no Storybook (única, intervalo, limites, erro, desabilitado, locale, em `AdsField`).
- [x] 3.3 Atualizar `docs/integration.md` e `docs/limitations.md`.

## 4. Validação

- [x] 4.1 Executar `npm run format`, `lint`, `build`, `typecheck`, `test:quality`, `inspect:packages` e `openspec validate --all --strict`, e o `test:e2e` completo no Windows, com os snapshots visuais `win32`, sem baseline alterado.
- [x] 4.2 Registrar que os snapshots visuais têm baseline só `win32`: são pulados na CI e falham em execução local fora do Windows.
- [x] 4.3 Confirmar que nenhuma dependência de runtime foi adicionada.
- [x] 4.4 Validar o consumo do CSS compilado do date picker em uma aplicação Next.js: página temporária no `apps/admin-demo` (build de produção, temas claro e escuro, sem erro de hidratação no console). A validação revelou que as classes de fundo, texto e borda da base do dia sobrepunham as dos estados selecionado, intervalo e hoje no CSS gerado; essas classes passam a ficar só em cada estado, com teste de regressão.
- [x] 4.5 Atualizar o baseline de `@admin-ds/components` em `docs/bundle-baseline.json`, medido como na CI (LF), e justificar em `docs/bundle-baseline.md`.
