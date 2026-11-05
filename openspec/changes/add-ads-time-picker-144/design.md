# Design — AdsTimePicker (#144)

## Contrato público
`AdsTimePickerProps`: `value?: string|null`, `defaultValue?: string|null`, `onValueChange(value: string|null)`, `format?: '12h'|'24h'`, `minuteStep?: number`, `min?: string`, `max?: string`, `name?`, `required?`, `disabled?`, `id?`, `size?`, `validationState?`, `labels?` e atributos ARIA. Valores canônicos `HH:mm` sempre em 24h, sem timezone. 12h altera só exibição. `minuteStep` inteiro 1..60 (padrão 1), alinhado a minuto 00 de cada hora; limites inclusivos de mesmo dia. Valor vazio `null`.

## UI e acessibilidade
Dois `AdsSelect` nativos (horas e minutos), terceiro `AdsSelect` para AM/PM quando 12h; teclado e foco nativos, rótulos acessíveis por parte, primeiro controle com `id` da `AdsField`, descrições/erros propagados. Opções fora de limites e passo desabilitadas; hora sem minuto permitido não pode ser selecionada. Componente composto e responsivo via classes Tailwind estáticas que compilam em `styles.css`. `required` nos dois selects e `name` apenas no hidden de valor canônico; `disabled` desabilita todos.

## Semântica de estado e validação
Uma seleção incompleta preserva edição local, mas emite `null` (limpa valor confirmado). Mudanças que inviabilizam minutos selecionados descartam essa parte; nada fora de faixa é emitido. Valor controlado segue o pai, sem sincronização forçada silenciosa; valores externos inválidos são anunciados com `aria-invalid`, não ajustados sem autorização. Min > max não seleciona valores. `minuteStep` inválido é tratado como configuração inválida, sem seleção. Não cruzar meia-noite.

## Alternativas
`input type=time` fornece UI dependente de browser e formato 12h/24h não confiável. Popover próprio ampliaria complexidade de foco e ARIA. Três selects nativos oferecem semântica, foco e validação previsíveis, sem novos pacotes e com pouco JS. Em um refinamento futuro pode haver popover visual sem alterar contrato.

## Fronteiras e distribuição
`'use client'` apenas no arquivo interativo; `packages/components` não importa Next.js nem `apps/`. `apps/admin-demo` consome entrypoint público e CSS compilado, sem imports internos; a página server pode hospedar um exemplo client. SSR inicial determinístico, sem `Date.now()`; React hidrata os selects. Classes estáticas usam tokens existentes e prefixo `ads-`; nenhuma alteração de token. Sem dependências novas; impacto de bundle aditivo limitado ao módulo e export.

## Testes, rollback
Vitest + axe + SSR para limites, passo, 12h/24h, estados, submissão, controle, teclado e associação à `AdsField`; Storybook e demo interativos; E2E em navegador e gates oficiais. Rollback por revert da mudança aditiva, sem migração de dados.
