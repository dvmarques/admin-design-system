# Design

## Context

`AdsPageHeader` usa `items-start` entre a intro e as ações. Com um botão de 32px ao lado de um H1 de 36px (linha de 45px), o botão fica no topo. O eyebrow existia só como CSS do Demo.

## Goals / Non-Goals

**Goals:** eyebrow tipado e estilizado pelo pacote; ações alinhadas à primeira linha do H1; documentar a Inter.

**Non-Goals:** novo componente, distribuição de fonte, mudança de tokens.

## Decisions

- Prop `eyebrow` no próprio `AdsPageHeader`, renderizada somente quando `!= null` (sem nó extra, como `description`/`actions`). Classe `ads-page-header__eyebrow`, com tokens existentes (`--ads-color-text-muted`, `--ads-spacing-2`, peso semibold).
- Eyebrow como linha própria do cabeçalho flex (`flex: 0 0 100%`) acima da intro, com margem negativa que compensa o `gap` para manter 8px até o H1; assim o H1 continua sendo a primeira linha da intro.
- Alinhamento: `align-items: first baseline` não serve com a intro contendo o eyebrow; as ações recebem `min-height` igual à altura da primeira linha do H1 (`font-size-4xl × line-height-tight`, tokens) e seguem centralizadas nela, mantendo `flex-wrap` para quebrar abaixo em larguras estreitas.
- O alinhamento é feito no pacote com valores derivados dos tokens tipográficos, sem número mágico no consumidor.

## Risks / Trade-offs

- Mudança visual nas ações de consumidores existentes → documentada no changelog; layout mais coerente, sem alteração de API.
- Orçamento de CSS de `components` → verificar `inspect:css`.
- Rollback: reverter o commit.
