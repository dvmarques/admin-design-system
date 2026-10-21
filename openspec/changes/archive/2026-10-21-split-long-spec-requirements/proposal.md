# Proposal

## Why

Dez requisitos em nove specs passam de 500 caracteres, e `openspec validate --all
--strict` falha por esse aviso desde antes da #148. Os requisitos acumulam
detalhes e casos de borda que pertencem a cenários.

## What Changes

**Specs (sem mudança de código)**

- Cada requisito longo é reescrito com até 500 caracteres, mantendo as mesmas
  obrigações (`MUST` e `MUST NOT`). Os detalhes que saíram do texto já estavam em
  cenários ou foram movidos para eles; poucos cenários novos explicitam
  comportamentos antes só citados no requisito.

## Objetivos e fora do escopo

Objetivo: `openspec validate --all --strict` passar sem avisos.

Fora do escopo: mudar comportamento, componentes, tokens ou testes; reescrever
requisitos que já estão dentro do limite.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `admin-flows`, `anchored-overlays`, `dashboard-metric-card`,
  `dashboard-panel-states`, `data-tables`, `date-picker`, `form-controls`,
  `navigation-menus` e `quality-assurance`: redação dos requisitos listados nos
  deltas.

## Impact

- **Pacotes e APIs públicas**: nenhum. Sem mudança de código, API, classes ou
  variáveis CSS.
- **Dependências**: nenhuma.
- **Acessibilidade e integração**: sem efeito; o comportamento observável é o
  mesmo.
