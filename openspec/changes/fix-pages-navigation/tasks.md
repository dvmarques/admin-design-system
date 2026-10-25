# Tasks

## 1. Navegação

- [x] 1.1 Mover Storybook para a navegação com contrato público existente; verificar presença opcional, nome acessível, nova aba e ausência no cabeçalho nos testes unitários e Pages.
- [x] 1.2 Atualizar docs/github-pages.md e CHANGELOG.md com a localização e a correção da issue #189; conferir diff.

## 2. Regressão Pages

- [ ] 2.1 Corrigir teste de marca para somente logo visível e cobrir desktop expandido/recolhido e celular com menu fechado/aberto; executar build:pages e test:e2e:pages nos dois temas.

- [ ] 2.2 Executar build e testes Pages em PRs para develop sem publicação; validar condições de deploy com testes de contrato do workflow e confirmar execução Linux na PR.

## 3. Integração

- [ ] 3.1 Executar lint, build normal (inclui Storybook), typecheck, test:quality e test:e2e, confirmando comportamento e consumo de CSS compilado. Não gerar snapshots Windows; registrar limitação e conferir snapshots Linux na CI.
- [x] 3.2 Formatar arquivos alterados com Prettier, executar npm run format e openspec.cmd validate --all --strict.
- [ ] 3.3 Submeter PR para develop e verificar checks do SHA atual, sem merge automático. Logs verbosos: test:verbose e test:e2e:verbose.

## Evidências locais

- npm ci --ignore-scripts: aprovado, sem vulnerabilidades reportadas.
- npm run build, lint, typecheck, format e validação OpenSpec estrita: aprovados.
- Testes unitários: 61 arquivos, 1065 testes aprovados. Repetição focal: 84 aprovados; timeout sob concorrência não se repetiu isoladamente.
- npm run test:e2e -- --ignore-snapshots: 305 aprovados em Chromium, Firefox e WebKit. Baselines Linux ficam para CI.
- npm run test:quality: bloqueado no Windows pelo teste preexistente scripts/ci-impact.test.mjs (safe.directory=/work versus C:\work); demais verificações posteriores de skills e tokens executadas separadamente e aprovadas.
- npm run build:pages: aprovado. npm run test:e2e:pages: 12 aprovados, incluindo os seis cenários novos do Storybook; 12 falhas por 404 de prefetch exportado como diretórios pelo Next.js no Windows. Manter validação Linux pendente, sem ignorar erros.
- Revisão visual local: Storybook na mesma lista de Catálogo em desktop expandido, recolhido e celular; cabeçalho sem link.
- node --test scripts/ci-workflow.test.mjs: 10 aprovados, incluindo proibição de deploy em PR/branch diferente de develop.
