## Why

Filtros e formulários administrativos precisam de seleção de data, e o design system ainda não oferece esse componente. Esta change (sub-item da issue #17, issue #57) adiciona `AdsDatePicker`, reutilizável e sem regras de negócio, para que aplicações consumidoras não reconstruam calendário, entrada digitada e acessibilidade a cada projeto.

## What Changes

- Adicionar `AdsDatePicker` ao pacote `@admin-ds/components`, com seleção de data única e de intervalo.
- Combinar entrada digitada (`AdsInput`) e calendário em `AdsPopover`, com valor controlado e não controlado.
- Suportar `min`/`max` e datas desabilitadas, estados desabilitado, erro e vazio, e integração com `AdsField`.
- Locale configurável com `pt-BR` como padrão (nomes de meses e dias, formato da data e primeiro dia da semana), implementado com `Intl`, sem dependência de runtime.
- Expor a semântica ARIA de grade de calendário e a navegação por teclado (setas, `Home`/`End`, `PageUp`/`PageDown`).
- Representar valores como strings ISO `AAAA-MM-DD`, sem fuso horário, e não usar a data atual na renderização inicial para evitar erros de hidratação.
- Adicionar story no Storybook, testes de comportamento e acessibilidade, e documentação.

Fora do escopo: seletor de hora, fusos horários, calendários não gregorianos, dependência de runtime para datas, componentes em `@admin-ds/admin` e a demonstração em `apps/admin-demo` (issue #62).

## Capabilities

### New Capabilities

- `date-picker`: seleção de data única e de intervalo, com entrada digitada, calendário acessível, locale configurável e integração com campos de formulário.

### Modified Capabilities

Nenhuma.

## Impact

- Pacote `@admin-ds/components`: novos exports públicos `AdsDatePicker`, `AdsDatePickerProps` (`AdsDatePickerSingleProps` e `AdsDatePickerRangeProps`), `AdsDateRange` e `AdsDatePickerLabels`; `AdsIconName` ganha `calendar`, `chevronLeft` e `chevronRight` (adição compatível); classes públicas `ads-date-picker*`. Nenhuma API existente é alterada (compatível retroativamente).
- Pacote `@admin-ds/admin` e `apps/admin-demo`: sem alterações.
- Pacote de tokens: sem novos tokens; reuso de tokens existentes.
- `apps/docs`: story `AdsDatePicker`.
- Dependências: nenhuma dependência de runtime adicionada.
- Documentação: `docs/integration.md` e `docs/limitations.md`.
