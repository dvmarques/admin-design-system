# Proposal

## Why

Um `AdsButton` em `startContent` ou `endContent` de `AdsInputGroup` fica dentro da
moldura do adendo de texto (borda de 1px, fundo e padding de 12px) e a altura do
botão, maior que a do campo, empurra o grupo: o campo passa de 30, 32 e 36px para
34, 38 e 42px em `sm`, `md` e `lg`. A documentação de integração hoje só alerta
para evitar o uso, e o caso (campo de busca com botão, filtro com botão) é comum
em telas administrativas.

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- `AdsInputGroup`: quando o adendo contém um `AdsButton`, ele deixa de ter borda,
  fundo e padding, o botão acompanha a altura do campo em qualquer `size` (em vez
  de impor a sua), fica rente ao campo com a quina externa arredondada e não
  desliza no hover. Adendos de texto não mudam.

**Aplicações de demonstração e documentação**

- `docs/integration.md`: o alerta é substituído pela orientação de uso.
- Storybook: nova story `InputGroupWithButton` com botão no início e no fim, nos
  três tamanhos, ao lado de adendos de texto.
- Nenhuma mudança de código no admin demo.

## Objetivos e fora do escopo

Objetivo: grupo de entrada com botão com a mesma altura do grupo com adendo de
texto e aparência de um único controle, sem mudar a API pública.

Fora do escopo: novas props em `AdsInputGroup`; mais de um botão por adendo;
conteúdo misto de texto e botão no mesmo adendo; mudar alturas de botões ou
campos.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `form-controls`: adiciona o requisito do botão no adendo do grupo de entrada.
- `component-documentation`: a orientação sobre botão no adendo passa de alerta
  para instrução de uso.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components`, `AdsInputGroup`. Nenhuma
  prop, tipo, export, classe `ads-*` ou variável `--ads-*` muda; compatibilidade
  retroativa preservada. A aparência muda de forma intencional só para quem já
  colocava um `AdsButton` no adendo, cuja altura passa a ser a do campo.
- **Dependências**: nenhuma.
- **Consumidores**: o botão no adendo passa a funcionar sem CSS próprio.
