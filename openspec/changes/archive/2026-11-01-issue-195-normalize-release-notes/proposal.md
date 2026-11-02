# Proposal

## Why

A tentativa autorizada de concluir a publicação da release 0.1.1 foi bloqueada antes de qualquer escrita porque o job privilegiado calculou o hash das notas incluindo o marcador editorial interno, enquanto a validação read-only já o remove. O processo precisa usar a mesma representação pública das notas em todas as etapas para permitir publicação e retomada consistentes.

## What Changes

- Fazer a publicação e a validação idempotente derivarem as notas com a mesma função canônica que remove o marcador editorial interno.
- Cobrir a divergência com teste de regressão e registrar a correção na seção em andamento do changelog.
- Preservar integralmente o changelog fechado da release 0.1.1.

**Fora de escopo:** disparar workflows de preparação/publicação, publicar pacotes, configurar Trusted Publishers, criar tags ou GitHub Releases, fazer merge ou fechar a issue #195.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `release-process`: define que as notas públicas extraídas do changelog excluem o marcador editorial interno e que hashes, comparação idempotente e publicação usam a mesma extração.

## Impact

- Código: `.github/scripts/publish-release.mjs`, usando `scripts/release-utils.mjs`.
- Testes: `scripts/release-workflows.test.mjs` e testes da extração canônica, se necessário.
- Documentação de versão: `CHANGELOG.md`, somente em `[0.1.2] - Em andamento`.
- Sem mudanças em APIs públicas, dependências, pacotes ou aplicação de demonstração.
- Perfil adaptativo: **Critical**, pois a alteração afeta o fluxo de release e a fronteira antes de escrita em GitHub.
