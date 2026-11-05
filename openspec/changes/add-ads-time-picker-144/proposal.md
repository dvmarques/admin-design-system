# Proposta — AdsTimePicker (#144)

## Motivação
Aplicações administrativas precisam selecionar horários sem depender do backend nem de bibliotecas externas; o DatePicker existente resolve apenas datas.

## Perfil e riscos
**Critical:** novo export público, CSS distribuível, acessibilidade de controle composto, consumo Next.js e Storybook. Revisar principalmente serialização, coerência de passos e limites, semântica de rótulos, SSR/hidratação e compatibilidade.

## Escopo
- Criar `AdsTimePicker` e tipos em `@dvmarques/admin-ds-components`.
- Selecionar horas/minutos em 24h ou 12h (AM/PM), valores `HH:mm` no contrato e nos formulários; `minuteStep`, `min`, `max`.
- Suportar `value`/`defaultValue`, `onValueChange`, `AdsField`, `name`, `required`, `disabled`, temas e tamanhos.
- Documentar, testar e demonstrar funcionalmente em `apps/admin-demo` e Storybook, incluindo combinação independente com `AdsDatePicker`.
- Atualizar catálogo, changelogs e evidências das verificações.

## Fora do escopo
- Backend, fusos horários, data/hora com timezone, segundos, janelas que cruzam a meia-noite e alterações à issue #91.
- Alterar `AdsDatePicker` ou adicionar peer/dependência de runtime.

## Consumidores
Export aditivo; formatos existentes preservados. Aplicações podem compor Data + Hora sem acoplamento obrigatório.
