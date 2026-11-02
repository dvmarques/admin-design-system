# Tasks — AdsOTPInput (#146)

## Planejamento e API
- [x] Ler issue, contratos dos inputs, catálogos e políticas; definir perfil Critical e API.
- [x] Criar proposta, design, especificação e tarefas OpenSpec; revisar cenários de compatibilidade e acessibilidade.

## Biblioteca
- [ ] Implementar AdsOTPInput com código numérico, 4/6+ dígitos, colagem/autofill e navegação nativa.
- [ ] Implementar valores controlado/não controlado, callbacks e tratamento de mutações externas/completude.
- [ ] Integrar AdsField, estados, ref, tema e CSS compilado; export público.

## Demonstração e documentação
- [ ] Adicionar página navegável no catálogo do Admin Demo com estados funcionais.
- [ ] Adicionar stories Storybook com uso básico, interações, controles e estados.
- [ ] Atualizar guia do componente e CHANGELOG da versão em andamento.

## Verificação
- [ ] Adicionar e executar testes unitários, interação, formulário e acessibilidade (incluindo regressões).
- [ ] Adicionar e executar E2E no Admin Demo com verificação de teclado, responsividade e temas.
- [ ] Executar build, typecheck, lint, testes de qualidade, consumo Next.js e avaliação de CSS distribuído.
- [ ] Executar `npm run test:e2e` completo sem falhas no ambiente de validação.
- [ ] Revisar código, formatar arquivos alterados e executar `npm run format`.
- [ ] Executar `npm run validate` e `openspec validate --all --strict`; registrar evidência real.
