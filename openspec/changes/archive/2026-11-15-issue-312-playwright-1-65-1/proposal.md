## Why

A issue #312 identifica divergência entre a versão de `@playwright/test`, o lockfile,
as imagens Playwright por digest na CI e os testes de supply chain. A PR #303
demonstrou que um bump isolado falha corretamente. A atualização para 1.65.1
deve preservar a reprodutibilidade do ambiente e impedir aprovação de regressão visual.

**Perfil: Critical** — dependência de execução de CI, segurança de supply chain,
imagens imutáveis e alteração transversal a workflows. Nenhuma API pública será alterada.

## What Changes

- Fixar `@playwright/test`, `playwright` e `playwright-core` em 1.65.1 no manifesto e no lockfile.
- Atualizar as imagens oficiais Noble por digest OCI verificável nos workflows
  `ci.yml`, `pages.yml`, `update-visual-baselines.yml` **e**
  `visual-audit.yml` (o quarto é exigido pelo contrato atual de segurança).
- Alinhar os checks de versão e digest em `ci.yml` e
  `scripts/verify-workflow-supply-chain.mjs`.
- Atualizar `docs/quality.md` e `docs/security/workflow-hardening.md`
  com versão, índice OCI, digest e procedimento de verificação.
- Verificar baselines Linux por diffs reais; regenerar somente imagens intencionais,
  com revisão humana, sem relaxar as comparações.

## Out of Scope

- Bumps do grupo `npm-development` não relacionados; alteração de hospedagem,
  publicação npm, API de componentes, tolerância visual ou estratégia de baselines.

## Impact

- Infraestrutura de desenvolvimento, QA, CI, Pages, auditoria visual e segurança.
- Bibliotecas `packages/*`, CSS distribuído, APIs públicas e interfaces visuais
  não são alterados. Demo e Storybook são consumidores de teste, sem mudança funcional.
- Sem mudança deliberada de tema, acessibilidade, responsividade, configuração
  de Tailwind ou fronteiras Server/Client.
- Dependências adicionais de runtime: nenhuma; apenas atualização de `devDependencies`
  já existentes.
- Sem nota no `CHANGELOG.md`: atualização exclusivamente interna da infraestrutura
  de testes, sem impacto a quem consome pacotes. Registrar justificativa na PR.

Issue: https://github.com/dvmarques/admin-design-system/issues/312
Referências: #171, #268, #303.
