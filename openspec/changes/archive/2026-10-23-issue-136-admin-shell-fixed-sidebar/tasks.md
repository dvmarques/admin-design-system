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

- [x] 4.1 Executados: prettier, lint, build, typecheck, test:quiet (851) e `openspec validate --all --strict`. E2E: novos testes aprovados localmente; os snapshots visuais divergem localmente também na base (renderização do ambiente) e são validados na CI Linux.
- [x] 4.2 PR #179 para `develop` com revisão técnica aprovada (sidebar com overflow garantido e capturas do layout desktop real em claro e escuro, baselines Linux gerados pelo workflow oficial); merge por squash e arquivamento autorizados pelo responsável.
