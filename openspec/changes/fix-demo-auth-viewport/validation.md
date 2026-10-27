# Evidências de validação

- Perfil Standard; composição interna do demo, sem mudança de API ou pacote público.
- `npm run validate` executado: identificou seletor interno proibido no CSS, corrigido com classes demo. Etapas oficiais refeitas: format, lint, build (pacotes, Storybook e Next.js), typecheck e test:quality passaram; 65 arquivos e 1.092 testes Vitest passaram, além das verificações Node, release, CI e skills.
- `openspec.cmd validate --all --strict`: 57 itens válidos.
- `npx.cmd playwright test e2e/auth-demo.spec.ts --config=node_modules/.cache/login-viewport.config.cjs --project=chromium --reporter=dot`: 83 passaram.
- `npm run test:e2e -- --config=node_modules/.cache/login-viewport.config.cjs --ignore-snapshots`: 394 passaram em Chromium, Firefox e WebKit após remover a porta fixa da asserção de permanência na página da saída simulada. Configuração temporária não versionada usa 3106 para preservar servidor existente na porta 3000. Comparações visuais Linux ficam para a CI; nenhum baseline foi atualizado localmente.
- Login testado sem rolagem nos dois temas em 1920×915, 1280×720, 768×600, 390×667 e 320×568. Fallback testado em 320×256 nas três rotas, após erro e com teclado.
- Conferência visual em 1920×915 e 320×568 no servidor dev: alturas de documento e viewport coincidem (915 e 568), sem overflow do formulário. Demo dev na porta 3107 e Storybook dev na porta 6106 iniciados e encerrados após a conferência.
- Claude Code realizou revisão independente somente de leitura. Corrigidos foco do scroller, nome acessível e seletor por label; última revisão: sem findings acionáveis restantes. A revisão não substitui aprovação humana nem execução dos testes.
- Change ativa; archive/sync e merge aguardam os gates e autorização aplicáveis.
