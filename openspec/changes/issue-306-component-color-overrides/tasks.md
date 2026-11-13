## 1. Especificação
- [x] 1.1 Inventariar CSS da sidebar, header principal, branding, seleção, tema e mobile; preservar `--ads-sidebar-active-background`.
- [x] 1.2 Escrever proposal/design/delta spec e critérios de não-regressão visual.

## 2. Implementação
- [ ] 2.1 Substituir os pontos de pintura relevantes por tokens específicos com fallback dinâmico no `packages/admin/src/styles.css`.
- [ ] 2.2 Criar testes de contratos de tokens e efeitos de escopo, incluindo herança global e valor explícito.
- [ ] 2.3 Documentar API CSS e adicionar showcase de customização no Storybook.

## 3. Validação e entrega
- [ ] 3.1 Revisão de CSS (sem alteração de defaults, classes, DOM, props, cores de UI). Conferir tema claro/escuro/mobile e estados.
- [ ] 3.2 Validar testes/format/lint/typecheck/build/OpenSpec; CI Linux sem diffs visuais não justificados.
- [ ] 3.3 Abrir PR não-draft, relacionar issue #306 e registrar checks e pendências.
