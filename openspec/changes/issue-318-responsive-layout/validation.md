# Evidências — #318

## Verificado

- Base `develop` `8ff38e1b0872edf4ce9b0e71584c5f5624f18b8b`; branch `feat/318-responsive-layout-patterns`.
- Change `issue-318-responsive-layout` ativa. Decisão B (quatro classes CSS); sem exports React novos, dependências, tokens ou alterações de consumidores externos.
- Implementação, três exemplos do Admin Demo, stories e novos testes versionados. **Testes escritos não são testes executados.**

## Gates (a registrar apenas após execução observável)

- [ ] `npm run format`
- [ ] `npm run lint`
- [ ] `npm run build` (pacotes, Next.js e Storybook)
- [ ] `npm run typecheck`
- [ ] `npm run test:quality`
- [ ] `npm run test:e2e`
- [ ] `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`
- [ ] `npm run inspect:packages`: medida de antes/depois com mesmo toolchain
- [ ] CI, Security, Pages e Playwright no SHA final da PR
- [ ] Inspeção humana das capturas da auditoria
- [ ] Zoom real 200% e leitor de tela (humano)

Não confundir viewport efetiva estreita com zoom nativo. Nenhuma aprovação humana é presumida. Archive, merge e fechamento estão proibidos nesta execução.

## Primeira CI da PR #327 (SHA ce215ee; 15/11/2026)

- `Política de develop`: success (inclui OpenSpec strict; confirmar log granular).
- `Segurança / npm audit`, `Gitleaks`, `CodeQL`: success; Pages `Construir o site`: success; publicação pulada em PR, conforme esperado.
- `Qualidade rápida`: failure em `npm run format`; Prettier identificou 10 arquivos para formatação, a corrigir com ferramenta do próprio repo.
- `Artefatos de distribuição`: failure em budget 305176 > 305000 B (+176 B); novo limite medido 305200 B, demais tetos preservados.
- `Chromium 2/2`: 252 passed e 1 failed, overflow local em grade aninhada no reflow de 195px. Ajuste de `overflow-wrap:anywhere` específico da demo, sujeito a reteste. Firefox e WebKit success na primeira execução.
- Nenhuma dessas falhas é omitida ou contada como aprovação. Checks finais serão reavaliados após correções.
