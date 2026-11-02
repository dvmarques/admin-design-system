# Proposal

## Why

A revisão da PR #293 encontrou que a spec de adoção ainda exigia avisos de indisponibilidade que já não correspondem aos pacotes publicados. Atualizar esse contrato evita que a documentação e as próximas mudanças reintroduzam instruções falsas.

## What Changes

- Esta correção complementa `2026-11-02-issue-195-post-publish-docs`, arquivada com `skip_specs: true`; o review da PR #293 identificou a necessidade de sincronizar o requisito OpenSpec em uma change separada.

- Atualizar o requisito de disponibilidade npm para cobrir pacotes publicados e pacotes ainda não publicados.
- Sincronizar a spec principal com o delta e arquivar esta correção após validação.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `consumer-adoption`: documentar disponibilidade real conforme o estado de publicação de cada pacote.

## Impact

Somente artefatos OpenSpec. Não altera pacotes, APIs, dependências ou a aplicação de demonstração. Relacionada à issue #195, sem fechá-la.
