# Design

## Decisão

As classes do adendo com botão (`fix-input-group-button-addon`) ganham três regras
em `field.tsx`, sem prop nova:

- `[&>.ads-button+.ads-button]:-ml-px`: cada botão depois do primeiro sobrepõe 1px
  ao anterior, como o adendo sobrepõe o campo, para as bordas não somarem 2px;
- no adendo inicial, todos os botões têm a quina direita reta (junto ao campo ou
  ao próximo botão) e os que não são o primeiro têm também a esquerda reta;
- no adendo final, todos têm a quina esquerda reta e os que não são o último têm
  também a direita reta.

Assim só a quina externa do conjunto (esquerda do primeiro no início, direita do
último no fim) fica arredondada.

## Fora do escopo

Texto e botão no mesmo adendo não é suportado: sem um componente de segmento de
texto não há como estilizar texto solto (nó de texto) ao lado de um botão, e a
semântica visual desse caso não está definida. A alternativa documentada é um
adendo de texto em `startContent` e o botão em `endContent`.
