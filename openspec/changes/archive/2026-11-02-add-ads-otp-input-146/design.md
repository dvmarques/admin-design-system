# Design: AdsOTPInput (#146)

## Decisão de interação

Um único `<input type="text">` nativo recebe o código e participa dos formulários; uma camada de caixas segmentadas é apenas apresentação (`aria-hidden`). Isso oferece um único ponto no Tab, leitura compreensível por tecnologia assistiva e o autofill real `autocomplete="one-time-code"`. As setas, Backspace, seleção e colagem usam a edição nativa; o destaque visual segue a posição do cursor. A digitação avança automaticamente para a posição seguinte, sem mover foco entre seis controles artificiais.

A API expõe `length` (inteiro positivo, padrão 6), `value`/`defaultValue`, `onChange(value: string)`, `onComplete(value: string)`, `size`, `validationState` e as props nativas pertinentes. Somente dígitos ASCII são aceitos; o código é sempre string, inclusive zeros à esquerda. Valor externo é normalizado sem notificar; `onComplete` reage apenas à edição da pessoa que forma código completo, nunca a mount, hidratação ou mudanças externas. Recomendação: não combinar `value` e `defaultValue`.

## Acessibilidade

`AdsField` injeta `id`, `aria-describedby`, `aria-invalid` e estado. A descrição interna contextualiza a quantidade de dígitos e mantém os IDs externos. A entrada nativa recebe ref, label, `inputMode="numeric"`, `maxLength`, `autoComplete` e semântica de teclado. Somente o input é exposto ao leitor de tela; caixas de apresentação nunca duplicam os dígitos no cursor virtual. Foco visível no segmento ativo, erro por borda e mensagem textual do `AdsField`, sem depender apenas de cor.

## Estilos e distribuição

Classes `ads-otp-input*` e utilities estáticas usam `--ads-*` por meio dos tokens do Tailwind interno; nenhuma dependência do Tailwind nos consumidores. Tema claro/escuro e dimensões sm/md/lg seguem a biblioteca. O layout flexível limita cada slot e contrai em viewport estreita; nenhum estilo global fora do componente. O CSS final é compilado pelo processo existente em `packages/components`.

## Alternativas e riscos

- **Seis inputs separados:** facilitaria foco por célula, mas requer lógica para paste/SMS, Tab, backspace, leitores de tela e formulários; rejeitada.
- **Um campo visual sem slots:** maximizaria comportamento nativo, mas não atenderia à affordance da issue; rejeitada.
- **Dependência OTP externa:** desnecessária; evitar aumento de bundle e risco de licença.

Atenção a composição IME, seleção no meio, controle externo que rejeita mudança, atualização de `length` e `onComplete` duplicado; cobrir por teste. Nenhuma retenção remota ou log de códigos. Rollback: remover export, arquivo e entradas aditivas do catálogo; não há migração de API preexistente.

## Consumidores e validação

`apps/admin-demo` incorpora o componente através do export público e CSS distribuído; `apps/docs` publica stories. Verificar build Next.js, Storybook, typecheck, format, lint, testes de unidade/acessibilidade e E2E em Chromium, mais `openspec validate --all --strict`. Não afirmar validações locais sem execução; CI Ready-for-review será fonte de evidência no SHA exato.
