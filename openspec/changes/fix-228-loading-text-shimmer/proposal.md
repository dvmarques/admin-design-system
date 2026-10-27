# Change: Melhorar visibilidade do shimmer em AdsLoadingText (#228)

## Why
O brilho do `AdsLoadingText` publicado é difícil de perceber, especialmente no tema escuro. No tema dark, `--ads-color-text-muted` (slate200) e `--ads-color-text-primary` (slate50) são próximos, resultando em variação visual pequena. Além disso, o CSS atual usa `background-color: currentColor`, ao contrário das duas camadas explícitas do Back Admin.

## What Changes
- Corrigir exclusivamente a composição visual CSS do `AdsLoadingText` com base sólida e faixa de brilho mais distinguível.
- Ajustar cor base da animação no dark por mistura de tokens existentes, sem introduzir paleta estática nem mudar APIs ou tempos.
- Acrescentar testes de regressão e critérios de contraste, modos de tema e movimento reduzido.
- Atualizar CHANGELOG e registrar evidências dos testes.

## Scope
`packages/components/src/styles.css` e testes de estilo, documentação/CHANGELOG. Storybook e Admin Demo já têm exemplos `slow`, `normal` e `fast`; mudar apenas se necessário para validar o resultado.

## Out of scope
Sem mudanças de API, velocidades, rótulos em inglês, regras de job, Back Admin ou tokens globais.
