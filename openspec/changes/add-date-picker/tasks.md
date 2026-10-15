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

- [x] 4.1 Executar `npm run format`, `lint`, `build`, `typecheck`, `test:quiet` e `openspec validate --all --strict`. O `test:e2e` roda, mas os 7 snapshots visuais falham fora do Windows (ver 4.2); os demais 85 testes passam.
- [x] 4.2 Registrar que os snapshots visuais (baseline `win32`) são pulados fora do Windows.
- [x] 4.3 Confirmar que nenhuma dependência de runtime foi adicionada.
- [ ] 4.4 Validar o consumo do CSS compilado do date picker em uma aplicação Next.js: pendente, pois a demonstração em `apps/admin-demo` é a issue #62; até lá o CSS é coberto pelo build, `inspect:css` e pelos testes de componente.
