# Proposal

## Why

O botão no adendo de `AdsInputGroup` acompanha a altura do campo, mas a correção
trata um botão por adendo. Com dois botões no mesmo adendo (por exemplo "Limpar" e
"Buscar"), cada um ficaria com as duas quinas arredondadas e uma fresta ou junção
dupla entre eles, sem o aspecto de um único controle.

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- `AdsInputGroup`: vários `AdsButton` como filhos diretos do mesmo adendo ficam
  contíguos; só a quina externa do conjunto é arredondada, as internas são retas
  e cada junção sobrepõe 1px. A altura é a do campo, como com um botão.

**Aplicações de demonstração e documentação**

- `docs/integration.md`: exemplo com dois botões e o limite documentado.
- Storybook: a story `InputGroupWithButton` ganha uma linha com dois botões por
  tamanho.
- Nenhuma mudança de código no admin demo.

## Objetivos e fora do escopo

Objetivo: vários botões no adendo com a aparência de um único controle, sem mudar
a API pública.

Fora do escopo: texto e botão no mesmo adendo (não há componente de segmento de
texto, e a semântica visual do texto solto ao lado de um botão não está definida;
criar API para isso não tem consumidor hoje); novas props; mudar alturas.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `form-controls`: adiciona o requisito dos vários botões no mesmo adendo.
- `component-documentation`: a orientação passa a cobrir um ou mais botões e o
  limite do conteúdo misto.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components`, `AdsInputGroup`. Nenhuma
  prop, tipo, export, classe `ads-*` ou variável `--ads-*` muda; compatibilidade
  retroativa preservada. Um adendo com um só botão não muda.
- **Dependências**: nenhuma.
- **Consumidores**: dois ou mais botões no adendo passam a funcionar sem CSS próprio.
