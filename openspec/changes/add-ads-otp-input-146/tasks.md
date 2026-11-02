# Tasks — AdsOTPInput (#146)

## Planejamento e API
- [x] Ler issue, contratos dos inputs, catálogos e políticas; definir perfil Critical e API.
- [x] Criar proposta, design, especificação e tarefas OpenSpec; revisar cenários de compatibilidade e acessibilidade.

## Biblioteca
- [x] Implementar AdsOTPInput com código numérico, 4/6+ dígitos, colagem/autofill e navegação nativa.
- [x] Implementar valores controlado/não controlado, callbacks e tratamento de mutações externas/completude.
- [x] Integrar AdsField, estados, ref e classes de tema; export público (compilação CSS pendente de validação).

## Demonstração e documentação
- [x] Adicionar página navegável no catálogo do Admin Demo com estados funcionais.
- [x] Adicionar stories Storybook com uso básico, interações, controles e estados.
- [x] Atualizar guia do componente e CHANGELOG da versão em andamento.

## Verificação
- [ ] Adicionar e executar testes unitários, interação, formulário e acessibilidade (incluindo regressões).
- [ ] Adicionar e executar E2E no Admin Demo com verificação de teclado, responsividade e temas.
- [ ] Executar build, typecheck, lint, testes de qualidade, consumo Next.js e avaliação de CSS distribuído.
- [ ] Executar `npm run test:e2e` completo sem falhas no ambiente de validação.
- [ ] Revisar código, formatar arquivos alterados e executar `npm run format`.
- [ ] Executar `npm run validate` e `openspec validate --all --strict`; registrar evidência real.

## Evidências parciais

- Código, catálogo, Storybook, E2E e docs nos commits `27b3ff7`, `df95d41` e `159051f`; diff comparado com `develop` (15 arquivos, sem divergência de base).
- Testes e2e/unitários foram escritos, **não executados localmente**; compilação CSS, format, lint, typecheck, build, validação OpenSpec e CI ainda aguardam verificação. Checkboxes de execução permanecem abertos.
