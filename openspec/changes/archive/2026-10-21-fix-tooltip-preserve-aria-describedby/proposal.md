# Proposal

## Why

Enquanto aberto, o `AdsTooltip` aplica `aria-describedby` ao gatilho por
`cloneElement` e substitui o `aria-describedby` que o consumidor já definiu.
Um texto de ajuda ou de erro associado ao gatilho (por exemplo, um campo) deixa
de ser anunciado por tecnologias assistivas enquanto o tooltip está visível.
O comportamento é anterior à #91 e à PR #137 (issue #148).

## What Changes

**Biblioteca reutilizável (`packages/components`)**

- `AdsTooltip`: enquanto aberto, o `aria-describedby` do gatilho passa a conter o
  id do consumidor e o id do tooltip, nessa ordem, separados por espaço. Ao
  fechar, volta ao valor original do consumidor, ou sem o atributo se não havia.

**Aplicações de demonstração e documentação**

- Story em `apps/docs` com gatilho que já possui `aria-describedby`.
- Nenhuma mudança de código no admin demo.

## Objetivos e fora do escopo

Objetivo: preservar a descrição do consumidor enquanto o tooltip está aberto.

Fora do escopo: mudar tipos, exports, classes `ads-*` ou variáveis `--ads-*`;
alterar a forma de abertura e fechamento do tooltip (foco, hover); o
`AdsPopover`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `anchored-overlays`: o requisito de tooltip passa a exigir a preservação do
  `aria-describedby` do gatilho.

## Impact

- **Pacotes e APIs públicas**: `@admin-ds/components`, `AdsTooltip`. Nenhuma prop,
  tipo, export, classe ou variável CSS muda; compatibilidade retroativa
  preservada. Gatilhos sem `aria-describedby` se comportam como antes.
- **Dependências**: nenhuma.
- **Acessibilidade**: a descrição do consumidor continua anunciada com o tooltip
  aberto.
