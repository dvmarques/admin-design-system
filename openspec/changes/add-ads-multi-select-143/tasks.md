## 1. Contrato e planejamento

- [x] 1.1 Analisar issue #143, dependências e perfil Critical; definir contrato controlado/não controlado, opção, limites, ARIA, formulário e decisões de rollback nesta change.
- [x] 1.2 Revisar e validar OpenSpec via CLI strict; serialização, `required`, reset e overlays documentados. (CI PR #300 run 41557877400, job Política de develop, step OpenSpec strict: success)

## 2. Componente reutilizável

- [ ] 2.1 Implementar `AdsMultiSelect` e tipos exportados com busca, chips removíveis, limpeza, controle, limites e opções disabled sem dependências novas.
- [ ] 2.2 Integrar `AdsField`, estados loading/error/vazio, acessibilidade, foco, teclado, validação e formulários.
- [ ] 2.3 Criar/ajustar estilos responsivos, temas e tokens; revisar CSS compilado, compatibilidade e orçamento de bundle.

## 3. Testes e demonstrações

- [ ] 3.1 Testes unitários e interação para controlled/uncontrolled, filtro, teclado, chip, clear, limite, reset, `name`, `required`, disabled e ARIA; regressões Combobox/FilterBar.
- [ ] 3.2 Adicionar exemplos funcionais e navegáveis no Admin Demo, atualizando catálogo, controles de estados e testes de consumo público.
- [ ] 3.3 Adicionar stories com estados/variantes ao Storybook; documentação API, CHANGELOG e matriz do catálogo.
- [ ] 3.4 E2E e acessibilidade em Chromium/Firefox/WebKit quando aplicável; contrastes, mobile, zoom, formulário, SSR/hidratação, sobreposições e snapshots revisados.

## 4. Verificação antes da revisão

- [ ] 4.1 Revisar diff, compatibilidade, riscos, validação estática, acessibilidade e testes; corrigir achados.
- [ ] 4.2 Executar `npm run format`, lint, typecheck, build, test:quality, `npm run validate`, E2E e `openspec validate --all --strict`; documentar comandos e evidências.
- [ ] 4.3 Confirmar CI no SHA final, consumo Next.js e Storybook, CSS exportado e budget antes de declarar pronta a entrega.
