# Proposal

## Why

Na `AdsSmartTable`, a legenda (`caption`) aparece colada na borda esquerda e no
topo do contêiner arredondado da tabela, sem respiro, enquanto o cabeçalho e as
células usam o espaçamento de densidade. O contêiner com borda
(`ads-smart-table-scroll`) é da `AdsSmartTable`; `AdsTableCaption` não define
espaçamento horizontal nem superior, o que é correto para `AdsTable` usada
isoladamente, sem borda.

## What Changes

**Biblioteca reutilizável (`packages/admin`)**

- `AdsSmartTable`: a legenda visível dentro do contêiner da tabela passa a ter
  o mesmo espaçamento horizontal das células e o espaçamento vertical da
  densidade, alinhando-se ao conteúdo da tabela. A legenda oculta
  (`hideCaption`) continua oculta visualmente e no DOM.

**Aplicações de demonstração e documentação**

- Nenhuma mudança de código no admin demo; a verificação confirma o resultado
  visual na rota de clientes e nas stories de `SmartTable`.

## Objetivos e fora do escopo

Objetivo: legenda alinhada ao conteúdo da tabela dentro da `AdsSmartTable`, sem
mudar API pública nem `AdsTable`.

Fora do escopo: alterar `AdsTableCaption` ou `AdsTable` isolados; novas props;
mudar tokens de densidade.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `smart-table`: adiciona o requisito de alinhamento da legenda dentro do
  contêiner da tabela.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/admin`, `AdsSmartTable`. Nenhuma prop,
  tipo, export, classe `ads-*` ou variável `--ads-*` muda; compatibilidade
  retroativa preservada. A legenda ganha espaçamento de forma intencional.
- **Dependências**: nenhuma.
- **Consumidores**: a legenda deixa de encostar na borda, sem configuração.
