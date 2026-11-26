# Proposal

## Why

Na POC de migração de uma aplicação consumidora (#343), o `AdsPageHeader` obrigou cada consumidor a reescrever o eyebrow acima do H1 e a criar um contêiner com altura mágica para alinhar ações à primeira linha do título. Além disso, não estava explícito quem distribui a fonte Inter.

## What Changes

- Nova prop opcional `eyebrow?: ReactNode` em `AdsPageHeader`, renderizada como `<p>` acima do H1 (11px, peso 600, `letter-spacing` 0,08em, `line-height` 1,25, texto secundário, 8px até o H1).
- As ações do cabeçalho passam a alinhar com a primeira linha do título, sem número mágico no consumidor, mantendo a quebra abaixo em larguras estreitas.
- O Admin Demo migra para a prop os `demo-kicker` dos cabeçalhos de página (Visão geral, Clientes, Novo cliente, Data display e Preferências) e passa a usar `AdsPageHeader` nesses cabeçalhos.
- Decisão sobre a Inter: os pacotes **não** distribuem a fonte (evita dependência de runtime e preserva a licença OFL na aplicação); a documentação passa a registrar a decisão, o exemplo Next.js e como sobrescrever `--ads-typography-font-family`.
- Fora do escopo: componente separado de eyebrow, eyebrows de painéis/seções (`demo-panel__eyebrow`, cabeçalhos de seção do Catálogo), hero do Catálogo e introdução de autenticação.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `page-composition`: eyebrow e alinhamento das ações no `AdsPageHeader`.
- `admin-demo-application`: cabeçalhos de página do Demo usam a prop `eyebrow`.

## Impact

Perfil **Critical**: nova prop em API pública e CSS distribuído de `components`. Compatível retroativamente: sem `eyebrow` o markup não muda; o alinhamento das ações muda apenas visualmente (centralizadas na primeira linha do H1 em vez de coladas ao topo). Consumidores afetados: `apps/admin-demo`, `apps/docs`. Sem novas dependências. Rollback: reverter o commit.
