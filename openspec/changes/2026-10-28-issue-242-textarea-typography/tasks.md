# Tasks — issue #242

- [ ] 1. Reproduzir em /catalogo/textarea e consumidor Next sem reset e registrar computed font-family de Input, Textarea, Select e tokens ativos (critério: causa confirmada, captura antes).
- [x] 2. Corrigir no ponto compartilhado apropriado da biblioteca usando --ads-typography-font-family, preservando classe customizada e todos os estados (critério: família efetiva igual ao token sem hardcode).
- [x] 3. Verificar componentes dependentes do mesmo utilitário CSS e que nenhuma prop/export, altura ou função de controle mudou (critério: sem regressões de API, readonly/disabled/erro/foco).
- [ ] 4. Acrescentar testes de CSS/computed styles e visual/E2E: sm/md/lg, texto e placeholder, light/dark, com e sem preflight e token customizado (critério: fonte correta em todas as combinações críticas).
- [ ] 5. Atualizar story/exemplo, documentação pertinente e entrada Fixed de CHANGELOG.md (#242) ao implementar; revisar CSS compilado consumido no Next.js e Storybook (critério: apps e pacotes compõem controles sem Tailwind consumidor).
- [ ] 6. Revisão independente do diff e das capturas, correção dos achados; executar npx.cmd prettier --write, npm run format, npm run lint, npm run build, npm run typecheck, npm run test:quality, npm run test:e2e, npm run validate e openspec.cmd validate --all --strict. Confirmar nenhum E2E falho antes do commit; atualizar snapshots apenas para diferenças intencionais revisadas via update-visual-baselines.yml. Registrar evidências e comandos de diagnóstico.
