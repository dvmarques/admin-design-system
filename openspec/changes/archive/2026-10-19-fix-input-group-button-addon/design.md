# Design

## Decisão

A correção fica nas classes do adendo em `field.tsx`, ativada por
`has-[>.ads-button]` (`:has(> .ads-button)`), sem prop nova nem detecção em
JavaScript: o botão pode vir de `AdsButton`, que já carrega `ads-button`, e o
comportamento acompanha o conteúdo recebido.

Com o botão como filho direto do adendo:

- o adendo perde borda, fundo e padding e passa a `items-stretch`, então o botão
  preenche a altura do grupo, que é a do campo;
- `min-h-0!` no botão: os dois `min-h-*` (do botão e o do campo) empatariam e o
  vencedor dependeria da ordem do CSS, como no gatilho do `AdsDatePicker`;
- a quina externa do botão continua arredondada e a interna é reta
  (`rounded-r-none` no início, `rounded-l-none` no fim), e o adendo sobrepõe 1px
  (`-mr-px`, `-ml-px`) para a borda do botão e a do campo não somarem 2px;
- `translate-y-0!` anula o deslize de 1px do hover do botão, que abriria uma
  fresta entre o botão e o campo.

## Consequências

O `size` do botão deixa de definir a altura dentro do adendo (passa a ser a do
campo) e continua definindo o padding horizontal e a fonte. O anel de foco do
grupo (`focus-within`) e o do botão aparecem juntos quando o botão tem foco por
teclado; os dois são visíveis nos temas claro e escuro.

O botão deve ser o único conteúdo do adendo: texto e botão no mesmo adendo
também perdem a moldura. A regra usa filho direto (`>`), então um botão dentro
de outro elemento no adendo mantém a moldura e a altura anteriores.
