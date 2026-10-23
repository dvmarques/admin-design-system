## 1. Preparação e especificação

- [x] 1.1 Ler a issue #136, AGENTS.md, README.md e configuração OpenSpec.
- [x] 1.2 Criar a change OpenSpec e validar em modo estrito.

## 2. Biblioteca

- [x] 2.1 CSS do layout desktop: altura da viewport, coluna, `min-height: 0`, rolagem independente de sidebar e main, safe areas.
- [x] 2.2 Confirmar que o layout móvel e o Drawer não mudam.

## 3. Testes e documentação

- [x] 3.1 E2E em 1280×800, 768×600, 390×844 e altura reduzida (rolagem, sidebar, header multilinha, recolhida, Drawer).
- [x] 3.2 Story com página longa e muitos itens; atualizar `docs/integration.md`.
- [x] 3.3 Registrar no CHANGELOG.

## 4. Validação e entrega

- [x] 4.1 Executados: prettier, lint, build, typecheck, test:quiet (851) e `openspec validate --all --strict`. E2E local (Chromium): novos testes e demais specs aprovados; snapshots visuais de admin-demo, rotas e data-display divergem do mesmo modo na base sem esta change (diferença de renderização do ambiente), sem atualização; validação na CI.
- [ ] 4.2 Abrir PR para `develop` (`Closes #136` somente com todos os critérios atendidos).
