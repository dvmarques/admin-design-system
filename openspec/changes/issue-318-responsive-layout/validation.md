# Evidências — #318

## Verificado

- Base `develop` `8ff38e1b0872edf4ce9b0e71584c5f5624f18b8b`; branch `feat/318-responsive-layout-patterns`.
- Change `issue-318-responsive-layout` ativa. Decisão B (quatro classes CSS); sem exports React novos, dependências, tokens ou alterações de consumidores externos.
- Implementação, três exemplos do Admin Demo, stories e novos testes versionados. **Testes escritos não são testes executados.**

## Gates (registrados com execução observável)

Referência de **código/CI** (não autorreferencial a commits só de documentação): `452283bc9d94a0a6ac78c71c69d174a141600b06`.

- [x] `npm run format` — CI [Qualidade rápida #43752585078](https://github.com/dvmarques/admin-design-system/actions/runs/43752585078) no SHA de código/CI; repetido em [CI #43754770088](https://github.com/dvmarques/admin-design-system/actions/runs/43754770088) após o commit de docs `de561ad` (mesmo diff de implementação).
- [x] `npm run lint` — mesmas execuções.
- [x] `npm run build` (pacotes, Next.js e Storybook) — mesmas execuções.
- [x] `npm run typecheck` — mesmas execuções.
- [x] `npm run test:quality` — Vitest **1.583/1.583** e testes Node **154/154** na CI de código/CI.
- [x] `npm run test:e2e` — Playwright Chromium **261/261** + **253/253**, Firefox **26/26**, WebKit **25/25**; agregador de navegador **success** no SHA de código/CI.
- [x] `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive` — política de develop **71/71** no SHA de código/CI; revalidação local nesta execução R1.
- [x] `npm run inspect:packages`: medida antes/depois (develop `8ff38e1` → PR no SHA de código/CI); tetos ajustados somente após falha medida — ver `docs/bundle-measurement.md`.
- [x] CI, Security e Pages no SHA de código/CI — [CI #43752585078](https://github.com/dvmarques/admin-design-system/actions/runs/43752585078) **success**; [Security #43752584975](https://github.com/dvmarques/admin-design-system/actions/runs/43752584975) **success**; [Pages #43752584972](https://github.com/dvmarques/admin-design-system/actions/runs/43752584972) construção **success** (publicação PR **skipped**). Novo push de documentação disparou [CI #43754770088](https://github.com/dvmarques/admin-design-system/actions/runs/43754770088), [Security](https://github.com/dvmarques/admin-design-system/actions/runs/43754770110) e [Pages #43754770029](https://github.com/dvmarques/admin-design-system/actions/runs/43754770029) no HEAD `de561ad` (somente OpenSpec tasks).
- [ ] Inspeção humana das capturas da auditoria focal — **24/24 capturas automatizadas** inspecionadas pelo agente ([artefato #14176183377](https://github.com/dvmarques/admin-design-system/actions/runs/43751285029/artifacts/14176183377), SHA `ca6b042`); aceite visual humano e matriz `docs/visual-audit-inventory.md` permanecem **Pendente** (Daniel).
- [ ] Zoom real 200% e leitor de tela (humano) — viewport estreita e E2E não substituem; task 9 permanece aberta.

## Validação local R1 (Node 24.22.1, `CI=1 npm run validate`)

- Exit **0** após liberar porta `3000` ocupada por `next-server` residual do snapshot.
- Vitest **1583/1583** (86 arquivos); Playwright **565** aprovados, **1** ignorado.
- `npx --yes @fission-ai/openspec@1.15.0 validate --all --strict --no-interactive`: **71/71**.

Não confundir viewport efetiva estreita com zoom nativo. Nenhuma aprovação humana é presumida. Archive, merge e fechamento estão proibidos nesta execução.

## Primeira CI da PR #327 (SHA ce215ee; 15/11/2026)

- `Política de develop`: success (inclui OpenSpec strict; confirmar log granular).
- `Segurança / npm audit`, `Gitleaks`, `CodeQL`: success; Pages `Construir o site`: success; publicação pulada em PR, conforme esperado.
- `Qualidade rápida`: failure em `npm run format`; Prettier identificou 10 arquivos para formatação, a corrigir com ferramenta do próprio repo.
- `Artefatos de distribuição`: failure em budget 305176 > 305000 B (+176 B); novo limite medido 305200 B, demais tetos preservados.
- `Chromium 2/2`: 252 passed e 1 failed, overflow local em grade aninhada no reflow de 195px. Ajuste de `overflow-wrap:anywhere` específico da demo, sujeito a reteste. Firefox e WebKit success na primeira execução.
- Nenhuma dessas falhas é omitida ou contada como aprovação. Checks finais serão reavaliados após correções.

## Revisão visual e orçamento de cenário — R2

- No SHA `3087fd7`, inspeção do artefato [visual-318 #14176571034](https://github.com/dvmarques/admin-design-system/actions/runs/43750732492/artifacts/14176571034): 24/24 capturas aprovadas geometricamente (3 rotas, 2 temas, 4 larguras). **Inspeção visual do agente encontrou defeito real**: em 320px, H1 quebrava última letra por padding duplo. Corrigido em `.demo-semantic-page` com gutter local zero, sem afetar o contrato público do container; nova captura obrigatória.
- CI #43750739423 mediu `admin-public` CSS gzip **15.434 B**, teto anterior 15.400 B. Ajustado apenas o teto medido para **15.450 B**; cenário JS não mudou. Próxima CI precisa confirmar.
- Qualidade rápida no SHA de auditoria falhou porque o workflow temporário com imagem não constava do inventário. O arquivo temporário deve ser **removido antes da revisão final**, restaurando a política de supply chain, não adicionando exceções.

## Auditoria R3 e medição antes/depois

- `develop` SHA `8ff38e1` e feature SHA `3087fd7`, mesmo runner Node 24.22.2/npm 11.19.1: `components` JS/CSS **304.361 → 305.176 B**, gzip **91.473 → 91.657 B**, delta +815/+184 B; sem mudança no JS dos cenários. Evidência e novos tetos mínimos: `docs/bundle-measurement.md`.
- Auditoria visual focalizada após corrigir gutter duplo: [#43751230322](https://github.com/dvmarques/admin-design-system/actions/runs/43751230322), [artefato #14176417422](https://github.com/dvmarques/admin-design-system/actions/runs/43751230322/artifacts/14176417422), **24/24 capturas** de Chromium, três páginas, dois temas e 320/390/768/1440px. Imagens examinadas antes/depois: sumiu a letra órfã do H1, e campos, tabela e indicadores permaneceram legíveis. Última execução focalizada no SHA `ca6b042`: [#43751285029](https://github.com/dvmarques/admin-design-system/actions/runs/43751285029), **24/24 aprovadas**.
- O relatório genérico da auditoria #152 emitido pelo teardown mostra cobertura pendente do catálogo total; ele não foi executado nesta rodada focalizada e não deve ser declarado aprovado.
- Workflows de formatação e captura foram criados somente na branch para executar ferramentas indisponíveis localmente e retirados antes do SHA final de revisão. Nenhum workflow original foi modificado.
- Permanecem pendentes **zoom real 200%**, leitor de tela e aceite visual de revisor humano. Os testes de viewport estreita demonstram reflow, não substituem essas verificações.
