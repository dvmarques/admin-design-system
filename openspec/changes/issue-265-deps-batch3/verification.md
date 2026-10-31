# Verificação do lote 3 da issue #265 — 31/10/2026

## Base e mudanças

Branch `issue-265-deps-batch3` originada da `develop` após os merges #266 e #270; PR parcial [#278](https://github.com/dvmarques/admin-design-system/pull/278). Node **v24.22.1**, npm **11.19.1**, `engines.node >=24.0.0` sem teto. Versions do lockfile: TypeScript **6.0.3**, Vitest e coverage-v8 **5.0.5**, jsdom **30.1.3**, lint-staged **17.6.0**. Vite permanece **8.3.5**, compatível com o peer do Vitest 5. Não há alteração de React, Next ou Storybook em relação ao lote 2.

## Evidências de execução

- [Preflight temporário #41199697708](https://github.com/dvmarques/admin-design-system/actions/runs/41199697708): `npm ci --ignore-scripts`, `npm ls --depth=0`, `npm run format`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:quality`, `npm run test:coverage`, inspeções de pacotes, builds docs/demo/Pages, teste de saída Storybook, smoke `lint-staged` com arquivo staged e `npx @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` aprovados. Workflow temporário era read-only e foi removido da branch da PR.
- [CI oficial #41200069724](https://github.com/dvmarques/admin-design-system/actions/runs/41200069724), commit `82e28b7`: qualidade, lint, typecheck, cobertura, compilação dos quatro pacotes, consumo de tarballs/Next externo e **455 testes E2E Chromium** aprovados; Firefox e WebKit aprovados separadamente.
- [Pages #41200069680](https://github.com/dvmarques/admin-design-system/actions/runs/41200069680): site estático e **30 testes de Pages** aprovados. Publicação do site não se aplica a PR e foi pulada corretamente.
- [Security Gate #41200069735](https://github.com/dvmarques/admin-design-system/actions/runs/41200069735): `npm audit`, Gitleaks e CodeQL aprovados. O gate não substitui investigação de riscos não cobertos.
- [CI do lote 2 #41164508809](https://github.com/dvmarques/admin-design-system/actions/runs/41164508809) usada como referência de regressão e [PR #270](https://github.com/dvmarques/admin-design-system/pull/270) como baseline de auditoria.

## Regressões corrigidas

A primeira validação com TypeScript 6 revelou `TS2882` em `apps/docs/src/highlighted-code.stories.tsx` (import CSS por efeito colateral); foi adicionada a declaração explícita do subpath em `apps/docs/src/highlighted-code-css.d.ts`. Sem `@ts-ignore`, sem desligar a verificação de imports e sem alterar a API pública. O `clearMocks: false` explícito preserva a semântica do Vitest 4 na migração para 5.

## Auditoria e escopo

Em 31/10/2026, `npm audit --json` no grafo completo: **14 moderate, 0 high, 0 critical**. Em produção (`npm audit --omit=dev --json`): **0 findings**. Contagens iguais ao lote 2; relatórios e advisories heredados (`glob`, `minimatch`) permanecem documentados na #265/#267, sem uso de `npm audit fix --force`.

Comparação do lockfile `develop` versus lote 3: **644 → 592 entradas**; alterações transitivas concentradas em Vitest e jsdom. A regressão de TypeScript foi corrigida apenas em `apps/docs`; contrato público dos quatro pacotes, CSS, tokens, React/Next/Storybook e regras de branch preservados.

## Pendências e limites

- `npm outdated` ainda não foi executado como comando; diferenciar elegíveis de exceções intencionais (`@types/node` na linha 24 e TypeScript 7 incompatível com typescript-eslint 8.72.1).
- `npm run validate` ainda não foi executado literalmente em um único ambiente; seus componentes obrigatórios foram verificados em preflight e CI separadamente, incluindo E2E, sem substituir a evidência exigida para a tarefa específica.
- CI no commit documental final deve ser confirmada depois deste registro; checks pulados não são equivalentes aos checks completos anteriores. Não fazer merge, publicar, arquivar a change nem fechar a #265 sem gates e autorização.
