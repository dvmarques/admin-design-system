## Why

A #265 já entregou os lotes 1 (PR #266) e 2 (PR #270) em `develop`. O lote 3 moderniza o toolchain de testes, compilação TypeScript, DOM de teste e hooks, preservando os contratos da biblioteca e a qualidade de distribuição. A migração atinge múltiplos pacotes e a compatibilidade do build; **perfil Critical** conforme `AGENTS.md` e `docs/ai-development-workflow.md`.

## What Changes

- Atualizar `typescript` de 5.9.3 para **6.0.3**, sem forçar TypeScript 7 (suporte oficial de `typescript-eslint@8.72.1`: `>=4.8.4 <6.1.0`).
- Atualizar `vitest` e `@vitest/coverage-v8` conjuntamente de 4.1.12 para **5.0.5**; verificar resolução Vite >=6.4, cobertura, mocks e runners nos workspaces.
- Atualizar `jsdom` de 29.1.1 para **30.1.3**; executar testes com Node 24 de patch compatível (>=24.15) sem limitar `engines.node >=24.0.0` da biblioteca.
- Atualizar `lint-staged` de 16.4.0 para **17.6.0**, verificar Husky, lint e formatação sem modificar arquivos não relacionados.
- Regenerar o lockfile com npm 11.19.1, conferir peers/engines e `npm audit` antes/depois, preservando registros de risco residual.
- Validar testes unitários, artefatos publicados, tipos `.d.ts`, Storybook, Next.js, E2E Chromium/Firefox/WebKit, Pages e Security Gate. Documentar diferenças e regressões reais.

## Impact

- **Bibliotecas:** `packages/tokens`, `components`, `admin`, `highlighted-code` — somente toolchain e outputs; preservar exports, peers React 18/19, CSS e classes/tokens públicos.
- **Aplicações:** `apps/docs` e `apps/admin-demo` — build, geração de API, consumidores e testes; sem recursos de produto novos.
- **Qualidade:** runner Vitest, DOM, cobertura, ferramentas TypeScript e lint-staged; não alterar identidade visual nem baselines sem motivo.
- **Node:** permanecer na linha 24 na CI e na `.nvmrc`, npm 11.19.1 e `engines.node >=24.0.0` sem teto.

## Out of Scope

- TypeScript 7 sem suporte oficial de `typescript-eslint`; versões beta/RC.
- Hardening dos workflows (#268), scanners ou Dependabot (#267), alterações de rulesets ou aprovações.
- Mudança intencional de API, CSS, tokens, release npm, alteração da branch de destino, merge ou fechamento da #265.
