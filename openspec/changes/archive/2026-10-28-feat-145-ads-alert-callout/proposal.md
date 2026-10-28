# Proposal: AdsAlert / AdsCallout (issue #145)

## Why

Mensagens persistentes inline precisam de um contrato acessível e reutilizável, distinto do toast temporário, para formulários e operações administrativas.

## What Changes

- Adicionar `AdsAlert` com variantes info/success/warning/error, apresentações compact/callout, conteúdo arbitrário, título opcional, ícone e ações customizáveis, fechamento opcional e visibilidade controlada/não controlada.
- Exportar a API tipada em `@admin-ds/components`, usando tokens existentes sem dependência nova.
- Entregar testes, Storybook e catálogo interativo no Admin Demo na mesma PR.
- Documentar distinção de `AdsToast`, acessibilidade e integração.

## Scope

Pacote `packages/components`, aplicação `apps/admin-demo`, `apps/docs`, documentação, testes e changelog. Não alterar `#91`, `AdsToast` ou contratos de códigos de negócio `SU/ER/EP`; adaptador pertence ao Back Admin.

## Workflow risk

Critical: nova API pública, CSS distribuído, ARIA e consumidores em múltiplos pacotes. Sem alterações incompatíveis intencionais; rollback por remoção do export e seus consumidores novos.
