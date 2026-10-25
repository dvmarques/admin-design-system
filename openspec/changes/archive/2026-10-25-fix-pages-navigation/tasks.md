# Tasks

## 1. Navegação

- [x] 1.1 Mover Storybook para a navegação com contrato público existente; verificar presença opcional, nome acessível, nova aba e ausência no cabeçalho nos testes unitários e Pages.
- [x] 1.2 Atualizar docs/github-pages.md e CHANGELOG.md com a localização e a correção da issue #189; conferir diff.

## 2. Regressão Pages

- [x] 2.1 Corrigir teste de marca para somente logo visível e cobrir desktop expandido/recolhido e celular com menu fechado/aberto; executar build:pages e test:e2e:pages nos dois temas (validação fiel Linux da PR).

- [x] 2.2 Executar build e testes Pages em PRs para develop sem publicação; validar condições de deploy com testes de contrato do workflow e confirmar execução Linux na PR.

## 3. Integração

- [x] 3.1 Executar lint, build normal (inclui Storybook), typecheck, test:quality e test:e2e, confirmando comportamento e consumo de CSS compilado. Não gerar snapshots Windows; registrar limitação e conferir snapshots Linux na CI.
- [x] 3.2 Formatar arquivos alterados com Prettier, executar npm run format e openspec.cmd validate --all --strict.
- [x] 3.3 Submeter PR para develop e verificar checks do SHA atual, sem merge automático. Logs verbosos: test:verbose e test:e2e:verbose.

- [x] 3.4 Executar revisão independente somente leitura pelo Claude CLI após os checks aprovarem; conferir achados acionáveis antes de solicitar revisão humana.

## Evidências locais

- npm ci --ignore-scripts: aprovado, sem vulnerabilidades reportadas.
- npm run build, lint, typecheck, format e validação OpenSpec estrita: aprovados.
- Testes unitários: 61 arquivos, 1065 testes aprovados. Repetição focal: 84 aprovados; timeout sob concorrência não se repetiu isoladamente.
- npm run test:e2e -- --ignore-snapshots: 305 aprovados em Chromium, Firefox e WebKit. Baselines Linux ficam para CI.
- npm run test:quality: bloqueado no Windows pelo teste preexistente scripts/ci-impact.test.mjs (safe.directory=/work versus C:\work); demais verificações posteriores de skills e tokens executadas separadamente e aprovadas.
- npm run build:pages: aprovado. npm run test:e2e:pages: 12 aprovados, incluindo os seis cenários novos do Storybook; 12 falhas por 404 de prefetch exportado como diretórios pelo Next.js no Windows. Manter validação Linux pendente, sem ignorar erros.
- Revisão visual local: Storybook na mesma lista de Catálogo em desktop expandido, recolhido e celular; cabeçalho sem link.
- node --test scripts/ci-workflow.test.mjs: 10 aprovados, incluindo proibição de deploy em PR/branch diferente de develop.

## Evidências Linux e revisão

- Commit de implementação validado: `d88f2db2a6d5d1b2c0a39c8abcf33ab4aa542c9c`.
- CI: https://github.com/dvmarques/admin-design-system/actions/runs/40215898179 — qualidade, distribuição, política de develop e E2E Chromium (incluindo snapshots), Firefox e WebKit aprovados. Validação de release pulada, pois não se aplica.
- Pages: https://github.com/dvmarques/admin-design-system/actions/runs/40215898143 — build e suíte Pages aprovados em Linux; publicação pulada como esperado na PR. Isso conclui as validações bloqueadas pelas limitações Windows descritas acima.
- Claude CLI, executado somente leitura após os checks: revisão concluída com sucesso, sem achados P0–P2 nem bloqueadores. Observação P3 sobre checkboxes resolvida nesta atualização; comentário explicativo adicional sobre âncora nativa é opcional e a decisão já está registrada em design.md.
- PR #190 pronta para revisão humana; label bug e assignee dvmarques. Issue original #187 recebeu comentário vinculando a correção e a issue complementar #189. Sem merge, deploy ou arquivamento da change.
