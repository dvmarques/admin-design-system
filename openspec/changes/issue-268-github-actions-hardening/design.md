## Decisão de segurança e compatibilidade

1. **Actions**: SHA completo para cada `uses` externo, comentário de major; verificação dos tags oficiais contra refs da API GitHub em 31/10/2026. O Dependabot já atualiza GitHub Actions semanalmente em develop, porém qualquer alteração requer revisão de proveniência, release notes, permissões e nova CI. Actions locais não mudam.
2. **Playwright**: digest de OCI Image Index `sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea` do MCR para `v1.64.1-noble`; versão/tag legíveis em comentário e auditoria. A atualização de Playwright da #265 exige atualizar, em uma só PR, os três workflows, `@playwright/test`, lockfile e digest confirmado no MCR. Teste fail-closed contra divergência de versão e hash entre jobs.
3. **Menor privilégio**: `contents: read` na validação e no workflow de baselines, `contents: write` somente no job que grava PNGs. CodeQL mantém `security-events: write`, Pages deploy mantém `pages: write` e `id-token: write` e release publish mantém `contents: write` exclusivamente no job já isolado por #195. `persist-credentials: false` evita deixar o token no checkout de código não confiável.
4. **Baselines**: `workflow_dispatch` somente em ref `refs/heads/*` do mesmo repositório, excluindo develop/master/release/*, recebe checkout pelo SHA exato do evento sem credenciais, roda instalação/build/Chromium sem escrita, publica apenas PNGs gerados em artifact. Um job separado, executando código fixo no workflow (sem rodar código do checkout), baixa artefatos e restringe alterações a `e2e/*.spec.ts-snapshots/*.png`, rejeita outras extensões/symlinks, verifica branch e SHA remoto antes do commit, e só então usa token com escrita para push `HEAD:<branch>` sem force. Checkout da mesma revisão impede gravar sobre commits posteriores; o diff fica visível na PR. Artefatos são dados não confiáveis, nunca comandos executáveis.
5. **Tratamento de PRs**: manter `pull_request` (não `pull_request_target`), jobs Draft skipped, nada de secrets extras; não alterar nomes de required checks, publicação Pages, semântica de release ou testes em três browsers. `npx --yes @fission-ai/openspec@1.15.0` continua com versão exata; mesmo assim é execução dinâmica fora do lockfile (risco residual documentado).
6. **Trade-offs**: pin por SHA/digest aumenta revisão manual em upgrades; usar upload/download-artifact aumenta tempo e armazenamento de CI do fluxo manual; separar job de escrita reduz significativamente superfície privilegiada. Se o workflow manual falhar na validação e2e, não haverá push. Rollback é reverter esta PR após análise de segurança, sem relaxar proteção de branch.

## Matriz de permissões (planejamento)

| Workflow/job | Antes | Depois |
| --- | --- | --- |
| CI quality/build/e2e | contents: read (global), checkout com credenciais persistentes | contents: read, checkout sem persistência |
| CI develop-policy/release-check | contents: read + pull-requests: read | iguais, checkout sem persistência |
| Pages build | contents: read (global) | igual, checkout sem persistência |
| Pages deploy | pages: write + id-token: write | igual, isolado |
| Security Gate SAST | contents: read + security-events: write | igual, checkout sem persistência |
| Security Gate SCA/Gitleaks | contents: read; Gitleaks pull-requests: read | iguais, checkout sem persistência |
| Release resolve-validate | contents: read + pull-requests: read | igual, checkout sem persistência |
| Release publish | contents: write + pull-requests: read | igual, código confiável, checkout sem persistência |
| Métricas | actions: read + contents: read | igual, checkout sem persistência |
| Baselines update | contents: write para install/build/test/push | gerar: contents: read; gravar: contents: write, sem testes/instalação |

## Revisão, evidência e riscos

- Provar comportamento de jobs via `npm run test:ci`, OpenSpec estrito, CI, Pages e Security Gate no SHA final; CI em PR Ready executa E2E Chromium/Firefox/WebKit.
- A verificação de fluxo manual com push precisa de execução explícita em uma branch descartável quando autorizada; não executar workflow_dispatch em branch do produto sem necessidade. Uma PR verde não comprova o push manual.
- Nenhuma alteração pública de React/Tailwind/CSS/tokens/Server Components, Storybook ou telas; testes de UI atuais protegem contra regressão indireta.
