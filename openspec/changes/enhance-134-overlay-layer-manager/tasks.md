## 1. Preparação e especificação

- [x] 1.1 Ler a issue #134, AGENTS.md, README.md e configuração OpenSpec.
- [x] 1.2 Inspecionar `overlay-utils`, diálogos, overlays ancorados, Dropdown e testes existentes.
- [x] 1.3 Criar e validar a change OpenSpec em modo estrito.

## 2. Biblioteca

- [x] 2.1 Tab/Shift+Tab tratado apenas pelo modal superior, com popups descendentes.
- [x] 2.2 Clique externo pela hierarquia lógica dos portais.
- [x] 2.3 Backdrop fecha só a camada superior.
- [x] 2.4 Bloqueio de scroll com contagem e restauração.
- [x] 2.5 Preservar SSR, StrictMode, tema por portal e Escape.

## 3. Testes e documentação

- [x] 3.1 Regressões Vitest: Dialog+Dialog, Dialog/Drawer+Popover/Dropdown, scroll, foco, desmontagem, gatilho removido, StrictMode, SSR e axe.
- [ ] 3.2 E2E: não executado localmente (sem navegadores/ambiente); a validar na CI.
- [x] 3.3 Atualizar documentação e CHANGELOG.

## 4. Revisão e entrega

- [x] 4.1 Executados: prettier, lint, build, typecheck, test:unit (773 testes) e `openspec validate --all --strict`. E2E pendente (CI).
- [ ] 4.2 Publicar PR para develop, sem merge nem archive.
