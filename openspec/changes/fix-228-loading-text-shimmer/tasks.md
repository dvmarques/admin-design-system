# Tasks: fix-228-loading-text-shimmer

## Implementação

- [x] 1.1 Comparar CSS do Back Admin e Admin DS e identificar limitações de contraste, especialmente dark.
- [x] 1.2 Corrigir base e gradiente de `AdsLoadingText` preservando velocidades e contratos públicos.
- [x] 1.3 Conferir compatibilidade com reduced motion, forced colors, RTL, fallback sem clip e tema sistema.

## Testes e documentação

- [x] 2.1 Adicionar cobertura automatizada de regressão do CSS e do estado inativo.
- [ ] 2.2 Testar visualmente em dark/light, comprimentos diferentes e Storybook/Admin Demo; validar consumo do CSS compilado no Next.js.
- [x] 2.3 Registrar resultado e changelog com referências à #228.
- [ ] 2.4 Executar formatação de arquivos, `npm run format`, `npm run validate`, `npm run test:e2e` e `openspec.cmd validate --all --strict`. Corrigir todas as falhas.

## Evidências e pendências

- CI do commit `db1c05bb3eda3bf1aef95e925d8c93c0bb41d1c7`: **success**, incluindo política/OpenSpec, qualidade, distribuição e E2E Chromium, Firefox e WebKit. [Execução](https://github.com/dvmarques/admin-design-system/actions/runs/40584286583).
- **2.2 pendente:** o CI valida comportamento e integração, mas não substitui a inspeção visual humana do brilho publicado em temas claro/escuro e no Storybook.
- **2.4 pendente de confirmação integral:** os gates de CI passaram, incluindo Prettier, lint, typecheck e testes de navegador; não há evidência nesta execução de que os comandos agregadores `npm run validate` e `npm run test:e2e` tenham sido invocados literalmente como descritos na task. Consolidar ou ajustar o critério antes de concluir.
