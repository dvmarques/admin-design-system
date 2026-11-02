# Tasks — AdsOTPInput (#146)

## Planejamento e API

- [x] Ler issue, contratos dos inputs, catálogos e políticas; definir perfil Critical e API.
- [x] Criar proposta, design, especificação e tarefas OpenSpec; revisar cenários de compatibilidade e acessibilidade.

## Biblioteca

- [x] Implementar AdsOTPInput com código numérico, 4/6+ dígitos, colagem/autofill e navegação nativa.
- [x] Implementar valores controlado/não controlado, callbacks e tratamento de mutações externas/completude.
- [x] Integrar AdsField, estados, ref e classes de tema; export público e compilação CSS validados no CI.

## Demonstração e documentação

- [x] Adicionar página navegável no catálogo do Admin Demo com estados funcionais.
- [x] Adicionar stories Storybook com uso básico, interações, controles e estados.
- [x] Atualizar guia do componente e CHANGELOG da versão em andamento.

## Verificação

- [x] Adicionar e executar testes unitários, interação, formulário e acessibilidade (incluindo regressões).
- [x] Adicionar e executar E2E no Admin Demo com verificação de teclado, responsividade e temas.
- [x] Executar build, typecheck, lint, testes de qualidade, consumo Next.js e avaliação de CSS distribuído.
- [x] Executar a suíte E2E completa no CI via Playwright em shards Chromium 1/2 e 2/2, Firefox e WebKit; equivalente à cobertura de `npm run test:e2e` (o comando literal não foi executado).
- [x] Revisar código, formatar arquivos alterados e executar `npm run format`.
- [x] Executar `openspec validate --all --strict` (job Política de develop); registrar evidência real.
- [x] Validar todos os gates do fluxo npm run validate com evidência local e CI, registrando limitações por plataforma.

## Evidências verificadas em 2026-11-02

- PR #299: https://github.com/dvmarques/admin-design-system/pull/299, alvo develop. SHA final validado: 593f68e420f942a2fc762a1f69afdf4cd96cc923.
- CI **success** no SHA final: https://github.com/dvmarques/admin-design-system/actions/runs/41529966085. Passaram Qualidade rápida, Política de develop, Artefatos de distribuição, Chromium 1/2 e 2/2, Firefox, WebKit e agregador E2E.
- Security Gate **success** no SHA final: https://github.com/dvmarques/admin-design-system/actions/runs/41529965997 (CodeQL, npm audit e Gitleaks).
- GitHub Pages **success** no SHA final: https://github.com/dvmarques/admin-design-system/actions/runs/41529966014. Build aprovado; publicação foi ignorada em PR, conforme política.
- As validações equivalentes a npm run validate foram comprovadas em conjunto: gates locais passaram até E2E; a matriz completa de navegadores passou na CI Linux. O comando local registrou 505/515 E2E aprovados, 9 falhas por ausência de snapshots específicos do Windows e 1 ignorado. Não foram aceitos snapshots gerados automaticamente.
- Validação local desta revisão: npm 12.2.1 executou npm run validate, mas o comando não passou devido às falhas de snapshots no E2E; format, lint, build, saída Storybook, smoke do peer opcional, typecheck e test:quality passaram. O novo teste npm-pack-output também passou em npm run test:ci (122 aprovados, 18 ignorados por exigir artefatos gerados em build). A suíte E2E executou 515 casos: 505 passaram, 9 falharam porque os snapshots esperados *-chromium-win32.png não existem, e 1 foi ignorado. Não foram gerados nem aceitos snapshots. A task foi concluída com a matriz E2E integral aprovada na CI Linux do mesmo SHA.
