## Why

A issue #265 prevê três lotes. O primeiro está integrado à `develop` via PR #266. Este segundo lote atualiza Storybook, Playwright e axe-core e resolve o bloqueio de acessibilidade identificado anteriormente, sem misturar as migrações maiores do lote 3.

## What Changes

- Sincronizar `storybook`, `@storybook/addon-docs` e `@storybook/react-vite` em 10.6.5.
- Alinhar `@playwright/test`, executáveis e imagens `mcr.microsoft.com/playwright` de CI, Pages e baselines em 1.64.1; verificar referências hardcoded e lockfile.
- Subir `axe-core` de 4.12.1 para 4.14.0 e corrigir o `label-content-name-mismatch` dos gatilhos da conta e da organização, preservando UX, temas e foco.
- Reauditar dependências (produção vs desenvolvimento), testar E2E e distribuição pública.

## Impact

- `packages/admin`: rótulos acessíveis dos gatilhos, sem alteração da API pública ou do layout.
- `apps/docs`: versões Storybook e build da documentação.
- `apps/admin-demo` e `e2e`: testes de acessibilidade, consumo externo, três navegadores e Pages.
- `.github/workflows`: atualização estritamente da versão da imagem Playwright; hardening por SHA, permissões e digest permanece na #268.
- Node 24/nvmrc, npm 11.19.1, `engines.node >=24.0.0`, contratos `@dvmarques/admin-ds-*` e linha `[0.1.1]` preservados.

## Out of Scope

- Lote 3: TypeScript 6, Vitest 5, jsdom 30, lint-staged 17.
- Implementação do security gate (#267) e hardening/permissions/digest (#268).
- Publicação npm, regras de branches, merge automático ou fechamento da #265.
