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
