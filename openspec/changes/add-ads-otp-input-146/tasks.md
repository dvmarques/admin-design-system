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
- [ ] Executar `npm run validate` completo no ambiente de validação.

## Evidências verificadas em 2026-11-02

- PR #299: https://github.com/dvmarques/admin-design-system/pull/299, alvo `develop`. SHA validado `ca834f1ebf784cc09797c024de73a3553fc8159b` (antes desta atualização documental).
- CI **success**: https://github.com/dvmarques/admin-design-system/actions/runs/41519033293. Jobs aprovados: Política de develop (incluindo `openspec validate --all --strict`), Qualidade rápida (Prettier, lint, builds, typecheck, testes Node, Vitest com cobertura), Artefatos de distribuição e fluxos de navegador (Firefox, WebKit, Chromium 1/2, Chromium 2/2 e agregação).
- Security Gate **success**: https://github.com/dvmarques/admin-design-system/actions/runs/41519033237 (CodeQL, npm audit e Gitleaks).
- GitHub Pages **success**: https://github.com/dvmarques/admin-design-system/actions/runs/41519033198. Construção aprovada; etapa de publicação foi ignorada em PR, conforme política.
- Evidências são do GitHub Actions; não há alegação de testes locais. O comando literal `npm run validate` permanece não executado, embora seus principais gates tenham sido verificados separadamente pelo CI. Por isso sua checkbox continua aberta.
