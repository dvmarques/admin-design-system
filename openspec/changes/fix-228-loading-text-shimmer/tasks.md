# Tasks: fix-228-loading-text-shimmer

## Implementação
- [ ] 1.1 Comparar CSS do Back Admin e Admin DS e identificar limitações de contraste, especialmente dark.
- [ ] 1.2 Corrigir base e gradiente de `AdsLoadingText` preservando velocidades e contratos públicos.
- [ ] 1.3 Conferir compatibilidade com reduced motion, forced colors, RTL, fallback sem clip e tema sistema.

## Testes e documentação
- [ ] 2.1 Adicionar cobertura automatizada de regressão do CSS e do estado inativo.
- [ ] 2.2 Testar visualmente em dark/light, comprimentos diferentes e Storybook/Admin Demo; validar consumo do CSS compilado no Next.js.
- [ ] 2.3 Registrar resultado e changelog com referências à #228.
- [ ] 2.4 Executar formatação de arquivos, `npm run format`, `npm run validate`, `npm run test:e2e` e `openspec.cmd validate --all --strict`. Corrigir todas as falhas.
