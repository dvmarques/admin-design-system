## Decisão e compatibilidade

Manter o ambiente oficial Playwright Noble com tag humana e digest OCI imutável.
A versão escolhida é **1.65.1**, sem faixa semver: manifest, lockfile, quatro
workflows e gates de verificação devem indicar a mesma versão.

Origem verificável: [Microsoft Artifact Registry](https://mcr.microsoft.com/en-us/product/playwright/tags),
tag `v1.65.1-noble`, **OCI Image Index**
`sha256:1507cbfc550a63a6b7396791ca4f00df17beb56342d2447b3f106c306f525579`,
publicado em 13/11/2026. O digest é do **índice** multi-arquitetura, não o hash
de uma imagem de arquitetura específica. Pacotes npm continuam verificados
por `integrity` SHA512 no `package-lock.json`.

## Alternativas e trade-offs

- Apenas alterar o `package.json`: rejeitado, diverge das imagens e falha no gate.
- Usar tag `v1.65.1-noble` sem digest: rejeitado por mutabilidade da referência.
- Atualizar só os três workflows da issue: rejeitado; o teste
  `verify-workflow-supply-chain.mjs` também protege `visual-audit.yml`.
- Regenerar snapshots automaticamente: rejeitado; mudança de versão de browser
  não comprova intenção de mudança visual.
- Trocar image base ou instalar browsers via `playwright install`: fora de
  escopo e perde reprodutibilidade/otimização existente.

## Limites técnicos

`@playwright/test` é devDependency da raiz; `playwright` e
`playwright-core` são transitivas e permanecem na mesma versão. O container
fornece os browsers e dependências de sistema; `npm ci --ignore-scripts`
instala o runner. O passo de CI também confere o executável de Chromium,
Firefox e WebKit antes dos testes.

Não há mudanças de código dos pacotes, APIs React, limites de Client/Server
Components, semântica de acessibilidade, CSS/Tailwind, tokens, bundles
distribuídos ou comportamento da Demo. Storybook/Next.js continuam sendo
validados via build e E2E.

## Validação, riscos e rollback

1. Verificar as quatro referências de imagem e o lockfile com teste de supply
   chain; `npm ci` não pode alterar o lockfile.
2. Rodar `npm run validate` e OpenSpec estrito. CI/Pages/Security devem executar
   efetivamente no SHA final; Chromium completo (dois shards), Firefox, WebKit
   e testes de Pages são gates, não apenas jobs presentes.
3. Se screenshots falharem, examinar diffs e caracterizar diferenças antes de
   disparar o workflow Linux. Qualquer regeneração requer revisão dos PNGs.
4. Se algum browser falhar por incompatibilidade, diagnosticar e corrigir
   sem eliminar testes, desabilitar snapshots ou ampliar tolerâncias.
5. Rollback: reverter o conjunto **atômico** (manifest/lock, quatro imagens,
   checks e docs) para 1.64.1 e seu digest anterior, nunca apenas uma parte.

A atualização pode mudar motores de browser e, portanto, diferenças visuais
podem ocorrer mesmo sem alterações do código da aplicação. CI verde não substitui
revisão visual quando há mudança de snapshot. Segurança da execução mantém
permissões e segregação dos workflows existentes.
