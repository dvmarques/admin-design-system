## Why

A #265 identificou atualizações para dependências externas do monorepo. As versões precisam ser sincronizadas entre manifests e lockfile para preservar instalações reprodutíveis e evitar incompatibilidades entre os workspaces, mantendo Node.js 24 na CI.

## What Changes

- Atualizar o primeiro lote de versões estáveis compatíveis: React/React DOM, Next.js (somente demo), typings React, Testing Library, esbuild, ESLint, prettier e typescript-eslint.
- Alinhar declarações repetidas na raiz e nos workspaces e regenerar o package-lock.json usando npm 11.19.1 sobre Node 24.
- Preservar engines.node >=24.0.0 sem limite superior; não atualizar @types/node para a linha 26.
- Manter intactas as APIs, exports, tokens e classes CSS públicas; testar builds, tipos, testes e consumo externo dos pacotes.
- Registrar verificações e eventuais incompatibilidades antes de marcar a PR como pronta.
- Incorporar a auditoria pontual exigida pelo complemento de segurança da #265: comparar npm audit do baseline Git com o lockfile atualizado, classificar exposição e tratar high/critical elegíveis neste escopo.

## Out of Scope

- `axe-core` 4.14.0: adiada para lote específico de remediação de acessibilidade. A nova regra detectou `label-content-name-mismatch` em elementos do shell; manter 4.12.1 exato neste lote para não mascarar uma quebra de CI.
- Migração para Node 26 ou adição de limite superior em engines.node.
- Atualizações de Playwright/Storybook e migrations TypeScript 6/Vitest 5/jsdom 30/lint-staged 17 (lotes posteriores da #265).
- Implantação de CodeQL, scanner de segredos, Dependabot e gate recorrente de auditoria (#267).
- Hardening amplo de GitHub Actions, fixação de SHAs/digests de imagens, permissões e workflows de snapshots (#268). A migração coordenada de Playwright no lote futuro da #265 seguirá as decisões da #268.
- Mudanças de comportamento, design, API pública, versões de release ou publicação npm.

## Impact

- Manifests raiz e apps/docs, apps/admin-demo; packages/* apenas quando uma dependência externa estiver declarada.
- Lockfile e cadeia de build/CI.
- Bibliotecas de tokens, components, admin e highlighted-code preservadas quanto ao contrato público; apps de consumo precisam passar nos testes.

## Risk profile

**Critical** — mudança de dependências compartilhadas entre múltiplos pacotes, incluindo React/Next e ferramentas de build. Implementar em lotes, registrar resolução npm, validar consumo e não fazer merge sem CI e revisão humana.

Issue: https://github.com/dvmarques/admin-design-system/issues/265
